"use client";

import { Navbar, Avatar, Button, Dropdown } from 'flowbite-react';
import { FaHome, FaLaptopCode, FaCloudUploadAlt, FaList } from 'react-icons/fa';
import Link from 'next/link';
import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs';

export default function Header() {
  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <Navbar fluid={true} rounded={true} className=" h-16 relative z-50 bg-gray-800/90 backdrop-blur-md border-b border-green-500/20 shadow-lg px-4 xl:px-12 2xl:px-20">
      <div className="flex items-center justify-between w-full">
        {/* Left Section: Brand */}
        <Navbar.Brand>
          <span className="self-center text-2xl font-semibold whitespace-nowrap bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-emerald-500 to-teal-500">
            GS-Code-Solver
          </span>
        </Navbar.Brand>

        {/* Center Section: Navigation Links */}
        <div className=' flex gap-8 items-center'>
          <div className=" flex gap-10 font-semibold">
            <Link href="/" passHref>
              <span className="flex items-center text-lg text-gray-300 hover:text-blue-200 transition-all duration-300 hover:scale-105">
                {/* <FaHome className="mr-2" /> */}
                Home
              </span>
            </Link>


            <Link href="/cf-buddy" passHref>
              <span className="flex items-center text-lg text-gray-300 hover:text-blue-200 transition-all duration-300 hover:scale-105">
                {/* <FaCloudUploadAlt className="mr-2" /> */}
                CF-Buddy
              </span>
            </Link>

            {/* New Problems Section */}
            <Link href="/problems" passHref>
              <span className="flex items-center text-lg text-gray-300 hover:text-blue-200 transition-all duration-300 hover:scale-105">
                {/* <FaList className="mr-2" /> */}
                Problems
              </span>
            </Link>

            <Link href="/ide" passHref>
              <span className="flex items-center text-lg text-gray-300 hover:text-blue-200 transition-all duration-300 hover:scale-105">
                {/* <FaLaptopCode className="mr-2" /> */}
                IDE
              </span>
            </Link>
          </div>

          <div className="flex items-center">
            {(!isLoaded || !isSignedIn)
              ?
              <SignInButton className=" bg-gradient-to-br from-green-400 to-emerald-900 px-4 py-2 rounded-lg font-semibold hover:scale-105 transition-all duration-300 ease-in-out" />
              :
              <Dropdown
                color={"transparent"}
                arrowIcon={false}
                pill={true}
                label={
                  <Avatar
                    img={user.imageUrl}
                    rounded={true}
                    bordered={true}
                    className="cursor-pointer hover:scale-105 transition-all duration-300"
                  />
                }
                className="relative" // Ensure dropdown is positioned correctly
                arrow={false} // Hide the arrow
                placement="bottom-start" // Adjust placement if needed
              >
                <Dropdown.Header>
                  <div className="flex flex-col items-baseline max-w-40 text-clip">
                    <div className='text-gray-600'>
                      {user.fullName}
                    </div>
                    <div>
                      @{user.username}
                    </div>
                  </div>
                </Dropdown.Header>
                <Dropdown.Divider className='text-sky-200' />
                <Dropdown.Item>
                  <Link href={`/profile/${user.username}`} className="block w-full text-left">
                    Profile
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <Link href={`/manage-account`} className="block w-full text-left">
                    Manage Account
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <SignOutButton className="text-red-600 hover:bg-red-100 w-full text-left" />
                </Dropdown.Item>
              </Dropdown>
            }
          </div>
        </div>
      </div>
    </Navbar>
  );
}
