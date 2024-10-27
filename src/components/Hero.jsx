"use client"

import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const Hero = () => {
    const { isLoaded, isSignedIn } = useUser();

    return (
        <div className=" h-[calc(100vh-64px)] w-full relative z-10 flex items-center justify-center ">
            <div className=" flex flex-col gap-4 items-center px-6">
                <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-text-main to-emerald-600 text-center">GS CODE SOLVER</h1>

                <p className=" w-2/3 max-md:w-full text-center text-2xl font-medium tracking-wider text-gray-300 leading-9">
                    Your one-stop <span className=" text-text-main underline underline-offset-4 decoration-wavy decoration-green-400" >Coding</span> solution for all your programming needs. Simplify your workflow and solve Coding Challenges effortlessly with <span className=" text-text-main underline underline-offset-4 decoration-wavy decoration-green-400">GS Code Solver</span>
                </p>

                <div className='flex mt-8 gap-12'>
                    <Link href="#feature-section">
                        <span className="px-5 py-3 text-lg font-bold bg-gradient-to-tr from-green-500 via-emerald-500 to-teal-600 text-center rounded-lg">
                            Explore Features
                        </span>
                    </Link>

                    {
                        (!isLoaded || !isSignedIn)
                        &&
                        <Link href="/sign-up">
                            <span className="px-5 py-3 text-lg font-bold bg-gradient-to-tr from-green-500 via-emerald-500 to-teal-600 text-center rounded-lg">
                                Get Started
                            </span>
                        </Link>
                    }
                </div>
            </div>
        </div>
    )
}

export default Hero