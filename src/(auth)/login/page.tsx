"use client"

import React,{useState} from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "@/store/Auth";

export default function Login() {
    const router = useRouter();
    const {login} = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        
        // collect the data
        const formData = new FormData()
        const email = formData.get("email")
        const password = formData.get("password")

        // validate form
        if(!email || !password) {
            setError("Please fill all the fields")
            return
        }
        // call the store
        try {
            const loginResponse = await login(email as string, password as string)
            if(loginResponse.error) {
                setError(loginResponse.error?.message)
                return 
            }
            router.push('/')
        } catch (error) {
            console.log("Error in login : ", error);   
        }
        finally{
            setIsLoading(false)
        }
    }

    return (
        <>
        <h1>This is the login page </h1>
        </>
    )
}