import AddAmountModal from '@/components/Amount/AddAmmountModal';
import HeaderName from '@/components/HeaderName'
import React from 'react'
const AmountPage = () => {
  return (
    <>
      <div className="container py-10">
        <HeaderName/>
        <div className="card w-1/3 border py-5 rounded flex items-center justify-between px-3">
        <div className="flex flex-col">
          <h1 className='text-xl font-bold'>Add Amount</h1>
          <p>Current Balance: Rs 200</p>
        
        
        </div>
        <AddAmountModal/>
        
        </div>
      </div>
    </>
  )
}

export default AmountPage