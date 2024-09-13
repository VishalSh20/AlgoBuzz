// pages/ide.js
"use client"
import {Editor} from "@monaco-editor/react"
import { useRef, useState } from 'react';
import { FaTerminal } from 'react-icons/fa';
import { Textarea, Card, Button } from 'flowbite-react';
import { boilerplate } from "../constants";

export default function Page() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language,setLanguage] = useState('javascript');
  const [code,setCode] = useState('');
  const [error,setError] = useState(null);
  const [editorKey,setEditorKey] = useState(0);
  const editorRef = useRef();

  return (
    <div className="min-h-screen flex flex-col bg-yellow-50 text-white">
      <header className="py-4 bg-indigo-600 text-center text-2xl font-bold shadow-lg">
        GS-Code-Solver IDE
      </header>

      <main className="flex flex-1 w-full">
        {/* Left side: Monaco Editor */}
        <div className="w-[50%] p-4">
          <Card className="bg-gray-800 shadow-lg">
            <div className="flex justify-between w-full text-black">
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

                    <Button gradientDuoTone="purpleToPink" outline>
                        Run
                    </Button>
            </div>
          <Editor
            height="90vh"
            key={editorKey}
            value={code}
            defaultLanguage={language}
            defaultValue={boilerplate[language]}
            onMount={(editor)=>{
            editorRef.current = editor;
            editorRef.current.focus();
             }}
            onChange={(value)=>{
                setCode(value);
            }}
            options={{
                minimap: { enabled: false }, // Disables the minimap
            }}
        />
        </Card>
        </div>

        {/* Right side: Input and Output */}
        <div className="w-[45%] p-4 space-y-4">
          {/* Input Box */}
          <Card className="bg-gray-800 shadow-lg">
            <div className="text-lg font-bold flex items-center mb-2">
              <FaTerminal className="mr-2" /> Input
            </div>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={6}
              className="text-black"
              placeholder="Enter input here..."
            />
          </Card>

          {/* Output Box */}
          <Card className="bg-gray-800 shadow-lg">
            <div className="text-lg font-bold flex items-center mb-2">
              <FaTerminal className="mr-2" /> Output
            </div>
            <div className="p-4 bg-gray-700 h-32 overflow-auto">
              {output || 'Your output will appear here...'}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
