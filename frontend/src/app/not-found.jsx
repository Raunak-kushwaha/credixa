 
import Link from 'next/link'; 
import React from 'react'

const ErrorPage = () => {
 

  return (
      <>
    <div className=" my-10 w-[96%] py-10 lg:w-1/2 flex items-center mx-auto flex-col justify-center lg:shadow lg:border rounded-md gap-y-5">
    
            <h1 className='text-4xl font-bold'>Not Found</h1>
            <Link  href={'/'} className='px-3 py-2 bg-blue-600 hover:bg-blue-800 transition-all duration-300 text-white rounded cursor-pointer'>Go To Dashboard</Link>
    </div>

      </>
  )
}

export default ErrorPage