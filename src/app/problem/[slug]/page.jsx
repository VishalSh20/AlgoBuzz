"use client"
import React, { useState, useEffect, useRef } from 'react'
import { useUser } from '@clerk/nextjs';
import { useRouter , useParams} from 'next/navigation';
import axios from 'axios';
import ProblemDescription from '@/components/Problem/ProblemDescription';
import ProblemSubmissions from '@/components/Problem/ProblemSubmissions';
import ProblemTestCases from '@/components/Problem/ProblemTestCases';
import ProblemTestOutput from '@/components/Problem/ProblemTestOutput';
import ProblemResult from '@/components/Problem/ProblemResult';
import { Editor } from '@monaco-editor/react';
import { toast } from 'sonner';
import { boilerplate } from '@/app/constants';
import ErrorComponent from '@/components/ErrorComponent';
import Loading from '@/app/loading';
import getExecutionResults from '@/utils/execution.utils';

// shadcn/ui imports
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Icons
import { MdCancel, MdPlayArrow, MdSend } from 'react-icons/md';
import { FaCheck, FaSpinner } from 'react-icons/fa';
import { AlertCircle, Code, FileText, TestTube, PlayCircle, Send } from 'lucide-react';

function Page() {
  const { slug } = useParams();
  // basic states
  const editorRef = useRef(0);
  const [editorKey, setEditorKey] = useState(0);
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const [loading, setLoading] = useState(true);
  const [pageErrorMessage, setPageErrorMessage] = useState(null);
  const [pageErrorCode, setPageErrorCode] = useState(0);
  const [executionError, setExecutionError] = useState(null);
  const [allTabs, setAllTabs] = useState(['description', 'submissions', 'testcases', 'test-output', 'result']);
  const [tab, setTab] = useState('description');
  const [isTabVisible, setIsTabVisible] = useState({ 
    'description': true, 
    'submissions': true, 
    'testcases': true, 
    'test-output': false, 
    'result': false 
  });
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
        if (data?.problem) {
          setProblem(data.problem);
          setExampleTestCases(data.problem.examples);
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
  }, [slug, user?.id]);

  const handleCodeRun = () => {
    setRunning(true);
    setTestExecutionError(null);
    
    getExecutionResults(code[language], language, exampleTestCases)
      .then((response) => {
        const { overallStatus, overallMemory, overallTime, executionResults } = response;
        
        setTestOverallStatus(overallStatus);
        setTestOverallTime(overallTime);
        setTestOverallMemory(overallMemory);
        setTestExecutionResults(executionResults);

        if (overallStatus !== "ACCEPTED") {
          toast.error(overallStatus);
          for (let i = 0; i < executionResults.length; i++) {
            const testError = executionResults[i].error || 
                             executionResults[i].stderr || 
                             executionResults[i].compilation_output;
            if (testError) {
              setTestExecutionError(testError);
              break;
            }
          }
        }
        else {
          toast.success("Executed Successfully!");
        }
      })
      .catch((error) => {
        const errorResponse = error.response;
        const errorMessage = errorResponse ? errorResponse.data?.error : error.message;
        toast.error(`An error occurred - ${errorMessage}`);
        setTestExecutionError(errorMessage);
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

    setSubmitting(true);
    setExecutionError(null);

    let executionData = {overallStatus:null,overallMemory:null,overallTime:null,executionResults:null};
    
    getExecutionResults(code[language], language, problem.testcases)
      .then((response) => {
        executionData = response;
        setExecutionStatus(()=>executionData.overallStatus);
        setExecutionTime(()=>executionData.overallTime);
        setExecutionMemory(()=>executionData.overallMemory);
        setExecutionResults(()=>executionData.executionResults);

        const submissionData = {
          userId: user.id,
          problemId: problem.id,
          solved:problem.solved,
          code: code[language],
          language,
          status: executionData.overallStatus,
          time: executionData.overallTime,
          memory: executionData.overallMemory
        };

        return axios.post('/api/submission', submissionData);
      })
      .then((response) => {
        const submissionInstance = response.data.submissionInstance;
        setCurrentSubmission(submissionInstance);

        if (executionData.overallStatus === "ACCEPTED") {
          toast.success("Accepted!!");
        } 
        else if(response.status === 500){
          toast.error("Internal Server Error");
        }
        else {
          toast.error(executionData.overallStatus);
          const errorResult = executionData?.executionResults?.find((result) => 
            result.error || result.stderr || result.compilation_output
          );
          if (errorResult) {
            const errorMsg = errorResult.error || errorResult.stderr || errorResult.compilation_output;
            setExecutionError(errorMsg);
          }
        }
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.error || error.message || "An error occurred";
        toast.error(errorMessage);
        setExecutionError(errorMessage);
      })
      .finally(() => {
        setIsTabVisible({ ...isTabVisible, ['result']: true })
        setTab('result');
        setSubmitting(false);
      });
  };

  const getTabIcon = (tabName) => {
    switch(tabName) {
      case 'description': return <FileText className="w-4 h-4" />;
      case 'submissions': return <Code className="w-4 h-4" />;
      case 'testcases': return <TestTube className="w-4 h-4" />;
      case 'test-output': return <PlayCircle className="w-4 h-4" />;
      case 'result': return <Send className="w-4 h-4" />;
      default: return null;
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (pageErrorCode) {
    return <ErrorComponent code={pageErrorCode} message={pageErrorMessage} />;
  }

  return (
    <div className='w-full min-h-screen pt-20 bg-gradient'>
      <div className='flex flex-col md:flex-row min-h-screen'>
        
       {/* Mobile Layout */}
        <div className="md:hidden flex flex-col min-h-screen">
          {/* Problem Info Section */}
          <Card className="m-4 mb-2 bg-gray-900/90 border-gray-700 text-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">
                  {problem.id}. {problem.title}
                </CardTitle>
                {problem.solved && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <FaCheck className="w-3 h-3 mr-1" />
                    Solved
                  </Badge>
                )}
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>Submissions: {problem.totalSubmissions}</span>
                <span>Accepted: {problem.acceptedSubmissions}</span>
              </div>
            </CardHeader>
          </Card>

          {/* Tabs for Mobile */}
          <div className="px-4 flex-1 flex flex-col min-h-0">
            <Tabs value={tab} onValueChange={setTab} className="w-full flex flex-col flex-1 min-h-0">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800 mb-4">
                {allTabs.filter(t => isTabVisible[t]).slice(0, 3).map((tabName) => (
                  <TabsTrigger 
                    key={tabName} 
                    value={tabName} 
                    className="flex items-center gap-1 text-gray-300 bg-gray-700 hover:bg-gray-600 hover:text-white data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    {getTabIcon(tabName)}
                    <span className="capitalize text-xs">{tabName === 'test-output' ? 'Output' : tabName}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Tab Content with proper height management */}
              <div className="flex-1 min-h-0 bg-gray-800/50 rounded-lg p-4">
                <div className="h-full overflow-y-auto">
                  {tab === "description" && <ProblemDescription problem={problem} />}
                  {tab === "submissions" && (
                    <ProblemSubmissions
                      userId={user?.id}
                      problem={problem}
                      setEditorLanguage={setLanguage}
                      setCode={setCode}
                    />
                  )}
                  {tab === "testcases" && (
                    <ProblemTestCases
                      problem={problem}
                      exampleTestCases={exampleTestCases}
                      setExampleTestCases={setExampleTestCases}
                    />
                  )}
                  {tab === "test-output" && (
                    <ProblemTestOutput
                      testcases={exampleTestCases}
                      overallStatus={testOverallStatus}
                      overallMemory={testOverallMemory}
                      overallTime={testOverallTime}
                      executionResults={testExecutionResults}
                      executionError={testExecutionError}
                    />
                  )}
                  {tab === "result" && (
                    <ProblemResult
                      testcases={problem.testcases}
                      submissionInstance={currentSubmission}
                      executionResults={executionResults}
                      executionStatus={executionStatus}
                      executionTime={executionTime}
                      executionMemory={executionMemory}
                      executionError={executionError}
                      submitting={submitting}
                    />
                  )}
                </div>
              </div>
            </Tabs>
          </div>

          {/* Code Editor for Mobile */}
          <Card className="m-4 mt-2 bg-gray-900/90 border-gray-700 text-white">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <Select value={language} onValueChange={(value) => {
                  setLanguage(value);
                  setEditorKey(key => key + 1);
                }}>
                  <SelectTrigger className="w-32 bg-gray-800 text-white border-gray-700">
                    <SelectValue className="text-white" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white border-gray-700">
                    <SelectItem value="cpp" className="hover:bg-gray-700 cursor-pointer">C++</SelectItem>
                    <SelectItem value="python" className="hover:bg-gray-700 cursor-pointer">Python</SelectItem>
                    <SelectItem value="java" className="hover:bg-gray-700 cursor-pointer">Java</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={running || submitting}
                    onClick={handleCodeRun}
                    className="bg-gray-800 text-white border-gray-700 hover:bg-gray-600 hover:text-white hover:border-gray-500"
                  >
                    {running ? <FaSpinner className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
                    Run
                  </Button>
                  <Button
                    size="sm"
                    disabled={running || submitting}
                    onClick={handleCodeSubmission}
                    className="bg-primary text-white hover:bg-primary/90 hover:text-white"
                  >
                    {submitting ? <FaSpinner className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Submit
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Editor
                height="35vh"
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
            </CardContent>
          </Card>
        </div>

        {/* Desktop Layout with Resizable Panels */}
        {/* Desktop Layout with Resizable Panels */}
        <div className="hidden md:flex w-full h-screen">
          <ResizablePanelGroup direction="horizontal" className="min-h-screen">
            {/* Problem Description Panel */}
            <ResizablePanel defaultSize={45} minSize={30} maxSize={70}>
              <Card className="m-4 h-full flex flex-col bg-gray-900/90 border-gray-700 text-white">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl font-bold">
                      {problem.id}. {problem.title}
                    </CardTitle>
                    {problem.solved && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <FaCheck className="w-4 h-4 mr-1" />
                        Solved
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex gap-4">
                      <span>Total Submissions: {problem.totalSubmissions}</span>
                      <span>Accepted: {problem.acceptedSubmissions}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  {/* Custom Tab Navigation */}
                  <div className="flex flex-wrap gap-2 mb-4 p-2 flex-shrink-0">
                    {allTabs.map((tabName) => (
                      isTabVisible[tabName] && (
                        <div
                          key={tabName}
                          className={`flex items-center rounded-lg border ${
                            tab === tabName 
                              ? "bg-primary text-primary-foreground border-primary" 
                              : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-600 hover:text-white hover:border-gray-500"
                          }`}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`flex items-center gap-2 h-8 px-3 rounded-l-lg rounded-r-none border-0 ${
                              tab === tabName 
                                ? "text-primary-foreground hover:text-primary-foreground hover:bg-primary/90" 
                                : "text-gray-300 hover:text-white hover:bg-gray-600"
                            }`}
                            onClick={() => setTab(tabName)}
                          >
                            {getTabIcon(tabName)}
                            <span className="capitalize text-xs">
                              {tabName === 'test-output' ? 'Output' : tabName}
                            </span>
                          </Button>
                          {(tabName === "test-output" || tabName === "result") && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`h-8 w-8 p-0 rounded-r-lg rounded-l-none border-l ${
                                tab === tabName 
                                  ? "text-primary-foreground hover:text-primary-foreground hover:bg-primary/80 border-primary-foreground/20" 
                                  : "text-gray-300 hover:bg-red-600 hover:text-white border-gray-600"
                              }`}
                              onClick={() => {
                                setTab(tabName === 'result' ? 'submissions' : 'description');
                                setIsTabVisible({ ...isTabVisible, [tabName]: false });
                              }}
                            >
                              <MdCancel className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      )
                    ))}
                  </div>

                  {/* Tab Content with proper scrolling */}
                  <div className="flex-1 min-h-0 bg-gray-800/20 rounded-lg p-4">
                    <div className="h-full overflow-y-auto overflow-x-hidden">
                      {tab === "description" && <ProblemDescription problem={problem} />}
                      {tab === "submissions" && (
                        <ProblemSubmissions
                          userId={user?.id}
                          problem={problem}
                          setEditorLanguage={setLanguage}
                          setCode={setCode}
                        />
                      )}
                      {tab === "testcases" && (
                        <ProblemTestCases
                          problem={problem}
                          exampleTestCases={exampleTestCases}
                          setExampleTestCases={setExampleTestCases}
                        />
                      )}
                      {tab === "test-output" && (
                        <ProblemTestOutput
                          testcases={exampleTestCases}
                          overallStatus={testOverallStatus}
                          overallMemory={testOverallMemory}
                          overallTime={testOverallTime}
                          executionResults={testExecutionResults}
                          executionError={testExecutionError}
                        />
                      )}
                      {tab === "result" && (
                        <ProblemResult
                          testcases={problem.testcases}
                          submissionInstance={currentSubmission}
                          executionResults={executionResults}
                          executionStatus={executionStatus}
                          executionTime={executionTime}
                          executionMemory={executionMemory}
                          executionError={executionError}
                          submitting={submitting}
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Code Editor Panel */}
            <ResizablePanel defaultSize={55} minSize={30}>
              <Card className="m-4 h-full flex flex-col bg-gray-900/90 border-gray-700 text-white">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <Select value={language} onValueChange={(value) => {
                      setLanguage(value);
                      setEditorKey(key => key + 1);
                    }}>
                      <SelectTrigger className="w-40 bg-gray-800 text-white border-gray-700">
                        <SelectValue className="text-white" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white border-gray-700">
                        <SelectItem value="cpp" className="hover:bg-gray-700 cursor-pointer">C++</SelectItem>
                        <SelectItem value="python" className="hover:bg-gray-700 cursor-pointer">Python</SelectItem>
                        <SelectItem value="java" className="hover:bg-gray-700 cursor-pointer">Java</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        disabled={running || submitting}
                        onClick={handleCodeRun}
                        className="bg-gray-800 text-white border-gray-700 hover:bg-gray-600 hover:text-white hover:border-gray-500"
                      >
                        {running ? (
                          <FaSpinner className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <PlayCircle className="w-4 h-4 mr-2" />
                        )}
                        Run
                      </Button>
                      <Button
                        disabled={running || submitting}
                        onClick={handleCodeSubmission}
                        className="bg-gray-800 text-white border-gray-700 hover:bg-gray-600 hover:text-white hover:border-gray-500"
                      >
                        {submitting ? (
                          <FaSpinner className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Send className="w-4 h-4 mr-2" />
                        )}
                        Submit
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 p-0">
                  <Editor
                    height="calc(100vh - 180px)"
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
                </CardContent>
              </Card>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  )
}

export default Page