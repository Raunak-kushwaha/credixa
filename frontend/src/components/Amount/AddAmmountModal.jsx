"use client";
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { CiSquarePlus } from 'react-icons/ci';
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { SiRazorpay } from "react-icons/si";
import { Field, Form, Formik } from 'formik';
import * as yup from 'yup'
import { toast } from 'react-toastify';
import { loadScript } from '@/utils/loadScripts';
import { checkout_url, razorpayCallBackUrl } from '@/utils/constant';
import { axiosClient } from '@/utils/AxiosClient';
import { useMainContext } from '@/context/MainContext';


export default function AddAmountModal({id}) {

  const {user} = useMainContext()

  let [isOpen, setIsOpen] = useState(false)

  const [loading,setLoading] = useState(false)

  const initial_state={
    amount:0,
    account_no:id
  }

  const validationSchema = yup.object({
    amount:yup.number().min(1, "Amount cannot be empty").required("Amount is required")
  })

  const onSubmitHandler = async (values, {resetForm}) => {
    try{
        setLoading(true)
            //console.log(values);
            await loadScript(checkout_url)

            const response = await axiosClient.post('/amount/add-money',values,{
      headers:{
        'Authorization':'Bearer '+ localStorage.getItem("token")
      }
     })
     const data = await response.data
     

            const options = {
key: `rzp_test_SDpRFBrxzIvRMx`, 
amount: (values.amount*100).toString(),
currency: 'INR',
name: "Credixa Corp.",
description: "Add Money Transaction",
callback_url: razorpayCallBackUrl(data.txn_id),
"image":"https://dashboard-assets.razorpay.com/dashboard/core-bundles/shell/static/standard.6b33a3feedbe5922.svg",
//image: { logo },
order_id: data.order_id,

prefill: {
name: user.name,
email: user.email,
contact: "9999999999"
},
theme: {
color: "#61dafb",
},
};



const paymentObject = new window. Razorpay(options);
paymentObject. open () ;

           
           // resetForm()

    } catch (error) {
    console.error('Payment error:', error);
    toast.error(error?.response?.data?.msg || error?.message || 'Payment failed. Please try again.');
        } finally{
            setLoading(false)
        }

  }

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <>
    
        <button type='button' onClick={openModal}><CiSquarePlus className='text-3xl text-blue-800 cursor-pointer'/></button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-[50vh] items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex item-center justify-between"
                  >
                    <span>
                        Add Amount
                    </span>
                    <button onClick={closeModal} className='text-2xl p-2 bg-blue-100 rounded-full cursor-pointer'>
                        <IoMdClose/>
                    </button>

                  </Dialog.Title>
                  
                    <Formik onSubmit={onSubmitHandler} validationSchema={validationSchema} initialValues={initial_state}>
                    {({values,handleSubmit}) => (
                        <form onSubmit={handleSubmit} className='w-[50%] lg:w-[50%] mx-auto'>
                    <div className='mb-3 flex item-center gap-x-2 border rounded w-full px-2 py-2'>

                     <RiMoneyRupeeCircleLine className='text-3xl'/>   
                     <Field name="amount" onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} type="text" className='w-full text-xl outline-none border-none' placeholder='Enter amount' />
                    </div>
                    <div className='mb-3 flex w-full justify-end'>
                       <button disabled={values.amount<1 || loading} className="px-3 flex items-center gap-x-2 bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-2 disabled:bg-blue-200"><span>Add</span><SiRazorpay/></button>
                    </div>
                    </form>

                    )}


                    </Formik>

                  
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
