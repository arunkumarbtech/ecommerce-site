import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

export const CouponContext = createContext();

export default function CouponProvider({ children }) {

    const [showCouponModal, setShowCouponModal] = useState(false);
    const [isEditCoupon, setIsEditCoupon] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [adminCoupons, setAdminCoupons] = useState([]);
    const [adminCouponsKeys, setAdminCouponsKeys] = useState([]);

    const fetchAllCoupons = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const res = await api.get(`/coupons/getallcoupons`, config)
            setAdminCoupons(res.data);
            setAdminCouponsKeys(Object.keys(res.data[0]));
        } catch (error) {
            console.error("Error while fetching Coupons")
        }
    }

    useEffect(() => {
        fetchAllCoupons();
    }, [])

    const addCoupon = async (couponData) => {
        try {
            const token = localStorage.getItem('adminToken');
            await api.post(`/coupons/create`, couponData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            alert("Coupon Added Successfully");
            fetchAllCoupons();
        } catch (error) {
            console.error("Error while adding coupon", error);
        }
    };

    const deleteCoupon = async (coupon_id) => {
        if (!window.confirm("Are you sure you want to delete this Coupon?")) return;
        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await api.delete(`/coupons/delete/${coupon_id}`, config);
            alert("Coupon deleted successfully!");
            fetchAllCoupons();
        } catch (error) {
            console.error("Error deleting coupon", error);
        }
    };

    const updateCoupon = async (coupon) => {
        try {
            const token = localStorage.getItem('adminToken');
            await api.put(
                `/coupons/update/${coupon.coupon_id}`,
                coupon,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            alert("Coupon updated successfully!");
            fetchAllCoupons();
        } catch (error) {
            console.error("Error updating coupon", error);
        }
    };

    const editCoupon = (coupon) => {
        setIsEditCoupon(true);
        setEditingCoupon(coupon);
        setShowCouponModal(true);
    };

    return (
        <CouponContext.Provider
            value={{
                showCouponModal,
                setShowCouponModal,
                addCoupon,
                deleteCoupon,
                updateCoupon,
                isEditCoupon,
                setIsEditCoupon,
                editingCoupon,
                setEditingCoupon,
                editCoupon,
                adminCouponsKeys,
                adminCoupons
            }}
        >
            {children}
        </CouponContext.Provider>
    );
}
