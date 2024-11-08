// "use client"
import Features from '@/components/Home/Features';
import Hero from '@/components/Home/Hero';
// import Link from 'next/link';
// import { FaCode, FaDropbox } from 'react-icons/fa';

export default function Home() {

  return (
    <main className=' h-fit bg-gradient'>
      <Hero />
      <Features />
    </main>
  );
}
