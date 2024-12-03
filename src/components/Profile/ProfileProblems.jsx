"use client";

import { useRouter } from "next/navigation";

const ProblemTable = ({ problems }) => {
  const router = useRouter();

  const easyProblems = problems.filter((p) => p.difficulty === "EASY");
  const mediumProblems = problems.filter((p) => p.difficulty === "MEDIUM");
  const hardProblems = problems.filter((p) => p.difficulty === "HARD");
  console.log(easyProblems,mediumProblems,hardProblems);

  const handleProblemClick = (slug) => {
    router.push(`/problem/${slug}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex gap-2 m-4">
        {/* easy questions */}
        <div className="flex flex-col w-full md:w-1/3">
        <span className="font-bold">EASY</span>
          {
            easyProblems.map((prob,index)=>(
              <div key={index} className="font-bold text-green-400 font-mono">
                {prob.title}
              </div>
            ))
          }
        </div>

         {/* medium questions */}
         <div className="flex flex-col w-full md:w-1/3">
         <span className="font-bold">MEDIUM</span>
          {
            mediumProblems.map((prob,index)=>(
              <div key={index} className="font-bold text-yellow-400 font-mono">
                {prob.title}
              </div>
            ))
          }
        </div>

         {/* hard questions */}
         <div className="flex flex-col w-full md:w-1/3">
         <span className="font-bold">HARD</span>
          {
            hardProblems.map((prob,index)=>(
              <div key={index} className="font-bold text-red-600 font-mono">
                {prob.title}
              </div>
            ))
          }
        </div>

      </div>
    </div>
  );
};

export default ProblemTable;
