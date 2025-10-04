import React, { useState, useContext, useEffect } from "react";
import { ProductListContext } from "../contexts/ProductListContext";
import AddCollectionModal from "./AddCollectionModal";
import { CollectionContext } from "../contexts/CollectionContext";
import { TiPlus } from "react-icons/ti";
import AddProductModal from "../components/AddProductModal";

export default function AddCollectionProductsModal({ onClose }) {
    const {
        collections,
        products,
        addCollectionProducts,
        updateCollectionProduct,
        isEditCollectionProduct,
        setIsEditCollectionProduct,
        editingCollectionProduct,
        showAddProductModal,
        setShowAddProductModal,
        setFormData,
        setIsEditProduct
    } = useContext(ProductListContext);

    const {
        showCollectionModal,
        setShowCollectionModal
    } = useContext(CollectionContext)

    const [collectionId, setCollectionId] = useState("");
    const [productId, setProductId] = useState("");

    useEffect(() => {
        if (isEditCollectionProduct && editingCollectionProduct) {
            setCollectionId(editingCollectionProduct.collection_id);
            setProductId(editingCollectionProduct.product_id);
        }
    }, [isEditCollectionProduct, editingCollectionProduct]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!collectionId || !productId) {
            alert("Please select both collection and product");
            return;
        }

        if (isEditCollectionProduct) {
            updateCollectionProduct({
                collection_products_id: editingCollectionProduct.collection_products_id,
                collection_id: collectionId,
                product_id: productId,
            });
        } else {
            addCollectionProducts({ collection_id: collectionId, product_id: productId });
        }

        setCollectionId("");
        setProductId("");
        setIsEditCollectionProduct(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-49">
            <div className="bg-gradient-to-tr from-[#0493fb] to-[#000060] text-white rounded-xl shadow-lg w-96 p-6">
                <h2 className="text-xl font-semibold mb-4">{isEditCollectionProduct ? "Edit Collection Product" : "Add Collection Product"}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Collection Dropdown */}
                    <div>
                        <label className="text-l flex items-center justify-between font-medium mb-1">Collection
                            <span
                                onClick={() => setShowCollectionModal(true)}
                                className="relative group float-end text-justify cursor-pointer"
                            >
                                <TiPlus />
                                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Add new Collection
                                </span>
                            </span>
                        </label>
                        <select
                            value={collectionId}
                            onChange={(e) => setCollectionId(parseInt(e.target.value))}
                            className="w-full border bg-white text-black rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            <option value="">-- Select Collection --</option>
                            {collections.map((col) => (
                                <option key={col.collection_id} value={col.collection_id}>
                                    {col.collection_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Product Dropdown */}
                    <div>
                        <label className="flex items-center justify-between text-l font-medium mb-1">Product
                            <span
                                onClick={(e) => {
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
                                        title_id:""
                                    });
                                    setFile(null);
                                    setFileName("");
                                }
                                }
                                className="relative group float-end text-justify cursor-pointer"
                            >
                                <TiPlus />
                                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 whitespace-nowrap bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    Add new Collection
                                </span>
                            </span>
                        </label>
                        <select
                            value={productId}
                            onChange={(e) => setProductId(parseInt(e.target.value))}
                            className="w-full border bg-white text-black rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            <option value="">-- Select Product --</option>
                            {products.map((prod) => (
                                <option key={prod.product_id} value={prod.product_id}>
                                    {prod.product_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 space-x-2">
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditCollectionProduct(false);
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
                            {isEditCollectionProduct ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
                {showCollectionModal && <AddCollectionModal onClose={() => setShowCollectionModal(false)} />}
                {showAddProductModal && <AddProductModal />}
            </div>
        </div>
    );
}
