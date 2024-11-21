"use client"
import { codeforcesProblemTags } from '@/app/constants';
import ProblemList from '@/components/CF-Buddy/Problemset/ProblemList';
import axios from 'axios';
import { Dropdown } from 'flowbite-react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io';
import { MdCancel } from 'react-icons/md';

function Page() {
    // filter states
    const [upperLimit, setUpperLimit] = useState(4000);
    const [lowerLimit, setLowerLimit] = useState(800);
    const [tags, setTags] = useState([]);
    const [tagDropDownKey, setTagDropDownKey] = useState(0);
    const [filterChangeState, setFilterChangeState] = useState(0);

    const [problemsLoading, setProblemsLoading] = useState(true);
    const [problems, setProblems] = useState([]);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);

    const handleFindProblem = () => { }

    useEffect(() => {
        setProblemsLoading(true);
        let requestURL = `${"http://localhost:4000/api/v1"}/problemset?page=${page}&upperLimit=${upperLimit}&lowerLimit=${lowerLimit}`;
        if(tags.length)
            requestURL += `&tags=${tags.join(',')}`;

        axios
            .get(requestURL)
            .then((response) => {
                const responseData = response.data;
                console.log("Response is-", responseData);
                setProblems(responseData.problems);
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.error || error.response?.status || error.message;
                console.log("Error Message - ", errorMessage);
                setError(errorMessage);
            })
            .finally(() => {
                setProblemsLoading(false);
            });
    }, [filterChangeState]);


    return (
        <div className=' pt-20 text-white items-center min-h-[100svh] bg-gradient overflow-x-hidden'>

            {/* header */}
            <header className='flex items-center w-full px-10 pt-12 justify-between'>
                <div className="flex flex-col gap-2 p-4 text-sm">
                    <span className='text-3xl font-bold logo-gradient'>CF-Buddy Problemset</span>
                    <span>Find and solve any CODEFORCES problem!!</span>
                </div>

                {/* link to single problem page */}
                <Link href="/cf-buddy/problem">
                    <div className="py-2 px-5 flex gap-2 items-center h-fit font-medium button-gradient1 rounded-xl cursor-pointer  hover:scale-105">
                        <span className='text-base'>Find exact problem by Id</span>
                        <ArrowRight size={36} strokeWidth={1} />
                    </div>
                </Link>

            </header>

            {/* problems searched out */}
            <div className={`flex flex-col md:flex-row gap-8 p-8 min-h-svh w-screen`}>

                {/* problem section */}
                {
                    (problemsLoading || !error)
                        ?
                        <div className="flex flex-col items gap-2 p-2">
                            <ProblemList problems={problems} problemsLoading={problemsLoading} />

                            <div className="flex text-xl justify-between px-4 py-2 mt-4">
                                <span className={`font-bold text-gray-200 ${problemsLoading ? "hidden" : "inline-block"}`}>Problems fetched: {problems.length}</span>
                                <div className='flex gap-2'>
                                    <span>Page: </span>
                                    <button
                                        className=' button-gradient2 p-2'
                                        disabled={page == 1}
                                        onClick={() => setPage(page => page - 1)}
                                    >
                                        <IoMdArrowBack />
                                    </button>
                                    <input
                                        type='number'
                                        min={1}
                                        value={page}
                                        onChange={(e) => setPage(e.target.value)}
                                        className='w-10 text-center p-2 bg-gray-900'
                                    />
                                    <button
                                        className=' button-gradient2 p-2'
                                        onClick={() => setPage(page => page + 1)}
                                    >
                                        <IoMdArrowForward />
                                    </button>
                                </div>
                            </div>

                        </div>
                        :
                        <div></div>
                }

                {/* filter section */}

                <div className={`w-full md:w-[30vw] gap-4 p-4 items-center  ${problemsLoading ? "hidden" : "flex flex-col"}`}>
                    {/* range filter */}
                    <div className="flex w-full flex-col justify-center">
                        <span className='font-bold ml-2 mb-1'>Range:</span>
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
                                    onChange={(e) => setLowerLimit(e.target.value)}
                                    className=' bg-gray-900 rounded-lg p-2'
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
                                    onChange={(e) => setUpperLimit(e.target.value)}
                                    className=' bg-gray-900 rounded-lg p-2'
                                />
                            </div>
                        </div>
                    </div>

                    {/* tag filter */}
                    <div className="flex flex-col w-full items-center p-2">
                        <div className='flex justify-around items-center w-full'>
                            <span className='font-bold'>Tags:</span>
                            <Dropdown
                                label="Add Tags"
                                key={tagDropDownKey}
                                className=' mt-20'
                            >
                                <Dropdown.Item>
                                    <div className='max-w-[50vw] flex gap-2 p-4 flex-wrap '>
                                        {codeforcesProblemTags.map((tag, index) => (
                                            <button
                                                key={index}
                                                className={`p-2 ${tags.indexOf(tag) !== -1 ? "bg-green-400" : "bg-slate-300"}`}
                                                onClick={() => {
                                                    if (tags.indexOf(tag) !== -1) {
                                                        setTags(tags.filter(currTag => currTag !== tag));
                                                    }
                                                    else {
                                                        setTags([...tags, tag]);
                                                    }
                                                    setTagDropDownKey(key => key + 1);
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
                            {tags.map((tag, index) => (
                                <div key={index} className='flex gap-2 p-2 bg-slate-400 rounded-lg'>
                                    <span>{tag}</span>
                                    <MdCancel
                                        className='text-red-500 cursor-pointer'
                                        onClick={() => {
                                            setTags(tags => tags.filter((_, currIndex) => currIndex !== index));
                                            setTagDropDownKey(key => key + 1);
                                        }}
                                    />
                                </div>))
                            }
                        </div>


                    </div>

                    <button
                        className='button-gradient2'
                    >
                        Apply filters
                    </button>
                </div>


            </div>



        </div>
    )
}

export default Page
