"use client"
import axios from 'axios';
import { Loader } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { MdErrorOutline, MdSearch } from 'react-icons/md'

function Page() {
    const [finding,setFinding] = useState(false);
    const [contestId,setContestId] = useState(2024);
    const [contest,setContest] = useState(null);
    const [problems,setProblems] = useState([]);
    const [error,setError] = useState(null);
    const router = useRouter();
 
 const findContestHandler = ()=>{
    setContest(null);
    setProblems(null);
    setError(null);
    setFinding(true);
    const requestURL = `${process.env.NEXT_PUBLIC_CF_INTERFACE_URL}/contest.list`;
    console.log(requestURL);

    axios
    .get(requestURL)
    .then((response)=>{
        console.log("ResponseData",response.data);
        const responseData = response.data;
        if(responseData.status=="OK"){
          const allContests = responseData.result;
          let expectedContest = allContests.filter((contest)=>contest.id==contestId);
          if(expectedContest.length){
            expectedContest = expectedContest[0];
            setContest(expectedContest);
          }
          else
            setError("Contest does not exist");
        }
        else{
          setError("Contest can't be searched at the moment, try again later!")
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
    <section className=' flex flex-col pt-20 gap-6 items-center justify-center min-h-[100svh] bg-gradient'>
      <div className=''>
        <span className="font-bold logo-gradient text-3xl">CF-Buddy Contest Interface</span>
      </div>

      <div className='w-full h-full flex flex-wrap md:flex-nowrap justify-evenly gap-10'>

        {/* form to find problem */}
            <div className='flex flex-col items-center w-[90%] sm:w-[30%] px-4 py-8 gap-4 bg-gray-800/70 backdrop-blur-md text-white rounded-xl'>
                <h2 className='self-center text-2xl '>Find Contest:</h2>
                <div className="flex items-center gap-2 p-2">
                <label>Contest Id -</label>
                <input type='number' 
                className='max-w-28 p-2 bg-gray-900 rounded-lg'
                min={1} 
                max={4000} 
                value={contestId}
                onChange={(e)=>setContestId(id => e.target.value)}/>
                </div>

                <button
                    className='self-center flex items-center gap-1 p-2 w-fit rounded-xl button-gradient2'
                    disabled={finding}
                    onClick={findContestHandler}
                >
                    <span>{finding ? <Loader className=' text-white animate-spin'/> : "Find"}</span>
                    <MdSearch className={`${finding && "hidden"}`}/>
                </button>
            </div>

        {/* question jo mila */}
        <div
  className={`items-center justify-center w-[90%] sm:w-fit p-4 ${
    (contest || error) && !finding ? "flex" : "hidden"
  }`}
>
  {contest ? (
    <div className="grid items-center grid-cols-8 w-full p-4 border border-emerald-400 rounded-xl bg-gradient-to-br from-gray-950 to-gray-800 shadow-neon">
      {/* Contest ID */}
      <div className="col-span-1 p-2 text-emerald-300 font-mono text-lg font-bold">
        {`${contest.id}`}
      </div>

      {/* Contest Title */}
      <div className="col-span-4 p-2 flex flex-col gap-1 text-emerald-200">
        <span className="text-xl font-semibold hover:text-emerald-400 transition duration-150">
          {contest.name}
        </span>
      </div>

      {/* Contest type */}
      <div className="col-span-1 p-2 text-emerald-300 font-mono text-lg font-bold">
        {`${contest.type}`}
      </div>

     {/* Contest Phase */}
      <div 
        className="col-span-1 p-2 text-emerald-300 font-mono text-lg font-bold flex items-center"
        title={contest.phase}
      >
        <span 
          className={`inline-block w-4 h-4 rounded-full ${
            contest.phase === "BEFORE" ? "bg-yellow-400" :
            contest.phase === "CODING" ? "bg-green-400" :
            contest.phase === "PENDING_SYSTEM_TEST" ? "bg-orange-400" :
            contest.phase === "SYSTEM_TEST" ? "bg-blue-400" :
            "bg-red-400"
          }`} 
        />
      </div>


      {/* Solve Button */}
      <div className="col-span-1 p-2 flex justify-center items-center">
          <button className="button-gradient2 text-white font-semibold  p-2 text-sm rounded-xl transform transition-all duration-300 shadow-lg shadow-green-500/50"
            onClick={()=>{router.push(`/cf-buddy/contest/${contestId}`)}}
          >
            Solve
          </button>
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
