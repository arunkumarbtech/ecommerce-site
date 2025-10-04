import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../contexts/CartContext";
import { ProductContext } from "../contexts/ProductContext";
import { UserContext } from "../contexts/UserContext";
import { PiHeartBold, PiHeartFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import api, { BASE_URL } from "../api/api";

export default function ProductCard({ product }) {
    const { favorites } = useContext(UserContext);
    const { toggleWishlist, fetchSingleProduct } = useContext(ProductContext);
    const { items, removeItems, addtocart } = useContext(CartContext);
    const navigate = useNavigate();

    const cartitem = items.find(item => item.product_id === product.product_id);
    const isFavorite = favorites.some(item => item.product_id === product.product_id);

    // handle multiple images
    const images = Array.isArray(product.image_path) ? product.image_path : [product.image_path];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        if (images.length > 1) {
            const interval = setInterval(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [images.length]);

    const handleSingleProduct = async () => {
        await fetchSingleProduct(product.product_id);
        navigate(`/product/${product.product_id}`);
    };

    const handleToggle = () => {
        toggleWishlist(product);
    };

    return (
        <div className="w-72 bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
            <div className="cursor-pointer relative h-48 w-full overflow-hidden flex items-center justify-center bg-gray-100">
                <img
                    src={`${BASE_URL}${images[currentImageIndex]}`}
                    alt={product.product_name}
                    className="h-full object-contain transition-transform duration-300 ease-in-out hover:scale-115"
                />
                <div
                    className="absolute top-2 right-2 text-[#0493fb] text-2xl cursor-pointer"
                    onClick={handleToggle}
                >
                    {isFavorite ? <PiHeartFill /> : <PiHeartBold />}
                </div>
            </div>

            <div className="p-3">
                <h2
                    onClick={handleSingleProduct}
                    className="text-lg font-semibold text-gray-800 truncate cursor-pointer"
                >
                    {product.product_name}
                </h2>
                <p className="text-sm text-gray-500">{product.brand}</p>
                <div className="mt-2 flex items-center space-x-2">
                    <span className="text-xl font-bold text-[#000060]">
                        ₹{Number(product.price) % 1 === 0
                            ? Number(product.price)
                            : Number(product.price).toFixed(2)}
                    </span>
                    {product.discount > 0 && (
                        <>
                            <span className="text-sm line-through text-gray-400">
                                ₹{parseInt(product.mrp)}
                            </span>
                            <span className="text-sm text-green-600 font-semibold">
                                {parseInt(product.discount)}% off
                            </span>
                        </>
                    )}
                </div>
                <p
                    className={`mt-2 text-sm font-medium ${product.stock_quantity > 0 ? "text-green-600" : "text-red-500"
                        }`}
                >
                    {product.stock_quantity === 0
                        ? "Out of Stock"
                        : product.stock_quantity <= 10
                            ? `Only ${product.stock_quantity} left in stock`
                            : "In Stock"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                    {product.category} › {product.title_id}
                </p>

                <div className="mt-4 flex items-center justify-center space-x-2">
                    {cartitem ? (
                        <>
                            <button
                                onClick={() => removeItems(product.product_id)}
                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#0493fb] text-white hover:bg-[#000060] text-2xl font-bold"
                            >
                                −
                            </button>
                            <span className="w-12 mx-2 h-10 flex items-center justify-center rounded-lg border bg-white shadow-sm font-medium">
                                {cartitem.quantity}
                            </span>
                            <button
                                onClick={() => addtocart(product.product_id)}
                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#0493fb] text-white hover:bg-[#000060] text-2xl font-bold"
                            >
                                +
                            </button>
                        </>
                    ) : (
                        <button
                            disabled={product.stock_quantity === 0}
                            onClick={() => addtocart(product.product_id)}
                            className={`${product.stock_quantity > 0
                                    ? " bg-[#0493fb] text-white font-medium hover:bg-[#000060] transition "
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                } flex-1 py-2 rounded-lg`}
                        >
                            Add to Cart
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
