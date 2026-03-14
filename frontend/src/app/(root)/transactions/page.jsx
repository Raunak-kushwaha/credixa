"use client";
import HeaderName from '@/components/HeaderName' 
import React, { Suspense, useEffect, useState } from 'react'

import { toast } from 'react-toastify'
import { axiosClient } from '@/utils/AxiosClient'
import { Filter, Calendar, IndianRupee, Search, X } from "lucide-react";

import MessageShow from './+___components/MessageShow';
import TableCard from './+___components/TableCard';
import Loader from '@/components/Loader';
import Pagination from '@/components/Pagination';

const Transactions = () => {
  const [transactionData, setTransactionData] = useState({ data: [], total: 0, page: 1, limit: 50, totalPages: 0 });
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({
    type: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: ""
  });

  const fetchAllTransaction = async(filterParams = {}, page = 1, limit = 50)=>{
    setLoading(true)
    try {
      const queryParams = new URLSearchParams();
      
      if (filterParams.type) queryParams.append("type", filterParams.type);
      if (filterParams.startDate) queryParams.append("startDate", filterParams.startDate);
      if (filterParams.endDate) queryParams.append("endDate", filterParams.endDate);
      if (filterParams.minAmount) queryParams.append("minAmount", filterParams.minAmount);
      if (filterParams.maxAmount) queryParams.append("maxAmount", filterParams.maxAmount);
      queryParams.append("page", page);
      queryParams.append("limit", limit);

      const response = await axiosClient.get(`/amount/transactions?${queryParams.toString()}`,{
        headers:{
          'Authorization':'Bearer '+ localStorage.getItem("token")
        }
      })
      const data = await response.data 
      setTransactionData(data)

    } catch (error) {
       toast.error(error.response.data.msg || error.message)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchAllTransaction(filters, transactionData.page, transactionData.limit)
  },[])

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    fetchAllTransaction(filters, 1, transactionData.limit);
  };

  const resetFilters = () => {
    setFilters({
      type: "",
      startDate: "",
      endDate: "",
      minAmount: "",
      maxAmount: ""
    });
    fetchAllTransaction({}, 1, transactionData.limit);
  };


  return (
    <>

<div className="container py-10">

           {/* Filters Section */}
           <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6 transition-all">
             <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
               <div className="flex flex-1 flex-wrap items-center gap-3">
                 <div className="flex items-center text-gray-700 mr-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                   <Filter size={16} className="mr-2 text-gray-500" />
                   <span className="font-semibold text-sm">Filters</span>
                 </div>

                 {/* Type Filter */}
                 <div className="relative">
                   <select
                     name="type"
                     value={filters.type}
                     onChange={handleFilterChange}
                     className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm rounded-full focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block w-full pl-4 pr-9 py-1.5 cursor-pointer outline-none transition-shadow hover:border-gray-300"
                   >
                     <option value="">All Types</option>
                     <option value="credit">Credit</option>
                     <option value="debit">Debit</option>
                   </select>
                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                     <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                   </div>
                 </div>

                 {/* Date Range Filter */}
                 <div className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-1.5 transition-shadow hover:border-gray-300 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
                   <Calendar size={15} className="text-gray-400 mr-2" />
                   <input
                     type="date"
                     name="startDate"
                     value={filters.startDate}
                     onChange={handleFilterChange}
                     className="bg-transparent text-sm text-gray-700 outline-none w-32 cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                     aria-label="Start Date"
                   />
                   <span className="text-gray-400 mx-2 text-sm font-medium">to</span>
                   <input
                     type="date"
                     name="endDate"
                     value={filters.endDate}
                     onChange={handleFilterChange}
                     className="bg-transparent text-sm text-gray-700 outline-none w-32 cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                     aria-label="End Date"
                   />
                 </div>

                 {/* Amount Range Filter */}
                 <div className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-1.5 transition-shadow hover:border-gray-300 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
                   <IndianRupee size={15} className="text-gray-400 mr-1" />
                   <input
                     type="number"
                     name="minAmount"
                     value={filters.minAmount}
                     onChange={handleFilterChange}
                     placeholder="Min"
                     className="bg-transparent text-sm text-gray-700 outline-none w-20 appearance-none m-0"
                     aria-label="Min Amount"
                   />
                   <span className="text-gray-400 mx-2 text-sm font-medium">-</span>
                   <input
                     type="number"
                     name="maxAmount"
                     value={filters.maxAmount}
                     onChange={handleFilterChange}
                     placeholder="Max"
                     className="bg-transparent text-sm text-gray-700 outline-none w-20 appearance-none m-0"
                     aria-label="Max Amount"
                   />
                 </div>
               </div>

               <div className="flex items-center gap-2 w-full lg:w-auto">
                 <button
                   onClick={applyFilters}
                   className="flex-1 lg:flex-none flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-5 rounded-full transition-colors text-sm shadow-sm hover:shadow active:scale-95"
                 >
                   <Search size={15} className="mr-1.5" />
                   Search
                 </button>
                 <button
                   onClick={resetFilters}
                   className="flex-1 lg:flex-none flex items-center justify-center bg-white hover:bg-gray-50 text-gray-700 font-medium py-1.5 px-4 rounded-full transition-colors text-sm border border-gray-200 shadow-sm hover:shadow active:scale-95"
                   title="Reset Filters"
                 >
                   <X size={15} className="mr-1" />
                   Clear
                 </button>
               </div>
             </div>
           </div>

<div className="relative overflow-x-auto py-10">
 <div className="px-3">
 <MessageShow/>
 </div>
<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border border-gray-200 rounded-lg overflow-hidden">
    <thead className="text-xs text-gray-700 uppercase bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100">
      <tr>
        <th scope="col" className="px-6 py-3 capitalize">
          Txn ID
        </th>
        <th scope="col" className="px-6 py-3 capitalize">
          Type
        </th>
        <th scope="col" className="px-6 py-3 capitalize ">
          Amount
        </th>
        <th scope="col" className="px-6 py-3 capitalize ">
          Timestamp
        </th>
        <th scope="col" className="px-6 py-3 capitalize hidden lg:block">
          Remark
        </th>
      </tr>
    </thead> 
    <tbody>
    <tr>
      <td colSpan={12}>
      {
        loading && <Loader/>
      }
      </td>
     </tr>
    </tbody>
        <Suspense fallback={<Loader/>}>
      <tbody>
            {
             transactionData.data && transactionData.data.length>0 && transactionData.data.map((cur,i)=>{
                return <TableCard key={i} id={i} data={cur} />
              })
            }
        </tbody>
        </Suspense>
       
  </table>
</div>

            {/* pagination */}
            <Pagination
              page={transactionData.page}
              totalPages={transactionData.totalPages}
              onPageChange={(p) => fetchAllTransaction(filters, p, transactionData.limit)}
            />

            </div>

    </>
  )
}

export default Transactions