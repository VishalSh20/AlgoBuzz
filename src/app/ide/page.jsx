"use client"
import { Editor } from "@monaco-editor/react";
import { Toaster, toast } from "react-hot-toast";
import { useRef, useState } from 'react';
import { FaTerminal } from 'react-icons/fa';
import { Textarea, Card, Button, Spinner, Modal, Dropdown } from 'flowbite-react';
import { boilerplate } from "../constants";
import axios from "axios";

export default function Page() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(boilerplate);
  const [executing, setExecuting] = useState(false);
  const [status, setStatus] = useState("");
  const [time, setTime] = useState(-1);
  const [memory, setMemory] = useState(-1);
  const [error, setError] = useState(null);
  const [editorKey, setEditorKey] = useState(0);
  const editorRef = useRef();

  const handleCodeExecution = (e) => {
    setExecuting(executing => true);
    const loadToast = toast.loading("Running...be patient");
    axios.post(
      "https://code-solver-worker-production.up.railway.app",
      {
        code: code[language],
        language,
        testcases: [{ input: input }],
      }
    )
      .then(
        (response) => {
          const data = response.data;
          if (data) {
            const overallStatus = data.overallStatus;
            const executionResults = data.executionResults;
            const executionOutput = executionResults[0].stdout;
            const executionError = executionResults[0].error;
            if (overallStatus) {
              setStatus(overallStatus);
              if (executionOutput) {
                toast.success("Execution Completed", { id: loadToast });
                setOutput(executionOutput);
              }
              else {
                toast.error(executionError, { id: loadToast });
                setOutput(executionError);
              }
            }
          }
        }
      )
      .catch(
        (errorResponse) => {
          toast.error("Oops..error occurred");
        }
      )
      .finally(
        () => { setExecuting(false); }
      );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r via-purple-800 from-violet-400 to-cyan-400 text-white">
      {/* <header className="py-4 mt-2 mx-auto bg-gradient-to-r from-cyan-300  to-pink-300 w-fit p-1 rounded text-2xl text-black font-bold shadow-lg">
        GS-Code-Solver IDE
      </header> */}

      <main className="flex flex-1 flex-col md:flex-row w-full">
        {/* Left side: Monaco Editor */}
        <div className="w-full md:w-[50%] p-4">
          <Card className="bg-gray-900 shadow-lg border border-purple-500">
            <div className="flex justify-between w-full text-white">
              <select className="p-2 border-2 border-purple-600 focus:border-pink-600 bg-gray-700 text-white rounded"
                value={language}
                onChange={e => {
                  setLanguage(e.target.value);
                  setEditorKey(key => key + 1);
                }}>
                <option value="javascript">JavaScript</option>
                <option value="cpp">C++</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
              </select>

              <Button gradientDuoTone="purpleToPink" outline disabled={executing} onClick={handleCodeExecution}>
                {executing ? <Spinner color="purple" /> : "Run"}
              </Button>
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
            />
          </Card>
        </div>

        {/* Right side: Input and Output */}
        <div className="w-[90%] md:w-[45%] p-4 space-y-4">
          {/* Input Box */}
          <Card className="bg-gray-900 shadow-lg border border-purple-500">
            <div className="text-lg font-bold flex items-center mb-2">
              <FaTerminal className="mr-2" /> Input
            </div>
            <Textarea
              value={input}
              disabled={executing}
              onChange={(e) => setInput(e.target.value)}
              rows={6}
              className="bg-gray-700 text-white border border-purple-600"
              placeholder="Enter input here..."
            />
          </Card>

          {/* Output Box */}
          <Card className="bg-gray-900 shadow-lg border border-purple-500">
            <div className="text-lg font-bold flex justify-between items-center mb-2">
              <div>
                Output
              </div>

              <Dropdown label={<span>{status}</span>}>
                <Dropdown.Header>
                  <div className={`text-2xl ${status === "Accepted" ? "text-green-500 bg-green-300" : "text-red-600 bg-red-300"}`}>
                    {status}
                  </div>
                </Dropdown.Header>
              </Dropdown>
            </div>
            <div className="p-4 bg-gray-700 min-h-32 overflow-auto text-white">
              {output || 'Your output will appear here...'}
            </div>
          </Card>
        </div>
      </main>
      <Toaster />
    </div>
  );
}
