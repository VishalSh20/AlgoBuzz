"use client"
import axios from 'axios';
import { Spinner } from 'flowbite-react';
import { Loader } from 'lucide-react';
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
    <section className=' flex flex-col pt-20 gap-6 items-center justify-center min-h-[100svh] bg-gradient'>
      <div className=''>
        <span className="font-bold logo-gradient text-3xl">CF-Buddy Problem Interface</span>
      </div>

      <div className='w-full h-full flex flex-wrap justify-evenly gap-10'>

        {/* form to find problem */}
            <div className='flex flex-col items-center w-[90%] sm:w-[45%] px-4 py-8 gap-4 bg-gray-800/70 backdrop-blur-md text-white rounded-xl'>
                <h2 className='self-center text-2xl '>Find Problem:</h2>
                <div className="flex items-center gap-2 p-2">
                <label>Contest Id -</label>
                <input type='number' 
                className='max-w-28 p-2 bg-gray-900 rounded-lg'
                min={1} 
                max={4000} 
                value={contestId}
                onChange={(e)=>setContestId(id => e.target.value)}/>
                </div>

                <div className="flex items-center gap-2 p-2">
                <label>Problem Id -</label>
                <input 
                className='max-w-20 p-2 bg-gray-900 rounded-lg'
                maxLength={2}
                value={problemId}
                onChange={(e)=>setProblemId(id => e.target.value.trim())}/>
                </div>

                <button
                    className='self-center flex items-center gap-1 p-2 w-fit rounded-xl button-gradient2'
                    disabled={finding}
                    onClick={findQuestionHandler}
                >
                    <span>{finding ? <Loader className=' text-white animate-spin'/> : "Find"}</span>
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
    <div className="grid items-center grid-cols-6 w-full p-4 border border-emerald-400 rounded-xl bg-gradient-to-br from-gray-950 to-gray-800 shadow-neon">
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
          <button className="button-gradient2 text-white font-semibold  p-2 text-sm rounded-xl transform transition-all duration-300 shadow-lg shadow-green-500/50">
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


      </div>
    </section>
  )
}

export default Page
