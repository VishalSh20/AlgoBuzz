"use client"
import React, { useState } from 'react';
import { FaDotCircle } from 'react-icons/fa';
import { MdMemory, MdTimer } from 'react-icons/md';

function ProblemTestOutput({ testcases, overallStatus, overallTime, overallMemory, executionResults, executionError }) {
  const [tab, setTab] = useState(0);

  return (
    <div className="flex flex-col gap-4 w-full h-full p-4 bg-gradient-to-r from-gray-100 to-purple-100 rounded-lg shadow-md overflow-y-scroll text-gray-800">
      {/* Overall Status */}
      <div className={`w-fit px-4 py-2 rounded-full text-white font-bold ${overallStatus === "Accepted" ? "bg-green-500" : "bg-red-500"}`}>
        {overallStatus}
      </div>

      {/* Overall Time and Memory */}
      {(overallStatus === "Accepted" || overallStatus === "Wrong Answer" || overallStatus === "Time Limit Exceeded") && (
        <div className="flex justify-evenly items-center w-full gap-8 text-lg">
          <div className="flex items-center gap-2">
            <MdTimer className="text-2xl" />
            <span>{`${overallTime} s` || "-"}</span>
          </div>
          <div className="flex items-center gap-2">
            <MdMemory className="text-2xl" />
            <span>{`${(overallMemory/1000).toFixed(3)} mb` || "-"}</span>
          </div>
        </div>
      )}

      {/* Test Case Tabs */}
      <div className="flex flex-wrap justify-start gap-4 py-2">
        {testcases.map((test, index) => (
          <button
            key={index}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all 
            ${tab === index ? "border-4 border-violet-800" : "border-2 border-gray-400"} 
            ${executionResults?.[index]?.status?.description === "Accepted" ? "bg-green-200" : "bg-red-200"}`}
            onClick={() => setTab(index)}
          >
            <FaDotCircle className="text-lg" color={executionResults?.[index]?.status.description === "Accepted" ? "green" : "red"} />
            TestCase {index + 1}
          </button>
        ))}
      </div>

      {/* Test Case Details */}
      <div className="flex flex-col gap-4 w-full bg-white p-4 rounded-lg shadow-sm">
        {/* Time and Memory for Selected Tab */}
        <div className="flex justify-around text-xl font-semibold">
          <div className="flex items-center gap-2">
            <MdTimer />
            <span>{`${executionResults?.[tab]?.time} s` || "-"}</span>
          </div>
          <div className="flex items-center gap-2">
            <MdMemory />
            <span>{`${(executionResults?.[tab]?.memory/1000).toFixed(3)} mb` || "-"}</span>
          </div>
        </div>

        {/* Input */}
        <div>
          <label className="font-bold text-gray-700">Input:</label>
          <textarea
            rows={Math.min(testcases[tab]?.input?.split('\n').length, 10)}
            className="w-full p-2 mt-2 bg-gray-100 rounded-md resize-none border-2 border-gray-300 overflow-auto"
            readOnly
            value={testcases[tab]?.input}
          />
        </div>

        {/* Code's Output */}
        <div>
          <label className="font-bold text-gray-700">Code's Output:</label>
          <pre className="p-2 mt-2 bg-gray-100 rounded-md border-2 border-gray-300 w-full text-wrap">
            {executionResults?.[tab]?.stdout || "-"}
          </pre>
        </div>

        {/* Expected Output */}
        {testcases[tab]?.output && (
          <div>
            <label className="font-bold text-gray-700">Expected Output:</label>
            <pre className="p-2 mt-2 bg-gray-100 rounded-md border-2 border-gray-300 w-full text-wrap">
              {testcases[tab]?.output}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProblemTestOutput;
