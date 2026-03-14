import React from 'react'
import moment from 'moment'
import { txn_type } from '@/utils/constant'
const TableCard = ({id,data:Datas}) => {

        const data = Datas.type=='credit'?txn_type.Credit : Datas.type=='debit' ?txn_type.Debit:txn_type.fix_deposit

  return (
    <>
        <tr className={` border-b bg-white border-gray-50 `}>
        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
          {Datas._id}  
        </th>
        <td className="px-6 py-4">
       <span title={data.desc} className={` px-5 py-1 border rounded ${data['bg-color']} ${data.color}`}>{data.name}</span>
        </td>
        <td className="px-6 py-4  ">
            {Datas.amount}
</td>
        <td className="px-6 py-4">
          {moment(Datas.createdAt).format('ll, LT')}
        </td>
        <td
          title={Datas.remark}
          className={`px-4 py-4 hidden max-w-50 truncate lg:table-cell ${Datas.isSuccess?'bg-green-100  border-gray-100 ':'bg-red-100  border-red-100 '}`}
        >
          {Datas.remark}
        </td>
      </tr>
    </>
  )
}

export default TableCard
