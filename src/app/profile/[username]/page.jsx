"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import Link from "next/link";
import ErrorComponent from "@/components/ErrorComponent";
import ProfileProblems from "@/components/Profile/ProfileProblems";
import ProfileSubmissions from "@/components/Profile/ProfileSubmissions";
import { Spinner } from "flowbite-react";
import { FaDotCircle, FaGithub, FaLinkedin } from "react-icons/fa";

function Page({ params }) {
  const { id, isLoaded } = useAuth();
  const username = params.username;
   const [userDetails, setUserDetails] = useState(null);
   const [isCurrentUser, setIsCurrentUser] = useState(false);
   const [allSubmissions, setAllSubmissions] = useState([]);
   const [problemsSolved, setProblemsSolved] = useState([]);
   const uniqueProblems = new Set();
   const [totalProblemsCount, setTotalProblemsCount] = useState(0);
   const [easyProblemsCount, setEasyProblemsCount] = useState(0);
   const [mediumProblemsCount, setMediumProblemsCount] = useState(0);
   const [hardProblemsCount, setHardProblemsCount] = useState(0);
   const [tab, setTab] = useState("allSubmissions");
   const [loading, setLoading] = useState(false); // Default to false for optional loading
   const [error, setError] = useState(null);
   const [errorCode, setErrorCode] = useState(0);
    useEffect(() => {
     if (!username) return;
     setLoading(true);
    axios
    .get(`/api/profile/?username=${username}`)
    .then((response) => {
        const data = response.data;
        if (data?.error) {
          setError(data.error);
        } else {
            const profile = data.profile;
            setUserDetails(profile.user);
            setAllSubmissions(profile.submissions);
            profile.problems.forEach(prob => uniqueProblems.add(prob));
            for(let val of uniqueProblems.keys)
              console.log(val);
            let problems = [];
            for(let prob of uniqueProblems){
              problems.push(prob);
            }
            setProblemsSolved(problems);
            setTotalProblemsCount(profile.problems.length);
            setEasyProblemsCount(problems.filter((prob) => prob.difficulty === "EASY").length);
         setMediumProblemsCount(problems.filter((prob) => prob.difficulty === "MEDIUM").length);
         setHardProblemsCount(problems.filter((prob) => prob.difficulty === "HARD").length);
        }
       })
       .catch((error) => {
         const errorMessage = error.response?.data?.error || "An error occurred";
         setError(errorMessage);
         setErrorCode(error.response?.status || 500);
        })
      .finally(() => {
        setLoading(false);
    });
  }, [username]);


  useEffect(() => {
    if (userDetails && id) setIsCurrentUser(id === userDetails?.id);
 }, [userDetails, isLoaded, id]);

  return (
    <div className="flex flex-col w-full min-h-screen justify-center items-center bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white font-sans">
      {loading && (
        <Spinner
          color="purple"
          className="w-20 h-20"
          data-testid="loading-spinner"
        />
      )}

      {!loading && error && (
        <ErrorComponent code={errorCode} message={error} data-testid="error" />
      )}

      {!loading && !error && userDetails && (
        <div className="flex flex-col gap-8 items-center w-full max-w-7xl min-h-screen p-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center p-8 bg-gradient-to-r from-slate-800/80 to-purple-900/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-500/20 w-full">
            <img
              src={userDetails.imageurl || "/default_profile.png"}
              alt="User Profile"
              className="w-48 h-48 rounded-2xl border-4 border-purple-400 shadow-lg transform hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col text-center md:text-left md:ml-10 mt-6 md:mt-0">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                {userDetails.name}
              </h1>
              <h2 className="text-2xl text-purple-300 mt-2">@{userDetails.username}</h2>
              <div className="flex space-x-4 mt-6">
                {userDetails.github && (
                  <Link href={userDetails.github} target="_blank">
                    <span className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-purple-600 rounded-lg transition-all duration-300 shadow-lg">
                      <FaGithub className="text-xl" />
                      Github
                    </span>
                  </Link>
                )}
                {userDetails.linkedin && (
                  <Link href={userDetails.linkedin} target="_blank">
                    <span className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-purple-600 rounded-lg transition-all duration-300 shadow-lg">
                      <FaLinkedin className="text-xl" />
                      LinkedIn
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="flex flex-col md:flex-row justify-evenly w-full bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-purple-500/20 shadow-xl">
            <div className="text-center">
              <h3 className="text-2xl text-purple-300">Problems Solved</h3>
              <p className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text mt-2">
                {totalProblemsCount}
              </p>
            </div>
            <div className="flex flex-col space-y-4 mt-6 md:mt-0">
              <p className="flex items-center gap-3 text-lg">
                <FaDotCircle className="text-emerald-400" />
                Easy - {easyProblemsCount}
              </p>
              <p className="flex items-center gap-3 text-lg">
                <FaDotCircle className="text-amber-400" />
                Medium - {mediumProblemsCount}
              </p>
              <p className="flex items-center gap-3 text-lg">
                <FaDotCircle className="text-rose-400" />
                Hard - {hardProblemsCount}
              </p>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="w-full bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 shadow-xl">
            <div className="flex space-x-4 border-b border-purple-500/30 pb-4">
              <button
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  tab === "allSubmissions"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-slate-700 hover:bg-purple-500 text-gray-200"
                }`}
                onClick={() => setTab("allSubmissions")}
              >
                Submissions
              </button>
              <button
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  tab === "problems"
                    ? "bg-purple-600 text-white shadow-lg"
                    : "bg-slate-700 hover:bg-purple-500 text-gray-200"
                }`}
                onClick={() => setTab("problems")}
              >
                Problems
              </button>
            </div>
            <div className="mt-6">
              {tab === "allSubmissions" ? (
                <ProfileSubmissions allSubmissions={allSubmissions} />
              ) : (
                <ProfileProblems problems={problemsSolved} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
