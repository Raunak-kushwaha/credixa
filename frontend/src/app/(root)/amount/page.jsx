"use client";
import AddAmountModal from '@/components/Amount/AddAmmountModal';
import HeaderName from '@/components/HeaderName'
import { useMainContext } from '@/context/MainContext';
import React from 'react'
const AmountPage = () => {
  const {user} = useMainContext()
  return (
    <>
      <div className="container py-10">
        <HeaderName/>
        <div className="card w-1/3 border py-5 rounded flex items-center justify-between px-3">
        <div className="flex flex-col">
          <h1 className='text-xl font-bold'>Add Amount</h1>
          <p className='text-small text-zinc-500'>{user?.account_no}</p>
          <p className='font-semibold'>Current Balance: ₹{user.amount}</p>
        
        
        </div>
        <AddAmountModal id={user.account_no}/>
        
        </div>
      </div>
    </>
  )
}

export default AmountPage