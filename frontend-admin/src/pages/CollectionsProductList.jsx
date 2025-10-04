import React, { useContext } from "react";
import AddCollectionProductsModal from "../modals/AddCollectionProductsModal";
import { ProductListContext } from "../contexts/ProductListContext";
import ResizableTable from "../components/ResizableTable"
export default function CollectionsProductList() {
    const {
        showAddCollectionProductModal,
        setShowAddCollectionProductModal,
        collectionProducts,
        collectionProductsKey,
        deleteCollectionProduct,
        editCollectionProduct
    } = useContext(ProductListContext)

    const columns = collectionProductsKey;
    const data = collectionProducts;
    
    return (
        <>
            <div className="search-container">
                <div className="search-element-container">
                    <div className="search-element-box">
                        <label htmlFor="name" className="search-label">Collection Name : </label>
                        <input className="search-input" name="name" type="text" placeholder="Name" />
                    </div>
                    <div className="search-element-box">
                        <label htmlFor="name" className="search-label">Product Name : </label>
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
                <button onClick={() => setShowAddCollectionProductModal(true)} className="text-center w-full cursor-pointer text-white">Add Collection Product</button>
            </div>
            <ResizableTable
                columns={columns}
                data={data}
                onEdit={(collectionProduct) => editCollectionProduct(collectionProduct)}
                onDelete={(collectionProduct) => deleteCollectionProduct({ collection_id: collectionProduct.collection_id, product_id: collectionProduct.product_id })}
            />

            {showAddCollectionProductModal && <AddCollectionProductsModal onClose={() => setShowAddCollectionProductModal(false)} />}
        </>
    )
}