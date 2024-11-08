"use client"
import { codeforcesProblemTags } from '@/app/constants';
import ProblemList from '@/components/CF-Buddy/Problemset/ProblemList';
import axios from 'axios';
import { Dropdown} from 'flowbite-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io';
import {MdArrowCircleLeft, MdArrowCircleRight, MdCancel, MdSearch } from 'react-icons/md';

function Page() {
    // filter states
    const [upperLimit,setUpperLimit] = useState(4000);
    const [lowerLimit,setLowerLimit] = useState(800);
    const [tags,setTags] = useState([]);
    const [tagDropDownKey,setTagDropDownKey] = useState(0);
    const [filterChangeState,setFilterChangeState] = useState(0);

    const [problemsLoading,setProblemsLoading] = useState(true);
    const [problems,setProblems] = useState([]);
    const [error,setError] = useState(null);
    const [page,setPage] = useState(1);

    const handleFindProblem = ()=>{}

    useEffect(()=>{
        setProblemsLoading(true);
        const requestURL = `${"http://localhost:4000/api/v1"}/problemset`;
        axios
        .get(requestURL)
        .then((response)=>{
            const responseData = response.data;
            console.log("Response is-",responseData);
            setProblems(problems => responseData.problems);
        })
        .catch((error)=>{
            const errorMessage = error.response?.data?.error || error.response?.status || error.message;
            console.log("Error Message - ",errorMessage);
            setError(errorMessage);
        })
        .finally(()=>{
            setProblemsLoading(false);
        });
    },[filterChangeState]);


  return (
    <div className=' flex flex-col gap-8 items-center min-h-[100svh] bg-gradient-to-br from-gray-800 via-green-900 to-emerald-900'>

        {/* header */}
      <header className='flex w-full px-4 py-12 justify-between'>
      <div className="flex flex-col gap-2 p-4">
        <span className='text-3xl font-bold text-green-600'>CF-Buddy Problemset</span>
        <span>Find and solve any CODEFORCES problem!!</span>
      </div>
   
     {/* link to single problem page */}
      <Link href="/cf-buddy/problem">
      <div className="p-2 flex gap-2 max-w-60 text-wrap h-fit font-bold bg-gradient-to-r from-green-600 to-green-400 via-teal-400 border border-green-900 rounded-xl cursor-pointer hover:from-teal-400 hover:to-green-400 hover:border-teal-300 hover:scale-105">
        <span className='text-xl'>Find exact problem by Id</span> 
        <MdArrowCircleRight className='w-10 h-10'/>
      </div>
      </Link>

      </header>

      {/* problems searched out */}
      <div className='flex flex-col md:flex-row-reverse gap-8 p-8 min-h-svh w-full bg-gradient-to-br'>

        {/* filter section */}
        <div className='flex flex-col w-full md:w-[30vw] gap-4 p-4 items-center '>
            {/* range filter */}
            <div className="flex w-full flex-col items-center justify-center">
            <span className='font-bold'>Range:</span>
            <div className="flex items-center gap-2 rounded-xl">
                <div className="flex flex-col gap-1">
                    <label htmlFor='lower-limit-filter-input'></label>
                    <input 
                    id='lower-limit-filter-input'
                    type="number" 
                    min={800} 
                    max={4000}
                    step={100}
                    value={lowerLimit}
                    onChange={(e)=>setLowerLimit(prevLimit => e.target.value)}
                    />
                </div>
                <span> to </span>
                <div className="flex flex-col gap-1">
                    <label htmlFor='upper-limit-filter-input'></label>
                    <input 
                    id='upper-limit-filter-input'
                    type="number" 
                    min={800} 
                    max={4000}
                    step={100}
                    value={upperLimit}
                    onChange={(e)=>setUpperLimit(prevLimit => e.target.value)}
                    />
                </div>
            </div>
            </div>

            {/* tag filter */}
            <div className="flex flex-col w-full items-center p-2">
                  <div className='flex justify-around w-full'>
                    <span className='font-bold'>Tags:</span>
                     <Dropdown
                    label="Add Tags"
                    key={tagDropDownKey}
                >
                    <Dropdown.Item>
                        <div className='max-w-[50vw] flex gap-2 p-4 flex-wrap'>
                        {codeforcesProblemTags.map((tag,index) => (
                            <button
                                key={index}
                                className={`p-2 ${tags.indexOf(tag) !== -1 ? "bg-green-400" : "bg-slate-300"}`}
                                onClick={()=>{
                                    if(tags.indexOf(tag) !== -1){
                                        setTags(tags.filter(currTag => currTag!==tag));
                                    }
                                    else{
                                        setTags([...tags,tag]);
                                    }
                                    setTagDropDownKey(key => key+1);
                                }}
                            >
                                {tag}
                            </button>
                        ))}

                        </div>
                    </Dropdown.Item>

                    </Dropdown>
                  </div>
                    <div className="flex flex-wrap w-full gap-2 p-4">
                        {tags.map((tag,index) => (
                            <div key={index} className='flex gap-2 p-2 bg-slate-400 rounded-lg'>
                                <span>{tag}</span>
                                <MdCancel 
                                className='text-red-500 cursor-pointer'
                                onClick={()=>{
                                    setTags(tags => tags.filter((_,currIndex)=>currIndex!==index));
                                    setTagDropDownKey(key => key+1);
                                }}
                                />
                            </div>))
                        }
                    </div>
                    

            </div>
                        
            <button
                className='p-2 rounded-xl border-2 hover:border-dotted border-green-500 bg-gradient-to-br from-green-500 to-cyan-200 hover:from-cyan-300 hover:to-green-400'
            >
                Apply filters
            </button>
        </div>

        {/* problem section */}
        {
            (problemsLoading || !error)
            ?
            <div className="flex flex-col items gap-2 p-2">

                <div className="flex text-xl justify-between px-4 py-2">
                    <span className={`font-bold text-gray-900 ${problemsLoading ? "hidden" : "inline-block"}`}>Problems fetched: {problems.length}</span>
                    <div className='flex gap-2'>
                        <span>Page: </span>
                        <button
                            className='text-blue-500 bg-teal-300 p-2 rounded'  
                            disabled={page==1}     
                            onClick={()=>setPage(page => page-1)}                 
                        >
                            <IoMdArrowBack/>
                        </button>
                        <input 
                        type='number'
                        min={1}
                        value={page}
                        onChange={(e)=>setPage(e.target.value)}
                        className='w-10 text-center p-2 bg-gray-300'
                        />
                        <button
                            className='text-blue-500 bg-teal-300 p-2 rounded' 
                            onClick={()=>setPage(page=>page+1)}
                        >
                            <IoMdArrowForward/>
                        </button>
                    </div>
                </div>

                <ProblemList problems={problems} problemsLoading={problemsLoading}/>
            </div>
            :
            <div></div>
        }

      </div>



    </div>
  )
}

export default Page
