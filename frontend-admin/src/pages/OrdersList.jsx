import React, { useContext, useState } from "react";
import ResizableTable from "../components/ResizableTable";
import { OrderContext } from "../contexts/OrderContext";

export default function OrdersList() {
    const {
        allOrdersKey,
        allOrders
    } = useContext(OrderContext);
    return (
        <>
            <div className="search-container">
                <div className="search-element-container">
                    <div className="search-element-box">
                        <label htmlFor="name" className="search-label">Name : </label>
                        <input className="search-input" name="name" type="text" placeholder="Name" />
                    </div>
                    <div className="search-element-box">
                        <label htmlFor="category" className="search-label">Category : </label>
                        <input className="search-input" name="category" type="text" placeholder="Category" />
                    </div>
                </div>
                <div className="search-btn-container">
                    <button className="admin-search-button">Search</button>
                    <button className="admin-search-button">Clear</button>
                </div>
            </div>
            <div className="add-new-product">
                <i class="fa-solid fa-plus"></i>
                <button
                    className="add-new-product-btn">Add Product</button>
            </div>
            <ResizableTable
                columns={allOrdersKey}
                data={allOrders}
            // onEdit={(product) => editProduct(product)}
            // onDelete={(product) => deleteProduct(product.product_code)}
            />
        </>
    )
}