import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaEye } from 'react-icons/fa';

function ProfileProblems({ problems }) {
  const [page, setPage] = useState(0);
  const totalPages = problems.length/10;
  const startIndex = page * 10;
  const endIndex = Math.min((page + 1) * 10,problems.length);

  return (
    <div className="flex flex-col w-full bg-inherit p-4">
      {/* Table Header */}
      <div className="grid grid-cols-10 gap-4 p-2 font-semibold bg-gray-800 text-white rounded-md">
        <div className="col-span-2">All</div>
        <div className="col-span-2">Easy</div>
        <div className="col-span-2">Medium</div>
        <div className="col-span-2">Hard</div>
      </div>

      {/* Table Body */}
     
        <div className="flex gap-1">
            <button className={`${page>0 ? "bg-slate-200" : "bg-slate-500"} p-2 rounded`} disabled={page===0} onClick={()=>setPage(page-1)}><FaArrowLeft/></button>
            <span className={`p-2 rounded`}>{page+1}</span>
            <button className={`${page<totalPages ? "bg-slate-200" : "bg-slate-500"} p-2 rounded`} disabled={page===totalPages} onClick={()=>setPage(page+1)}><FaArrowRight/></button>

        </div>
    </div>
  );
}

export default ProfileProblems;
