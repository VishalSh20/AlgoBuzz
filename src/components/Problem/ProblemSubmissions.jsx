"use client"
import axios from 'axios';
import { Button, Modal, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { RiShareForward2Fill } from "react-icons/ri";
import { IoMdTime } from 'react-icons/io';
import { MdContentCopy, MdMemory } from 'react-icons/md';
import toast, { Toaster } from "react-hot-toast";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function ProblemSubmissions({userId, problem, setEditorLanguage, setCode }) {
  const [page, setPage] = useState(1);
  const [submissions, setSubmissions] = useState([]);
  const [moreSubmissionsAhead, setMoreSubmissionsAhead] = useState(false);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [language, setLanguage] = useState("");
  const [error, setError] = useState(null);
  const [limitToUser, setLimitToUser] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  // Fetch submissions based on the selected page, status, language, etc.
  useEffect(() => {
    setSubmissionsLoading(true);
    axios.get('/api/submission', {
      params: {
        page: page,
        problemId: problem.id,
        userId:userId,
        userOnly: limitToUser,
        language: language,
        status: status,
      },
    })
      .then(response => {
        const data = response.data;
        if (data?.body) {
          setSubmissions(data.body.submissions);
          setMoreSubmissionsAhead(data.body.areSubmissionsAhead);
        } else {
          toast.error(data.error);
          setError(data.error);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setSubmissionsLoading(false));
  }, [page, status, language, limitToUser]);

  const getTimeSeparation = (solvedTime) => {
    const pastTime = new Date(solvedTime).getTime();
    const currTime = Date.now();
    const timeSeparation = currTime - pastTime;
    
    let seconds = Math.floor(timeSeparation / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    
    seconds %= 60;
    minutes %= 60;
    hours %= 24;
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}, ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}, ${seconds} second${seconds > 1 ? 's' : ''} ago`;
    
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="flex flex-col w-full text-black">
      <Toaster position="top-left" reverseOrder={false} />
      
      <Modal show={openModal} onClose={() => setOpenModal(false)} position="center" className='text-black'>
        <Modal.Header>Submission Details</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4">
            {/* Status and submission time */}
            <div className="flex justify-between">
              <div className={`flex flex-col p-2 items-baseline ${selectedSubmission?.status === 'ACCEPTED' ? "bg-green-400" : "bg-red-500"} rounded-lg`}>
                <span className="font-bold text-xl">Status</span>
                <span>{`${selectedSubmission?.status[0]}${selectedSubmission?.status.substr(1).toLowerCase()}`.replace('_', ' ')}</span>
              </div>
              <div className="flex flex-col items-baseline">
                <span className="font-bold">Submission time</span>
                <span>{new Date(selectedSubmission?.createdAt).toLocaleDateString()} {new Date(selectedSubmission?.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>

            {/* Language, memory, time taken */}
            <div className="flex gap-2 justify-evenly">
              <div className="rounded p-2 flex flex-col items-center bg-gradient-to-r from-gray-200 to-zinc-100">
                <span className="font-semibold">Language</span>
                <span>{selectedSubmission?.language}</span>
              </div>
              <div className="rounded p-2 flex flex-col items-center bg-gradient-to-r from-gray-200 to-zinc-100">
                <MdMemory />
                <span>{selectedSubmission?.memory > 0 ? `${(selectedSubmission?.memory / 1024).toFixed(2)} MB` : "NA"}</span>
              </div>
              <div className="rounded p-2 flex flex-col items-center bg-gradient-to-r from-gray-200 to-zinc-100">
                <IoMdTime />
                <span>{selectedSubmission?.time_taken > 0 ? `${(selectedSubmission?.time_taken).toFixed(3)} secs` : "NA"}</span>
              </div>
            </div>

            {/* Submission code and actions */}
            <div className="m-2 px-4 py-2 bg-gradient-to-tr from-purple-100 to-indigo-300 rounded-lg">
              <div className="flex justify-end gap-2">
                <Button title="copy to clipboard" pill outline onClick={() => {
                  navigator.clipboard.writeText(selectedSubmission?.code);
                  toast.success("Copied to clipboard!");
                }}>
                  <MdContentCopy />
                </Button>
                <Button title="Move to editor" pill outline onClick={() => {
                  setEditorLanguage(selectedSubmission?.language);
                  setCode(code => ({ ...code, language: selectedSubmission.code }));
                  toast.success("Code moved to editor!");
                }}>
                  <RiShareForward2Fill /> Move to Editor
                </Button>
              </div>
              <pre className='text-wrap'><code>{selectedSubmission?.code}</code></pre>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Filter Section */}
      <div className="flex justify-between p-2">
        <select value={limitToUser} onChange={(e) => setLimitToUser(e.target.value === 'true')} className="px-2 py-1 border rounded-md bg-white focus:outline-none">
          <option value={true}>My Submissions</option>
          <option value={false}>All Submissions</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-2 py-1 border rounded-md bg-white focus:outline-none">
          <option value="">Status</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="WRONG_ANSWER">Wrong Answer</option>
          {/* other options... */}
        </select>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="px-2 py-1 border rounded-md bg-white focus:outline-none">
          <option value="">Language</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          {/* other options... */}
        </select>
      </div>

      {/* Submissions List */}
      {submissionsLoading ? (
        <div className="w-full flex justify-center p-4">
          <Spinner className="text-indigo-500 w-12 h-12" />
        </div>
      ) : submissions.length > 0 ? (
        <div className="w-full">
          {submissions.map((submission, index) => (
            <div key={index} className={`grid grid-cols-6 font-mono m-1 p-2 rounded-xl ${submission.status === 'ACCEPTED' ? "bg-green-300 hover:bg-green-400" : "bg-red-400 hover:bg-red-500"} cursor-pointer`}>
              <span className="col-span-2 ml-2">{submission.status.replace('_', ' ')}</span>
              <span className="col-span-1">{submission.language}</span>
              <span className="col-span-2">{getTimeSeparation(submission.createdAt)}</span>
              <Button
                pill
                outline
                size="sm"
                onClick={() => {
                  setSelectedSubmission(submission);
                  setOpenModal(true);
                }}
                className="text-center justify-self-end"
              >
                View Details
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full flex justify-center p-4">
          <span>No submissions found for the selected filters.</span>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between p-2">
        <Button
          disabled={page === 1}
          pill
          outline
          onClick={() => setPage(page - 1)}
          className="flex items-center gap-1"
        >
          <FaArrowLeft /> Previous
        </Button>
        <Button
          disabled={!moreSubmissionsAhead}
          pill
          outline
          onClick={() => setPage(page + 1)}
          className="flex items-center gap-1"
        >
          Next <FaArrowRight />
        </Button>
      </div>
    </div>
  );
}

export default ProblemSubmissions;

