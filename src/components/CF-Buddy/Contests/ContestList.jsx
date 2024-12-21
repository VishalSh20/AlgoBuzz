"use client";
import Loading from "@/app/loading";
import React, { useEffect, useState } from "react";
import {useRouter} from "next/navigation";
const getRelativeTime = (contest) => {
  const now = new Date();
  const startTime = new Date(contest.startTimeSeconds * 1000);
  const diffTime = startTime - now;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
  const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
  return `${diffDays} days, ${diffHours} hours, ${diffMinutes} minutes`;
}

function ContestList({ upcomingCurrentContests, pastContests, contestsLoading }) {
  const [tab,setTab] = useState("upcoming");
  const router = useRouter();



  return (
    <div className="flex flex-col w-full items-start justify-center h-svh gap-4 p-4 m-4 ">
      {contestsLoading ? (
        <Loading />
      ) : (
        <div className="w-full p-2">
          <div className="flex p-2 gap-2 m-4 bg-gradient-to-r shadow-lg shadow-green-500 from-teal-200/50 via-purple-200 to-green-200/50 rounded-lg">
            <button className={`${tab === "upcoming" ? "bg-green-500/50 shadow-lg shadow-emerald-400" : "bg-violet-500/50"} p-2 rounded-lg text-2xl font-semibold text-violet-900 mb-4`} onClick={() => setTab("upcoming")}>Upcoming and Current</button>
            <button className={`${tab === "past" ? "bg-green-500/50 shadow-lg shadow-emerald-400" : "bg-violet-500/50"} p-2 rounded-lg text-2xl font-semibold text-violet-900 mb-4`} onClick={() => setTab("past")}>Past</button>
          </div>

          {tab === "upcoming" && (
            <div className="mb-6">
              {upcomingCurrentContests?.length > 0 ? (
                <TableElement contests={upcomingCurrentContests} showRelativeTime={true} />
              ) : (
                <p className="text-gray-600">No upcoming or current contests available.</p>
              )}
            </div>
          )}

          {tab === "past" && (
            <div>
              {pastContests?.length > 0 ? (
                <TableElement contests={pastContests} showRelativeTime={false} />
              ) : (
                <p className="text-gray-600">No past contests available.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TableElement({ contests, showRelativeTime }) {
  const router = useRouter();
  return (
    <div className='w-full h-svh overflow-y-scroll rounded-xl border-2 border-[#00ff00] shadow-[0_0_10px_#00ff00] p-4'>
      {/* Header */}
      <div className='grid grid-cols-7 gap-4 p-4 rounded-xl bg-zinc-900 text-sm mb-4 border border-[#00ff00] shadow-[0_0_5px_#00ff00]'>
        <span className='text-[#00ff00] font-bold'>Id</span>
        <span className='text-[#00ff00] font-bold col-span-2'>Name</span>
        <span className='text-[#00ff00] font-bold'>Start Time</span>
        <span className='text-[#00ff00] font-bold'>Duration</span>
        <span className='text-[#00ff00] font-bold'>Type</span>
        <span className='text-[#00ff00] font-bold'>{showRelativeTime ? 'Before Start' : 'Actions'}</span>
      </div>

      {/* Contest Rows */}
      {contests.map((contest, index) => (
        <div key={index} className="grid grid-cols-7 gap-4 p-4 mb-2 rounded-lg border border-[#00ff00]/30 hover:border-[#00ff00] hover:shadow-[0_0_5px_#00ff00] transition-all duration-300 bg-zinc-900/50">
          <span className="text-gray-900 font-mono">{contest.id}</span>
          <span className="text-gray-900 font-bold col-span-2">{contest.name}</span>
          <span className="text-gray-900 font-mono">{new Date(contest.startTimeSeconds * 1000).toLocaleString()}</span>
          <span className="text-gray-900 font-mono">{Math.floor(contest.durationSeconds / 60)} minutes</span>
          <span className="text-gray-900 font-mono">{contest.type}</span>
          {showRelativeTime ? (
            <span className="text-gray-900 font-mono">{getRelativeTime(contest)}</span>
          ) : (
            <button 
              className="px-4 py-2 h-fit rounded bg-[#00ff00]/20 text-gray-900 border border-[#00ff00] hover:bg-[#00ff00]/30 hover:shadow-[0_0_10px_#00ff00] transition-all duration-300"
              onClick={() => router.push(`/cf-buddy/contest/${contest.id}`)}
            >
              Solve
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default ContestList;
