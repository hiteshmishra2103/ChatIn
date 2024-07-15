"use client"

import { useAuthStore } from "../zustand/useAuthStore";
import useMountedStore from "../zustand/useMountedStore";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";    
import Spinner from "./Spinner";
const TopBar = () => {
    const router = useRouter();
    const { authName } = useAuthStore();
    const { isMounted } = useMountedStore();
    const updateAuthName = useAuthStore((state) => state.updateAuthName);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading state for authName
        const loadAuthName = async () => {
            setLoading(true);
            // Here you might fetch or check for authName from a source if needed
            setLoading(false);
        };

        loadAuthName();
    }, [authName]);

    const handleLogout = async () => {
        try {
            await axios.post('${process.env.NEXT_PUBLIC_BACKEND_HOST}:8081/auth/logout', {}, { withCredentials: true });
            updateAuthName('');
            router.push('/login'); // Redirect after logout
        } catch (error) {
            console.error('Logout failed');
        }
    };

    if (loading) {
        return (
            <nav className="m-auto w-full z-10 sticky flex justify-between items-center p-4 px-6 bg-black shadow-lg top-0">
                <div className="flex items-center space-x-4">
                    <h1 className="text-white text-2xl font-bold">Chatin</h1>
                </div>
                <Spinner />
            </nav>
        );
    }

    if (isMounted) {
        return (
            <nav className="m-auto w-full z-10 sticky flex justify-between items-center p-4 px-6 bg-black shadow-lg top-0">
                <div className="flex items-center space-x-4">
                    <h1 className="cursor-pointer text-white text-2xl font-bold" onClick={() => router.push('/')}>
                        Chatin
                    </h1>
                </div>
                <div className="flex items-center space-x-4">
                    {authName ? (
                        <>
                            <span className="text-white text-lg">Hello, {authName}!</span>
                            <button
                                onClick={handleLogout}
                                className="cursor-pointer px-4 py-2 rounded-full border border-transparent bg-white text-black hover:bg-gray-200 transition-colors duration-200"
                            >
                                Logout
                            </button>
                            <button
                                onClick={() => router.push("/chat")}
                                className='cursor-pointer px-4 py-2 rounded-full border border-transparent bg-white text-black hover:bg-gray-200 transition-colors duration-200'
                            >
                                Chat Now!
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => router.push(`/login`)}
                            className="cursor-pointer px-4 py-2 rounded-full border border-transparent bg-white text-black hover:bg-gray-200 transition-colors duration-200"
                        >
                            Login
                        </button>
                    )}
                </div>
            </nav>
        );
    } else {
        return (
            <nav className="m-auto w-full z-10 sticky flex justify-between items-center p-4 px-6 bg-black shadow-lg top-0">
                <div className="flex items-center space-x-4">
                    <h1 className="text-white text-2xl font-bold">Chatin</h1>
                </div>
            </nav>
        )
    }
};

export default TopBar;
