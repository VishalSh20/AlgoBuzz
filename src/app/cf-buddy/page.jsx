"use client"
import React from 'react';
import { FaLink } from 'react-icons/fa';

function Page() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-violet-400 to-red-200">
      {/* Header Section */}
      <div className="flex flex-col justify-center w-full h-72 bg-gradient-to-r from-yellow-100 to-blue-400 via-pink-400 shadow-lg shadow-blue-300">
        <div className="flex flex-col w-full items-center gap-4">
          <div className="flex flex-col items-center shadow-lg shadow-violet-600 p-6 rounded-lg bg-white bg-opacity-50">
            <span className="font-serif font-extrabold text-8xl text-black">CODEFORCES - BUDDY</span>
            <span className="font-mono text-3xl text-black">by GS-CODESOLVER</span>
          </div>
          <div className="flex flex-col items-center font-light mt-8 text-black">
            <span className="text-2xl">Revolutionize your CP. Focus on solving, not switching.</span>
            <span className="text-lg">Paste the question link and dive straight into coding.</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-full max-w-lg items-center justify-center gap-6 mt-12 p-8 rounded-lg shadow-lg text-black border border-violet-950">
        <div className="flex flex-col gap-2 items-center w-full">
          <label htmlFor="contestInput" className="text-lg font-medium">Choose a Contest</label>
          <div className="flex gap-2 w-full">
            <select id="contestInput" className="w-3/4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>Select Question</option>
            </select>
            <span className="text-sm flex items-center">OR</span>
            <div className="bg-violet-700 text-white p-2 rounded-lg flex items-center justify-center cursor-pointer hover:bg-violet-800">
              <FaLink />
            </div>
          </div>
        </div>

        <span className="text-lg font-semibold">OR</span>

        <div className="w-full flex flex-col items-center">
          <label className="text-lg font-medium">Search a Question</label>
          <div className="flex gap-2 w-full">
            <select id="contestInput" className="w-3/4 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
              <option>Select Question</option>
            </select>
            <span className="text-sm flex items-center">OR</span>
            <div className="bg-violet-700 text-white p-2 rounded-lg flex items-center justify-center cursor-pointer hover:bg-violet-800">
              <FaLink />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
