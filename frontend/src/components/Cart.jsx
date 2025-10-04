import React, { useContext, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import CouponModal from "../modals/CouponModal";
import { OrderContext } from "../contexts/OrderContext";
import ImageSlider from "./ImageSlider";

export default function Cart() {
    const { loggedInUser } = useContext(UserContext);
    const [toggleCouponModal, setToggleCouponModal] = useState(false);
    const { deleteItem, clearCart, items, removeItems, addtocart, priceDetails, appliedCoupon, setAppliedCoupon } = useContext(CartContext);
    const { coupons } = useContext(OrderContext);
    const navigator = useNavigate();

    //display discount
    const displayDeliveryFee = (priceDetails.deliveryFee === 0) ? <span style={{ color: '#18f718', textShadow: '4px 4px 3px rgba(0, 0, 0, 0.3)' }}>Free</span > : <span>₹{priceDetails.deliveryFee}</span>;

    const gotoOrderSummary = () => {
        if (loggedInUser) {
            navigator('/ordersummary');
        } else {
            navigator('/login');
        }
    }
    return (
        <div className="cart-box">
            <div className="flex">
                <h2 className="cart-title">Cart</h2>
                <div className="clear-cart" onClick={() => clearCart()}><i class="fa-solid fa-trash"></i></div>
            </div>
            {items.length == 0 ?
                <>
                    <div className="empty-cart-image" style={{ marginTop: '30%' }}>
                        <i class="fa-solid fa-cart-shopping" />
                    </div>
                    <div className="cart-empty-note">Cart is Empty</div>
                </>
                :
                <>
                    <div style={{ overflowY: 'auto' }}>
                        {
                            items.map((item, index) => (
                                <div key={index} className="flex items-center justify-between bg-white shadow-sm rounded-lg p-2 mb-2 w-full">
                                    <ImageSlider images={item.image_path} />

                                    <div className="flex-1 mx-2">
                                        <h4 className="text-sm font-medium text-gray-800">{item.product_name}</h4>
                                        <p className="text-sm text-gray-600">{item.price} ₹</p>
                                    </div>

                                    <div className="flex items-center">
                                        <button
                                            onClick={() => removeItems(item.product_id)}
                                            className="bg-[#0493fb] text-white text-sm px-2 py-1 rounded hover:bg-[#000060]"
                                        >
                                            -
                                        </button>
                                        <span className="mx-2 text-sm font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => addtocart(item.product_id)}
                                            className="bg-[#0493fb] text-white text-sm px-2 py-1 rounded hover:bg-[#000060]"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div
                                        onClick={() => deleteItem(item.product_id)}
                                        className="text-red-500 text-lg ml-2 cursor-pointer"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </div>
                                </div>

                            ))
                        }
                        {appliedCoupon
                            ?
                            <div className="applied-coupon-box">
                                <div className="applied-code">{appliedCoupon}</div>
                                <button onClick={() => setAppliedCoupon(null)} className="coupon-remove">Remove</button>
                            </div>
                            :
                            <div onClick={() => setToggleCouponModal(prev => !prev)} className="apply-coupon-box">
                                <i class="fa-regular fa-percent"></i>
                                <span>Apply Coupon</span>
                            </div>
                        }
                        <CouponModal isOpen={toggleCouponModal} Coupons={coupons} onClose={() => setToggleCouponModal(false)} />
                        <div className="price-details-constainer">
                            <div className="price-details-header">
                                Price details :
                            </div>
                            <div className="price-details-box">
                                <div className="price-detail-elements">
                                    <div className="price-detail-element-label">Total MRP :</div>
                                    <div className="price-detail-element-prices">₹{priceDetails.subtotal}</div>
                                </div>
                                <div className="price-detail-elements">
                                    <div className="price-detail-element-label">Discount: </div>
                                    <div className="price-detail-element-prices">-₹{(priceDetails.discount + (priceDetails.couponDiscount || 0)).toFixed(2)}</div>
                                </div>
                                <div className="price-detail-elements">
                                    <div className="price-detail-element-label">Delivery Fee : </div>
                                    <div className="price-detail-element-prices">{displayDeliveryFee}</div>
                                </div>
                                <div className="price-detail-elements">
                                    <div style={{ fontWeight: '600', fontSize: '20px' }} className="price-detail-element-label ">Total : </div>
                                    <div style={{ fontWeight: '600', fontSize: '20px' }} className="price-detail-element-prices ">₹{priceDetails.grandTotal} </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="place-order-container">
                        <div className="grand-total-box">
                            <div className="grand-total">
                                ₹{priceDetails.grandTotal}
                            </div>
                            <div className="grand-total-label">
                                Grand Total
                            </div>
                        </div>
                        <div className="place-order-box">
                            <button onClick={gotoOrderSummary} className="place-order-button">
                                Place Order
                            </button>
                            <i class="fa-solid fa-arrow-right place-order-arrow"></i>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}