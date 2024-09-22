import { SignUp } from "@clerk/nextjs";
import React from "react";

function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 via-violet-300 to-purple-500">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">GS-CodeSolver welcomes you!</h2>
        <p className="text-gray-600 mb-6">Create your account to get started</p>
        <SignUp />
      </div>
    </div>
  );
}

export default Page;
