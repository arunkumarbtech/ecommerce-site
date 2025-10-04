import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProductContext } from "../contexts/ProductContext";
import Loading from "../components/Loading";
import { CartContext } from "../contexts/CartContext";
import { PiHeartBold } from "react-icons/pi";
import { PiHeartFill } from "react-icons/pi";
import { UserContext } from "../contexts/UserContext";
import ReviewSection from "../components/ReviewSection";
import api, { BASE_URL } from "../api/api";

export default function ProductPage() {
    const { id } = useParams();
    const { fetchSingleProduct, singleProduct, toggleWishlist } = useContext(ProductContext);
    const { items, removeItems, addtocart } = useContext(CartContext);
    const { favorites } = useContext(UserContext);

    const [currentIndex, setCurrentIndex] = useState(0); // ✅ Hooks at the top

    // Determine images array
    const images = singleProduct
        ? (Array.isArray(singleProduct.image_path)
            ? singleProduct.image_path
            : JSON.parse(singleProduct.image_path || "[]"))
        : [];

    const cartitem = items.find(item => item.product_id == id);
    const isFavorite = favorites.some(item => item.product_id == id);

    useEffect(() => {
        if (!singleProduct || singleProduct.product_id !== parseInt(id)) {
            fetchSingleProduct(id);
        }
    }, [id]);

    const handleToggle = () => toggleWishlist(singleProduct);

    const handlePrev = () => {
        setCurrentIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
    };

    const handleNext = () => {
        setCurrentIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
    };

    if (!singleProduct) return <Loading />;

    const product = singleProduct;
    return (
        <div className="max-w-6xl mx-auto px-4 py-10 bg-white">
            {/* Product Section */}
            <div className="flex flex-col lg:flex-row gap-10">
                {/* Product Image */}
                {/* <div className="relative lg:w-[400px] lg:h-[400px] m-3 cursor-pointer">
                <img
                    src={`${BASE_URL}${product.image_path}`}
                    alt={product.product_name}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105 rounded-[10px] shadow"
                />
                <div
                    className="absolute top-3 right-3 text-[#0493fb] text-2xl cursor-pointer z-50"
                    onClick={handleToggle}
                >
                    {isFavorite ? <PiHeartFill /> : <PiHeartBold />}
                </div>
            </div> */}

                <div className="relative lg:w-[400px] lg:h-[400px] m-3 cursor-pointer">
                    {/* Display current image */}
                    <img
                        src={`${BASE_URL}${images[currentIndex]}`}
                        alt={product.product_name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105 rounded-[10px] shadow"
                    />

                    {/* Wishlist Button */}
                    <div
                        className="absolute top-3 right-3 text-[#0493fb] text-2xl cursor-pointer z-50"
                        onClick={handleToggle}
                    >
                        {isFavorite ? <PiHeartFill /> : <PiHeartBold />}
                    </div>

                    {/* Left & Right Buttons */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={handlePrev}
                                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow text-gray-700"
                            >
                                ◀
                            </button>

                            <button
                                onClick={handleNext}
                                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow text-gray-700"
                            >
                                ▶
                            </button>
                        </>
                    )}

                    {/* Small indicators (dots) */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((_, index) => (
                            <span
                                key={index}
                                className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-[#0493fb]" : "bg-gray-300"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="lg:w-1/2 flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-gray-900 mt-3">{product.product_name}</h1>
                    <p className="text-gray-600">{product.description}</p>

                    <div className="flex flex-wrap gap-3 mt-2">
                        <span className="text-sm text-gray-500">Category: {product.category}</span>
                        <span className="text-sm text-gray-500">Sub-Category: {product.title_id}</span>
                        <span className="text-sm text-gray-500">Brand: {product.brand}</span>
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                        <p className="text-xl font-semibold text-gray-800">₹{product.price}</p>
                        {product.discount >= 0 && (
                            <p className="text-sm text-gray-500 line-through">₹{product.mrp}</p>
                        )}
                        {product.discount > 0 && (
                            <p className="text-sm text-green-600 font-semibold">{product.discount}% Off</p>
                        )}
                    </div>

                    <span className={`font-medium ${product.stock_quantity > 0 ? "text-green-600" : "text-red-600"
                        }`}>
                        {product.stock_quantity === 0
                            ? "Out of Stock"
                            : product.stock_quantity < 5
                                ? `Only ${product.stock_quantity} left in stock`
                                : "In Stock"}
                    </span>
                    {cartitem ? <div className="mt-4 flex items-center gap-3">
                        <button className="w-10 h-10 flex items-center justify-center bg-[#0493fb] text-white rounded-[10px] hover:bg-[#000060] transition" onClick={() => removeItems(product.product_id)}>-</button>

                        <div className="w-12 h-10 flex items-center justify-center bg-gray-100 text-gray-800 rounded-[10px] font-semibold">{cartitem.quantity}</div>

                        <button className="w-10 h-10 flex items-center justify-center bg-[#0493fb] text-white rounded-[10px] hover:bg-[#000060] transition" onClick={() => addtocart(product.product_id)}>+</button>
                    </div>
                        :
                        <button
                            className={`mt-4 w-full py-3 rounded-[10px] font-semibold transition-all duration-300 
                            ${product.stock_quantity > 0
                                    ? "bg-gradient-to-r from-[#0493fb] to-[#54a0ff] text-white hover:from-[#000060] hover:to-[#0073ff] shadow-md hover:shadow-lg"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                            disabled={product.stock_quantity === 0} onClick={() => addtocart(product.product_id)}>Add to Cart</button>}
                </div>
            </div>
            <ReviewSection productId={id} />
        </div>
    );
};

