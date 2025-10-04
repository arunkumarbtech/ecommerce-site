import { useEffect, useState } from "react";
import axios from "axios";
import api, { BASE_URL } from "../api/api";

export default function ReviewSection({ productId }) {
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    // Fetch reviews for product
    const fetchReviews = async () => {
        try {
            const res = await api.get(`/reviews/${productId}`);
            setReviews(res.data);
        } catch (err) {
            console.error("Error fetching reviews:", err);
        }
    };

    // Submit a review
    const handleSubmit = async () => {
        if (!rating || !comment.trim()) return alert("Provide rating & comment");

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
            await api.post(`/reviews`, {product_id: productId,rating,comment},config);
            setComment("");
            setRating(0);
            fetchReviews();
        } catch (err) {
            console.error("Error submitting review:", err);
        }
    };

    // Fetch reviews on component mount
    useEffect(() => {
        fetchReviews();
    }, []);

    return (
        <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>

            {/* Review Form */}
            <div className="mb-6 p-4 border rounded-[12px] shadow-sm">
                <div className="flex gap-1 text-2xl mb-2 cursor-pointer">
                    {[1, 2, 3, 4, 5].map(star => (
                        <span
                            key={star}
                            onClick={() => setRating(star)}
                            className={star <= rating ? "text-yellow-400" : "text-gray-300"}
                        >
                            ★
                        </span>
                    ))}
                </div>
                <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    rows={3}
                    placeholder="Write your review..."
                    className="w-full p-2 border rounded-[10px] focus:ring-2 focus:ring-[#0493fb]"
                />
                <button
                    onClick={handleSubmit}
                    className="mt-2 px-4 py-2 bg-[#0493fb] text-white rounded-[10px] hover:bg-[#000060] transition"
                >
                    Submit
                </button>
            </div>

            {/* Existing Reviews */}
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
                {reviews.map((review, idx) => (
                    <div key={idx} className="p-3 border rounded-[10px] bg-gray-50 shadow-sm">
                        <div className="flex justify-between mb-1">
                            <span className="font-semibold">{review.user}</span>
                            <span className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex text-yellow-400 mb-1">
                            {"★".repeat(review.rating)}
                            <span className="text-gray-300">{"★".repeat(5 - review.rating)}</span>
                        </div>
                        <p className="text-gray-700 text-sm">{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
