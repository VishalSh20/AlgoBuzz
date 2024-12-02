"use client";
import { UserProfile,useUser } from "@clerk/nextjs";
import { Button, Spinner } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

export default function ProfileForm() {
  const {isLoaded,user} = useUser();
  const router = useRouter();

  return (
    <div className="w-full flex gap-4 min-h-svh bg-gradient-to-r from-green-400 to-emerald-900">
      <div className="nav-block">
      <Button onClick={()=>{router.push("/")}} className="mx-4 my-20 flex gap-2 items-center" outline gradientMonochrome="cyan">
        <FaArrowLeft/><span>Back to Home</span>
      </Button>
      </div>
      <div className="flex flex-col gap-4 text-4xl mx-auto my-20 font-mono">
        <div className="heading-edit-profile">
          Edit Profile
        </div>
        {
          isLoaded
          ?
          <UserProfile/>
          :
          <Spinner/>
        }
      </div>
    </div>
  );
}
