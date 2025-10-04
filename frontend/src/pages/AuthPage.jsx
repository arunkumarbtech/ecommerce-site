import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

export default function AuthPage() {
    const { sendOtp, verifyOtp, completeProfile } = useContext(UserContext);
    const [step, setStep] = useState(1);
    const [number, setNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');
    const navigate = useNavigate();

    const handleGetOtp = async () => {
        if (number.length !== 10) {
            alert("Enter valid number");
            return;
        }
        await sendOtp(number);
        setStep(2);
    };

    const handleVerifyOtp = async () => {
        const res = await verifyOtp(number, otp);
        if (res.needProfile) {
            setStep(3);
        } else if (res.success) {
            navigate("/");
        }
    };

    const handleCompleteProfile = async () => {
        const success = await completeProfile(number, username, email, dob);
        if (success) navigate("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[linear-gradient(45deg,#0493fb,#54a0ff)] p-4">
            <div className="auth-container bg-white shadow-xl rounded-2xl w-full max-w-md p-6 space-y-6">

                {step === 1 && (
                    <div className="space-y-4 ">
                        {/* Heading */}
                        <h2 className="text-3xl mb-3 font-bold text-gray-800 text-center">Login / Signup</h2>

                        {/* Input with label */}
                        <div className="flex flex-col">
                            <label htmlFor="number" className="mb-2.5 text-gray-700 font-medium">
                                Enter Mobile Number
                            </label>
                            <input
                                id="number"
                                type="text"
                                value={number}
                                onChange={e => setNumber(e.target.value)}
                                placeholder="Mobile Number"
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0493fb] focus:outline-none"
                            />
                        </div>

                        {/* Button */}
                        <button
                            onClick={handleGetOtp}
                            className="w-full py-2 mt-2.5 rounded-xl text-white transition-colors duration-300 bg-[#0493fb] hover:bg-[#000060]"
                        >
                            Continue
                        </button>

                    </div>

                )}

                {step === 2 && (
                    <div className="space-y-4">
                        {/* Heading */}
                        <h2 className="text-3xl font-bold text-gray-800 text-center">Enter OTP</h2>

                        {/* Input with label */}
                        <div className="flex flex-col">
                            <label htmlFor="otp" className="mb-2 text-gray-700 font-medium">
                                Enter OTP
                            </label>
                            <input
                                id="otp"
                                type="text"
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                placeholder="OTP"
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0493fb] focus:outline-none"
                            />
                        </div>

                        {/* Button */}
                        <button
                            onClick={handleVerifyOtp}
                            className="w-full py-2 mt-3 rounded-xl text-white transition-colors duration-300 bg-[#0493fb] hover:bg-[#000060]"
                        >
                            Verify OTP
                        </button>
                    </div>

                )}

                {step === 3 && (
                    <div className="space-y-4">
                        {/* Heading */}
                        <h2 className="text-3xl font-bold text-gray-800 text-center">Complete Profile</h2>

                        {/* Username Input */}
                        <div className="flex flex-col">
                            <label htmlFor="username" className="mb-2 text-gray-700 font-medium">
                                Username
                            </label>
                            <input
                                id="username"
                                placeholder="Username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                        </div>

                        {/* Email Input */}
                        <div className="flex flex-col">
                            <label htmlFor="email" className="mb-2 text-gray-700 font-medium">
                                Email
                            </label>
                            <input
                                id="email"
                                placeholder="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                        </div>

                        {/* DOB Input */}
                        <div className="flex flex-col">
                            <label htmlFor="dob" className="mb-2 text-gray-700 font-medium">
                                Date of Birth
                            </label>
                            <input
                                id="dob"
                                type="date"
                                placeholder="DOB"
                                value={dob}
                                onChange={e => setDob(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleCompleteProfile}
                            className="w-full py-2 mt-3 rounded-xl text-white transition-colors duration-300 bg-[#0493fb] hover:bg-[#000060]"
                        >
                            Submit
                        </button>
                    </div>

                )}
            </div>
        </div>

    );
}
