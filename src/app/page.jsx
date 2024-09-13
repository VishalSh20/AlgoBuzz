import Link from 'next/link';
import {FaCode, FaDropbox} from 'react-icons/fa'

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen items-center bg-violet-200">
      <header className="flex flex-col items-center text-black">
      <h1 className="text-4xl">GS CODESOLVER</h1>
      <div className="font-serif">your one stop coding solution</div>
      </header>

      <div className="flex flex-col items-center mt-8 w-[50%] text-black">
        <h1 className="text-2xl font-mono text-purple-400">Our features</h1>
        <div className="flex gap-4 p-2 text-2xl">
       
          <Link href="/ide" className='p-2 h-full'>
          <div className='flex flex-col justify-center items-center w-full bg-violet-300'>
            <FaCode/>
            IDE
          </div>
          </Link>

          <Link href="/dropnsolve" className='p-2 h-full'>
          <div className='flex flex-col justify-center items-center w-full p-4 bg-violet-300'>
            <FaDropbox/>
            DropnSolve
          </div>
          </Link>
         

        </div>
      </div>
    </div>
  );
}
