"use client"
import { FaRegCreditCard } from "react-icons/fa6";
import { LuWallet } from "react-icons/lu";
import { PiHandCoins } from "react-icons/pi";
import Link from "next/link";
import HeaderName from "@/components/HeaderName";
import { useMainContext } from "@/context/MainContext";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";

const Homepage = () => {

  const {user} = useMainContext()
  const dashboard_data = [
    {
      title: "Amount",
      Icon: <LuWallet className="text-4xl text-yellow-400" />,
      value: `₹${user?.amount}`,
      mask: "₹XXXX",
      link: "/amount",
    },
    {
      title: "Fixed Deposit",
      Icon: <PiHandCoins className="text-4xl text-sky-700" />,
      value: 0,
      mask: "₹XXXX",
      link: "/fd-amount",
    },
    {
      title: "ATM Cards",
      Icon: <FaRegCreditCard className="text-4xl" />,
      value: 0,
      mask: "XX",
      link: "/atm-cards",
    },
  ];


  return (
    <div className="container py-10">
      <div className="flex flex-col gap-y-4">
        <HeaderName />
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-3">
          {dashboard_data.map((cur, i) => {
            return <DashboardCard data={cur} key={i} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Homepage;

const DashboardCard = ({ data }) => {
    const [isShow, setIsShow] = useState(false)

  return (
    <Link
      href={data.link}
      className="flex items-center justify-between border rounded py-5 px-10"
    >
      {data.Icon}
      <div className="flex flex-col gap-y-2 justify-end">
        <p className="text-xl font-semibold">{data.title}</p>
        <div className="flex items-center justify-end gap-x-2">
          <h1 className="text-2xl font-semibold tabular-nums min-w-[90px] text-right">
            {isShow ? data.value : data.mask}
          </h1>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsShow(!isShow);
            }}
            className="text-2xl text-black flex items-center justify-center w-8 h-8 cursor-pointer"
          >
            {isShow ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>
        </div>
      </div>
    </Link>
  );
};
