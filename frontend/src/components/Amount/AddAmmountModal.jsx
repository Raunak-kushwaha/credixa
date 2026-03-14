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


export default function AddAmountModal({ id, children, className = "" }) {

  const { user } = useMainContext()

  let [isOpen, setIsOpen] = useState(false)

  const [loading, setLoading] = useState(false)

  const initial_state = {
    amount: "",
    account_no: id
  }

  const validationSchema = yup.object({
    amount: yup.number().min(1, "Amount cannot be empty").required("Amount is required")
  })

  const onSubmitHandler = async (values, { resetForm }) => {
    try {
      setLoading(true)
      //console.log(values);
      await loadScript(checkout_url)

      const response = await axiosClient.post('/amount/add-money', values, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
      })
      const data = await response.data


      const options = {
        key: `rzp_test_SDpRFBrxzIvRMx`,
        amount: (values.amount * 100).toString(),
        currency: 'INR',
        name: "Credixa Corp.",
        description: "Add Money Transaction",
        callback_url: razorpayCallBackUrl(data.txn_id),
        "image": "https://dashboard-assets.razorpay.com/dashboard/core-bundles/shell/static/standard.6b33a3feedbe5922.svg",
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



      const paymentObject = new window.Razorpay(options);
      paymentObject.open();


      // resetForm()

    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error?.response?.data?.msg || error?.message || 'Payment failed. Please try again.');
    } finally {
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
      {children ? (
        <button type="button" onClick={openModal} className={className}>
          {children}
        </button>
      ) : (
        <button type='button' onClick={openModal}>
          <CiSquarePlus className='text-3xl text-blue-800 cursor-pointer' />
        </button>
      )}

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
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-2xl border border-gray-100 transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-bold text-gray-900"
                    >
                      Add Amount
                    </Dialog.Title>
                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors outline-none">
                      <IoMdClose size={24} />
                    </button>
                  </div>

                  <Formik onSubmit={onSubmitHandler} validationSchema={validationSchema} initialValues={initial_state}>
                    {({ values, handleSubmit }) => (
                      <form onSubmit={handleSubmit} className="w-full">
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Amount to add</label>
                          <div className="flex items-center gap-x-3 border border-gray-200 rounded-xl w-full px-4 py-3 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                            <RiMoneyRupeeCircleLine className="text-gray-500" size={28} />
                            <Field
                              name="amount"
                              onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                              type="text"
                              className="w-full text-2xl text-gray-800 outline-none bg-transparent placeholder-gray-300"
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 w-full border-t border-gray-100 pt-5 mt-2">
                          <button
                            type="button"
                            onClick={closeModal}
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={values.amount < 1 || loading}
                            className="flex items-center justify-center gap-x-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl px-6 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow active:scale-[0.98] min-w-[140px]"
                          >
                            <span>{loading ? "Processing..." : "Proceed"}</span>
                            {!loading && <SiRazorpay size={16} className="ml-1" />}
                          </button>
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
