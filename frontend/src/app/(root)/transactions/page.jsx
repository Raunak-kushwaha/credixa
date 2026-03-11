"use client";
import HeaderName from '@/components/HeaderName' 
import React, { Suspense, useEffect, useState } from 'react'


import { toast } from 'react-toastify'
import { axiosClient } from '@/utils/AxiosClient'

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
           <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Filter Transactions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                <select
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-white text-sm"
                >
                  <option value="">All Types</option>
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Min Amount</label>
                <input
                  type="number"
                  name="minAmount"
                  value={filters.minAmount}
                  onChange={handleFilterChange}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Amount</label>
                <input
                  type="number"
                  name="maxAmount"
                  value={filters.maxAmount}
                  onChange={handleFilterChange}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={applyFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition"
              >
                Apply Filters
              </button>
              <button
                onClick={resetFilters}
                className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded transition"
              >
                Reset Filters
              </button>
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
          Date
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