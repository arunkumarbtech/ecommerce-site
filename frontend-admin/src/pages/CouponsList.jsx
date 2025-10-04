import React, { useContext } from "react";
import AddCouponModal from "../modals/AddCouponModal";
import { CouponContext } from "../contexts/CouponContext";
import ResizableTable from '../components/ResizableTable';
export default function CouponsList() {

    const {
        showCouponModal,
        setShowCouponModal,
        editCoupon,
        deleteCoupon,
        adminCouponsKeys,
        adminCoupons
    } = useContext(CouponContext);

    const data = adminCoupons;
    const columns = adminCouponsKeys;

    return (
        <>
            <div className="search-container">
                <div className="search-element-container">
                    <div className="search-element-box">
                        <label htmlFor="name" className="search-label">Coupon Name : </label>
                        <input className="search-input" name="name" type="text" placeholder="Coupon Name" />
                    </div>

                    <div className="search-element-box">
                        <label htmlFor="coupon_code" className="search-label">Coupon Code : </label>
                        <input className="search-input" name="coupon_code" type="text" placeholder="Coupon Code" />
                    </div>

                    <div className="search-element-box">
                        <label htmlFor="discount_type" className="search-label">Discount Type : </label>
                        <input className="search-input" name="discount_type" type="text" placeholder="Discount Type" />
                    </div>

                    <div className="search-element-box">
                        <label htmlFor="status" className="search-label">Status : </label>
                        <input className="search-input" name="status" type="text" placeholder="Status" />
                    </div>

                    <div className="search-element-box">
                        <label htmlFor="usage_limit" className="search-label">Usage Limit : </label>
                        <input className="search-input" name="usage_limit" type="text" placeholder="Usage Limit" />
                    </div>
                </div>
                <div className="search-btn-container">
                    <button className="admin-search-button">Search</button>
                    <button className="admin-search-button">Clear</button>
                </div>
            </div>
            <div className="add-new-product">
                <i class="fa-solid fa-plus"></i>
                <button onClick={() => setShowCouponModal(true)} className="text-center w-full cursor-pointer text-white">Add Coupons</button>
            </div>
            <ResizableTable
                columns={columns}
                data={data}
                onEdit={(coupon) => editCoupon(coupon)}
                onDelete={(coupon) => deleteCoupon(coupon.coupon_id)}
            />

            {showCouponModal && <AddCouponModal onClose={() => setShowCouponModal(false)} />}
        </>
    )
}