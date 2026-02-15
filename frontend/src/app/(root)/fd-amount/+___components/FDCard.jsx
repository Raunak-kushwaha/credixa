"use client";
import Link from 'next/link';
import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import { TbCoins } from 'react-icons/tb'
import ClaimFDModel from './ClaimFDModel';

const FDCard = ({data,isUpdate,setIsUpdate}) => {
    const [isShow,setIsShow] = useState(false)
    const amount = `${data.amount}`

  return (
    <div className='flex items-center justify-between border rounded py-3 px-10 w-full'>
      <TbCoins className='text-4xl text-yellow-400' />

      <div className='flex flex-col gap-y-2 justify-end w-full ml-4'>
        <p className='text-xl font-semibold'>{data?.apply_for}</p>

        <div className='flex items-center justify-end gap-x-2'>
          <h1 className='text-2xl font-bold'>
            {isShow
              ? `₹${amount}/-`
              : ``.padStart(`${amount}`.length, `X`.repeat(`${amount}`.length))}
          </h1>

          <button
            onClick={(e)=>{
              e.preventDefault();
              e.stopPropagation();
              setIsShow(!isShow)
            }}
            type='button' className='text-2xl flex items-center justify-center w-8 h-8'
          >
            {isShow ? <FaEyeSlash/> : <FaEye/>}
          </button>
        </div>

        <div className='flex justify-end mt-2'>
          <ClaimFDModel methods={{isUpdate,setIsUpdate}} id={data?._id} />
        </div>
      </div>
    </div>
  )
}

export default FDCard