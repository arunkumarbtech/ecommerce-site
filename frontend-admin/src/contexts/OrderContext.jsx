import React, { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import api, { BASE_URL } from "../api/api";
export const OrderContext = createContext();
export default function OrderProvider({ children }) {
    const [allOrders, setAllOrders] = useState([]);
    const [allOrdersKey, setAllOrdersKey] = useState([]);
    const { loggedInUser } = useContext(UserContext);
    const [coupons, setCoupons] = useState([]);

    const fetchAllOrders = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const res = await api.get(`/order/allorders`, config);
            setAllOrders(res.data);
            setAllOrdersKey(Object.keys(res.data[0]));
        } catch (error) {
            console.error("Error while getting orders", error)
        }
    }

    useEffect(() => {
        fetchAllOrders();
    }, [])

    useEffect(() => {
    }, [loggedInUser])


    const fetchCoupons = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
            const res = await api.get(`/coupons`, config);
            setCoupons(res.data);
        } catch (error) {
            console.error('Error while fetching coupons', error)
        }
    }

    useEffect(() => {
        fetchCoupons();
    }, [])
    return (
        <OrderContext.Provider value={{
            coupons,
            allOrdersKey,
            allOrders
        }}>
            {children}
        </OrderContext.Provider>
    )
}