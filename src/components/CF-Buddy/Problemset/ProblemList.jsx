"use client"

import Loading from '@/app/loading'
import { useRouter } from 'next/navigation'
import React from 'react'

function ProblemList({ problems, problemsLoading,page }) {
  const startIndex = (page-1)*50;
  const endIndex = (page)*50;
  const router = useRouter();
  return (
    <div className='w-full h-svh p-4 bg-inherit cursor-default' key={problemsLoading}>
      {problemsLoading ? (
        <Loading />
      ) : (
        <div className="w-full h-svh overflow-y-auto p-2">
          <div className='w-full rounded-xl border-2 border-[#00ff00] shadow-[0_0_10px_#00ff00] p-4'>
            
            {/* Header */}
            <div className='grid grid-cols-7 gap-4 p-4 rounded-xl bg-zinc-900 text-sm mb-4 border border-[#00ff00] shadow-[0_0_5px_#00ff00]'>
              <span className='text-[#00ff00] font-bold'>ContestId</span>
              <span className='text-[#00ff00] font-bold'>Index</span>
              <span className='text-[#00ff00] font-bold col-span-2'>Title</span>
              <span className='text-[#00ff00] font-bold'>Rating</span>
              <span className='text-[#00ff00] font-bold'>Solved Count</span>
              <span className='text-[#00ff00] font-bold'>Actions</span>
            </div>

            {/* Problem Rows */}
            {problems
            .filter((_,index)=>{
              return index>=startIndex && index<endIndex;
            })
            .map((problem, index) => (
              <div key={index} className="grid grid-cols-7 gap-4 p-4 mb-2 rounded-lg border border-[#00ff00]/30 hover:border-[#00ff00] hover:shadow-[0_0_5px_#00ff00] transition-all duration-300 bg-zinc-900/50">
                <span className="text-gray-900 font-mono">
                  {problem.contestId}
                </span>

                <span className="text-gray-900 font-mono">
                  {problem.index}
                </span>

                <div className="col-span-2">
                  <div className="text-gray-900 font-bold mb-1">{problem.name}</div>
                  <div className='text-gray-900/60 text-sm'>{problem.tags.join(', ')}</div>
                </div>

                <span className="text-gray-900 font-mono">
                  {problem.rating || problem.points}
                </span>

                <span className="text-gray-900 font-mono">
                  {problem.solvedCount}
                </span>

                <button 
                className="px-4 py-2 rounded bg-[#00ff00]/20 text-gray-900 border border-[#00ff00] hover:bg-[#00ff00]/30 hover:shadow-[0_0_10px_#00ff00] transition-all duration-300 h-fit"
                onClick={()=>{
                  router.push(`/cf-buddy/problem/${problem.contestId}-${problem.index}`)
                }}
                >
                  Solve
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProblemList
