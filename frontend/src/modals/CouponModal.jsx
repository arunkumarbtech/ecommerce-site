import React, { useContext } from "react";
import { CartContext } from "../contexts/CartContext";

export default function CouponModal({ isOpen, onClose, Coupons }) {
    const {applyCoupon} = useContext(CartContext)
    if (!Coupons || !Coupons.coupons) return null;

    const handleApplyCoupon = async(coupon_code)=>{
        applyCoupon(coupon_code);
        onClose();
    }
    
    return (
        <div className={`coupon-order-modal-overlay ${isOpen ? "active" : ""}`}>
            <div className="coupon-order-modal">
                <div>
                    <i
                        style={{ float: 'right', cursor: 'pointer', fontSize: '30px' }}
                        className="fa-solid fa-xmark"
                        onClick={onClose}
                    ></i>
                </div>
                <h4>Available Coupons</h4>
                <hr className="white-line" />
                <div className="coupon-list-container">
                    {Coupons.coupons.map(item => {
                        const formattedDate = new Date(item.valid_to).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        });

                        const subtotal = parseFloat(Coupons.subtotal);
                        const minAmount = parseFloat(item.min_order_amount?.toString().trim() || 0);
                        const isDisabled = subtotal < minAmount;

                        console.log("Subtotal:", subtotal, "Min Amount:", minAmount, "Disabled?", isDisabled);

                        return (
                            <div
                                key={item.coupon_id}
                                className={`coupon-card ${isDisabled ? "disabled" : ""}`}
                                style={{ opacity: isDisabled ? 0.5 : 1 }}
                            >
                                <div className="coupon-header">
                                    <span className="coupon-code">{item.coupon_code}</span>
                                    <span className="coupon-type">
                                        {item.discount_type === "percentage"
                                            ? `${parseFloat(item.discount_value).toFixed(0)}%`
                                            : `FLAT ${parseFloat(item.discount_value).toFixed(0)}`}
                                    </span>
                                </div>
                                <p className="coupon-description">{item.description}</p>
                                <div className="coupon-footer">
                                    <span className="coupon-validity">Valid till: {formattedDate}</span>
                                    <button
                                        className="apply-btn"
                                        disabled={isDisabled}
                                        onClick={()=>{handleApplyCoupon(item.coupon_code)}}
                                        style={{ cursor: isDisabled ? "not-allowed" : "pointer" }}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
