import React, { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import api from "../api/api";
export const CartContext = createContext();
export function CartProvider({ children }) {
    const { loggedInUser } = useContext(UserContext);
    //required states for cartcontext
    const [items, setItems] = useState([]);
    const [priceDetails, setPriceDetails] = useState(null);
    const [appliedCoupon, setAppliedCoupon] = useState(null);


    const fetchCartItems = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
            const res = await api.get(`/cart`, config);
            setItems(res.data);
        } catch (error) {
            console.error("Error while fetching cart items", error);
        }
    }

    useEffect(() => {
        fetchCartItems();
    }, [])

    useEffect(() => {
        fetchCartItems();
    }, [loggedInUser])

    //add to cart
    const addtocart = async (product_id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Login to add products to Cart!!!');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
            const res = await api.post(`/cart/addtocart`, { product_id, quantity: 1 }, config);
            fetchCartItems();
        } catch (error) {
            console.error("Error while adding to cart", error);
        }
    };

    //reduce quantity count
    const removeItems = async (product_id) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-type': 'application/json'
                }
            }
            const res = await api.post(`/cart/removeitem`, { product_id }, config);
            fetchCartItems();
        } catch (error) {
            console.error("Error while removing item", error)
        }
    };

    //empty or clear cart
    const clearCart = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
            const res = await api.delete(`/cart/emptycart`, config);
            fetchCartItems();
        } catch (error) {
            console.error('Error while deleting the items in the cart', error)
        }
    }

    //delete item in the cart
    const deleteItem = async (product_id) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: { product_id }
            }
            const res = await api.delete(`/cart/deleteitem`, config);
            fetchCartItems();
        } catch (error) {
            console.error('Error while deleting the item', error);
        }
    }

    //add item quantity
    const cartCount = () => {
        let quantityCount = 0;
        items.forEach(item => quantityCount += item.quantity)
        return quantityCount;
    }

    const fetchPriceDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await api.get(`/cart/price-details`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            setPriceDetails(res.data.priceDetails);
        } catch (err) {
            console.error("Error fetching price details", err);
        }
    };

    useEffect(() => {
        fetchPriceDetails();
    }, [])

    useEffect(() => {
        fetchPriceDetails();
    }, [items])

    const applyCoupon = async (couponCode) => {
        try {
            const token = localStorage.getItem("token");

            const { data } = await api.post(
                `/coupons/apply-coupon`,
                { coupon_code: couponCode },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setPriceDetails(data.priceDetails);
            setAppliedCoupon(couponCode);
            alert(`Coupon ${couponCode} applied successfully!`);

        } catch (err) {
            console.error(err);
            if (err.response && err.response.data && err.response.data.error) {
                alert(err.response.data.error);
            } else {
                alert("Failed to apply coupon");
            }
        }
    };


    return (
        <CartContext.Provider value={{ appliedCoupon, setAppliedCoupon, applyCoupon, priceDetails, setItems, cartCount, clearCart, items, addtocart, removeItems, deleteItem }}>
            {children}
        </CartContext.Provider>
    );


};