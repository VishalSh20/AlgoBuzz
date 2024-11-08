"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'

function Page({params}) {
    const {id} = params;
    const [contestId,problemId] = id.split('-').length==2 ? [id.split('-')[0],id.split('-')[1]] : [null,null];
    const [problem,setProblem] = useState(null);
    const [error,setError] = useState((!id || id.split('-').length!=2) ? "Invalid Id" : null);
    const [loading,setLoading] = useState(false);

    useEffect(()=>{
        if(error)
            return;

        setLoading(true);
        setError(null);
        setProblem(null);
        const requestURL = `${process.env.NEXT_PUBLIC_CF_INTERFACE_URL}/problem?problemId=${problemId}&contestId=${contestId}`;
        console.log(requestURL);

        axios
        .get(requestURL)
        .then((response)=>{
            const responseData = response.data;
            console.log(responseData);
            setProblem(responseData.problem);
        })
        .catch((error)=>{
            const errorMessage = error.response?.data?.error || error.response?.status || error.message;
            console.log(errorMessage);
            setError(errorMessage);
        })
        .finally(()=>{
            setLoading(false);
        });
    },[]);

  return (
    <div className=' flex flex-col gap-8 items-center min-h-[100svh] bg-gradient-to-br from-gray-800 via-green-900 to-emerald-900'>
      
    </div>
  )
}

export default Page
