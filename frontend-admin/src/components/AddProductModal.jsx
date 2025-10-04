import React, { useContext, useRef, useState } from "react";
import { ProductListContext } from "../contexts/ProductListContext";
import { useEffect } from "react";
import { TiPlus } from "react-icons/ti";
import AddCategoryModal from "../modals/AddCategoryModal";
import AddCollectionModal from "../modals/AddCollectionModal";
import { CollectionContext } from "../contexts/CollectionContext";
import { CategoryContext } from "../contexts/CategoryContext";
import api, { BASE_URL } from "../api/api";
export default function AddProductModal() {
    const {
        setShowAddProductModal,
        setShowCategoryModal,
        showCategoryModal,
        addProduct,
        formData,
        setFormData,
        setIsEditProduct,
        updateProduct,
        isEditProduct,
        categories,
        collections
    } = useContext(ProductListContext);

    const { categoryTitle } = useContext(CategoryContext);

    const {
        showCollectionModal,
        setShowCollectionModal
    } = useContext(CollectionContext)

    
    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);
    const [fileNames, setFileNames] = useState([]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === "number" ? Number(value) : value,
        });
    };


    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
        setFileNames(selectedFiles.map(file => file.name));
    };

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditProduct) {
            updateProduct(formData, files);
        } else {
            addProduct(formData, files);
        }
        setShowAddProductModal(false);
    };

    useEffect(() => {
        const { price, mrp } = formData;
        if (mrp > 0 && price > 0 && price <= mrp) {
            const discount = ((mrp - price) / mrp) * 100;
            setFormData((prev) => ({
                ...prev,
                discount: discount.toFixed(2),
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                discount: 0,
            }));
        }
    }, [formData.price, formData.mrp]);

    const handleDeleteImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            imagePath: prev.imagePath.filter((_, i) => i !== index),
        }));
    };

    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal-content">
                <div className="admin-modal-header">Add New Product</div>
                <hr className="white-line" />

                <div className="addproduct-element-conatiner-modal">
                    <div className="addproduct-element">
                        <label className="addproduct-element-label">
                            Product Name :
                        </label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="addproduct-element-input"
                            placeholder="Product name"
                            type="text"
                        />
                    </div>

                    <div className="addproduct-element">
                        <label className="addproduct-element-label">
                            Alternative Tag :
                        </label>
                        <input
                            name="alt_tag"
                            value={formData.alt_tag}
                            onChange={handleChange}
                            className="addproduct-element-input"
                            placeholder="Alternative Tag"
                            type="text"
                        />
                    </div>

                </div>

                <div className="addproduct-description-box">
                    <label className="addproduct-element-label">Description : </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="addproduct-description"
                        placeholder="Description"
                    />
                </div>

                <div className="addproduct-element-conatiner-modal">
                    <div className="addproduct-element">
                        <label className="addproduct-element-label flex items-center justify-between">
                            Category :
                            <span
                                onClick={() => setShowCategoryModal(true)}
                                className="relative group float-end text-justify cursor-pointer"
                            >
                                <TiPlus />
                                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Add new category
                                </span>
                            </span>
                        </label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            className="addproduct-element-input"

                        >
                            <option className="h-10" value="">-- Select Category --</option>
                            {categories.map((cat) => (
                                <option key={cat.category_id} value={cat.category_id}>
                                    {cat.category_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {showCategoryModal && <AddCategoryModal onClose={() => setShowCategoryModal(false)} />}

                    <div className="addproduct-element">
                        <label className="addproduct-element-label flex items-center justify-between">
                            Category Title :
                            {/* <span
                                onClick={() => setShowCategoryModal(true)}
                                className="relative group float-end text-justify cursor-pointer"
                            >
                                <TiPlus />
                                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Add new category
                                </span>
                            </span> */}
                        </label>
                        <select
                            name="title_id"
                            value={formData.title_id}
                            onChange={handleChange}
                            className="addproduct-element-input"

                        >
                            <option className="h-10" value="">-- Select Category --</option>
                            {categoryTitle.map((cat) => (
                                <option key={cat.title_id} value={cat.title_id}>
                                    {cat.title_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="addproduct-element-conatiner-modal">
                    <div className="addproduct-element">
                        <label className="addproduct-element-label">
                            Brand :
                        </label>
                        <input
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            className="addproduct-element-input"
                            placeholder="Brand"
                            type="text"
                        />
                    </div>

                    <div className="addproduct-element">
                        <label className="addproduct-element-label">
                            Product Code :
                        </label>
                        <input
                            name="productCode"
                            value={formData.productCode}
                            onChange={handleChange}
                            className="addproduct-element-input"
                            placeholder="Product Code"
                            type="text"
                        />
                    </div>
                </div>

                <div className="addproduct-element-conatiner-modal">
                    <div className="addproduct-element">
                        <label className="addproduct-element-label">
                            Price :
                        </label>
                        <input
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="addproduct-element-input"
                            placeholder="Price"
                            type="number"
                        />
                    </div>

                    <div className="addproduct-element">
                        <label className="addproduct-element-label">
                            Stock Quantity :
                        </label>
                        <input
                            name="stockQuantity"
                            value={formData.stockQuantity}
                            onChange={handleChange}
                            className="addproduct-element-input"
                            placeholder="Stock Quantity"
                            type="number"
                        />
                    </div>
                </div>

                <div className="addproduct-element-conatiner-modal">
                    <div className="addproduct-element">
                        <label className="addproduct-element-label">
                            Status :
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="addproduct-element-input admin-dropdown"
                            placeholder="Status"
                        >
                            <option value="">-select-</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="addproduct-element">
                        <label className="addproduct-element-label">
                            MRP :
                        </label>
                        <input
                            name="mrp"
                            value={formData.mrp}
                            onChange={handleChange}
                            className="addproduct-element-input"
                            placeholder="MRP"
                            type="number"
                        />
                    </div>
                </div>
                <div className="addproduct-element-conatiner-modal">
                    <div className="addproduct-element">
                        <label className="addproduct-element-label">
                            Discount (%):
                        </label>
                        <input
                            name="discount"
                            value={formData.discount}
                            readOnly
                            disabled
                            className="addproduct-element-input"
                            placeholder="Discount"
                            type="number"
                        />
                    </div>
                    <div className="addproduct-element">
                        <label className="addproduct-element-label flex items-center justify-between">
                            Collection :
                            <span
                                onClick={() => setShowCollectionModal(true)}
                                className="relative group float-end text-justify cursor-pointer"
                            >
                                <TiPlus />
                                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Add new collection
                                </span>
                            </span>
                        </label>
                        <select
                            name="collection_id"
                            value={formData.collection_id}
                            onChange={handleChange}
                            className="addproduct-element-input"
                        >
                            <option value="">-- Select Collection --</option>
                            {collections.map((col) => (
                                <option key={col.collection_id} value={col.collection_id}>
                                    {col.collection_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {showCollectionModal && <AddCollectionModal onClose={() => setShowCollectionModal(false)} />}
                </div>

                <div className="addproduct-element-conatiner-modal">
                    <div className="addproduct-element">
                        <label className="addproduct-element-label">
                            BestSeller :
                        </label>
                        <select
                            name="bestseller"
                            value={formData.bestseller}
                            onChange={handleChange}
                            className="addproduct-element-input admin-dropdown"
                            placeholder="Bestseller"
                        >
                            <option value={false}>Inactive</option>
                            <option value={true}>Active</option>
                        </select>
                    </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                    <label className="addproduct-element-label">
                        Upload Image :
                    </label>
                    <div className="image-upload-container">
                        {isEditProduct && formData.imagePath && Array.isArray(formData.imagePath) && (
                            <div style={{ marginBottom: "10px" }}>
                                <p>Current Images:</p>
                                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                    {formData.imagePath.map((img, index) => (
                                        <div key={index} style={{ position: "relative" }}>
                                            <img
                                                src={`${BASE_URL}${img}`}
                                                alt="Product"
                                                style={{
                                                    width: "100px",
                                                    height: "100px",
                                                    objectFit: "cover",
                                                    borderRadius: "5px",
                                                }}
                                            />
                                            {/* Delete button for each image */}
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteImage(index)}
                                                style={{
                                                    position: "absolute",
                                                    top: "2px",
                                                    right: "2px",
                                                    background: "rgba(255,0,0,0.7)",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "50%",
                                                    width: "20px",
                                                    height: "20px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}


                        <p>Choose a file to upload..</p>
                        <i className="fa-solid fa-cloud-arrow-up uploadimg"></i>
                        <input
                            type="file"
                            hidden
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            multiple
                        />
                        <button
                            onClick={handleButtonClick}
                            className="uploadbtn"
                        >
                            Browse File
                        </button>

                        {fileNames && (
                            <p style={{ marginTop: "10px" }}>
                                Selected: {fileNames}
                                <i
                                    onClick={() => { setFileNames([]); setFiles([]); }}
                                    className="fa-solid fa-trash delete-upload"
                                    style={{ marginLeft: "8px", cursor: "pointer" }}
                                ></i>
                            </p>
                        )}
                    </div>
                </div>
                <hr className="white-line" />
                <div className="modal-actions">
                    <button className="upload-modal-button" onClick={(e) => {
                        e.preventDefault();
                        setIsEditProduct(false);
                        setShowAddProductModal(prev => !prev);
                    }} >Cancel</button>
                    <button onClick={handleSubmit} className="upload-modal-button">Save</button>
                </div>
            </div>
        </div >
    )
}