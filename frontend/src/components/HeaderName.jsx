"use client";
import { useMainContext } from '@/context/MainContext'
import React from 'react'

const HeaderName = () => {

  const {user} = useMainContext()

  return (
    <>
      <div className="py-2">
        <h1 className="text-3xl font-extrabold capitalize bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
          Welcome {user?.name}
        </h1>
      </div>
    </>
  )
}

export default HeaderName