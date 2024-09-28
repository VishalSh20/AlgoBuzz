'use client';

import { Spinner } from 'flowbite-react';
import React, { useState,useEffect } from 'react';
import { FaCheck } from 'react-icons/fa';
import { MdCancel, MdMemory, MdTimer } from 'react-icons/md';

function ProblemResult({ testcases, submissionInstance, executionResults, executionStatus, executionError, executionTime, executionMemory, submitting }) {
  const totalTestCases = testcases.length;
  const [checking, setChecking] = useState(false);
  const [testsChecked, setTestsChecked] = useState(0);

 useEffect(()=>{
  if(!submitting){
    // console.log(testsChecked,executionResults[testsChecked]);
    if(testsChecked<totalTestCases && executionResults[testsChecked]?.status?.description==="Accepted"){
      setChecking(true);
      setTestsChecked(count=>count+1);
    }
    else{
      setChecking(false);
    }
  }
 },[submitting,testsChecked,executionResults]);
  
  
  return (
    <div className='min-h-screen bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-6'>
      {
        submitting
          ?
          <div className="flex justify-center items-center h-full">
            <Spinner color="purple" size="xl" />
          </div>
          :
          // submissionInstance
          // ?
          // <div className='bg-inherit flex flex-col gap-4 w-full h-full items-center justify-center font-bold text-2xl'>
          //   <span>Oops..Network Error</span>
          //   <span>Please Try Again later!!</span>
          // </div>
          // :
          <div className='flex flex-col bg-white rounded-lg p-6 text-gray-900 shadow-lg w-full max-w-4xl mx-auto'>
            <div className='flex items-center justify-between font-mono mb-6'>
              <div className='flex items-center gap-2 text-2xl font-bold'>
                {checking && <Spinner color="info" size="md" />}
                <span>{testsChecked}/{totalTestCases} passed</span>
                {testsChecked === totalTestCases ? (
                  <FaCheck className='text-green-500 shadow-lg' />
                ) : (
                  !checking && <MdCancel className='text-red-500 shadow-lg' />
                )}
              </div>
              <div className={`py-2 px-4 rounded-lg font-bold text-white ${executionStatus === "Accepted" ? "bg-green-500" : "bg-red-500"}`}>
                {executionStatus}
              </div>
            </div>

            {!checking && testsChecked !== totalTestCases && (
              <div className='flex flex-col space-y-6'>
                <div className="flex justify-between bg-gray-200 p-4 rounded-lg">
                  <div className="flex flex-col items-center">
                    <MdTimer className='text-2xl' />
                    <span className="font-bold text-sm">{executionTime ? `${executionTime} s` : '-'}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <MdMemory className='text-2xl' />
                    <span className="font-bold text-sm">{executionMemory ? `${(executionMemory/1000).toFixed(3)} mb` : '-'}</span>
                  </div>
                </div>

                <div className='bg-gray-100 p-4 rounded-lg'>
                  <label className="font-bold text-sm text-gray-700">Last Executed Input:</label>
                  <textarea className='resize-none bg-gray-200 p-2 rounded-lg w-full text-sm'
                    rows={Math.min(5, testcases[testsChecked].input.split('\n').length)}
                    disabled>
                    {testcases[testsChecked].input}
                  </textarea>

                  <label className="font-bold text-sm mt-2 text-red-600">Code's Output:</label>
                  <textarea className='resize-none bg-gray-200 p-2 rounded-lg w-full text-sm'
                    rows={Math.min(5, (executionError || executionResults?.[testsChecked]?.stdout).split('\n').length)}
                    disabled>
                    {executionResults?.[testsChecked]?.error || executionResults?.[testsChecked]?.stdout}
                  </textarea>

                  <label className="font-bold text-sm text-gray-700 mt-2">Expected Output:</label>
                  <textarea className='resize-none bg-gray-200 p-2 rounded-lg w-full text-sm'
                    rows={Math.min(5, (testcases?.[testsChecked]?.output).split('\n').length)}
                    disabled>
                    {testcases?.[testsChecked]?.output}
                  </textarea>
                </div>
              </div>
            )}

            {(!checking && testsChecked === totalTestCases) && (
              <div className="flex flex-col space-y-6">
                <div className="flex justify-between bg-gray-200 p-4 rounded-lg">
                  <div className="flex flex-col items-center">
                    <MdTimer className='text-2xl' />
                    <span className="font-bold text-sm">{executionTime ? `${executionTime} s` : '-'}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <MdMemory className='text-2xl' />
                    <span className="font-bold text-sm">{executionMemory ? `${(executionMemory/1000).toFixed(3)} mb` : '-'}</span>
                  </div>
                </div>

                <div className='bg-gray-100 p-4 rounded-lg'>
                  <label className="font-bold text-sm text-gray-700">Submitted Code:</label>
                  <pre className="bg-gray-200 p-4 rounded-lg text-sm overflow-auto">
                    <code>{submissionInstance.code}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
      }
    </div>
  );
}

export default ProblemResult;
