"use client"

import useMountedStore from "../zustand/useMountedStore";
import { useEffect } from "react";
import { useAuthStore } from "../zustand/useAuthStore";
import { useRouter } from "next/navigation";
import axios from "axios";

const InitUser = () => {
    const updateAuthName = useAuthStore((state) => state.updateAuthName);
    const updateMounted = useMountedStore((state) => state.updateMounted);

    useEffect(() => {
        const init = async () => {
            try {
                console.log("InitUser");
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_HOST}:8081/users/profile`, {
                    withCredentials: true, // Ensure credentials are sent
                });
                console.log(response.data);

                if (response.data) {
                    console.log("InitUser scuess");
                    console.log(response.data.username);
                    updateAuthName(response.data.username); // Update the auth name
                }
            } catch (e) {
                console.error(e.message);
            } finally {
                updateMounted(true); // Update mounted state
            }
        };

        init();

        return () => {
            updateMounted(false); // Optional: Reset mounted state on unmount
        };
    }, [updateMounted, updateAuthName]);

    return null; // No UI to render
};

export default InitUser;
