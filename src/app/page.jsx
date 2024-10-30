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
    </main>
  );
}
