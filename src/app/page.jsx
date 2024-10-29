// "use client"
import Features from '@/components/Home/Features';
import Hero from '@/components/Home/Hero';
// import Link from 'next/link';
// import { FaCode, FaDropbox } from 'react-icons/fa';

export default function Home() {

  return (
    <main className=' h-fit bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900'>
      <Hero />

      <Features />
      {/* <section className="flex flex-col items-center mt-12 w-[90%] max-w-6xl text-black" id='feature-section'>
        <h2 className="text-4xl font-semibold text-purple-600 mb-10 drop-shadow-md">Our Features</h2>
        <div className="flex flex-wrap justify-center gap-8 w-full">
          IDE Card
          <Link href="/ide">
            <span className="flex flex-col justify-center items-center bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 hover:bg-purple-100 w-[300px] h-[350px]">
              <FaCode className="text-5xl mb-4 text-purple-600" />
              <span className="text-xl font-semibold text-gray-800">IDE</span>
              <p className="text-center mt-4 text-gray-600">
                A powerful Integrated Development Environment to code, debug, and run your projects seamlessly.
              </p>
            </span>
          </Link>

          DropnSolve Card
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
      </section> */}
    </main>
  );
}
