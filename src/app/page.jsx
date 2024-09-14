import Link from 'next/link';
import { FaCode, FaDropbox } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center bg-violet-200">
      {/* Hero Section */}
      <header className="flex flex-col w-full items-center justify-center text-center p-8 bg-gradient-to-r from-blue-500 to-red-500 text-black min-h-[50vh]">
        <h1 className="text-5xl font-serif font-bold mb-4 text-purple-600">GS CODESOLVER</h1>
        <p className="text-xl font-serif mb-6 max-w-2xl mx-auto text-gray-800">
          Your one-stop coding solution for all your programming needs. Simplify your workflow and solve coding challenges effortlessly with our intuitive tools and resources.
        </p>
        <Link href="/get-started">
          <span className="px-6 py-3 text-lg font-serif bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition cursor-pointer">
            Get Started
          </span>
        </Link>
      </header>

      {/* Features Section */}
      <section className="flex flex-col md:flex-row items-center mt-8 w-[90%] max-w-4xl text-black">
        <h2 className="text-3xl font-serif font-semibold text-purple-600 mb-6">Our Features</h2>
        <div className="flex flex-wrap gap-4 p-2">
          <Link href="/ide">
            <span className="flex flex-col justify-center items-center bg-purple-200 p-6 rounded-lg shadow-lg hover:bg-purple-300 transition cursor-pointer">
              <FaCode className="text-4xl mb-2 text-purple-600" />
              <span className="font-serif text-xl">IDE</span>
              <p className="text-center mt-2 text-gray-700">
                A powerful Integrated Development Environment to code, debug, and run your projects seamlessly.
              </p>
            </span>
          </Link>

          <Link href="/dropnsolve">
            <span className="flex flex-col justify-center items-center bg-purple-200 p-6 rounded-lg shadow-lg hover:bg-purple-300 transition cursor-pointer">
              <FaDropbox className="text-4xl mb-2 text-purple-600" />
              <span className="font-serif text-xl">DropnSolve</span>
              <p className="text-center mt-2 text-gray-700">
                Upload and solve coding problems with ease, enhancing your productivity and efficiency in tackling challenges.
              </p>
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
