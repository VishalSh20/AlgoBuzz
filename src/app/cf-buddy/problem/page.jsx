"use client"
import axios from 'axios';
import { Spinner } from 'flowbite-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { MdErrorOutline, MdSearch } from 'react-icons/md'

function Page() {
    const [finding,setFinding] = useState(false);
    const [contestId,setContestId] = useState(2024);
    const [problemId,setProblemId] = useState("A");
    const [problem,setProblem] = useState(null);
    const [error,setError] = useState(null);
    const router = useRouter();
 
 const findQuestionHandler = ()=>{
    setProblem(null);
    setError(null);
    setFinding(true);
    const requestURL = `${process.env.NEXT_PUBLIC_CF_INTERFACE_URL}/problem/?contestId=${contestId}&problemId=${problemId}`;
    console.log(requestURL);

    axios
    .get(requestURL)
    .then((response)=>{
        console.log("ResponseData",response.data);
        const responseData = response.data;
        setProblem(responseData.problem);
    })
    .catch((error)=>{
        const errorMessage = error.response?.data?.error || error.response?.status || error.message;
        console.log("Error is- ",errorMessage);
        setError(errorMessage);
    })
    .finally(()=>{
        setFinding(false);
    })
 }

  return (
    <div className=' flex flex-col items-center min-h-[100svh] bg-gradient-to-br from-gray-800 via-green-900 to-emerald-900'>
      <header className='w-full px-4 pt-20 pb-10'>
        <span className="font-bold text-green-800 text-3xl">CF-Buddy Problem Interface</span>
      </header>

      <main className='w-full h-full flex flex-wrap justify-evenly gap-10 p-10'>

        {/* form to find problem */}
            <div className='flex flex-col items-center w-[90%] sm:w-[35%] p-4 gap-4 bg-gradient-to-br from-green-700 to-teal-500 border border-emerald-400 rounded-xl'>
                <h2 className='self-center text-2xl '>Find Problem:</h2>
                <div className="flex items-center gap-2 p-2">
                <label>Contest Id -</label>
                <input type='number' 
                className='max-w-28 p-2'
                min={1} 
                max={4000} 
                value={contestId}
                onChange={(e)=>setContestId(id => e.target.value)}/>
                </div>

                <div className="flex items-center gap-2 p-2">
                <label>Problem Id -</label>
                <input 
                className='max-w-20 p-2'
                maxLength={2}
                value={problemId}
                onChange={(e)=>setProblemId(id => e.target.value.trim())}/>
                </div>

                <button
                    className='self-center flex items-center gap-1 p-2 w-fit rounded-xl bg-gradient-to-r from-teal-400 to-cyan-700 hover:from-teal-200 hover:to-purple-400  hover:border-2 hover:border-purple-800'
                    disabled={finding}
                    onClick={findQuestionHandler}
                >
                    <span>{finding ? <Spinner/> : "Find"}</span>
                    <MdSearch className={`${finding && "hidden"}`}/>
                </button>
            </div>

        {/* question jo mila */}
        <div
  className={`items-center justify-center w-[90%] sm:w-fit p-4 ${
    (problem || error) && !finding ? "flex" : "hidden"
  }`}
>
  {problem ? (
    <div className="grid grid-cols-6 w-full p-4 border-2 border-emerald-400 rounded-xl bg-gradient-to-br from-black to-gray-800 shadow-neon">
      {/* Problem ID */}
      <div className="col-span-1 p-2 text-emerald-300 font-mono text-lg font-bold">
        {`${problem.id}`}
      </div>

      {/* Problem Title */}
      <div className="col-span-4 p-2 text-clip flex flex-col gap-1 text-emerald-200">
        <span className="text-xl font-semibold hover:text-emerald-400 transition duration-150">
          {problem.title}
        </span>
        {/* <span>{problem.topics}</span> */}
      </div>

      {/* Solve Button */}
      <div className="col-span-1 p-2 flex justify-center items-center">
        <Link href={`/cf-buddy/problem/${contestId}-${problemId}`}>
          <button className="bg-gradient-to-r from-purple-500 to-teal-500 text-white font-semibold hover:from-green-500 hover:to-purple-500 hover:scale-105 p-2 text-sm rounded-xl transform transition-all duration-300 shadow-lg shadow-purple-500/50">
            Solve
          </button>
        </Link>
      </div>
    </div>
  ) : (
    <div className="flex w-full justify-between items-center p-4 bg-gradient-to-br from-red-600 to-red-800 text-red-200 rounded-lg shadow-red-500/50">
      <MdErrorOutline className="text-3xl neon-glow-red" />
      <span className="font-bold">{error}</span>
    </div>
  )}
</div>


      </main>
    </div>
  )
}

export default Page
