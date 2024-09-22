"use client"
import React,{useState,useEffect,useRef} from 'react'
import axios from 'axios';
import ProblemDescription from '@/components/Problem/ProblemDescription';
import { Button, Spinner } from 'flowbite-react';
import { Editor } from '@monaco-editor/react';
import { Toaster,toast } from 'react-hot-toast';
import { boilerplate } from '@/app/constants';

function Page({params}) {
    const {slug} = params;
    const [tab,setTab] = useState('description');
    const [problem, setProblem] = useState({});
    const [loading, setLoading] = useState(true);
    const [allTabs,setAllTabs] = useState(['description','submissions','testcases','test-output']);
    const [error,setError] = useState(null);
    const [language,setLanguage] = useState("cpp");
    const [code,setCode] = useState(boilerplate);
    const [running,setRunning] = useState(false);
    const [executing,setExecuting] = useState(false);
    const [submitting,setSubmitting] = useState(false);
    const [testResults,setTestResults] = useState(null);
    const [executionResults,setExecutionResults] = useState(null);
    const [executionStatus,setExecutionStatus] = useState(null);
    const editorRef = useRef(0);
    const [editorKey,setEditorKey] = useState(0);

    useEffect(()=>{
    console.log(process.env.NEXT_PUBLIC_EXECUTION_WORKER_URL);
    setLoading(true);
    axios
      .get(`/api/problem/?slug=${slug}`)
      .then((response) => {
        const data = response.data;
        if(data?.problem) {
          setProblem(data.problem);
        //   setTestInput(data.problem.examples.map(example=>`${example.testcase.input}`));
        }
        else{
          setError(data.error);
        }
      })
      .catch((error) => {
        const errorResponse = error.response;
        const errorResponseData = errorResponse.data;
        const errorMessage = errorResponseData.message;
        setError(errorMessage);
      })
      .finally(() => {
          setLoading(false);
          error ? toast.error(error) : "";
          setError(null);
      });
  }, [slug]);

  const handleCodeExecution = ()=>{
    const workerURL = process.env.NEXT_PUBLIC_EXECUTION_WORKER_URL;
    setExecuting(true);
    axios.post(
        workerURL,
        {
            code:code[language],
            language:language,
            testcases:problem.testcases
        }
    )
    .then((response)=>{
        const executionResponseData = response.data;
        const executionError = executionResponseData.error;
        const executionStatus = executionResponseData.overallStatus;
        const executionResults = executionResponseData.executionResults;
        if(executionError){
            setError(executionError);
        }
        else{
            setExecutionStatus(executionStatus);
            setExecutionResults(executionResults);
            handleCodeSubmission();
        }
    })
    .catch(error=>{
        console.log(error);
    })
    .finally(()=>{
        setExecuting(false);
        if(error){
            toast.error(error);
            setError(null);
        }
    })

  }
  
  const handleCodeSubmission = ()=>{
    setSubmitting(true);
    axios.post(
        '/api/submission',
        {
            problemId:problem.id,
            code:code[language],
            language:language,
            status:executionStatus
        }
    )
    .then(

    )
    .catch()
    .finally(
        ()=>setSubmitting(false)
    );
  }

  return (
    <div className='w-full min-h-screen from-blue-300 to-violet-400 via-zinc-100'>  
    {
        (loading)
        ?
        <Spinner className='m-auto h-20 w-20'/>
        :
        <div className='flex flex-col md:flex-row min-h-screen'>
    
            <div className="flex flex-col p-8 gap-4 w-full md:w-[45%] overflow-scroll h-screen bg-gradient-to-br">
                <h2 className='font-bold text-2xl text-black'>{problem.id}.{problem.title}</h2>

                <div className='flex flex-wrap w-fit gap-1 p-2 border-dotted border-2 border-violet-400'>
                    {allTabs.map((tabName,index) => 
                        <Button
                          key={index}
                          gradientMonochrome={"info"}
                          outline = {tab===tabName}
                          onClick= {()=>setTab(tabName)}
                        >{tabName}</Button>
                    )
                    }
                    </div>
                    
                    {
                        tab=="description"
                        &&
                        <ProblemDescription problem={problem}/>
                    }
                    {
                        tab=="submission"
                        &&
                        <ProblemSubmissions problem={problem} setEditorLanguage={setLanguage} setCode={setCode}/>
                    }
            </div>
    
            <div className="w-full p-2 h-screen md:w-[55%] bg-gray-300">
            <div className="flex justify-between w-full text-black p-2">
                <select className="p-2 border-2 focus:border-blue-600 rounded" value={language} 
                    onChange={e => {
                    setLanguage(e.target.value);
                    setEditorKey(key=>key+1);
                    }
                  }
                >
                <option value="javascript">JavaScript</option>
                <option value="cpp">C++</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                </select>
                    <div className='flex gap-2'>
                    <Button gradientDuoTone="purpleToPink" outline
                      disabled = {executing||running}
                      onClick={handleCodeExecution}  
                    >
                     {running ? <Spinner color="purple"/> : "Run"}
                    </Button>

                    <Button gradientDuoTone="purpleToPink" outline
                      disabled = {executing||running||submitting}
                      onClick={handleCodeExecution}  
                    >
                     {executing ? <Spinner color="purple"/> : "Submit"}
                    </Button>
                    </div>
            </div>
          <Editor
            height="90vh"
            key={editorKey}
            value={code[language]}
            defaultLanguage={language}
            defaultValue={boilerplate[language]}
            onMount={(editor)=>{
            editorRef.current = editor;
            editorRef.current.focus();
             }}
            onChange={(value)=>{
                const newCode = {...code,[language]:value}
                setCode(code=>newCode);
            }}
            options={{
                minimap: { enabled: false }, 
            }}
        />
                    
            </div>
            
        </div>
        
    }
    <Toaster/>
    </div>
  )
}

export default Page
