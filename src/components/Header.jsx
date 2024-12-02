"use client";

import { Avatar, Dropdown } from 'flowbite-react';
import Link from 'next/link';
import { SignInButton, SignOutButton, useUser } from '@clerk/nextjs';
import { Squash as Hamburger } from 'hamburger-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { isLoaded, isSignedIn, user } = useUser();
  const path = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className=" h-20 max-lg:h-28 fixed w-full z-50 bg-gray-800/70 backdrop-blur-md border-b border-green-500/20 shadow-lg px-4 xl:px-12 2xl:px-20 flex items-center justify-center">
      <div className=" w-[90vw] flex items-center justify-between">
        {/* Left Section: Brand */}
        <span className="self-center text-2xl font-semibold whitespace-nowrap logo-gradient">
         AlgoBuzz
        </span>


        {/* Center Section: Navigation Links */}
        <div className=' flex gap-8 max-md:gap-2 items-center'>
          <div className=" flex gap-10 font-semibold max-md:hidden">
            <Link href="/" passHref>
              <span className={`flex items-center text-lg text-gray-300 transition-all duration-300 hover:scale-105 hover:text-text-main ${path === '/' ? "text-text-main" : ""}`}>
                {/* <FaHome className="mr-2" /> */}
                Home
              </span>
            </Link>


            <Link href="/cf-buddy" passHref>
              <span className={`flex items-center text-lg text-gray-300 transition-all duration-300 hover:scale-105 hover:text-text-main ${path === '/cf-buddy' ? "text-text-main" : ""}`}>
                {/* <FaCloudUploadAlt className="mr-2" /> */}
                CF-Buddy
              </span>
            </Link>

            {/* New Problems Section */}
            <Link href="/problems" passHref>
              <span className={`flex items-center text-lg text-gray-300 transition-all duration-300 hover:scale-105 hover:text-text-main ${path === '/problems' ? "text-text-main" : ""}`}>
                {/* <FaList className="mr-2" /> */}
                Problems
              </span>
            </Link>

            <Link href="/ide" passHref>
              <span className={`flex items-center text-lg text-gray-300 transition-all duration-300 hover:scale-105 hover:text-text-main ${path === 'ide' ? "text-text-main" : ""}`}>
                {/* <FaLaptopCode className="mr-2" /> */}
                IDE
              </span>
            </Link>
          </div>


          <div className="flex items-center">
            {(!isLoaded || !isSignedIn)
              ?
              <SignInButton className=" button-gradient2" />
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
                  <Link href={`/profile/settings`} className="block w-full text-left">
                    Manage Account
                  </Link>
                </Dropdown.Item>
                <Dropdown.Item>
                  <SignOutButton className="text-red-600 hover:bg-red-100 w-full text-left" />
                </Dropdown.Item>
              </Dropdown>
            }
          </div>

          {/* <p className=' text-white text-5xl md:hidden'>
            |
          </p> */}

          <div className='md:hidden' onClick={() => setMenuOpen(!menuOpen)}>
            <Hamburger toggled={menuOpen} toggle={setMenuOpen} color={"#FFFFFF"} size={24} />
          </div>

          <div className={`${menuOpen ? "flex" : "hidden"} absolute z-50 top-28 right-0 flex-col items-center justify-center gap-10 font-semibold h-fit w-fit px-24 py-16 rounded-3xl bg-gray-800 backdrop-blur-lg`}>
            <Link href="/" passHref>
              <span className="flex items-center text-lg text-gray-300 transition-all duration-300 hover:scale-105 hover:text-text-main">
                {/* <FaHome className="mr-2" /> */}
                Home
              </span>
            </Link>


            <Link href="/cf-buddy" passHref>
              <span className="flex items-center text-lg text-gray-300 transition-all duration-300 hover:scale-105 hover:text-text-main">
                {/* <FaCloudUploadAlt className="mr-2" /> */}
                CF-Buddy
              </span>
            </Link>

            {/* New Problems Section */}
            <Link href="/problems" passHref>
              <span className="flex items-center text-lg text-gray-300 transition-all duration-300 hover:scale-105 hover:text-text-main">
                {/* <FaList className="mr-2" /> */}
                Problems
              </span>
            </Link>

            <Link href="/ide" passHref>
              <span className="flex items-center text-lg text-gray-300 transition-all duration-300 hover:scale-105 hover:text-text-main">
                {/* <FaLaptopCode className="mr-2" /> */}
                IDE
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
