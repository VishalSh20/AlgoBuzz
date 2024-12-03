"use client"
import { boilerplate } from '@/app/constants';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { MdCancel } from 'react-icons/md';
import { Editor } from '@monaco-editor/react';
import { Toaster } from 'react-hot-toast';
import ProblemDescription from '@/components/Problem/ProblemDescription';
import ProblemSubmissions from '@/components/Problem/ProblemSubmissions';
import ProblemTestCases from '@/components/Problem/ProblemTestCases';
import ProblemTestOutput from '@/components/Problem/ProblemTestOutput';

function Page({params}) {
    const {id} = params;
    const [contestId,problemId] = id.split('-').length==2 ? [id.split('-')[0],id.split('-')[1]] : [null,null];
    const [problem,setProblem] = useState(null);
    const [testcases,setTestcases] = useState([]);
    const [pageError,setPageError] = useState((!id || id.split('-').length!=2) ? "Problem does not exist, invalid ID" : null);
    const [loading,setLoading] = useState(false);

    const [allTabs, setAllTabs] = useState(['Description', 'Submissions', 'testcases', 'test-output', 'result']);
    const [tab, setTab] = useState('Description');
    const [isTabVisible, setIsTabVisible] = useState({ 'Description': true, 'Submissions': true, 'testcases': true, 'test-output': false, 'result': false });

    const [code,setCode] = useState(boilerplate);
    const [language,setLanguage] = useState("cpp");
    const [editorKey,setEditorKey] = useState(0);
    const editorRef = useRef();
    
    // test run states
    const [running,setRunning] = useState(false);
    const [testOverallStatus, setTestOverallStatus] = useState(null);
    const [testOverallMemory, setTestOverallMemory] = useState(-1);
    const [testOverallTime, setTestOverallTime] = useState(-1);
    const [testExecutionResults, setTestExecutionResults] = useState(null);
    const [testExecutionError, setTestExecutionError] = useState(null);


  // result states
  const [submitting,setSubmitting] = useState(false);
  const [executionResults, setExecutionResults] = useState(null);
  const [executionStatus, setExecutionStatus] = useState(null);
  const [executionTime, setExecutionTime] = useState(-1);
  const [executionMemory, setExecutionMemory] = useState(-1);
  const [currentSubmission, setCurrentSubmission] = useState(null);


    useEffect(()=>{
        if(error)
            return;

        setLoading(true);
        setPageError(null);
        setProblem(null);
        const requestURL = `${process.env.NEXT_PUBLIC_CF_INTERFACE_URL}/problem?problemId=${problemId}&contestId=${contestId}`;
        console.log(requestURL);

        axios
        .get(requestURL)
        .then((response)=>{
            const responseData = response.data;
            console.log(responseData);
            setProblem(responseData.problem);
        })
        .catch((error)=>{
            const errorMessage = error.response?.data?.error || error.response?.status || error.message;
            console.log(errorMessage);
            setPageError(errorMessage);
        })
        .finally(()=>{
            setLoading(false);
        });
    },[id]);

      const handleCodeRun = () => {
        const workerURL = `${process.env.EXECUTION_WORKER_URL}`;
        setRunning(true);
        axios.post(
          workerURL,
          {
            code: code[language],
            language: language,
            testcases: testcases
          }
        )
          .then((response) => {
            const data = response.data;
            const { overallStatus, overallMemory, overallTime, executionResults } = data;
            setTestOverallStatus(overallStatus);
            setTestOverallTime(overallTime);
            setTestOverallMemory(overallMemory);
            setTestExecutionResults(executionResults);
    
            if (overallStatus !== "Accepted") {
              toast.error(overallStatus);
              for (let i = 0; i < executionResults.length; i++) {
                if (executionResults[i].error) {
                  setTestExecutionError(executionResults[i].error);
                  break;
                }
              }
            }
            else
              toast.success("Executed Successfully!");
          })
          .catch((error) => {
            const errorResponse = error.response;
            const errorMessage = errorResponse ? errorResponse.data?.error : error.message;
            toast.error(`An error occured- ${errorMessage}`);
          })
          .finally(() => {
            setRunning(false);
            setIsTabVisible({ ...isTabVisible, ['test-output']: true })
            setTab("test-output");
          })
      }
    
      const handleCodeSubmission = () => {
        if (!isSignedIn) {
          router.push(`/sign-in?redirect_url=${encodeURIComponent(window.location.pathname)}`);
          return;
        }
    
        if (!user) {
          toast.error("Network Error - user status can't be fetched");
          return;
        }
    
        const workerURL = process.env.EXECUTION_WORKER_URL;
        setSubmitting(true);
    
        // Submit the code for execution
        axios
          .post(workerURL, {
            code: code[language],
            language,
            testcases: problem?.testcases,
          })
          .then((response) => {
            const { overallStatus, overallMemory, overallTime, executionResults } = response.data;
    
            setExecutionStatus(overallStatus);
            setExecutionTime(overallTime);
            setExecutionMemory(overallMemory);
            setExecutionResults(executionResults);
    
            // Register the submission
            return axios.post('/api/submission', {
              userId: user.id,
              problemId: problem?.id,
              code: code[language],
              language,
              status: overallStatus,
              time: overallTime,
              memory: overallMemory,
            });
          })
          .then((response) => {
            const submissionInstance = response.data.submissionInstance;
            setCurrentSubmission(submissionInstance);
          })
          .catch((error) => {
            const errorMessage = error.response?.data?.error || error.message || "An error occured";
            toast.error(errorMessage);
          })
          .finally(() => {
            if (executionStatus !== "Accepted") {
              toast.error(executionStatus);
              const errorResult = executionResults?.find((result) => result.error);
              if (errorResult) {
                setExecutionError(errorResult.error);
              }
            } else {
              if (currentSubmission) {
                toast.success("Accepted!!");
              }
    
            }
            setIsTabVisible({ ...isTabVisible, ['result']: true })
            setTab('result');
            setSubmitting(false);
          });
      };
    
    
      return (
        <div className='w-full min-h-screen pt-20 bg-gradient'>
          {
            (loading)
              ?
              <Loading />
              :
              pageError
                ?
                <div>
                    {pageError}
                </div>
                :
                <div className='flex flex-col md:flex-row min-h-screen'>
    
                  <div className="flex flex-col p-8 pb-16 gap-4 w-full md:w-[45%] overflow-scroll h-screen bg-gray-900 text-white">
                    <div className='flex flex-col w-full gap-1'>
                      <h2 className='font-bold text-2xl'>{problem?.id}.{problem?.title}</h2>
                      <div className='flex justify-between text-gray-200'>
                        <span>Total Submissions:{problem?.acceptedCount}</span>
                      </div>
                    </div>
    
    
                    <div className='flex flex-wrap w-fit gap-2 p-2 text-white'>
                      {allTabs.map((tabName, index) => (
                        <div
                          key={index}
                          // ${tab === tabName ? " from-purple-500 to-purple-300" : "from-purple-300 to-zinc-300"}
                          className={`flex p-0 ${tab === tabName ? " bg-gray-700 border border-green-400" : "button-gradient2"} font-normal rounded-md ${!isTabVisible[tabName] ? "hidden" : ""}`}>
                          <button
                            key={index}
                            className='p-2'
                            onClick={(e) => {
                              e.preventDefault();
                              setTab(tabName);
                            }}
                          >{tabName}</button>
                          {
                            (tabName === "test-output" || tabName === "result")
                            &&
                            <button
                              onClick={() => {
                                setTab(tabName === 'result' ? 'Submissions' : 'Description');
                                setIsTabVisible({ ...isTabVisible, [tabName]: false });
                              }}
                            ><MdCancel /></button>
                          }
                        </div>
                      )
                      )
                      }
                    </div>
    
                    {
                      tab === "Description"
                      &&
                      <ProblemDescription
                        problem={problem} />
                    }
                    {
                      tab === "Submissions"
                      &&
                      <ProblemSubmissions
                        userId={user?.id}
                        problem={problem}
                        setEditorLanguage={setLanguage}
                        setCode={setCode} />
                    }
                    {
                      tab === "testcases"
                      &&
                      <ProblemTestCases
                        problem={problem}
                        exampleTestCases={testcases}
                        setExampleTestCases={setTestcases} /> //need to give correct props
                    }
                    {
                      tab === "test-output"
                      &&
                      <ProblemTestOutput
                        testcases={testcases}
                        overallStatus={testOverallStatus}
                        overallMemory={testOverallMemory}
                        overallTime={testOverallTime}
                        executionResults={testExecutionResults}
                        executionError={testExecutionError} />
                    }
                    {
                      tab === "result"
                      &&
                      <ProblemResult
                        testcases={problem.testcases}
                        submissionInstance={currentSubmission}
                        executionResults={executionResults}
                        executionStatus={executionStatus}
                        executionTime={executionTime}
                        executionMemory={executionMemory}
                        executionError={executionError}
                        submitting={submitting} />
                    }
                  </div>
    
                  <div className="w-full p-2 h-screen md:w-[55%] bg-gray-800">
                    <div className="flex justify-between w-full text-white p-2">
                      <select className="p-2 focus:border-green-400 bg-gray-700 rounded" value={language}
                        onChange={e => {
                          setLanguage(e.target.value);
                          setEditorKey(key => key + 1);
                        }
                        }
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="cpp">C++</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                      </select>
                      <div className='flex gap-2'>
                        <button className=' bg-gray-700 rounded p-2 px-4 border border-gray-500 hover:border-green-400'
                          disabled={running || submitting}
                          onClick={handleCodeRun}
                        >
                          {running ? <Spinner color="purple" /> : "Run"}
                        </button>
    
                        <button className=' bg-gray-700 rounded p-2 px-4 border border-gray-500 hover:border-green-400'
                          disabled={running || submitting}
                          onClick={handleCodeSubmission}
                        >
                          {submitting ? <Spinner color="purple" /> : "Submit"}
                        </button>
                      </div>
                    </div>
                    <Editor
                      height="90vh"
                      key={editorKey}
                      value={code[language]}
                      defaultLanguage={language}
                      defaultValue={boilerplate[language]}
                      onMount={(editor) => {
                        editorRef.current = editor;
                        editorRef.current.focus();
                      }}
                      onChange={(value) => {
                        const newCode = { ...code, [language]: value }
                        setCode(code => newCode);
                      }}
                      options={{
                        minimap: { enabled: false },
                      }}
                      theme='vs-dark'
                    />
    
                  </div>
    
                </div>
    
          }
          <Toaster />
        </div>
      )
    }
export default Page
    