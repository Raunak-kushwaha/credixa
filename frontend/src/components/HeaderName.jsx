"use client";
import { useMainContext } from '@/context/MainContext'
import React from 'react'

const HeaderName = () => {

  const {user} = useMainContext()

  return (
    <>
          <div className="py-1">
      <h1 className="text-3xl font-bold capitalize">Welcome {user?.name}</h1>
    </div>
    </>
  )
}

export default HeaderName