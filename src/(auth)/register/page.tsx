"use client"

import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "@/store/Auth";

export default function Register() {
    const router = useRouter();

    const { createAccount, login } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        // collect the data
        const formData = new FormData(e.currentTarget)
        const firstName = formData.get("firstName")
        const lastName = formData.get("lastName")
        const email = formData.get("email")
        const password = formData.get("password")

        // validate the form
        if (!firstName || !lastName || !email || !password) {
            setError("Please fill all the fields");
            return;
        }

        // call the store
        try {
            const response = await createAccount(email as string, password as string, `${firstName} ${lastName}`);
            if (response.success) {
                // router.push("/login"); // redirect to the login page
                // make it login automatically on signup
                try {
                    const loginResponse = await login(email as string, password as string)
                    if (loginResponse.success) {
                        router.push('/')
                        return
                    } else {
                        setError(() => loginResponse.error?.message || "Failed to login after creating account")
                    }
                } catch (error: any) {
                    console.log("Failed to login after creating account : ", error)
                }
            } else {
                setError(response.error?.message ?? "Something went wrong")
            }
        } catch (error) {
            console.log("Error in calling to api for creating account : ", error);
            setError("Something went wrong in calling the api")
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <h1>This is the Register page</h1>
        </>
    )
}
