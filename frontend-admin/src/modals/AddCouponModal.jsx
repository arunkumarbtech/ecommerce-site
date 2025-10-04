import React, { useContext, useEffect, useState } from "react";
import { CouponContext } from "../contexts/CouponContext";

export default function AddCouponModal({ onClose }) {
    const {
        addCoupon,
        updateCoupon,
        isEditCoupon,
        setIsEditCoupon,
        editingCoupon,
        setEditingCoupon
    } = useContext(CouponContext);

    const [formData, setFormData] = useState({
        coupon_code: "",
        description: "",
        discount_type: "percentage",
        discount_value: "",
        min_order_amount: "",
        max_discount_amount: "",
        valid_from: "",
        valid_to: "",
        usage_limit: "",
        status: "active",
    });

    useEffect(() => {
        const formatDate = (dbDate) => {
            if (!dbDate) return "";
            return dbDate.split("T")[0] || dbDate.split(" ")[0];
        };

        if (isEditCoupon && editingCoupon) {
            setFormData({
                ...editingCoupon,
                valid_from: formatDate(editingCoupon.valid_from),
                valid_to: formatDate(editingCoupon.valid_to),
            });
        } else {
            setFormData({
                coupon_code: "",
                description: "",
                discount_type: "percentage",
                discount_value: "",
                min_order_amount: "",
                max_discount_amount: "",
                valid_from: "",
                valid_to: "",
                usage_limit: "",
                status: "active",
            });
        }
    }, [isEditCoupon, editingCoupon]);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditCoupon) {
                await updateCoupon({ ...formData, coupon_id: editingCoupon.coupon_id });
            } else {
                await addCoupon(formData);
            }

            setIsEditCoupon(false);
            setEditingCoupon(null);
            onClose();
        } catch (error) {
            console.error("Failed to save coupon:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
            <div className="bg-gradient-to-tr from-[#0493fb] to-[#000060] text-white rounded-2xl scrollbar-hidden shadow-lg w-[550px] h-[550px] overflow-auto p-6 relative">
                <button
                    className="absolute top-3 right-3 hover:text-red-500"
                    onClick={() => {
                        setIsEditCoupon(false);
                        setEditingCoupon(null);
                        onClose();
                    }}
                >
                    ✕
                </button>

                <h2 className="text-xl font-semibold mb-4">
                    {isEditCoupon ? "Edit Coupon" : "Add Coupon"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-[16px] font-medium mb-1" htmlFor="coupon_code">
                            Coupon Code
                        </label>
                        <input
                            type="text"
                            id="coupon_code"
                            name="coupon_code"
                            value={formData.coupon_code}
                            onChange={handleChange}
                            placeholder="Coupon Code"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-black"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[16px] font-medium mb-1" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Description"
                            className="w-full px-3 mt-2 py-2 rounded-lg border border-gray-300 text-black resize-none"
                            required
                            style={{ resize: "none" }}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[16px] font-medium mb-1" htmlFor="discount_type">
                                Discount Type
                            </label>
                            <select
                                id="discount_type"
                                name="discount_type"
                                value={formData.discount_type}
                                onChange={handleChange}
                                className="px-3 py-2 outline-none rounded-lg border bg-white border-gray-300 text-black w-full"
                            >
                                <option value="percentage">Percentage</option>
                                <option value="flat">Flat</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[16px] font-medium mb-1" htmlFor="discount_value">
                                Discount Value
                            </label>
                            <input
                                type="number"
                                id="discount_value"
                                name="discount_value"
                                value={formData.discount_value}
                                onChange={handleChange}
                                placeholder="Discount Value"
                                className="px-3 py-2 rounded-lg border border-gray-300 text-black w-full"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[16px] font-medium mb-1" htmlFor="min_order_amount">
                                Min Order Amount
                            </label>
                            <input
                                type="number"
                                id="min_order_amount"
                                name="min_order_amount"
                                value={formData.min_order_amount}
                                onChange={handleChange}
                                placeholder="Min Order Amount"
                                className="px-3 py-2 rounded-lg border border-gray-300 text-black w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-[16px] font-medium mb-1" htmlFor="max_discount_amount">
                                Max Discount Amount
                            </label>
                            <input
                                type="number"
                                id="max_discount_amount"
                                name="max_discount_amount"
                                value={formData.max_discount_amount}
                                onChange={handleChange}
                                placeholder="Max Discount Amount"
                                className="px-3 py-2 rounded-lg border border-gray-300 text-black w-full"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[16px] font-medium mb-1" htmlFor="valid_from">
                                Valid From
                            </label>
                            <input
                                type="date"
                                id="valid_from"
                                name="valid_from"
                                value={formData.valid_from}
                                onChange={handleChange}
                                className="px-3 py-2 rounded-lg border border-gray-300 text-black w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-[16px] font-medium mb-1" htmlFor="valid_to">
                                Valid To
                            </label>
                            <input
                                type="date"
                                id="valid_to"
                                name="valid_to"
                                value={formData.valid_to}
                                onChange={handleChange}
                                className="px-3 py-2 rounded-lg border border-gray-300 text-black w-full"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[16px] font-medium mb-1" htmlFor="usage_limit">
                                Usage Limit
                            </label>
                            <input
                                type="number"
                                id="usage_limit"
                                name="usage_limit"
                                value={formData.usage_limit}
                                onChange={handleChange}
                                placeholder="Usage Limit"
                                className="px-3 py-2 rounded-lg border border-gray-300 text-black w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-[16px] font-medium mb-1" htmlFor="status">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="px-3 py-2 bg-white outline-none rounded-lg border border-gray-300 text-black w-full"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="expired">Expired</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditCoupon(false);
                                setEditingCoupon(null);
                                onClose();
                            }}
                            className="px-4 py-2 rounded-lg bg-[#0493fb] hover:bg-red-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-[#0493fb] hover:bg-[#000060]"
                        >
                            {isEditCoupon ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>       
    );
}
