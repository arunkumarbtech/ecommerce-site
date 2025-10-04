import React, { useEffect, useState } from "react";
import api, { BASE_URL } from "../api/api";
const ImageSlider = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!images || images.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images]);

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <img
            src={`${BASE_URL}${images[currentIndex]}`}
            alt="Product"
            className="w-16 h-16 object-contain rounded"
        />
    );
};

export default ImageSlider;
