import React, { useEffect, useState, useContext } from "react";
import { ProductListContext } from "../contexts/ProductListContext";
import api, { BASE_URL } from "../api/api";

export default function AddCategoryModal({ onClose }) {
    const {
        categoryName,
        setCategoryName,
        isEditCategory,
        setIsEditCategory,
        addCategory,
        updateCategory,
        editingCategoryId,
        setEditingCategoryId,
        categories
    } = useContext(ProductListContext);

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [removeExistingImage, setRemoveExistingImage] = useState(false);

    const resetForm = () => {
        setCategoryName("");
        setImageFile(null);
        setImagePreview(null);
        setRemoveExistingImage(false);
        setIsEditCategory(false);
        setEditingCategoryId(null);
    };


    useEffect(() => {
        if (!isEditCategory) {
            setCategoryName("");
            setImageFile(null);
            setImagePreview(null);
            setRemoveExistingImage(false);
        } else if (editingCategoryId && categories.length > 0) {
            const category = categories.find(c => c.category_id === editingCategoryId);
            if (category) {
                setCategoryName(category.category_name);
                setImagePreview(category.category_image ? category.category_image : null);
                setRemoveExistingImage(false);
                setImageFile(null);
            }
        }
    }, [isEditCategory, editingCategoryId, categories, setCategoryName]);


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (isEditCategory && imagePreview) {
            setRemoveExistingImage(true); // mark existing image for deletion
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoryName.trim()) return alert("Category name is required");

        const data = new FormData();
        data.append("category_name", categoryName);
        if (imageFile) data.append("category_image", imageFile);
        if (removeExistingImage) data.append("remove_image", "true");

        try {
            if (isEditCategory) {
                await updateCategory(editingCategoryId, data);
            } else {
                await addCategory(data);
            }
        } catch (error) {
            console.error("Error saving category:", error);
            alert("Error saving category");
        }

        onClose();
        setCategoryName("");
        setIsEditCategory(false);
        setEditingCategoryId(null);
        setImageFile(null);
        setImagePreview(null);
        setRemoveExistingImage(false);
    };

    const handleClose = () => {
        onClose();
        setTimeout(() => resetForm(), 0);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
            <div className="bg-gradient-to-tr from-[#0493fb] to-[#000060] text-white rounded-2xl shadow-lg w-96 p-6 relative">
                <button className="absolute top-3 right-3 hover:text-red-500" onClick={onClose}>✕</button>
                <h2 className="text-xl font-semibold mb-4">{isEditCategory ? "Edit Category" : "Add New Category"}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="categoryName" className="block text-[20px] font-medium">Category Name</label>
                        <input
                            id="categoryName"
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            placeholder="Enter category name"
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-lg font-semibold mb-3">Category Image</label>

                        <div
                            className="relative w-85 h-48 border-2 border-dashed border-white rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#0493fb] transition"
                            onClick={() => document.getElementById("categoryImageInput").click()}
                        >
                            {imagePreview ? (
                                <>
                                    <img
                                        src={
                                            imagePreview.startsWith("blob:")
                                                ? imagePreview
                                                : `${BASE_URL}${imagePreview}`
                                        }
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation(); 
                                            removeImage();
                                        }}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
                                    >
                                        ✕
                                    </button>
                                </>
                            ) : (
                                <div className="text-center text-white">
                                    
                                    <p className="text-sm">Click or drag image here</p>
                                </div>
                            )}
                        </div>

                        {/* Hidden input */}
                        <input
                            id="categoryImageInput"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={handleClose} className="px-4 py-2 rounded-lg bg-[#0493fb] hover:bg-red-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-lg bg-[#0493fb] text-white hover:bg-[#000060]">{isEditCategory ? "Update" : "Save"}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
