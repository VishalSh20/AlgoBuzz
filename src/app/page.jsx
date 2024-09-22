import Link from 'next/link';
import { FaCode, FaDropbox } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center bg-gradient-to-b from-violet-400 via-fuchsia-100 to-purple-400">
      {/* Hero Section */}
      <header className="flex flex-col w-full items-center justify-center text-center p-8 bg-gradient-to-r from-blue-500 to-fuchsia-500 text-white min-h-[50vh]">
        <h1 className="text-6xl font-bold mb-4 text-indigo-700 drop-shadow-lg">
          GS CODESOLVER
        </h1>
        <p className="text-2xl mb-6 max-w-3xl mx-auto text-yellow-300 opacity-90">
          Your one-stop coding solution for all your programming needs. Simplify your workflow and solve coding challenges effortlessly with our intuitive tools and resources.
        </p>
        <div className='flex gap-2 p-2'>
        <Link href="#feature-section">
          <span className="px-8 py-4 text-lg font-bold bg-purple-500 text-white rounded-full shadow-xl hover:bg-purple-800 transition-transform transform hover:scale-105">
            Explore Features
          </span>
        </Link>

        <Link href="/sign-up">
          <span className="px-8 py-4 text-lg font-bold bg-purple-700 text-white rounded-full shadow-xl hover:bg-purple-800 transition-transform transform hover:scale-105">
            Get Started
          </span>
        </Link>
        </div>
      </header>

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
          <Link href="/dropnsolve">
            <span className="flex flex-col justify-center items-center bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-transform transform hover:scale-105 hover:bg-purple-100 w-[300px] h-[350px]">
              <FaDropbox className="text-5xl mb-4 text-purple-600" />
              <span className="text-xl font-semibold text-gray-800">DropnSolve</span>
              <p className="text-center mt-4 text-gray-600">
                Upload and solve coding problems with ease, enhancing your productivity and efficiency in tackling challenges.
              </p>
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
