"use client"

import { codeforcesProblemTags } from '@/app/constants';
import ProblemList from '@/components/CF-Buddy/Problemset/ProblemList';
import axios from 'axios';
import { Button, Dropdown, Modal } from 'flowbite-react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react'
import { toast, Toaster } from 'react-hot-toast';
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io';
import { MdCancel } from 'react-icons/md';

function Page() {
    // filter states
    const [limits, setLimits] = useState({ upper: 4000, lower: 800 });
    const [tempLimits, setTempLimits] = useState({ upper: 4000, lower: 800 });
    const [changingLimitModalOpen, setChangingLimitModalOpen] = useState(false);
    const [tags, setTags] = useState([]);
    const [tagDropDownKey, setTagDropDownKey] = useState(0);

    const [problemsLoading, setProblemsLoading] = useState(true);
    const [problemSet, setProblemSet] = useState([]);
    const [problems, setProblems] = useState([]);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);

    const handleLimitChange = () => {
        if (tempLimits.lower > tempLimits.upper) {
            toast.error("Lower limit can't be larger than upper limit");
            return;
        }
        setLimits(tempLimits);
        setChangingLimitModalOpen(false);
    };

    const applyFilters = useCallback((problemSet) => {
        if (limits.lower > limits.upper) {
            toast.error("Lower limit can't be larger than upper limit");
        }
        let filteredProblems = problemSet.filter((prob, index) => {
            const rating = Math.max(prob.rating, prob.points);
            if (rating >= limits.lower && rating <= limits.upper) return true;
            else return false;
        });
        setProblems(filteredProblems);
    }, [limits]);

    useEffect(() => {
        console.log("let's find them!")
        setProblemsLoading(true);
        let requestURL = `${process.env.NEXT_PUBLIC_CF_INTERFACE_URL}/problemset.problems`;
        if (tags.length)
            requestURL += `?tags=${tags.join(",")}`;

        axios
            .get(requestURL)
            .then((response) => {
                const responseData = response.data;
                if (responseData.status == "OK") {
                    const { problems, problemStatistics } = responseData.result;
                    for (let i = 0; i < problems.length; i++) {
                        problems[i] = { ...problems[i], solvedCount: problemStatistics[i].solvedCount }
                    }
                    setProblemSet(problems);
                    applyFilters(problems);
                }
                console.log("Response is-", responseData);
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.error || error.response?.status || error.message;
                console.log("Error Message - ", errorMessage);
                setError(errorMessage);
            })
            .finally(() => {
                setProblemsLoading(loading => false);
            });
    }, [tags, applyFilters]);

    return (
        <div className='pt-16 text-white items-center min-h-[100svh] bg-gradient overflow-x-hidden'>
            {/* header */}
            <header className='flex items-center w-full px-10 pt-12 justify-between'>
                <div className="flex flex-col gap-2 p-4 text-sm">
                    <span className='text-3xl font-bold logo-gradient'>CF-Buddy Problemset</span>
                    <span>Find and solve any CODEFORCES problem!!</span>
                </div>

                {/* link to single problem page */}
                <Link href="/cf-buddy/problem">
                    <div className="py-2 px-5 flex gap-2 items-center h-fit font-medium button-gradient1 rounded-xl cursor-pointer hover:scale-105">
                        <span className='text-base'>Find exact problem by Id</span>
                        <ArrowRight size={36} strokeWidth={1} />
                    </div>
                </Link>
            </header>

            {/* problems searched out */}
            <div className={`flex flex-col md:flex-row gap-8 px-8 py-6 min-h-svh w-screen`}>
                {/* problem section */}
                {
                    (problemsLoading || !error)
                        ?
                        <div className="flex flex-col items gap-2 p-2">
                            <span className={`font-bold text-gray-200 ${problemsLoading ? "hidden" : "inline-block"}`}>
                                Total: {problems.length}, On this page: {Math.min(50, problems.length - ((page - 1) * 50))}</span>
                            <ProblemList problems={problems} problemsLoading={problemsLoading} page={page} />
                        </div>
                        :
                        <div></div>
                }

                {/* filter section */}
                <div className={`w-full md:w-[30vw] gap-4 p-4 items-center ${problemsLoading ? "hidden" : "flex flex-col"}`}>
                    {/* page */}
                    <div className='flex gap-2 h-fit w-full'>
                        <span>Page: </span>
                        <button
                            className='button-gradient2 p-2'
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
                            className='max-w-20 text-center p-4 bg-inherit border-2 border-green-400 rounded-md'
                        />
                        <button
                            className='button-gradient2 p-2'
                            onClick={() => {
                                setPage(page => page + 1);
                            }}
                        >
                            <IoMdArrowForward />
                        </button>
                    </div>

                    {/* range filter */}
                    <div className="flex w-full flex-col justify-center">
                        <span className='font-semibold ml-2 mb-1 text-black'>Ratings range:</span>
                        <div className="flex items-start gap-2 rounded-xl">
                                <input
                                    id='lower-limit-filter-input'
                                    type="number"
                                    value={limits.lower}
                                    readOnly={true}
                                    className='bg-gray-900 rounded-lg p-2 max-w-20'
                                />
                            <span> to </span>
                                <input
                                    id='upper-limit-filter-input'
                                    type="number"
                                    value={limits.upper}
                                    readOnly={true}
                                    className='bg-gray-900 rounded-lg p-2 max-w-20'
                                />
                        </div>

                        <Button
                            onClick={() => setChangingLimitModalOpen(true)}
                            className="mt-2 bg-blue-600 hover:bg-blue-700"
                        >
                            Change Limits
                        </Button>

                        <Modal
                            show={changingLimitModalOpen}
                            onClose={() => setChangingLimitModalOpen(false)}
                        >
                            <Modal.Header>Change Rating Limits</Modal.Header>
                            <Modal.Body>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="modal-lower-limit">Lower Limit:</label>
                                        <input
                                            id="modal-lower-limit"
                                            type="number"
                                            min={800}
                                            max={4000}
                                            step={100}
                                            value={tempLimits.lower}
                                            onChange={(e) => setTempLimits({ ...tempLimits, lower: parseInt(e.target.value) })}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="modal-upper-limit">Upper Limit:</label>
                                        <input
                                            id="modal-upper-limit"
                                            type="number"
                                            min={800}
                                            max={4000}
                                            step={100}
                                            value={tempLimits.upper}
                                            onChange={(e) => setTempLimits({ ...tempLimits, upper: parseInt(e.target.value) })}
                                            className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2"
                                        />
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={handleLimitChange}>Apply Changes</Button>
                                <Button
                                    color="gray"
                                    onClick={() => {
                                        setTempLimits(limits);
                                        setChangingLimitModalOpen(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>

                    {/* tag filter */}
                    <div className="flex flex-col w-full items-center p-2">
                        <div className='flex justify-around items-center w-full'>
                            <span className='font-bold'>Tags:</span>
                            <Dropdown
                                label="Add Tags"
                                key={tagDropDownKey}
                                className='mt-20'
                            >
                                <Dropdown.Item>
                                    <div className='max-w-[50vw] flex gap-2 p-4 flex-wrap'>
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
                </div>
            </div>
            <Toaster />
        </div>
    )
}

export default Page
