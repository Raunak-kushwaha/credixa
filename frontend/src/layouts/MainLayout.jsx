"use client";
import Navbar from '@/components/Navbar'
import { MainContextProvider } from '@/context/MainContext'

import React from 'react'

import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const MainLayout = ({children}) => {
  return (
    
    <MainContextProvider>
    <ToastContainer/>
    <Navbar/>
        {children}
    </MainContextProvider>
    
  )
}

export default MainLayout