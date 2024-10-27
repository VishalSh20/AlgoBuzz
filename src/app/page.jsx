"use client"
import Hero from '@/components/Hero';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { FaCode, FaDropbox } from 'react-icons/fa';

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <main className='bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900'>
      <div class="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_100%,transparent_100%)]"></div>
      {/* Hero Section */}
      {/* <header className="flex flex-col w-[90vw] items-center justify-center text-center p-8 bg-indigo-700/30 min-h-[50vh] ">
        <h1 className="text-6xl font-bold mb-4 text-indigo-700 drop-shadow-lg">
          GS CODESOLVER
        </h1>
        <p className="text-2xl mb-6 max-w-3xl mx-auto font-mono text-gray-900 opacity-90">
          Your one-stop coding solution for all your programming needs. Simplify your workflow and solve coding challenges effortlessly with our intuitive tools and resources.
        </p>
        <div className='flex gap-2 p-2'>
        <Link href="#feature-section">
          <span className="px-8 py-4 text-lg font-bold bg-purple-500 text-white rounded-full shadow-xl hover:bg-purple-800 transition-transform transform hover:scale-105">
            Explore Features
          </span>
        </Link>

        {
          (!isLoaded || !isSignedIn)
            &&
        <Link href="/sign-up">
          <span className="px-8 py-4 text-lg font-bold bg-purple-700 text-white rounded-full shadow-xl hover:bg-purple-800 transition-transform transform hover:scale-105">
            Get Started
          </span>
        </Link>
      }
        </div>
      </header> */}

      <Hero />

      {/* Features Section */}
      <section className="flex flex-col items-center mt-12 w-[90%] max-w-6xl text-black" id='feature-section'>
        <h2 className="text-4xl font-semibold text-purple-600 mb-10 drop-shadow-md">Our Features</h2>
        <div className="flex flex-wrap justify-center gap-8 w-full">
          {/* IDE Card */}
          <Link href="/ide">
            <span className="flex flex-col justify-center items-center bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 hover:bg-purple-100 w-[300px] h-[350px]">
              <FaCode className="text-5xl mb-4 text-purple-600" />
              <span className="text-xl font-semibold text-gray-800">IDE</span>
              <p className="text-center mt-4 text-gray-600">
                A powerful Integrated Development Environment to code, debug, and run your projects seamlessly.
              </p>
            </span>
          </Link>

          {/* DropnSolve Card */}
          <Link href="/cf-buddy">
            <span className="flex flex-col justify-center items-center bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 hover:bg-purple-100 w-[300px] h-[350px]">
              <FaDropbox className="text-5xl mb-4 text-purple-600" />
              <span className="text-xl font-semibold text-gray-800">CF-BUDDY</span>
              <p className="text-center mt-4 text-gray-600">
                Upload and solve coding problems with ease, enhancing your productivity and efficiency in tackling challenges.
              </p>
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
