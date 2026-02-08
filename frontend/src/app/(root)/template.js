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
    return (
      <>
        <MenuItem
          style={{
            background: pathname === link ? "#155dfc" : "#ffff",
            color: pathname === link ? "white" : "black",
            borderRadius: pathname === link ? "10px" : "0px",
          }}
          icon={<Icon className="text-2xl" />}
          component={<Link href={link} />}
        >
          {" "}
          {text}{" "}
        </MenuItem>
      </>
    );
  };

  return (
    <>
      <section className="flex item-start">
        <Sidebar
          breakPoint="lg"
          toggled={isToggled}
          onBackdropClick={() => dispatch(setIsToggled())}
        >
          <Menu className="!bg-white !min-h-screen lg:!min-h-[90vh] px-3 py-3">
            <CustomMenu link={"/"} text={"Home"} Icon={MdDashboard} />
                        <CustomMenu link={"/amount"} text={"Funds"} Icon={GrCurrency} />
            <CustomMenu link={"/profile"} text={"Profile"} Icon={LuSquareUser} />

          </Menu>
        </Sidebar>
        <main className="px-1 md:px-3 w-full">{children}</main>
      </section>
    </>
  );
}

export default RootTemplate