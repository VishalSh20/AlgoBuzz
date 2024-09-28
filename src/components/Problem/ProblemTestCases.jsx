"use client"
import { Button, Modal } from 'flowbite-react';
import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';

function ProblemTestCases({problem, exampleTestCases, setExampleTestCases }) {
  const [newTestInput, setNewTestInput] = useState('');
  const [showAddCaseModal, setShowAddCaseModal] = useState(false);

  return (
    <div className="flex flex-col items-baseline overflow-y-scroll gap-4 w-full h-full bg-gradient-to-r from-slate-200 to-violet-200 p-2 text-black">
      
      {/* Add New Test Case Button */}
      <div className='flex justify-between p-2 w-full'>
      <button
        className="bg-gradient-to-r from-blue-600 to-violet-400 rounded-full p-2"
        onClick={(e) => {
          e.preventDefault();
          setShowAddCaseModal(true);
        }}
      >
        + Add
      </button>

      <button
        className="bg-gradient-to-r from-violet-600 to-violet-200 via-indigo-400 hover:from-indigo-400 hover:to-violet-700 rounded-full p-2"
        onClick={(e) => {
          e.preventDefault();
          setExampleTestCases(problem.testcases);
        }}
      >
        Refresh
      </button>
      </div>

      {/* Add Test Case Modal */}
      <Modal
        show={showAddCaseModal}
        onClose={() => setShowAddCaseModal(false)}
        className="w-full text-black"
      >
        <Modal.Header>
          <div>Add another test case</div>
        </Modal.Header>
        <Modal.Body>
          <label className="font-bold">TEST INPUT</label>
          <textarea
            className="w-[95%] overflow-auto resize-none border-2 border-gray-300 p-2 rounded-md"
            value={newTestInput}
            onChange={(e) => setNewTestInput(e.target.value)}
            rows={5}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex w-full justify-between">
            <button
              className="p-2 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-violet-400 rounded-lg"
              onClick={() => {
                setExampleTestCases((prev) => [
                  ...prev,
                  { id: Date.now(), input: newTestInput },
                ]);
                setShowAddCaseModal(false);
                setNewTestInput('');
              }}
            >
              Add
            </button>
            <button
              className="p-2 bg-gradient-to-r from-red-500 to-fuchsia-200 hover:from-fuchsia-400 hover:to-red-700 rounded-lg"
              onClick={() => {
                setShowAddCaseModal(false);
                setNewTestInput('');
              }}
            >
              Cancel
            </button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Display Test Cases */}
      <div className="flex flex-col items-center gap-4 p-2 w-full">
        {exampleTestCases.map((testcase, index) => (
          <div className="flex flex-col gap-2 w-full" key={testcase.id}>
            <label
              className="font-mono text-slate-800 shadow-md shadow-gray-400"
              htmlFor={`input${testcase.id}`}
            >
              Test Case {index + 1}
            </label>
            <div className="flex gap-2">
              <textarea
                id={`input${testcase.id}`}
                rows={Math.min(10, testcase.input.split('\n').length)}
                className="w-[95%] resize-none overflow-scroll border-2 border-gray-300 p-2 rounded-md"
                disabled
              >
                {testcase.input}
              </textarea>
              <button
                className="p-2 rounded-full text-red-600 border-2 border-red-600 hover:bg-red-400"
                onClick={() => {
                  setExampleTestCases((prev) =>
                    prev.filter((test) => test.id !== testcase.id)
                  );
                }}
              >
                <MdDelete />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProblemTestCases;
