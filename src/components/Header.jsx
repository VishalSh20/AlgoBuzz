"use client"
import { Navbar } from 'flowbite-react';
import { FaHome, FaLaptopCode, FaCloudUploadAlt } from 'react-icons/fa';
import Link from 'next/link';

export default function Header() {
  return (
    <Navbar fluid={true} rounded={true} className="bg-gradient-to-r from-purple-800 to-violet-600">
      <Navbar.Brand>
        {/* Title on the left */}
        <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
          GS-Code-Solver
        </span>
      </Navbar.Brand>

      {/* Navigation Links */}
      <Navbar.Collapse>
        <Link href="/">
          <span className="flex items-center text-white hover:text-blue-200 hover:text-2xl">
            <FaHome className="mr-2" />
            Home
          </span>
        </Link>

        <Link href="/ide" passHref>
          <span className="flex items-center text-white hover:text-blue-200 hover:text-2xl">
            <FaLaptopCode className="mr-2" />
            IDE
          </span>
        </Link>

        <Link href="/dropnsolve" passHref>
          <span className="flex items-center text-white hover:text-blue-200 hover:text-2xl">
            <FaCloudUploadAlt className="mr-2" />
            DropNSolve
          </span>
        </Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
