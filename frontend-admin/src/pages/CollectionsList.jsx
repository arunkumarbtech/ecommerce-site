import React, { useContext } from "react";
import AddCollectionModal from "../modals/AddCollectionModal";
import { ProductListContext } from "../contexts/ProductListContext";
import ResizableTable from "../components/ResizableTable"
import { CollectionContext } from "../contexts/CollectionContext";
export default function CollectionsList() {
    const {
        collections,
        collectionsKeys,
    } = useContext(ProductListContext)

    const {
        showCollectionModal,
        setShowCollectionModal,
        deleteCollection,
        editCollection,
    } = useContext(CollectionContext)

    const columns = collectionsKeys;
    const data = collections;

    return (
        <>
            <div className="search-container">
                <div className="search-element-container">
                    <div className="search-element-box">
                        <label htmlFor="name" className="search-label">Collection Name : </label>
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
                <button onClick={() => setShowCollectionModal(true)} className="text-center w-full cursor-pointer text-white">Add Collection</button>
            </div>
            <ResizableTable
                columns={columns}
                data={data}
                onEdit={(collectionProduct) => editCollection(collectionProduct)}
                onDelete={(collection) => deleteCollection(collection.collection_id)}
            />

            {showCollectionModal && <AddCollectionModal onClose={() => setShowCollectionModal(false)} />}
        </>
    )
}