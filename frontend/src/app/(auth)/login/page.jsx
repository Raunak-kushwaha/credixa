"use client";

import { axiosClient } from '@/utils/AxiosClient';
import React, { useState } from 'react'

const LoginPage = () => {

  const [states, setStates] = useState({
    name: '',
    email: '',
    password: '',
    ac_type: ''
  })

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setStates(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
    const response = await axiosClient.post('/auth/register', states)
    const data = await response.data;
    console.log(data);
    }
    catch (error) {
    console.log(error.message)
    }
  }

return (

<div className="min-h-[80vh] flex items-center justify-center">
  <form onSubmit={onSubmitHandler} className="w-full max-w-md px-10 py-10 border rounded-md space-y-3">

    <input
      type="text"
      name="name"
      value={states.name}
      onChange={onChangeHandler}
      placeholder="Name"
      className="w-full py-3 px-3 rounded border outline-none"
    />

    <input
      type="email"
      name="email"
      value={states.email}
      onChange={onChangeHandler}
      placeholder="Email"
      className="w-full py-3 px-3 rounded border outline-none"
    />

    <input
      type="text"
      name="password"
      value={states.password}
      onChange={onChangeHandler}
      placeholder="Password"
      className="w-full py-3 px-3 rounded border outline-none"
    />

    <select
      name="ac_type"
      value={states.ac_type}
      onChange={onChangeHandler}
      className="w-full py-3 px-3 rounded border outline-none"
    >
      <option value="">Select Account Type</option>
      <option value="saving">Saving</option>
      <option value="current">Current</option>
    </select>

    <button
  type="submit"
  className="w-full py-4 text-lg bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
>
  Login
</button>


  </form>
</div>

  )
}
    
export default LoginPage