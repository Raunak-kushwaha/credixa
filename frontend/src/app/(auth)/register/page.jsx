"use client";
import { axiosClient } from '@/utils/AxiosClient';
import React, { useState } from 'react'
import {Formik,Form,ErrorMessage,Field} from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify';
import CustomAuthButton from '@/components/reusable/CustomAuthButton';
import Link from 'next/link';
import { useMainContext } from '@/context/MainContext';
import { useRouter } from 'next/navigation';
const RegisterPage = () => {
  const [loading, setLoading] = useState(false);
    const { fetchUserProfile } = useMainContext();
    const router = useRouter()


 // const [states, setStates] = useState()

  // const onChangeHandler = (e) => {
  //   const { name, value } = e.target;
  //   setStates(prev => ({
  //     ...prev,
  //     [name]: value
  //   }))
  // }
const initialValues = {
    name: '',
    email: '',
    password: '',
    ac_type: ''
  }


const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    ac_type: Yup.string().oneOf(['saving', 'current'], 'Invalid account type').required('Account type is required')
  });


  const [states, setStates] = useState(initialValues)
  const onSubmitHandler = async (values, helpers) => {
    try {
      setLoading(true);
    const response = await axiosClient.post('/auth/register', values)
    const data = await response.data;
   // console.log(data);
   toast.success(data.msg)
   

         localStorage.setItem("token", data.token)
         fetchUserProfile() 
      router.push("/")
   
   helpers.resetForm();
    }
    catch (error) {
    console.log(error.message)
    toast.error(error.response?.data?.msg || 'Registration failed')
    }finally {
      setLoading(false);
    }
  }

return (

<div className="min-h-[80vh] flex items-center justify-center">
  <div className="w-full max-w-lg p-10 flex items-start justify-center bg-white shadow-md rounded-md">
    <div className="div">
      </div>
    <Formik
    initialValues={initialValues}
    validationSchema={validationSchema}
    onSubmit={onSubmitHandler}
  >
    <Form className="w-full max-w-md px-10 py-10 rounded-md space-y-3">
    <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
    <Field
      type="text"
      name="name"
      placeholder="Name"
      className="w-full py-3 px-3 rounded border outline-none"
    />
    <ErrorMessage name="name" component="p" className="text-red-500 text-sm" />

    <Field
      type="email"
      name="email"
      placeholder="Email"
      className="w-full py-3 px-3 rounded border outline-none"
    />
    <ErrorMessage name="email" component="p" className="text-red-500 text-sm" />
    <Field
      type="text"
      name="password"
      placeholder="Password"
      className="w-full py-3 px-3 rounded border outline-none"
    />
    <ErrorMessage name="password" component="p" className="text-red-500 text-sm" />
    <Field as ="select"
      name="ac_type"
      className="w-full py-3 px-3 rounded border outline-none"
    >
      <option value="">Select Account Type</option>
      <option value="saving">Saving</option>
      <option value="current">Current</option>
    </Field>
    <ErrorMessage name="ac_type" component="p" className="text-red-500 text-sm" />
    
    
    <div className="mb-3">
      <CustomAuthButton  text="Register" type='submit' isLoading={loading}/>
    </div>
    <div className="mb-3">
      <p className="text-end">Already have an account? <Link href="/login" className="text-blue-600 underline">Login here</Link></p>
    </div>


  </Form>
  </Formik>
  </div>
</div>

  )
}
    
export default RegisterPage