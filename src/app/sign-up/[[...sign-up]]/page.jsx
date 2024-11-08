import { SignUp } from "@clerk/nextjs";
import React from "react";

function Page() {
  return (
    <div className="flex items-center justify-center h-fit pt-24 pb-12 bg-gradient">
      <div className="bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-4 text-white">GS-CodeSolver welcomes you!</h2>
        <p className="text-gray-300 mb-6">Create your account to get started</p>
        <SignUp />
      </div>
    </div>
  );
}

export default Page;
