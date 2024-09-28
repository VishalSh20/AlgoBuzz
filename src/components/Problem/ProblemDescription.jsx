import { Topic } from '@prisma/client';
import { Dropdown } from 'flowbite-react';
import React from 'react'

function ProblemDescription({problem}) {
    console.log(problem);
  return (
    <div className='w-full bg-transparent text-black'>
            
        <div className="flex flex-col items-baseline gap-10 min-h-full p-2">
            <pre className='text-gray-600 font-mono text-wrap'>{problem.Statement}</pre>

            <div className="flex flex-col gap-4">
                {problem.examples?.map((example,index)=>(
                    <div className='flex flex-col gap-2 p-2' key={index}>
                        <h2>Example {index}</h2>
                        <span>Input: {example.inputText}</span>
                        <span>Output: {example.outputText}</span>
                        {
                        example.explaination
                        &&
                        <span>Explaination: {example.explaination}</span>
                        }
                    </div>
                ))}
            </div>

            <div className='flex flex-col gap-2'>
              <h2 className="font-bold">Constraints:</h2>
              <div className='flex flex-col gap-2'>
                {problem.constraints?.map((constraint, index) => (
                  <p
                    key={index}
                    className="bg-slate-300 dark:bg-purple-700 p-1 rounded w-fit"
                  >
                    {constraint}
                  </p>
                ))}
              </div>
            </div>

            
              <Dropdown label={"Topics"} >
                <Dropdown.Item className='flex flex-wrap gap-2 '>
                  {
                    problem.topics?.map((topic,index) => (
                      <div className='p-1 rounded-lg bg-gray-200' key={index}>{topic}</div>
                    ))
                  }
                </Dropdown.Item>
              </Dropdown>
            

        </div>
    </div>
  )
}

export default ProblemDescription
