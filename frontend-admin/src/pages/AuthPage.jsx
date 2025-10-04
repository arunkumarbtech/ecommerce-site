import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import background from '../assets/background.jpg';
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
export default function AuthPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { adminlogin } = useContext(UserContext);
    const navigator = useNavigate();

    const handleLogin = async (user) => {
        const success = await adminlogin(user)
        if (success) {
            setUsername('');
            setPassword('');
            navigator('/')
        }
    };

    useEffect(() => {
        setUsername('');
        setPassword('');
    }, [])

    return (
        <div
            className="flex items-center justify-center h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${background})` }}
        >
            {/* Login Card */}
            <div className="w-full max-w-md p-8 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200">
                {/* Title */}
                <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
                    Admin Portal
                </h2>

                {/* Form */}
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin({ username, password })
                }} className="space-y-5">
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0493fb] focus:border-transparent"
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 text-gray-800 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0493fb] focus:border-transparent"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-[#0493fb] to-blue-600 text-white py-3 text-lg font-semibold rounded-xl shadow-md hover:opacity-90 transition"
                    >
                        Login
                    </button>
                </form>

            </div>
        </div>
    );
}

