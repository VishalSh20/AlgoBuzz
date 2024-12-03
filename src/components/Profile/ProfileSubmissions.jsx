import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaEye } from 'react-icons/fa';
import { Modal, Button, Spinner } from 'flowbite-react';
import { MdWarning } from 'react-icons/md';

function ProfileSubmissions({allSubmissions}) {
  const submissions = allSubmissions.reverse();
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const totalPages = Math.ceil(allSubmissions.length/limit);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
  };
  
  const closeModal = () => {
    setSelectedSubmission(null);
  };


  // Status color mapping
  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACCEPTED':
        return 'text-green-400';
      case 'REJECTED':
        return 'text-red-400';
      case 'PENDING':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="flex flex-col w-full bg-[#0f1f0f] p-4 rounded-lg shadow-2xl border border-[#00ff00]/20">
      {/* Loading and Error Handling */}
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <Spinner color="success" size="xl" />
        </div>
      ) : error ? (
        <div className='bg-red-500/20 p-4 rounded-lg flex items-center gap-4'>
          <MdWarning className='text-4xl text-red-600'/>
          <span className='text-xl text-red-300'>{error}</span>
        </div>
      ) : (
        <div className='flex flex-col w-full'>
          {/* Table Header */}
          <div className="grid grid-cols-10 gap-4 p-3 font-semibold bg-[#00ff00]/20 text-[#00ff00] rounded-md mb-2">
            <div className="col-span-2">Status</div>
            <div className="col-span-6">Problem</div>
            <div className="col-span-2">Time</div>
          </div>

          {/* Table Body */}
          <div className="bg-[#121212] rounded-lg">
            {submissions
            .filter((sub,index)=>index>=((page-1)*limit) && index<(page*limit))
            .map((sub, index) => (
              <div
                key={index}
                className="grid grid-cols-10 gap-4 p-2 items-center border-b border-[#333] hover:bg-[#1e1e1e] transition-colors"
              >
                <div className={`col-span-2 capitalize font-medium ${getStatusColor(sub.status)}`}>
                  {sub.status?.charAt(0).toUpperCase() + sub.status?.slice(1).toLowerCase().replace('_', ' ')}
                </div>
                <div className="col-span-6 text-[#90fa0a] font-medium">
                  {sub.problem?.title || 'N/A'}
                </div>
                <div className="col-span-1 text-gray-400">
                  {new Date(sub.createdAt).toLocaleDateString()}
                </div>
                <div className="col-span-1 flex justify-end">
                  <FaEye 
                    onClick={() => handleViewSubmission(sub)}
                    className="text-[#00ff00] cursor-pointer hover:text-[#39ff14] transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button 
          className={`p-2 rounded transition-all ${
            page > 1 
              ? "bg-[#00ff00]/20 text-[#00ff00] hover:bg-[#00ff00]/30" 
              : "bg-[#333] text-gray-500 cursor-not-allowed"
          }`} 
          disabled={page === 1} 
          onClick={() => setPage(page - 1)}
        >
          <FaArrowLeft />
        </button>
        
        <span className="text-[#00ff00] font-bold">
          {page} / {totalPages}
        </span>
        
        <button 
          className={`p-2 rounded transition-all ${
            page < totalPages 
              ? "bg-[#00ff00]/20 text-[#00ff00] hover:bg-[#00ff00]/30" 
              : "bg-[#333] text-gray-500 cursor-not-allowed"
          }`} 
          disabled={page === totalPages} 
          onClick={() => setPage(page + 1)}
        >
          <FaArrowRight />
        </button>
      </div>

      {/* Submission Details Modal */}
      {selectedSubmission && (
        <Modal show={!!selectedSubmission} onClose={closeModal}>
          <Modal.Header className="bg-[#0f1f0f] text-[#00ff00]">
            Submission Details
          </Modal.Header>
          <Modal.Body className="bg-[#0f1f0f] text-[#00ff00]">
            <div className="space-y-4">
              <div className='flex justify-between'>
                <p><strong>Problem:</strong> {selectedSubmission.problemId || 'N/A'}</p>
                <p className={`${getStatusColor(selectedSubmission.status)}`}>
                  <strong>Status:</strong> {selectedSubmission.status}
                </p>
              </div>
              <p><strong>Submitted At:</strong> {new Date(selectedSubmission.createdAt).toLocaleDateString()}</p>
              <div className='bg-[#00ff00]/10 w-full p-4 m-4 overflow-auto rounded-xl max-h-[300px]'>
                <code>
                  <pre className='text-wrap font-mono text-[#90fa0a]'>
                    {selectedSubmission.code || 'No code available'}
                  </pre>
                </code>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="bg-[#0f1f0f]">
            <Button onClick={closeModal} color="dark">Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default ProfileSubmissions;