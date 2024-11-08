"use client"
import React from 'react';
import Link from 'next/link';

function Page() {
  return (
    <div className=" pt-28 pb-12 flex flex-col gap-8 items-center justify-center min-h-[100svh] bg-gradient">
      <div className="absolute inset-0 h-full bg-[linear-gradient(to_right,#6666662e_1px,transparent_1px),linear-gradient(to_bottom,#6666662e_1px,transparent_1px)] bg-[size:14px_24px] mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#ffffff_100%,transparent_100%)]"></div>

      <div className=' flex relative z-10 flex-col justify-center items-center gap-4'>
        <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-text-main to-emerald-600 text-center ">CODE FORCES BUDDY</h1>

        <p className=' text-white -mt-4 text-lg'>
          By <span className='logo-gradient font-semibold ml-2'>Gs-Code-Solver</span>
        </p>

        <p className=" text-center text-xl font-medium tracking-wider text-gray-300 leading-6">
          Revolutionize your <span className="text-text-main underline underline-offset-4 decoration-wavy decoration-green-400">CP</span>, Focus on <span className="text-text-main underline underline-offset-4 decoration-wavy decoration-green-400">Solving</span>, not Switching
        </p>
      </div>

      <div className=' flex flex-col items-center justify-center gap-4 text-white relative z-10'>
        <h2 className=' text-lg'>
          Paste the Question Link and Dive into <span className="text-text-main font-semibold">Coding...</span>
        </h2> 
      </div>

      <div className="flex mx-auto p-4 gap-4 items-center justify-center border-2 border-green-700 rounded-xl">
        <div className="w-40 h-40 flex flex-col justify-center items-center bg-gradient-to-r from-green-700 via-purple-400 to-teal-700 hover:from-teal-400 hover:to-purple-500 rounded-xl border-2 border-green-400 p-4">
        <Link href="/cf-buddy/problems" >
          <span className='text-wrap font-mono text-2xl w-fit'>
            Search Problems
          </span>
        </Link>
        </div>

        <div className="w-40 h-40 flex flex-col justify-center items-center bg-gradient-to-r from-green-700 via-purple-400 to-teal-700 hover:from-teal-400 hover:to-purple-500 rounded-xl border-2 border-green-400 p-4">
        <Link href="/cf-buddy/contests" >
          <span className='text-wrap font-mono text-2xl w-fit'>
            Search contests
          </span>
        </Link>
        </div>

      </div>
      

      {/* <div className="flex flex-col justify-center w-full h-72 shadow-lg shadow-blue-300">
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
      </div> */}
    </div>
  );
}

export default Page;
