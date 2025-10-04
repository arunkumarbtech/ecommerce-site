import React from "react";
import ResizableTable from "../components/ResizableTable"
import { useContext } from "react";
import { ProductListContext } from "../contexts/ProductListContext";
import { useState } from "react";
import AddCategoryModal from "../modals/AddCategoryModal";
export default function CategoriesList() {
    const {
        showCategoryModal,
        setShowCategoryModal,
        categories,
        categoriesKeys,
        deleteCategory,
        editCategory,
        setCategoryName
    } = useContext(ProductListContext);
    const columns = categoriesKeys;
    const data = categories;
    return (
        <>
            <div className="search-container">
                <div className="search-element-container">
                    <div className="search-element-box">
                        <label htmlFor="name" className="search-label">Category Name : </label>
                        <input className="search-input" name="name" type="text" placeholder="Name" />
                    </div>
                </div>
                <div className="search-btn-container">
                    <button className="admin-search-button">Search</button>
                    <button className="admin-search-button">Clear</button>
                </div>
            </div>
            <div className="add-new-product">
                <i class="fa-solid fa-plus"></i>
                <button onClick={() => {
                    setShowCategoryModal(true);
                    setCategoryName("");
                }} className="add-new-product-btn">Add Category</button>
            </div>
            <ResizableTable
                columns={columns}
                data={data}
                onEdit={(category) => editCategory(category)}
                onDelete={(category) => deleteCategory(category.category_id)}
            />
            {showCategoryModal && (
                <AddCategoryModal
                    onClose={() => setShowCategoryModal(false)}
                />
            )}
        </>
    )
}