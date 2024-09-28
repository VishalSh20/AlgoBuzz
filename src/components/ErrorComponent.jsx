import React from 'react'

function ErrorComponent({code,message}) {
  return (
   
    <div className="flex justify-center items-center w-full h-[100vh] bg-gradient-to-r from-indigo-400 to-purple-800">
      <div className="flex flex-col w-fit h-fit items-center gap-2 p-4 bg-gradient-to-r from-teal-400 to-pink-300 via-transparent rounded-lg">
            <span className='text-gray-800 font-mono text-3xl'>Oops..Error Occured !!</span>
            <span className='text-red-800 font-mono text-2xl'>{message}</span>
            <h2 className="text-8xl shadow-lg shadow-teal-300">
                {code}
            </h2>
        </div>
    </div>

  )
}

export default ErrorComponent
