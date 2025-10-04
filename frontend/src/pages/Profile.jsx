import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import Loading from "../components/Loading";
import { OrderContext } from "../contexts/OrderContext";
// import ChatBox from "../components/ChatBox";
import { FaPlus } from "react-icons/fa6";
import { FaArrowDown } from "react-icons/fa";
import api, { BASE_URL } from "../api/api";


export default function Profile() {
    const {
        favorites,
        addAddress,
        loadingUser,
        loggedInUser,
        updateUser,
        logOut,
        editAddress,
        deleteAddress,
        activeSession,
        setActiveSession,
        userAddresses,
    } = useContext(UserContext);

    const { addtocart, addtofavorites } = useContext(CartContext);
    const {
        orderedList,
        downloadInvoice
    } = useContext(OrderContext);
    const navigate = useNavigate();

    // User State
    const [id, setId] = useState("");
    const [username, setUsername] = useState("");
    const [number, setNumber] = useState("");
    const [email, setEmail] = useState("");


    // Address Modal States
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [addressName, setAddressName] = useState("");
    const [addressNumber, setAddressNumber] = useState("");
    const [address, setAddress] = useState("");
    const [addressId, setAddressId] = useState("");

    // Image index for carousels
    const [orderImageIndexes, setOrderImageIndexes] = useState({});
    const [favImageIndexes, setFavImageIndexes] = useState({});


    // Populate user data
    useEffect(() => {
        if (loggedInUser) {
            setId(loggedInUser.id || "");
            setUsername(loggedInUser.username || "");
            setNumber(loggedInUser.number || "");
            setEmail(loggedInUser.email || "");
        }
    }, [loggedInUser]);

    // Redirect if user not logged in
    useEffect(() => {
        if (!loadingUser && !loggedInUser) navigate("/");
    }, [loadingUser, loggedInUser, navigate]);

    // Logout
    const logoutProfile = () => {
        logOut();
        navigate("/");
    };

    // Handle address save
    const handleSaveAddress = (name, number, address, id) => {
        if (isEditMode) {
            editAddress(name, number, address, id);
        } else {
            addAddress(name, number, address);
        }
        setAddress("");
        setAddressName("");
        setAddressNumber("");
        setIsEditMode(false);
        setShowAddressModal(false);
    };

    const handleAddressDelete = (addId) => deleteAddress(addId);

    const handleEditAddress = (addId) => {
        const addr = userAddresses.find((user) => user.address_id === addId);
        if (!addr) return;
        setAddress(addr.address);
        setAddressName(addr.name);
        setAddressNumber(addr.mobile_number);
        setAddressId(addr.address_id);
        setIsEditMode(true);
        setShowAddressModal(true);
    };

    // Modals
    const openModal = (order) => setSelectedOrder(order);
    const closeModal = () => setSelectedOrder(null);

    // Order image carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setOrderImageIndexes((prev) => {
                const newIndexes = { ...prev };
                orderedList?.forEach((order) => {
                    order.items.forEach((item) => {
                        let imagesArray = [];
                        try {
                            imagesArray = Array.isArray(item.product.image_path)
                                ? item.product.image_path
                                : JSON.parse(item.product.image_path || "[]");
                        } catch {
                            imagesArray = [];
                        }
                        if (!imagesArray.length) return;
                        const key = item.order_item_id;
                        newIndexes[key] = ((prev[key] ?? 0) + 1) % imagesArray.length;
                    });
                });
                return newIndexes;
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [orderedList]);

    // Favorite image carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setFavImageIndexes((prev) => {
                const newIndexes = { ...prev };
                favorites?.forEach((fav) => {
                    let imagesArray = [];
                    try {
                        imagesArray = Array.isArray(fav.image_path)
                            ? fav.image_path
                            : JSON.parse(fav.image_path || "[]");
                    } catch {
                        imagesArray = [];
                    }
                    if (!imagesArray.length) return;
                    const key = fav.product_id;
                    newIndexes[key] = ((prev[key] ?? 0) + 1) % imagesArray.length;
                });
                return newIndexes;
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [favorites]);

    if (!loggedInUser) return <Loading />;

    const updatedata = { id, username, number, email };

    const handleDownloadInvoice = async (order_id) => {
        downloadInvoice(order_id)
    }

    return (
        <div className="profile-container">
            {/* Sidebar */}
            <div className="profile-element-container">
                <div className="profile-title">{loggedInUser.username}</div>
                <div className="profile-element-box">
                    <div onClick={() => setActiveSession("profile")} className="profile-elements">
                        <i className="fa-solid fa-user element-icon"></i> Profile
                    </div>
                    <div onClick={() => setActiveSession("orders")} className="profile-elements">
                        <i className="fa-solid fa-truck element-icon"></i> My Orders
                    </div>
                    <div onClick={() => setActiveSession("address")} className="profile-elements">
                        <i className="fa-solid fa-location-dot element-icon"></i> Manage Addresses
                    </div>
                    <div className="profile-elements">
                        <i className="fa-solid fa-credit-card element-icon"></i> Payments
                    </div>
                    <div onClick={() => setActiveSession("favorites")} className="profile-elements">
                        <i className="fa-solid fa-heart element-icon"></i> Favorites
                    </div>
                    <hr className="white-line" />
                    <div onClick={() => setActiveSession("support")} className="profile-elements">
                        <i className="fa-solid fa-message element-icon"></i> Customer Support
                    </div>
                    <div onClick={logoutProfile} className="profile-elements">
                        <i className="fa-solid fa-arrow-right-from-bracket element-icon"></i> Logout
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="profile-element-description-container">
                {/* Profile Section */}
                {activeSession === "profile" && (
                    <form className="profile-element-description-box" onSubmit={(e) => { e.preventDefault(); updateUser(updatedata); }}>
                        <div className="description-header-box">
                            <div className="description-header">Edit Profile :</div>
                            <button type="submit" className="profile-save-button">Save Changes</button>
                        </div>
                        <hr className="white-line-description" />
                        <div className="profile-edit-elements">
                            <label htmlFor="userid" className="profile-label">User ID : </label>
                            <input id="userid" value={id} className="profile-input" disabled readOnly style={{ cursor: 'not-allowed' }} />
                        </div>
                        <div className="profile-edit-elements">
                            <label htmlFor="name" className="profile-label">Name : </label>
                            <input id="name" value={username} onChange={(e) => setUsername(e.target.value)} className="profile-input" />
                        </div>
                        <div className="profile-edit-elements">
                            <label className="profile-label">Mobile Number : </label>
                            <input value={number} onChange={(e) => setNumber(e.target.value)} className="profile-input" />
                        </div>
                        <div className="profile-edit-elements">
                            <label className="profile-label">Email : </label>
                            <input value={email} onChange={(e) => setEmail(e.target.value)} className="profile-input" />
                        </div>


                    </form>
                )}

                {/* Orders Section */}
                {activeSession === "orders" && (
                    <form className="profile-element-description-box">
                        <div className="order-title">Orders :</div>
                        <hr className="white-line-description" />
                        {orderedList ? (
                            <div className="orders-list-container">
                                <div className="orders-heading">
                                    <div className="orders-box-heads">Order No</div>
                                    <div className="orders-box-heads">Order Date</div>
                                    <div className="orders-box-heads">Order Status</div>
                                    <div className="orders-box-heads">Payment Status</div>
                                    <div className="orders-box-heads">Details</div>
                                </div>
                                <hr className="white-line-description" />
                                <div className="flex flex-col gap-2.5 overflow-y-auto h-109 scrollbar-hidden">
                                    {orderedList.map(order => (
                                        <div key={order.order_id} className="orders">
                                            <div className="order-number orders-box">#{order.order_id}</div>
                                            <div className="order-date orders-box">
                                                {new Date(order.created_at).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </div>
                                            <div className="orders-box">
                                                <div className={
                                                    order.order_status === 'placed' ? "status-green" :
                                                        order.order_status === 'cancelled' ? "status-red" : "status-yellow"
                                                }>
                                                    {order.order_status}
                                                </div>
                                            </div>
                                            <div className="payment orders-box">
                                                <div className={
                                                    order.payment_status === 'paid' ? "status-green" :
                                                        order.payment_status === 'not paid' ? "status-red" : "status-yellow"
                                                }>
                                                    {order.payment_status}
                                                </div>
                                            </div>
                                            <div className="orders-box">
                                                <div className="more-info" onClick={() => openModal(order)}>
                                                    more info<i className="fa-solid fa-angle-down"></i>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Details Modal */}
                                {selectedOrder && (
                                    <div className="order-modal-overlay" onClick={(e) => {
                                        if (e.target.classList.contains("order-modal-overlay")) closeModal();
                                    }}>
                                        <div className="order-modal">
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <div className="order-details-title">ORDER DETAILS</div>
                                                <div className="order-no-element">Order No: #{selectedOrder.order_id}</div>
                                            </div>
                                            <hr className="white-line-description" />
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <div className="order-details-title">Ordered Items :</div>
                                                <div className="order-no-element">
                                                    {selectedOrder.order_status === 'placed'
                                                        ? <> <i className="fa-regular fa-circle-check green circle-icon"></i><span className="order-place-font green">{selectedOrder.order_status}</span></>
                                                        : <> <i className="fa-solid fa-xmark red circle-icon"></i><span className="order-place-font red">{selectedOrder.order_status}</span></>}
                                                </div>
                                            </div>
                                            <div className="order-modal-container">
                                                <div className="order-orders-list">

                                                    {selectedOrder.items.map(item => {
                                                        const imagesArray = Array.isArray(item.product.image_path)
                                                            ? item.product.image_path
                                                            : JSON.parse(item.product.image_path || '[]');

                                                        const imgIndex = orderImageIndexes[item.order_item_id] ?? 0; // get current index

                                                        return (
                                                            <div key={item.order_item_id} className="order-item">
                                                                <div className="product-image">
                                                                    <img src={`${BASE_URL}${imagesArray[imgIndex]}`} alt={item.product.product_name} />
                                                                </div>
                                                                <div className="product-details">
                                                                    <div className="product-name">{item.product.product_name}</div>
                                                                    <div className="product-id">Category: {item.product.category}</div>
                                                                    <div className="product-meta">
                                                                        <div className="meta-box">Quantity: {item.quantity}</div>
                                                                        <div className="meta-box">Price: ₹{item.price}</div>
                                                                        <div className="meta-box">Order Item ID: {item.order_item_id}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Price & Address */}
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <div className="price-card">
                                                        <h2>Price Details</h2>
                                                        <div className="price-row">
                                                            <span>Price ({selectedOrder.items.length} items)</span>
                                                            <span>₹{selectedOrder.total_amount}</span>
                                                        </div>
                                                        <div className="price-row">
                                                            <span>Discount</span>
                                                            <span style={{ color: 'green' }}>- ₹{(Number(selectedOrder.discount) + Number(selectedOrder.coupon_discount)) || 0}</span>
                                                        </div>
                                                        <div className="price-row">
                                                            <span>Delivery Charges</span>
                                                            <span style={{ color: 'green' }}>{selectedOrder.delivery_fee || 'FREE'}</span>
                                                        </div>
                                                        <div className="price-row total">
                                                            <span>Total Amount</span>
                                                            <span>₹{selectedOrder.final_amount}</span>
                                                        </div>
                                                    </div>

                                                    <div className="address-card">
                                                        <h2>Delivery Address</h2>
                                                        <div className="address-row"><span>Name:</span> {selectedOrder.name}</div>
                                                        <div className="address-row"><span>Mobile:</span> {selectedOrder.mobile_number}</div>
                                                        <div className="address-row"><span>Address:</span> {selectedOrder.address}</div>
                                                    </div>
                                                    <div className="flex justify-center mt-4">
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleDownloadInvoice(selectedOrder.order_id);
                                                            }}
                                                            className="px-4 py-2 bg-[#0493fb] hover:bg-[#000060] w-full text-white rounded-lg shadow-md active:scale-95 transition-all flex justify-center items-center gap-2"
                                                        >
                                                            <FaArrowDown size={20} />
                                                            Download Invoice
                                                        </button>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : <div>No Orders</div>}
                    </form>
                )}

                {/* Address Section */}
                {activeSession === "address" && (
                    <form className="profile-element-description-box">
                        <div className="description-header-box">
                            <div className="description-header">Manage Addresses :</div>
                            <FaPlus
                                size={35}
                                className="address-plus-button"
                                onClick={(e) => { e.preventDefault(); setShowAddressModal(true) }}
                            />
                        </div>
                        <hr className="white-line-description" />
                        {/* Address List */}
                        <div style={{ height: '86%', width: '100%', overflowY: 'auto' }}>
                            {userAddresses && userAddresses.length ? userAddresses.map(add => (
                                <div key={add.address_id} className="profile-edit-element">
                                    <div className="address-box">
                                        <div className="address-element-container">
                                            <div className="address-name-no">
                                                <div className="address-name">{add.name}</div>
                                                <div className="address-name">{add.mobile_number}</div>
                                            </div>
                                            <div className="address-address">{add.address}</div>
                                        </div>
                                        <div className="address-button-container">
                                            <button onClick={(e) => { e.preventDefault(); handleEditAddress(add.address_id); }} className="btn btn-primary address-control-button">Edit</button>
                                            <button onClick={(e) => { e.preventDefault(); handleAddressDelete(add.address_id); }} className="btn btn-primary address-control-button">Delete</button>
                                        </div>
                                    </div>
                                </div>
                            )) : <div>No Saved Addresses</div>}
                        </div>

                        {/* Add/Edit Address Modal */}
                        {showAddressModal && (
                            <div className="modal-overlay">
                                <div className="address-modal-content">
                                    <div className="modal-header">{isEditMode ? "Edit Address" : "Add New Address"}</div>
                                    <div className="address-modal-element">
                                        <input value={addressName} onChange={(e) => setAddressName(e.target.value)} className="address-modal-input" placeholder="Name" />
                                        <input value={addressNumber} onChange={(e) => setAddressNumber(e.target.value)} className="address-modal-input" placeholder="Mobile Number" />
                                    </div>
                                    <div className="address-modal-element">
                                        <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="address-modal-textarea" placeholder="Address" />
                                    </div>
                                    <div className="address-modal-actions">
                                        <button onClick={() => setShowAddressModal(false)} className="btn btn-primary modal-buttons">Cancel</button>
                                        <button onClick={(e) => { e.preventDefault(); handleSaveAddress(addressName, addressNumber, address, addressId); }} className="btn btn-primary modal-buttons">{isEditMode ? "Update" : "Save"}</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                )}

                {/* Favorites Section */}
                {activeSession === "favorites" && (
                    <form className="profile-element-description-box">
                        <div className="description-header-box">
                            <div className="description-header">Favorites :</div>
                        </div>
                        <hr className="white-line-description" />
                        <div style={{ height: '86%', width: '100%', overflowY: 'auto' }}>
                            {favorites && favorites.length ? favorites.map(fav => {
                                const imagesArray = Array.isArray(fav.image_path) ? fav.image_path : JSON.parse(fav.image_path || '[]');
                                const favIndex = favImageIndexes[fav.product_id] ?? 0;

                                return (
                                    <div key={fav.product_id} className="favorite-item-container">
                                        <div className="image-conatainer">
                                            <img className="favorite-image" src={`${BASE_URL}${imagesArray[favIndex]}`} alt={fav.product_name} />
                                        </div>
                                        <div className="favorite-description-container">
                                            <div className="favorite-title-container">
                                                <div className="favorite-title">{fav.product_name}</div>
                                                <div onClick={() => addtofavorites(fav)} className="favorite-delete-icon"><i className="fa-solid fa-trash"></i></div>
                                            </div>
                                            <div className="favorite-description-box">
                                                <div className="favorite-description">{fav.description}</div>
                                                <div className="favorite-category">Category : {fav.category}</div>
                                                <div className="favorite-price-box">
                                                    <div className="favorite-price">₹{fav.price}</div>
                                                    <button onClick={(e) => { e.preventDefault(); addtocart(fav); }} className="btn btn-primary addtocart-fav">Add to cart</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }) : <div>No Favorites</div>}

                        </div>
                    </form>
                )}

                {/* Support Section */}
                {/* {activeSession === "support" && (
                    <form className="profile-element-description-box">
                        <div className="description-header-box">
                            <div className="description-header">Support :</div>
                        </div>
                        <hr className="white-line-description" />
                        <div style={{ height: '86%', width: '100%', overflowY: 'auto' }}>
                            <ChatBox chatId={1} sender="customer" />
                        </div>
                    </form>
                )} */}
            </div>
        </div>
    );
}
