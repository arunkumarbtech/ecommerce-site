import React from "react";
import Lottie from "lottie-react";
import success from '../success.json';
export default function SuccessModal() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#0000007e] bg-opacity-40 z-50">
            <div className="bg-white rounded-2xl shadow-xl w-96 p-6 text-center animate-fadeIn">
                <Lottie animationData={success} loop={false} speed={0.5} className="w-40 h-40 mx-auto" />
                <h2 className="text-[#0493fb] text-2xl font-semibold mb-2">Order Placed!</h2>
                <p className="text-[#0493fb] font-semibold mb-6">
                    Your order has been placed successfully.
                </p>
            </div>
        </div>
    )
}