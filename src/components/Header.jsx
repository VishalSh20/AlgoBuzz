"use client";

import { Navbar, Avatar } from 'flowbite-react';
import { FaHome, FaLaptopCode, FaCloudUploadAlt, FaList } from 'react-icons/fa';
import Link from 'next/link';

export default function Header() {
  return (
    <Navbar fluid={true} rounded={true} className="bg-gradient-to-r from-purple-800 to-violet-600">
      <div className="flex items-center justify-between w-full">
        {/* Left Section: Brand */}
        <Navbar.Brand>
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            GS-Code-Solver
          </span>
        </Navbar.Brand>

        {/* Center Section: Navigation Links */}
        <Navbar.Collapse className="flex gap-6">
          <Link href="/" passHref>
            <span className="flex items-center text-white hover:text-blue-200 transition-all duration-300 hover:scale-105">
              <FaHome className="mr-2" />
              Home
            </span>
          </Link>


          <Link href="/cf-buddy" passHref>
            <span className="flex items-center text-white hover:text-blue-200 transition-all duration-300 hover:scale-105">
              <FaCloudUploadAlt className="mr-2" />
              CF-Buddy
            </span>
          </Link>

          {/* New Problems Section */}
          <Link href="/problems" passHref>
            <span className="flex items-center text-white hover:text-blue-200 transition-all duration-300 hover:scale-105">
              <FaList className="mr-2" />
              Problems
            </span>
          </Link>

          <Link href="/ide" passHref>
            <span className="flex items-center text-white hover:text-blue-200 transition-all duration-300 hover:scale-105">
              <FaLaptopCode className="mr-2" />
              IDE
            </span>
          </Link>
        </Navbar.Collapse>

        {/* Right Section: Avatar */}
        <div className="flex items-center">
          <Avatar
            img="https://randomuser.me/api/portraits/men/32.jpg"
            rounded={true}
            bordered={true}
            className="cursor-pointer hover:scale-105 transition-all duration-300"
          />
        </div>
      </div>
    </Navbar>
  );
}
