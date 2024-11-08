"use client"
import { Spinner } from 'flowbite-react'
import React from 'react'

function ProblemList({problems,problemsLoading}) {
  return (
    <div className='flex items-center w-full h-svh gap-4 p-2 border-1 border-teal-700 rounded-lg'>
      {
        problemsLoading
        ?
        <div className='flex flex-col h-full justify-center'>
            <span className='text-2xl font-mono font-bold'>Loading the problems...</span>
            <Spinner color="info" className='w-20 h-20'/>
        </div>
        :
        <div className="w-full h-svh overflow-scroll p-2">
        <table className='w-full h-full overflow-scroll border-2 border-gray-200 p-2 rounded-xl'>
            <thead className='p-4 border border-green-900 rounded-xl bg-gradient-to-br from-green-700 to-teal-700'>
                <tr>
                <th className='border border-gray-200'>Id</th>
                <th className='border border-gray-200'>Title</th>
                <th className='border border-gray-200'>Rating</th>
                <th className='border border-gray-200'>Submissions</th>
                <th className='border border-gray-200'></th>
                </tr>
            </thead>
            <tbody>
            {
                problems.map((problem,index) => (
                    <tr key={index} className="p-2 text-balance border border-gray-200 rounded-lg">
                    {/* Problem ID */}
                    <td className="border-2 text-cyan-400 font-bold p-2">
                      {problem.id}
                    </td>
                    
                    {/* Problem Name */}
                    <td className="flex flex-col border border-gray-200 p-2">
                      <span className="text-green-500 text-xl text-clip">{problem.name}</span>
                      <span className='text-gray-600 text-clip text-sm'>{problem.topics.join(',')}</span>
                    </td>
                    
                    {/* Problem Rating */}
                    <td className="border border-gray-200 p-2">
                      {problem.rating}
                    </td>
                    
                    {/* Accepted Count */}
                    <td className="border border-gray-200 p-2">
                      {problem.acceptedCount}
                    </td>
                    
                    {/* Solve Button */}
                    <td className="border border-gray-200 p-2">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                        Solve
                      </button>
                    </td>
                  </tr>
                ))
            }
            </tbody>
        </table>
        </div>
      }
    </div>
  )
}

export default ProblemList
