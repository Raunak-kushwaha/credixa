 "use client"
 import Link from 'next/link'
    import React from 'react'
    import Logo from './reusable/Logo'
import { useMainContext } from '@/context/MainContext'
import { SlMenu } from "react-icons/sl";
import { useDispatch } from 'react-redux'
import { usePathname } from "next/navigation";

import { setIsToggled } from '@/redux/slice/sidebarSlice'


    const Navbar = () => {
  const { user, LogoutHandler } = useMainContext();
  const dispatch = useDispatch();
  const pathname = usePathname();   

  return (
    <header className="w-full border-b rounded-b-md">
      <nav className="w-[98%] lg:w-[80%] mx-auto py-3 flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <button
            onClick={() => dispatch(setIsToggled())}
            className="bg-gray-100 rounded-full p-2 sm:hidden text-xl hover:bg-gray-200 cursor-pointer"
          >
            <SlMenu />
          </button>
          <Logo />
        </div>

        <ul className="flex items-center justify-center gap-x-2">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/services">Services</Link></li>
          <li><Link href="/about">About</Link></li>

          {user ? (
            <li>
              <button
                onClick={LogoutHandler}
                className="bg-white text-rose-700 px-4 py-1 cursor-pointer font-medium rounded"
              >
                Logout
              </button>
            </li>
          ) : (
            pathname !== "/login" && (
              <li>
                <Link href="/login">Login</Link>
              </li>
            )
          )}
        </ul>
      </nav>
    </header>
  );
};


    export default Navbar
