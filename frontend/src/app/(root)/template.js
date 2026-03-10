"use client"
import Loader from '@/components/Loader';
import { useMainContext } from '@/context/MainContext';
import { setIsToggled, SidebarSlicePath } from '@/redux/slice/sidebarSlice';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { useDispatch, useSelector } from 'react-redux';
import {MdDashboard} from 'react-icons/md'
import { LuSquareUser } from "react-icons/lu"
import { GrCurrency } from "react-icons/gr";
import { MdOutlineReceiptLong } from "react-icons/md";
import { PiHandCoinsBold } from "react-icons/pi";



const RootTemplate = ({children}) => {
  const { user } = useMainContext()
  const [loading, setLoading] = useState(true)

  const router = useRouter();
  const isToggled = useSelector(SidebarSlicePath)
  const dispatch = useDispatch()

  useEffect(()=>{
    if(!user){
      router.push("/login")

    }else{
      setLoading(false)
    }
  },[user, router, setLoading])

  if(loading){
    return <div className='min-h-screen flex items-center justify-center'>
      <Loader/>
    </div>
  }


  const CustomMenu = ({ link, text, Icon }) => {
    const pathname = usePathname();
    const isActive = pathname === link || (link !== "/" && pathname.startsWith(link));
    return (
      <MenuItem
        style={{
          background: isActive ? "#eef2ff" : "transparent",
          color: isActive ? "#4f46e5" : "#374151",
          borderRadius: "8px",
        }}
        className="!mb-1"
        icon={<Icon className={isActive ? "text-indigo-600" : "text-gray-500"} style={{ fontSize: "1.125rem" }} />}
        component={<Link href={link} />}
      >
        {text}
      </MenuItem>
    );
  };

  return (
    <section className="flex min-h-screen">
      <Sidebar
        breakPoint="lg"
        toggled={isToggled}
        onBackdropClick={() => dispatch(setIsToggled())}
        className="!border-r !border-gray-200"
      >
        <Menu className="!bg-white !min-h-screen !border-0 px-3 py-4">
            <CustomMenu link={"/"} text={"Home"} Icon={MdDashboard} />
            <CustomMenu link={"/amount"} text={"Funds"} Icon={GrCurrency} />
            <CustomMenu
              link={"/transactions"}
              text={"Transactions"}
              Icon={MdOutlineReceiptLong}
            />
            <CustomMenu
              link={"/fd-amount"}
              text={"Fix Deposit"}
              Icon={PiHandCoinsBold}
            />

            <CustomMenu
              link={"/profile"}
              text={"Profile"}
              Icon={LuSquareUser}
            />
          </Menu>
      </Sidebar>
      <main className="flex-1 px-4 py-4 md:px-6">{children}</main>
    </section>
    
  );
}

export default RootTemplate