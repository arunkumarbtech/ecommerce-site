import React, { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { CartContext } from "../contexts/CartContext";
import api, { BASE_URL } from "../api/api";
export const OrderContext = createContext();
export default function OrderProvider({ children }) {
    const [orderedList, setOrderedList] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [allOrdersKey, setAllOrdersKey] = useState([]);
    const { loggedInUser } = useContext(UserContext);
    const { items, setAppliedCoupon } = useContext(CartContext)
    const [coupons, setCoupons] = useState([]);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
            const res = await api.get(`/order/orderlist`, config);
            setOrderedList(res.data);
        } catch (error) {
            console.error("Error while getting orders", error)
        }
    }

    const fetchAllOrders = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const res = await api.get(`/order/allorders`, config);
            setAllOrders(res.data);
            setAllOrdersKey(Object.keys(res.data[0]));
        } catch (error) {
            console.error("Error while getting orders", error)
        }
    }

    useEffect(() => {
        fetchOrders();
        fetchAllOrders();
    }, [])

    useEffect(() => {
        fetchOrders();
    }, [loggedInUser])

    const placeOrder = async ({ payment_method, address_id, products, coupon_code }) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
            const res = await api.post(`/order/placeOrder`, { payment_method, address_id, products, coupon_code }, config)
            setOrderedList(res.data)
            setAppliedCoupon(null);
            await fetchOrders();
            return true;
        } catch (error) {
            console.error("Error while placing order", error)
            return false;
        }
    }

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

    useEffect(() => {
        fetchCoupons();
    }, [items])

    
    const downloadInvoice = async (orderId) => {
        try {
            const response = await api.get(`/order/${orderId}/invoice`, {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `invoice_${orderId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Error while Downloading Invoice", error);
        }
    };

    return (
        <OrderContext.Provider value={{
            orderedList,
            placeOrder,
            coupons,
            allOrdersKey,
            allOrders,
            downloadInvoice
        }}>
            {children}
        </OrderContext.Provider>
    )
}