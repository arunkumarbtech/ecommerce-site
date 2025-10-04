import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineCategory } from "react-icons/md";
import { BiSolidCollection, BiSolidCoupon } from "react-icons/bi";
import { FaClipboardList } from "react-icons/fa";
import { HiOutlineCollection } from "react-icons/hi";
import { FaBoxOpen } from "react-icons/fa6";
import { TbCategory } from "react-icons/tb";
import { BsFillCartCheckFill } from "react-icons/bs";
import { FaUserCircle, FaUserCog, FaUserLock } from "react-icons/fa";
import { UserContext } from "../contexts/UserContext";

export default function Home() {
    const { loggedInUser } = useContext(UserContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (!loggedInUser) {
            navigate("/auth"); 
        }
    }, [loggedInUser, navigate]);
    const goto = (path) => navigate(path);

    return (
        <div className="container">
            {/* Employees */}
            {loggedInUser?.permissions.includes("view_admins") && (
                <div onClick={() => goto('/admin/employees')} className="Home-icons">
                    <FaUserCircle size={98} /> Employees
                </div>
            )}

            {/* Products */}
            {loggedInUser?.permissions.includes("view_products") && (
                <div onClick={() => goto('/admin/productList')} className="Home-icons">
                    <FaClipboardList size={98} /> Products list
                </div>
            )}

            {/* Orders */}
            {loggedInUser?.permissions.includes("view_orders") && (
                <div onClick={() => goto('/admin/orders')} className="Home-icons">
                    <BsFillCartCheckFill size={98} /> Orders
                </div>
            )}

            {/* Out of Stock */}
            {loggedInUser?.permissions.includes("view_outOfStock_products") && (
                <div onClick={() => goto('/admin/outofstock')} className="Home-icons">
                    <FaBoxOpen size={98} /> Out of Stock Products
                </div>
            )}

            {/* Categories */}
            {loggedInUser?.permissions.includes("view_categories") && (
                <div onClick={() => goto('/admin/CategoriesList')} className="Home-icons">
                    <MdOutlineCategory size={98} /> Categories
                </div>
            )}

            {/* Category Title */}
            {loggedInUser?.permissions.includes("view_category_title") && (
                <div onClick={() => goto('/admin/categorytitle')} className="Home-icons">
                    <TbCategory size={98} /> Category Title
                </div>
            )}

            {/* Collections */}
            {loggedInUser?.permissions.includes("view_collections") && (
                <div onClick={() => goto('/admin/collections')} className="Home-icons">
                    <HiOutlineCollection size={98} /> Collections
                </div>
            )}

            {/* Collection Products */}
            {loggedInUser?.permissions.includes("view_collection_products") && (
                <div onClick={() => goto('/admin/collectionProductList')} className="Home-icons">
                    <BiSolidCollection size={98} /> Collection Products
                </div>
            )}

            {/* Coupons */}
            {loggedInUser?.permissions.includes("view_coupons") && (
                <div onClick={() => goto('/admin/coupons')} className="Home-icons">
                    <BiSolidCoupon size={98} /> Coupons
                </div>
            )}

            {/* Roles */}
            {loggedInUser?.permissions.includes("manage_roles") && (
                <div onClick={() => goto('/admin/roles')} className="Home-icons">
                    <FaUserCog size={98} /> Roles and Permissions
                </div>
            )}

            {/* Permissions */}
            {loggedInUser?.permissions.includes("manage_permissions") && (
                <div onClick={() => goto('/admin/permissions')} className="Home-icons">
                    <FaUserLock size={98} /> Permissions
                </div>
            )}
        </div>
    );
}
