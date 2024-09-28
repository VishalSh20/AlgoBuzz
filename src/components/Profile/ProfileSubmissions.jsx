import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaEye } from 'react-icons/fa';

function ProfileSubmissions({ submissions }) {
  const [page, setPage] = useState(0);
  const totalPages = submissions.length/10;
  const startIndex = page * 10;
  const endIndex = Math.min((page + 1) * 10,submissions.length);

  return (
    <div className="flex flex-col w-full bg-inherit p-4">
      {/* Table Header */}
      <div className="grid grid-cols-10 gap-4 p-2 font-semibold bg-gray-800 text-white rounded-md">
        <div className="col-span-2">Status</div>
        <div className="col-span-6">Problem</div>
        <div className="col-span-2">Time</div>
      </div>

      {/* Table Body */}
      {submissions
        .filter((sub, index) => index >= startIndex && index < endIndex)
        .map((sub, index) => (
          <div
            key={index}
            className="grid grid-cols-10 gap-4 p-2 items-center border-b border-gray-300 hover:bg-gray-100 transition-colors"
          >
            <div className="col-span-2 capitalize text-gray-700">
              {sub.status[0] + sub.status.slice(1).replace('_', ' ').toLowerCase()}
            </div>
            <div className="col-span-6 text-blue-700 font-medium">
              {sub.problem.title}
            </div>
            <div className="col-span-2 text-gray-500">
              {new Date(sub.created_at).toLocaleDateString()}
            </div>
            <FaEye className="text-gray-500 cursor-pointer hover:text-gray-700" />
          </div>
        ))}

        <div className="flex gap-1">
            <button className={`${page>0 ? "bg-slate-200" : "bg-slate-500"} p-2 rounded`} disabled={page===0} onClick={()=>setPage(page-1)}><FaArrowLeft/></button>
            <span className={`p-2 rounded`}>{page+1}</span>
            <button className={`${page<totalPages ? "bg-slate-200" : "bg-slate-500"} p-2 rounded`} disabled={page===totalPages} onClick={()=>setPage(page+1)}><FaArrowRight/></button>

        </div>
    </div>
  );
}

export default ProfileSubmissions;
