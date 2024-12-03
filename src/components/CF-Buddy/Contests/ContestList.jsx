"use client";
import Loading from "@/app/loading";
import React, { useEffect } from "react";

function ContestList({ upcomingCurrentContests, pastContests, contestsLoading }) {
  useEffect(() => {
    console.log(upcomingCurrentContests, pastContests);
  }, [contestsLoading]);

  return (
    <div className="flex flex-col w-full items-start justify-center h-svh gap-4 p-4 border-2 border-teal-700 rounded-lg">
      {contestsLoading ? (
        <Loading />
      ) : (
        <div className="w-full h-svh overflow-y-auto p-2">
          {/* Upcoming and Current Contests Table */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">
              Upcoming & Current Contests
            </h2>
            {upcomingCurrentContests?.length > 0 ? (
              <UpcomingCurrentTable contests={upcomingCurrentContests} />
            ) : (
              <p className="text-gray-600">No upcoming or current contests available.</p>
            )}
          </div>

          {/* Past Contests Table */}
          <div>
            <h2 className="text-2xl font-semibold text-green-700 mb-4">
              Past Contests
            </h2>
            {pastContests?.length > 0 ? (
              <PastContestsTable contests={pastContests} />
            ) : (
              <p className="text-gray-600">No past contests available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function UpcomingCurrentTable({ contests }) {
  return (
    <table className="w-full border-2 border-gray-200 rounded-lg">
      <thead className="bg-gradient-to-br from-green-700 to-teal-700 text-white">
        <tr>
          <th className="border border-gray-200 p-3">Id</th>
          <th className="border border-gray-200 p-3">Name</th>
          <th className="border border-gray-200 p-3">Writers</th>
          <th className="border border-gray-200 p-3">Start Time</th>
          <th className="border border-gray-200 p-3">Duration</th>
          <th className="border border-gray-200 p-3">Accepted Count</th>
        </tr>
      </thead>
      <tbody>
        {contests.map((contest, index) => (
          <tr
            key={index}
            className="hover:bg-gray-500 text-center text-gray-900"
          >
            <td className="border border-gray-200 p-3 text-cyan-600 font-semibold">
              {contest.id || "N/A"}
            </td>
            <td className="border border-gray-200 p-3">
              <span className="text-green-500 font-bold">{contest.name}</span>
            </td>
            <td className="border border-gray-200 p-3">
              {contest.writers?.join(", ") || "N/A"}
            </td>
            <td className="border border-gray-200 p-3">
              {contest.startTime || "N/A"}
            </td>
            <td className="border border-gray-200 p-3">
              {contest.duration || "N/A"}
            </td>
            <td className="border border-gray-200 p-3">
              {contest.acceptedCount || "N/A"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PastContestsTable({ contests }) {
  return (
    <table className="w-full border-2 border-gray-200 rounded-lg">
      <thead className="bg-gradient-to-br from-green-700 to-teal-700 text-white">
        <tr>
          <th className="border border-gray-200 p-3">Id</th>
          <th className="border border-gray-200 p-3">Name</th>
          <th className="border border-gray-200 p-3">Writers</th>
          <th className="border border-gray-200 p-3">Start Time</th>
          <th className="border border-gray-200 p-3">Duration</th>
          <th className="border border-gray-200 p-3">Accepted Count</th>
          <th className="border border-gray-200 p-3">Action</th>
        </tr>
      </thead>
      <tbody>
        {contests.map((contest, index) => (
          <tr
            key={index}
            className="hover:bg-gray-500 text-center text-gray-900"
          >
            <td className="border border-gray-200 p-3 text-cyan-600 font-semibold">
              {contest.id || "N/A"}
            </td>
            <td className="border border-gray-200 p-3">
              <span className="text-green-500 font-bold">{contest.name}</span>
            </td>
            <td className="border border-gray-200 p-3">
              {contest.writers?.join(", ") || "N/A"}
            </td>
            <td className="border border-gray-200 p-3">
              {contest.startTime || "N/A"}
            </td>
            <td className="border border-gray-200 p-3">
              {contest.duration || "N/A"}
            </td>
            <td className="border border-gray-200 p-3">
              {contest.acceptedCount || "N/A"}
            </td>
            <td className="border border-gray-200 p-3">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Solve
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ContestList;
