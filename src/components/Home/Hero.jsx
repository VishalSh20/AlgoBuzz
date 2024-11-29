"use client"

import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const Hero = () => {
    const { isLoaded, isSignedIn } = useUser();

    return (
        <section className=" h-[100vh] pt-20 w-full relative z-10 flex items-center justify-center  ">
            <div className="absolute inset-0 h-full bg-[linear-gradient(to_right,#6666662e_1px,transparent_1px),linear-gradient(to_bottom,#6666662e_1px,transparent_1px)] bg-[size:14px_24px] mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#ffffff_100%,transparent_100%)]">
            </div>
            <div className=" flex flex-col gap-4 max-lg:gap-8 max-lg:pb-10 items-center px-6 relative z-10">
                <h1 className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-text-main to-emerald-600 text-center ">ALGOBUZZ</h1>

                <p className=" w-2/3 max-md:w-full text-center text-2xl font-medium tracking-wider text-gray-300 leading-9">
                    Your one-stop <span className=" text-text-main underline underline-offset-4 decoration-wavy decoration-green-400" >Coding</span> solution for all your programming needs. Simplify your workflow and solve Coding Challenges effortlessly with <span className=" text-text-main underline underline-offset-4 decoration-wavy decoration-green-400">AlgoBuzz</span>
                </p>

                <div className='flex mt-8 gap-12'>
                    <Link href="#feature-section">
                        <span className="px-5 py-3 text-lg font-medium button-gradient1 text-center rounded-lg hover:px-6 hover:py-4">
                            Explore Features
                        </span>
                    </Link>

                    {
                        (!isLoaded || !isSignedIn)
                        &&
                        <Link href="/sign-up">
                            <span className="px-5 py-3 text-lg font-medium button-gradient1 text-center rounded-lg hover:px-6 hover:py-4">
                                Get Started
                            </span>
                        </Link>
                    }
                </div>
            </div>
        </section>
    )
}

export default Hero