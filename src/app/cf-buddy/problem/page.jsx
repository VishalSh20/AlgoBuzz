"use client"
import axios from 'axios';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { MdErrorOutline, MdSearch } from 'react-icons/md'

function Page() {
    const [finding,setFinding] = useState(false);
    const [contestId,setContestId] = useState(2024);
    const [problemIndex,setProblemIndex] = useState("A");
    const [problem,setProblem] = useState(null);
    const [error,setError] = useState(null);
    const router = useRouter();
 
 const findQuestionHandler = ()=>{
    setProblem(null);
    setError(null);
    setFinding(true);
    const requestURL = `${process.env.NEXT_PUBLIC_CF_INTERFACE_URL}/problemset.problems`;

    axios
    .get(requestURL)
    .then((response)=>{
        const responseData = response.data;
        if(responseData.status == "OK"){
          const allProblems = responseData.result?.problems;
          let expectedProblem = allProblems.filter((prob)=>{
            return prob.contestId==contestId && prob.index==problemIndex;
          });
          if(expectedProblem.length){
            expectedProblem = expectedProblem[0];
            setProblem(expectedProblem);
          }
          else
            setError("Problem does not exist"); 
        }
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
    <section className=' flex flex-col pt-20 gap-4 items-center justify-center min-h-[100svh] bg-gradient'>
      <div className=''>
        <span className="font-bold logo-gradient text-3xl">CF-Buddy Problem Interface</span>
      </div>

      {/* question jo mila */}
      <div
      className={`items-center justify-center w-[90%] sm:w-fit p-4 ${
        (problem || error) && !finding ? "flex" : "hidden"
      }`}
      >
      {problem ? (
        <div className="grid grid-cols-7 gap-4 p-4 mb-2 rounded-lg border border-[#00ff00]/30 hover:border-[#00ff00] hover:shadow-[0_0_5px_#00ff00] transition-all duration-300 bg-zinc-900/50">
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
      ) : (
        <div className="flex w-full justify-between items-center p-4 bg-gradient-to-br from-red-600 to-red-800 text-red-200 rounded-lg shadow-red-500/50">
          <MdErrorOutline className="text-3xl neon-glow-red" />
          <span className="font-bold">{error}</span>
        </div>
      )}
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
                value={problemIndex}
                onChange={(e)=>setProblemIndex(id => e.target.value.trim())}/>
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



      </div>
    </section>
  )
}

export default Page
