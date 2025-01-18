"use client"

import { useAuthStore } from "@/store/Auth"
import { useRouter } from "next/router";

import React from 'react'   

const layout = ({children} : {children : React.ReactNode}) => {
    const {session } = useAuthStore();
    const router = useRouter();

    React.useEffect(() => {
        if(session){
            router.push("/");
        } 
    },[session,router])

    if(session) return null;


    return (
        <>
        <h1>This is the layout page </h1>
        </>
    )
}

export default layout