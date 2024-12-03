"use client"

import axios from "axios";
import Loading from "@/app/loading";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export default function Page({params}) {
    const router = useRouter();
    const {id} = params;
    const [error,setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [contest, setContest] = useState(null);
    const [problems, setProblems] = useState([]);


    useEffect(() => {
        if(!id) return;
        setContest(null);
        setProblems(null);
        setError(null);
        setLoading(true);

        const requestURL = `${process.env.NEXT_PUBLIC_CF_INTERFACE_URL}/contest/?contestId=${id}`;
        
        axios
            .get(requestURL)
            .then((response) => {
                const responseData = response.data;
                setContest(responseData.contest);
                setProblems(responseData.contest?.problems);
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.error || error.response?.status || error.message;
                setError(errorMessage);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="w-full min-h-screen bg-gradient py-24 px-4 md:px-8">
            {loading ? (
                <Loading />
            ) : error ? (
                <div className="text-red-500 text-center text-lg font-semibold">{error}</div>
            ) : (
                <div className="max-w-6xl mx-auto space-y-8">
                    <h2 className="text-3xl md:text-4xl font-mono font-bold text-black text-center mb-12">
                        {contest?.title}
                    </h2>
                    
                    <div className="space-y-4">
                        {problems?.map((problem) => (
                            <div key={problem.id} 
                                className="grid grid-cols-7 items-center w-full p-4 border border-emerald-400 rounded-xl bg-gradient-to-br from-gray-950 to-gray-800 shadow-neon hover:scale-[1.01] transition-transform duration-200">
                                
                                <div className="col-span-1 text-emerald-300 font-mono text-lg font-bold">
                                    {problem?.id}
                                </div>

                                <div className="col-span-4 flex flex-col">
                                    <h3 className="text-lg font-semibold text-emerald-200 hover:text-emerald-400 transition duration-150">
                                        {problem?.title}
                                    </h3>
                                </div>

                                <div className="col-span-1 text-center text-emerald-300">
                                    {problem?.acceptedCount || 0}
                                </div>

                                <div className="col-span-1 flex justify-center">
                                    <button 
                                        onClick={() => router.push(`/cf-buddy/problem/${contest.id}-${problem?.id}`)}
                                        className="button-gradient2 text-white font-semibold px-4 py-2 rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg shadow-green-500/50"
                                    >
                                        Solve
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
