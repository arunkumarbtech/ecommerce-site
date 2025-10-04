import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import Loading from "../components/Loading";
import CouponModal from '../modals/CouponModal';
import { OrderContext } from "../contexts/OrderContext";
import SuccessModal from '../modals/SuccessModal';
import api, { BASE_URL } from "../api/api";
export default function OrderSummary() {
    //using context
    const { loggedInUser, userAddresses, loadingUser } = useContext(UserContext);
    const { items, addtocart, removeItems, clearCart, priceDetails, appliedCoupon, setAppliedCoupon } = useContext(CartContext);
    const { placeOrder, coupons } = useContext(OrderContext);
    const displayDeliveryFee = priceDetails
        ? (priceDetails.deliveryFee === 0
            ? <span style={{ color: '#18f718', textShadow: '4px 4px 3px rgba(0, 0, 0, 0.3)' }}>Free</span>
            : <span>₹{priceDetails.deliveryFee}</span>)
        : <Loading />;
    //required states
    const [selectAddress, setSelectAddress] = useState(null);
    const [selectPaymentType, setSelectPaymentType] = useState(null);
    const [togglePaymentType, setTogglePaymentType] = useState(null);
    const [toggleCouponModal, setToggleCouponModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [imageIndexes, setImageIndexes] = useState({});
    //navigator
    const navigator = useNavigate();
    
    if (loadingUser) {
        return <Loading />;
    }

    useEffect(() => {
        if (!loadingUser) {
            if (!loggedInUser) {
                navigator('/login');
            } else if (Array.isArray(items) && items.length === 0) {
                navigator('/');
            }
        }
    }, [loggedInUser, items, loadingUser, navigator]);


    const handleSelectAddress = (id) => {
        setSelectAddress(id);
    }

    const handlePaymentSelect = (type) => {
        setSelectPaymentType(type);
        setTogglePaymentType(type);
    }

    const address = userAddresses;

    const handlePlaceOrder = async () => {
        if (!selectAddress || !selectPaymentType) {
            alert('SELECT PAYMENT AND ADDRESS');
            return;
        }

        try {
            const response = await placeOrder({
                address_id: selectAddress,
                payment_method: selectPaymentType,
                products: items,
                coupon_code: appliedCoupon,
            });

            if (response) {
                setShowSuccess(true);
            } else {
                alert('Order not placed!!!');
            }
        } catch (error) {
            console.error("Error in handlePlaceOrder:", error);
            alert("Failed to place order");
        }
    };

    useEffect(() => {
        if (showSuccess) {
            const timer = setTimeout(() => {
                clearCart();
                navigator("/");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSuccess, clearCart, navigator]);

    useEffect(() => {
        const interval = setInterval(() => {
            setImageIndexes(prevIndexes => {
                const newIndexes = { ...prevIndexes };
                items.forEach(item => {
                    let imagesArray = [];
                    try {
                        imagesArray = Array.isArray(item.image_path)
                            ? item.image_path
                            : JSON.parse(item.image_path || "[]");
                    } catch {
                        imagesArray = [item.image_path];
                    }
                    if (!imagesArray.length) return;
                    const key = item.product_id;
                    newIndexes[key] = ((prevIndexes[key] ?? 0) + 1) % imagesArray.length;
                });
                return newIndexes;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, [items]);

    return (
        <div className="ordersum-container">
            <div className="order-summary-container">
                <div className='order-summary-title'>
                    Order Summary <span></span>
                </div>
                <hr className='white-line' />
                <div className="select-address-title">
                    Cart Items :
                </div>
                {items &&
                    items.map(item => {
                        let imagesArray = [];
                        try {
                            imagesArray = Array.isArray(item.image_path)
                                ? item.image_path
                                : JSON.parse(item.image_path || "[]");
                        } catch {
                            imagesArray = [item.image_path];
                        }
                        const currentIndex = imageIndexes[item.product_id] || 0;
                        return (
                            <div key={item.product_id} className="summary-cart-item-box">
                                <div className="summary-img-container">
                                    <img
                                        className="summary-img"
                                        src={`${BASE_URL}${imagesArray[currentIndex]}`}
                                        alt={item.product_name}
                                    />
                                </div>
                                <div className="summary-description-box">
                                    <div className="description-summary-container-box">
                                        <div className="summary-item-head">{item.product_name}</div>
                                        <div className="summary-item-description">{item.description}</div>
                                        <div className="summary-item-category">Category : {item.category}</div>
                                        <div className="summary-item-price">Cost : ₹{item.price}</div>
                                    </div>
                                    <div className="summ-buttons">
                                        <div className="summ-increment" onClick={() => addtocart(item.product_id)}>+</div>
                                        <div style={{ fontSize: '15px' }}>{item.quantity}</div>
                                        <div className="summ-increment" onClick={() => removeItems(item.product_id)}>-</div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                <div className='select-address-container'>
                    <div className="select-address-title">
                        Select Address
                    </div>
                    <div className="select-address-box">
                        {address && (address.map(add => (
                            <div key={add.address_id} onClick={() => handleSelectAddress(add.address_id)} className={selectAddress === add.address_id ? 'select-box selected' : 'select-box'}>
                                <div className="select-box-name">{add.name}</div>
                                <div className="select-box-number">{add.mobile_number}</div>
                                <div className="select-box-address">{add.address}</div>
                            </div>
                        )))}
                    </div>
                </div>
                <div className="select-payment-container">
                    <div className="payment-header">
                        Select Payment Type
                    </div>
                    <div className="payment-select-box">
                        <div onClick={() => handlePaymentSelect('UPI')} className={selectPaymentType == 'UPI' ? 'payment-element selected' : 'payment-element'}>
                            UPI
                        </div>
                        <div onClick={() => handlePaymentSelect('CARD')} className={selectPaymentType == 'CARD' ? 'payment-element selected' : 'payment-element'}>
                            Card
                        </div>
                        <div onClick={() => handlePaymentSelect('COD')} className={selectPaymentType == 'COD' ? 'payment-element selected' : 'payment-element'}>
                            Cash on delivery
                        </div>
                    </div>
                    {/* {togglePaymentType == 'UPI' && <div className="upi-box">
                        <label className="upi-label">
                            Enter UPI ID :
                        </label>
                        <input type="text" placeholder="Enter UPI Id" className="upi-input" />
                    </div>}
                    {togglePaymentType == 'CARD' && <div className="upi-box">
                        <label className="upi-label">
                            Enter Card Details:
                        </label>
                        <div className="card-card">
                            <label className="card-label">Card Number : </label>
                            <input placeholder="XXXX XXXX XXXX XXXX" type="number" className="card-ac-num" />
                            <div className="expire-cvv">
                                <label className="card-elabel">Valid Upto :</label>
                                <input placeholder="MM/YY" className="card-expire" />
                                <label className="card-elabel">CVV :</label>
                                <input placeholder="CVV" type="number" className="card-expire" />
                            </div>
                        </div>
                    </div>} */}
                </div>
            </div>
            <div className="order-summary-price-container">
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
                <div className="price-details-constainer-summary">
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
                    <div className="place-order-container-summary">
                        <div className="grand-total-box">
                            <div className="grand-total">
                                ₹{priceDetails.grandTotal}
                            </div>
                            <div className="grand-total-label">
                                Grand Total
                            </div>
                        </div>
                        <div className="place-order-box">
                            <button onClick={handlePlaceOrder} className="place-order-button">
                                Make Payment
                            </button>
                            <i class="fa-solid fa-arrow-right place-order-arrow"></i>
                        </div>
                    </div>
                </div>
            </div>
            {showSuccess && <SuccessModal />}
        </div>
    )
}