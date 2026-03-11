"use client";
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { toast } from 'react-toastify';
import { Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import { RiExchangeDollarFill } from 'react-icons/ri';
import { IoMdClose } from 'react-icons/io';
import { axiosClient } from '@/utils/AxiosClient';
import { useMainContext } from '@/context/MainContext';

export default function TransferModal({ id, children, className = "" }) {
  const { user, fetchUserProfile } = useMainContext();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [transferData, setTransferData] = useState(null);
  const [loading, setLoading] = useState(false);

  const initial_state = {
    receiverEmail: '',
    amount: 0
  };

  const validationSchema = yup.object({
    receiverEmail: yup.string().email('Invalid email').required('Receiver email is required'),
    amount: yup.number().min(1, 'Amount must be at least 1').max(user?.amount || 0, 'Insufficient balance').required('Amount is required')
  });

  const handleSubmit = async (values) => {
    setTransferData(values);
    setShowConfirmation(true);
  };

  const onConfirmTransfer = async () => {
    if (!transferData) return;

    try {
      setLoading(true);
      const response = await axiosClient.post('/amount/transfer', transferData, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')
        }
      });
      const data = await response.data;
      toast.success(data.msg || 'Transfer successful');
      await fetchUserProfile();
      setTransferData(null);
      setShowConfirmation(false);
      closeModal();
    } catch (error) {
      console.error('Transfer error', error);
      toast.error(error?.response?.data?.msg || error?.message || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  const setQuickAmount = (formikProps, amount) => {
    if (amount <= (user?.amount || 0)) {
      formikProps.setFieldValue('amount', amount);
    } else {
      toast.warning('Amount exceeds available balance');
    }
  };

  function closeModal() {
    setIsOpen(false);
    setShowConfirmation(false);
    setTransferData(null);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      {children ? (
        <button type="button" onClick={openModal} className={className}>
          {children}
        </button>
      ) : (
        <button type="button" onClick={openModal}>
          <RiExchangeDollarFill className='text-3xl text-green-600 cursor-pointer hover:text-green-700 transition' />
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
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold text-gray-900 flex items-center justify-between mb-6"
                  >
                    <span>💸 Transfer Money</span>
                    <button onClick={closeModal} className='p-2 bg-gray-100 hover:bg-gray-200 rounded-full cursor-pointer transition'>
                      <IoMdClose className='text-2xl' />
                    </button>
                  </Dialog.Title>

                  {!showConfirmation ? (
                    <Formik onSubmit={handleSubmit} validationSchema={validationSchema} initialValues={initial_state}>
                      {({ values, handleSubmit, errors, touched, setFieldValue }) => (
                        <form onSubmit={handleSubmit} className='space-y-5'>
                          {/* Available Balance */}
                          <div className='bg-blue-50 rounded-lg p-4 border border-blue-200'>
                            <p className='text-sm text-blue-600 font-medium'>Available Balance</p>
                            <p className='text-2xl font-bold text-blue-700 mt-1'>₹{user?.amount || 0}</p>
                          </div>

                          {/* Receiver Email */}
                          <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>Receiver Email</label>
                            <Field 
                              name="receiverEmail" 
                              type="email" 
                              className='w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition' 
                              placeholder='friend@example.com' 
                            />
                            {errors.receiverEmail && touched.receiverEmail && (
                              <p className='text-red-500 text-sm mt-1'>{errors.receiverEmail}</p>
                            )}
                          </div>

                          {/* Amount */}
                          <div>
                            <label className='block text-sm font-semibold text-gray-700 mb-2'>Amount</label>
                            <div className='flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200'>
                              <RiExchangeDollarFill className='text-2xl text-gray-400' />
                              <Field 
                                name="amount" 
                                type="number" 
                                className='w-full text-lg outline-none border-none bg-transparent' 
                                placeholder='0' 
                              />
                            </div>
                            {errors.amount && touched.amount && (
                              <p className='text-red-500 text-sm mt-1'>{errors.amount}</p>
                            )}
                          </div>

                          {/* Quick Amount Buttons */}
                          <div>
                            <p className='text-sm font-semibold text-gray-700 mb-3'>Quick Amount</p>
                            <div className='grid grid-cols-3 gap-2'>
                              {[100, 500, 1000].map((amount) => (
                                <button
                                  key={amount}
                                  type="button"
                                  onClick={() => setQuickAmount({ setFieldValue }, amount)}
                                  disabled={amount > (user?.amount || 0)}
                                  className='bg-gray-100 hover:bg-blue-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-semibold py-2 px-3 rounded-lg transition'
                                >
                                  ₹{amount}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Transfer Preview */}
                          {values.amount && values.receiverEmail && (
                            <div className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
                              <p className='text-xs text-gray-600 font-medium mb-2'>TRANSFER PREVIEW</p>
                              <p className='text-gray-700'>
                                You are sending <span className='font-bold'>₹{values.amount}</span> to <span className='font-bold'>{values.receiverEmail}</span>
                              </p>
                            </div>
                          )}

                          {/* Submit Button */}
                          <button 
                            type="submit"
                            disabled={values.amount < 1 || !values.receiverEmail || loading} 
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition transform hover:scale-105 flex items-center justify-center gap-2"
                          >
                            <RiExchangeDollarFill className='text-lg' />
                            <span>Send Money</span>
                          </button>
                        </form>
                      )}
                    </Formik>
                  ) : (
                    /* Confirmation Modal */
                    <div className='space-y-5'>
                      <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                        <p className='text-sm font-semibold text-yellow-800 mb-2'>⚠️ Confirm Transfer</p>
                        <p className='text-gray-700 text-sm'>
                          You are about to send <span className='font-bold'>₹{transferData?.amount}</span> to <span className='font-bold'>{transferData?.receiverEmail}</span>. This action cannot be undone.
                        </p>
                      </div>

                      <div className='flex gap-3'>
                        <button
                          onClick={() => setShowConfirmation(false)}
                          disabled={loading}
                          className='flex-1 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-gray-800 font-semibold py-3 rounded-lg transition'
                        >
                          Cancel
                        </button>
                        <button
                          onClick={onConfirmTransfer}
                          disabled={loading}
                          className='flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition'
                        >
                          {loading ? 'Processing...' : 'Confirm Transfer'}
                        </button>
                      </div>
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}