import React, { useContext, useState } from "react";
import ResizableTable from "../components/ResizableTable";
import AddProductModal from "../components/AddProductModal";
import { ProductListContext } from "../contexts/ProductListContext";

export default function ProductsList() {
    const {
        editProduct,
        deleteProduct,
        showAddProductModal,
        setFormData,
        setIsEditProduct,
        setShowAddProductModal,
        products,
        productKeys
    } = useContext(ProductListContext);
    const columns = productKeys;
    const data = products;
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
                    <div className="search-element-box">
                        <label htmlFor="subCategory" className="search-label">Sub Category : </label>
                        <input className="search-input" name="subCategory" type="text" placeholder="Sub Category" />
                    </div>
                    <div className="search-element-box">
                        <label htmlFor="Category" className="search-label">Category : </label>
                        <input className="search-input" name="Category" type="text" placeholder="Category" />
                    </div>
                    <div className="search-element-box">
                        <label htmlFor="stock" className="search-label">Stock : </label>
                        <input className="search-input" name="stock" type="text" placeholder="Stock" />
                    </div>
                    <div className="search-element-box">
                        <label htmlFor="brand" className="search-label">Brand : </label>
                        <input className="search-input" name="brand" type="text" placeholder="Brand" />
                    </div>
                </div>
                <div className="search-btn-container">
                    <button className="admin-search-button">Search</button>
                    <button className="admin-search-button">Clear</button>
                </div>
            </div>
            <div className="add-new-product">
                <i class="fa-solid fa-plus"></i>
                <button onClick={(e) => {
                    e.preventDefault();
                    setIsEditProduct(false);
                    setShowAddProductModal((prev) => !prev)
                    setFormData({
                        name: "",
                        description: "",
                        category_id: "",
                        brand: "",
                        productCode: "",
                        price: 0,
                        stockQuantity: 0,
                        status: "",
                        mrp: 0,
                        discount: 0,
                        imagePath: "",
                        collection_id: "",
                        alt_tag: "",
                        bestseller: false,
                        title_id: ""
                    });
                    setFile(null);
                    setFileName("");
                }}
                    className="add-new-product-btn">Add Product</button>
            </div>
            {showAddProductModal && <AddProductModal />}
            <ResizableTable
                columns={columns}
                data={data}
                onEdit={(product) => editProduct(product)}
                onDelete={(product) => deleteProduct(product.product_code)} />
        </>
    )
}