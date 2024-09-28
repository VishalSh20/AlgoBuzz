"use client"
import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import ErrorComponent from '@/components/ErrorComponent';
import ProfileProblems from '@/components/Profile/ProfileProblems';
import ProfileSubmissions from '@/components/Profile/ProfileSubmissions';
import { Alert, Spinner, Tabs, TabItem } from 'flowbite-react'; // Import Tabs from Flowbite
import { FaDotCircle, FaGithub, FaLinkedin } from 'react-icons/fa';

function Page({ params }) {
    const {id,isLoaded,isSignedIn} = useAuth();
  const username = params.username;
  const [userDetails, setUserDetails] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [problemsSolved, setProblemsSolved] = useState([]);
  const [totalProblemsCount, setTotalProblemsCount] = useState(0);
  const [easyProblemsCount, setEasyProblemsCount] = useState(0);
  const [mediumProblemsCount, setMediumProblemsCount] = useState(0);
  const [hardProblemsCount, setHardProblemsCount] = useState(0);
  const [tab,setTab] = useState('submissions');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorCode, setErrorCode] = useState(0);
  const router = useRouter();

  useEffect(() => {
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
          setSubmissions(profile.submissions);
          setProblemsSolved(profile.problems);
          setTotalProblemsCount(profile.problems.length);
          setEasyProblemsCount((profile.problems.filter(prob => prob.difficulty==="EASY")).length)
          setMediumProblemsCount((profile.problems.filter(prob => prob.difficulty==="MEDIUM")).length)
          setHardProblemsCount((profile.problems.filter(prob => prob.difficulty==="HARD")).length)
        }
      })
      .catch((error) => {
        console.log(error);
        const errorCode = error.status;
        const errorMessage = error.response?.data?.error;
        setError(errorMessage);
        setErrorCode(errorCode);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [username]);

   useEffect(()=>{
    console.log(id);
        if(userDetails && id)
            setIsCurrentUser(id===currentUser.id);
   },[userDetails,isLoaded,id]);  

  return (
    <div className="flex flex-col w-full min-h-screen justify-center items-center bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
      {loading && <Spinner color="gray" className="w-20 h-20" />}

      {error && <ErrorComponent code={errorCode} message={error} />}

      {userDetails && (
        <div className="flex flex-col gap-16 items-center w-full min-h-screen p-6 rounded-lg shadow-lg">
          <div className="flex items-center w-full p-4 bg-gradient-to-r from-purple-700 to-indigo-800 rounded-lg shadow-lg text-white">

            {/* Profile Header */}
            <div className="flex items-center space-x-6 mb-6">
              <img
                src={userDetails.imageurl || "/default_profile.png"}
                alt="User Profile Image"
                className="w-40 h-40 rounded-full border-4 border-purple-500 shadow-lg"
              />
              <div className="flex flex-col text-center md:text-left">
                <span className="text-3xl font-bold">{userDetails.name}</span>
                <span className="text-lg">@{userDetails.username}</span>
              </div>

            {/* Social Links */}
            <div className="flex space-x-4 mb-6">
              {userDetails.github && (
                <Link href={userDetails.github} target="_blank">
                  <span className="flex items-center gap-2 p-2 bg-gray-700 hover:bg-gray-600 rounded-md">
                    <FaGithub className="text-white" />
                    <span className="text-sm">Github</span>
                  </span>
                </Link>
              )}
              {userDetails.linkedin && (
                <Link href={userDetails.linkedin} target="_blank">
                  <span className="flex items-center gap-2 p-2 bg-blue-600 hover:bg-blue-500 rounded-md">
                    <FaLinkedin className="text-white" />
                    <span className="text-sm">LinkedIn</span>
                  </span>
                </Link>
              )}
            </div>

            {/* Profile Stats */}
            <div className="flex items-center space-x-2 p-4 bg-indigo-900 rounded-lg w-full shadow-md">
              <div className="flex flex-col space-y-2">
              <h3 className="text-xl font-semibold">Problems Solved</h3>
              <p className="text-4xl font-bold text-green-300">
                {totalProblemsCount || 0}
              </p>
              </div>

              <div className="flex flex-col space-y-2">
              <span className='flex gap-1 p-1'><FaDotCircle color='green'/>EASY - {easyProblemsCount}</span>
              <span className='flex gap-1 p-1'><FaDotCircle color='yellow'/>MEDIUM - {mediumProblemsCount}</span>
              <span className='flex gap-1 p-1'><FaDotCircle color='red'/>HARD - {hardProblemsCount}</span>
              </div>

            </div>
            
            </div>

          </div>   

          <div className="flex flex-col p-1 w-full bg-gradient-to-r from-indigo-600 to-violet-400 text-black">
                <div className="w-full flex border-b-2 border-dotted border-black gap-2">
                    <div className={`p-2 text-2xl font-mono ${tab==="submissions" ? "bg-gradient-to-r from-blue-500 to-purple-600 cursor-pointer" : "bg-gradient-to-r from-indigo-200 to-purple-500"} hover:from-violet-500 hover:to-cyan-300 rounded`}
                        onClick={()=>{
                            setTab("submissions")
                        }}
                    >Submissions</div>
                    <div  className={`p-2 text-2xl font-mono ${tab==="problems" ? "bg-gradient-to-r from-blue-500 to-purple-600 cursor-pointer" : "bg-gradient-to-r from-indigo-200 to-purple-500"}  hover:from-violet-500 hover:to-cyan-300  rounded`}
                        onClick={()=>{
                            setTab("problems")
                        }}
                    >Problems</div>
                </div>

                {
                    tab === "submissions"
                    ?
                    <ProfileSubmissions submissions={submissions}/>
                    :
                    <ProfileProblems problems={problemsSolved}/>
                }


            </div>

     </div>
      )}
    </div>
  );
}

export default Page;
