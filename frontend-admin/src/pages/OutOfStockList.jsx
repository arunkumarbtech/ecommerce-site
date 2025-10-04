import React, { useContext, useEffect } from "react";
import EditOutOfStockModal from '../modals/EditOutOfStockModal';
import { ProductListContext } from "../contexts/ProductListContext";
import ResizableTable from '../components/ResizableTable';
export default function OutOfStockList() {
    const { setShowEditOutOfStockModal,
        showEditOutOfStockModal,
        outOfStockProductsKeys,
        outOfStockProducts,
        setEditingOutOfStockProduct,
        fetchOutOfStockProducts,
        deleteProduct
    } = useContext(ProductListContext)

    useEffect(() => {
        fetchOutOfStockProducts();
    }, [])

    useEffect(() => {
        fetchOutOfStockProducts();
    }, [outOfStockProducts])

    return (
        <>
            <div className="search-container">
                <div className="search-element-container">
                    <div className="search-element-box">
                        <label htmlFor="productName" className="search-label">Product Name : </label>
                        <input className="search-input" name="Product Name" type="text" placeholder="Product Name" />
                    </div>
                </div>
                <div className="search-btn-container">
                    <button className="admin-search-button">Search</button>
                    <button className="admin-search-button">Clear</button>
                </div>
            </div>
            <ResizableTable
                columns={outOfStockProductsKeys}
                data={outOfStockProducts}
                onEdit={(product) => {
                    setEditingOutOfStockProduct(product);
                    setShowEditOutOfStockModal(true);
                }}
                onDelete={(product) => deleteProduct(product.product_code)}
            />

            {showEditOutOfStockModal && <EditOutOfStockModal onClose={() => setShowEditOutOfStockModal(false)} />}
        </>
    )
}