import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { ProductListContext } from "../contexts/ProductListContext";
export default function EditOutOfStockModal({ onClose }) {
    const { editingOutOfStockProduct, updateOutOfStockproduct } = useContext(ProductListContext);

    const [formData, setFormData] = useState({
        stock_quantity: "",
        status: ""
    });

    useEffect(() => {
        if (editingOutOfStockProduct) {
            setFormData({
                stock_quantity: editingOutOfStockProduct.stock_quantity || 0,
                status: editingOutOfStockProduct.status || ""
            });
        }
    }, [editingOutOfStockProduct]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editingOutOfStockProduct) return;

        await updateOutOfStockproduct({
            product_id: editingOutOfStockProduct.product_id,
            stock_quantity: formData.stock_quantity,
            status: formData.status
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
            <div className="bg-gradient-to-tr from-[#0493fb] to-[#000060] text-white rounded-2xl shadow-lg w-96 p-6 relative">
                <button
                    className="absolute top-3 right-3  hover:text-red-500"
                    onClick={() => {
                        onClose();
                    }}
                >
                    ✕
                </button>

                <h2 className="text-xl font-semibold mb-4 ">
                    Edit Out of Stock
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="addproduct-element">
                        <label className="addproduct-element-label">
                            Stock Quantity :
                        </label>
                        <input
                            name="stock_quantity"
                            value={formData.stock_quantity}
                            onChange={handleChange}
                            className="addproduct-element-input"
                            placeholder="Stock Quantity"
                            type="number"
                        />
                    </div>

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


                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => {
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
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}