"use client"
import React, { useState, useEffect, useRef } from 'react'
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import ProblemDescription from '@/components/Problem/ProblemDescription';
import ProblemSubmissions from '@/components/Problem/ProblemSubmissions';
import ProblemTestCases from '@/components/Problem/ProblemTestCases';
import ProblemTestOutput from '@/components/Problem/ProblemTestOutput';
import ProblemResult from '@/components/Problem/ProblemResult';
import { Editor } from '@monaco-editor/react';
import { Toaster, toast } from 'react-hot-toast';
import { boilerplate } from '@/app/constants';
import ErrorComponent from '@/components/ErrorComponent';
import { Button, Spinner } from 'flowbite-react';
import { MdCancel } from 'react-icons/md';
import { FaCheck } from 'react-icons/fa';
import Loading from '@/app/loading';

function Page({ params }) {
  const { slug } = params;
  // basic states
  const editorRef = useRef(0);
  const [editorKey, setEditorKey] = useState(0);
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const [loading, setLoading] = useState(true);
  const [pageErrorMessage, setPageErrorMessage] = useState(null);
  const [pageErrorCode, setPageErrorCode] = useState(0);
  const [executionError, setExecutionError] = useState(null);
  const [allTabs, setAllTabs] = useState(['Description', 'Submissions', 'testcases', 'test-output', 'result']);
  const [tab, setTab] = useState('Description');
  const [isTabVisible, setIsTabVisible] = useState({ 'Description': true, 'Submissions': true, 'testcases': true, 'test-output': false, 'result': false });
  const [problem, setProblem] = useState({});
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(boilerplate);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [exampleTestCases, setExampleTestCases] = useState([]);

  // test-run states
  const [testOverallStatus, setTestOverallStatus] = useState(null);
  const [testOverallMemory, setTestOverallMemory] = useState(-1);
  const [testOverallTime, setTestOverallTime] = useState(-1);
  const [testExecutionResults, setTestExecutionResults] = useState(null);
  const [testExecutionError, setTestExecutionError] = useState(null);


  // result states
  const [executionResults, setExecutionResults] = useState(null);
  const [executionStatus, setExecutionStatus] = useState(null);
  const [executionTime, setExecutionTime] = useState(-1);
  const [executionMemory, setExecutionMemory] = useState(-1);
  const [currentSubmission, setCurrentSubmission] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/problem/?slug=${slug}${'&'}userId=${user?.id}`)
      .then((response) => {
        const data = response.data;
        console.log(data);
        if (data?.problem) {
          setProblem(data.problem);
          setExampleTestCases(data.problem.testcases);
        }
        else {
          setPageErrorMessage(data.error);
          setPageErrorCode(response.status);
        }
      })
      .catch((error) => {
        const errorCode = error.status;
        const errorResponse = error.response;
        const errorResponseData = errorResponse.data;
        const errorMessage = errorResponseData.message;
        setPageErrorMessage(errorMessage);
        setPageErrorCode(errorCode);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);



  const handleCodeRun = () => {
    const workerURL = process.env.EXECUTION_WORKER_URL;
    setRunning(true);
    axios.post(
      workerURL,
      {
        code: code[language],
        language: language,
        testcases: exampleTestCases
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

    const workerURL = "http://localhost:4000";
    setSubmitting(true);

    // Submit the code for execution
    axios
      .post(workerURL, {
        code: code[language],
        language,
        testcases: problem.testcases,
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
          problemId: problem.id,
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
          pageErrorCode
            ?
            <ErrorComponent code={pageErrorCode} message={pageErrorMessage} />
            :
            <div className='flex flex-col md:flex-row min-h-screen'>

              <div className="flex flex-col p-8 pb-16 gap-4 w-full md:w-[45%] overflow-scroll h-screen bg-gray-900 text-white">
                <div className='flex flex-col w-full gap-1'>
                  <h2 className='font-bold text-2xl'>{problem.id}.{problem.title}</h2>
                  <div className='flex justify-between text-gray-200'>
                    <span>Total Submissions:{problem.totalSubmissions}</span>
                    <span>Accepted:{problem.acceptedSubmissions}</span>
                    {
                      problem.solved
                      &&
                      <FaCheck className='text-green-400' />
                    }
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
                    exampleTestCases={exampleTestCases}
                    setExampleTestCases={setExampleTestCases} /> //need to give correct props
                }
                {
                  tab === "test-output"
                  &&
                  <ProblemTestOutput
                    testcases={exampleTestCases}
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
