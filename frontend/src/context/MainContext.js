"use client"
import Loader from "@/components/Loader";
import { axiosClient } from "@/utils/AxiosClient";
import { toast } from "react-toastify";

// const { createContext, useContext, useState} = require("react");
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";


const mainContext = createContext({user: {}, role: null, fetchUserProfile (){}, LogoutHandler(){} });

export const useMainContext = () => useContext(mainContext)

export const MainContextProvider = ({children}) => {

    const [user, setUser] = useState(null)
    const [role, setRole] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const fetchUserProfile = async() => {
        try {
            const token = localStorage.getItem("token") || ''
            let storedRole = localStorage.getItem("role") || null
            if (!token) return

        
            const response = await axiosClient.get('/auth/profile', {
                headers: {
                    Authorization: 'Bearer '+ token
                }
            })

            const data = await response.data;
            console.log(data);
            setUser(data)
            
            // Get role from profile response if available, otherwise use stored role
            if (data.role) {
                storedRole = data.role;
                localStorage.setItem("role", data.role);
            }
            
            setRole(storedRole)
        }
        catch (error) {
            toast.error(error.response?.data?.msg || 'Failed to fetch user profile')
        }
        finally {
            setLoading(false);
        }   
     }



        const LogoutHandler = () => {
            router.push("/login")
            localStorage.removeItem("token")
            localStorage.removeItem("role")
            setUser(null)
            setRole(null)
             toast.success("Logged out successfully")
        }


        useEffect(() => {
            fetchUserProfile()
        }, [])


        if(loading) {
            return <div className="min-h-screen flex items-center justify-center w-full">
             <Loader />
            </div>
        }

        return (
            <mainContext.Provider value={{user, role, fetchUserProfile, LogoutHandler}}  >
                {children}
            </mainContext.Provider>
        )
}

