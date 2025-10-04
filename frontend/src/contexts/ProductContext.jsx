import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
import { UserContext } from "../contexts/UserContext";
export const ProductContext = createContext();
export default function ProductProvider({ children }) {
    const { favorites, setFavorites, loggedInUser } = useContext(UserContext)
    const [categoryname, setCategoryname] = useState(null);
    const [productsList, setProductsList] = useState([]);
    const [orderedList, setOrderedList] = useState([]);
    const [singleProduct, setSingleProduct] = useState(null);

    const fetchProducts = async () => {
        try {
            const response = await api.get(`/products`);
            setProductsList(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const fetchWishlist = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const res = await api.get(`/wishlist`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFavorites(res.data);
        } catch (err) {
            console.error("Error fetching wishlist:", err);
        }
    };

    const toggleWishlist = async (product) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return alert("Please login to use wishlist");

            const res = await api.post(
                `/wishlist/toggle`,
                { productId: product.product_id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.added) {
                setFavorites((prev) => [...prev, product]);
            } else if (res.data.removed) {
                setFavorites((prev) =>
                    prev.filter((item) => item.product_id !== product.product_id)
                );
            }
            console.log(res.data.message);
        } catch (err) {
            console.error("Error toggling wishlist:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchWishlist();
    }, []);

    useEffect(() => {
        fetchWishlist();
    }, [loggedInUser])

    const placeOrder = async ({ payment_method, address_id, products }) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
            const res = await api.post(`/order`, { payment_method, address_id, products }, config)
            setOrderedList(res.data)
            return true;
        } catch (error) {
            console.error("Error while placing order", error)
            return false;
        }
    }

    const fetchSingleProduct = async (id) => {
        try {
            const response = await api.get(`/products/${id}`);
            setSingleProduct(response.data);
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    };

    return (
        <ProductContext.Provider value={{ fetchSingleProduct, singleProduct, orderedList, placeOrder, favorites, productsList, categoryname, setCategoryname, toggleWishlist }}>
            {children}
        </ProductContext.Provider>
    )
}