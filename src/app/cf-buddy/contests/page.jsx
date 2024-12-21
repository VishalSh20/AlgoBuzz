"use client"
import { codeforcesContestTypes } from '@/app/constants';
import ContestList from '@/components/CF-Buddy/Contests/ContestList';
import axios from 'axios';
import { Dropdown } from 'flowbite-react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io';
import { MdCancel } from 'react-icons/md';

function Page() {
    // filter states
    const [contestTypes, setContestTypes] = useState([]);
    const [rated, setRated] = useState("");
    const [searchString, setSearchString] = useState("");
    const [typeDropDownKey, setTypeDropDownKey] = useState(0);
    const [filterChangeState, setFilterChangeState] = useState(0);

    const [contestsLoading, setContestsLoading] = useState(true);
    const [pastContests, setPastContests] = useState([]);
    const [upcomingCurrentContests,setUpcomingCurrentContests] = useState([]);
    const [error, setError] = useState(null);

    const handleFindProblem = () => { }

    useEffect(() => {
        setContestsLoading(true);
        let requestURL = `${process.env.NEXT_PUBLIC_CF_INTERFACE_URL}/contest.list`;

        axios
            .get(requestURL)
            .then((response) => {
                const responseData = response.data;
                if(responseData.status === "OK"){
                    const allContests = responseData.result;
                    const pastContests = allContests.filter(contest => contest.phase === "FINISHED");
                    const upcomingCurrentContests = allContests.filter(contest => contest.phase === "BEFORE" || contest.phase === "CODING");
                    setPastContests(pastContests);
                    setUpcomingCurrentContests(upcomingCurrentContests);
                }
                else{
                    setError("Unable to get details at this moment, please try later");
                }
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.error || error.response?.status || error.message;
                console.log("Error Message - ", errorMessage);
                setError(errorMessage);
            })
            .finally(() => {
                setContestsLoading(false);
            });
    }, [filterChangeState]);


    return (
        <div className=' pt-20 text-white items-center min-h-[100svh] bg-gradient overflow-x-hidden'>

            {/* header */}
            <header className='flex items-center w-full px-10 pt-12 justify-between'>
                <div className="flex flex-col gap-2 p-4 text-sm">
                    <span className='text-3xl font-bold logo-gradient'>CF-Buddy Contest Arena</span>
                    <span>Find and solve any CODEFORCES contests!!</span>
                </div>

                {/* link to single contest page */}
                <Link href="/cf-buddy/contest">
                    <div className="py-2 px-5 flex gap-2 items-center h-fit font-medium button-gradient1 rounded-xl cursor-pointer  hover:scale-105">
                        <span className='text-base'>Find exact contest by Id</span>
                        <ArrowRight size={36} strokeWidth={1} />
                    </div>
                </Link>

            </header>

            {/* problems searched out */}
            <div className={`flex flex-col md:flex-row gap-8 p-8 min-h-svh w-screen`}>

                {/* problem section */}
                {
                    (contestsLoading || !error)
                        ?
                        <div className="flex flex-col items gap-2 p-2">
                            <ContestList upcomingCurrentContests={upcomingCurrentContests} pastContests={pastContests} contestsLoading={contestsLoading} />
                        </div>
                        :
                        <div></div>
                }

                {/* filter section */}

                {/* <div className={`w-full md:w-[30vw] gap-4 p-4 items-center  ${contestsLoading ? "hidden" : "flex flex-col"}`}> */}

                    {/* contest type filter
                    <div className="flex flex-col w-full items-center p-2">
                        <div className='flex justify-around items-center w-full'>
                            <span className='font-bold'>Contest Types:</span>
                            <Dropdown
                                label="Add Types"
                                key={typeDropDownKey}
                                className=' mt-20'
                            >
                                <Dropdown.Item>
                                    <div className='max-w-[50vw] flex gap-2 p-4 flex-wrap '>
                                        {codeforcesContestTypes.map((type, index) => (
                                            <button
                                                key={index}
                                                className={`p-2 ${contestTypes.indexOf(type) !== -1 ? "bg-green-400" : "bg-slate-300"}`}
                                                onClick={() => {
                                                    if (contestTypes.indexOf(type) !== -1) {
                                                        setContestTypes(contestTypes.filter(currType => currType !== type));
                                                    }
                                                    else {
                                                        setContestTypes([...contestTypes, type]);
                                                    }
                                                    setTypeDropDownKey(key => key + 1);
                                                }}
                                            >
                                                {type}
                                            </button>
                                        ))}

                                    </div>
                                </Dropdown.Item>

                            </Dropdown>
                        </div>
                        <div className="flex flex-wrap w-full gap-2 p-4">
                            {contestTypes.map((type, index) => (
                                <div key={index} className='flex gap-2 p-2 bg-slate-400 rounded-lg'>
                                    <span>{type}</span>
                                    <MdCancel
                                        className='text-red-500 cursor-pointer'
                                        onClick={() => {
                                            setContestTypes(types => contestTypes.filter((_, currIndex) => currIndex !== index));
                                            setTypeDropDownKey(key => key + 1);
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

*/}
            </div> 



        </div>
    )
}

export default Page
