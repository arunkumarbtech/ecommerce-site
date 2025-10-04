import React, { useState, useContext, useEffect } from "react";
import { TiPlus } from "react-icons/ti";
import { ProductListContext } from "../contexts/ProductListContext";
import { CategoryContext } from "../contexts/CategoryContext";

export default function AddCategoryTitleModal({ onClose }) {
    const {
        addCategoryTitle,
        updateCategoryTitle,
        isEditCategoryTitle,
        setIsEditCategoryTitle,
        editingCategoryTitle,
        setEditingCategoryTitle
    } = useContext(CategoryContext);

    const [formData, setFormData] = useState({
        title_name: ""
    });


    useEffect(() => {
        if (isEditCategoryTitle && editingCategoryTitle) {
            setFormData({ title_name: editingCategoryTitle.title_name });
        } else {
            setFormData({ title_name: "" });
        }
    }, [isEditCategoryTitle, editingCategoryTitle]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditCategoryTitle) {
                await updateCategoryTitle({ ...formData, title_id: editingCategoryTitle.title_id });
            } else {
                await addCategoryTitle(formData);
            }
            setIsEditCategoryTitle(false);
            setEditingCategoryTitle(null);
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-49">
            <div className="bg-gradient-to-tr from-[#0493fb] to-[#000060] text-white rounded-xl shadow-lg w-96 p-6">
                <h2 className="text-xl font-semibold mb-4">Add category title Modal</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="flex items-center justify-between text-l font-medium mb-1">Category Title Name</label>
                        <input
                            id="title_name"
                            name="title_name"
                            type="text"
                            value={formData.title_name}
                            onChange={handleChange}
                            placeholder="Enter Category Title Name"
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2  focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                            required
                        />
                    </div>
                    {/* Buttons */}
                    <div className="flex justify-end gap-2 space-x-2">
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditCategoryTitle(false);
                                setEditingCategoryTitle(null);
                                onClose();
                            }}
                            className="px-4 py-2 rounded-lg bg-[#0493fb]  hover:bg-red-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-[#0493fb] text-white hover:bg-[#000060]"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
