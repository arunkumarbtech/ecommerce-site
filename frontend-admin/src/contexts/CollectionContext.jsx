import React, { createContext, useContext, useState } from "react";
import { ProductListContext } from "./ProductListContext";
import api from "../api/api";
export const CollectionContext = createContext();
export default function CollectionProvider({ children }) {
    const { fetchCollections } = useContext(ProductListContext);

    const [showCollectionModal, setShowCollectionModal] = useState(false);
    const [isEditCollection, setIsEditCollection] = useState(false);
    const [editingCollection, setEditingCollection] = useState(null);

    const addCollection = async (formData) => {
        try {
            const token = localStorage.getItem('adminToken');
            await api.post(`/collections/create`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                },
            });
            alert("Collection Added Successfully");
            fetchCollections();
        } catch (error) {
            console.error("error while Adding collection", error);
        }
    };

    const updateCollection = async (id, formData) => {
        try {
            const token = localStorage.getItem('adminToken');
            await api.put(`/collections/update/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                },
            });
            alert("Collection updated successfully!");
            fetchCollections();
        } catch (error) {
            console.error(error);
            alert("Error updating collection");
        }
    };



    const deleteCollection = async (collection_id) => {
        if (!window.confirm("Are you sure you want to delete this Category?")) return;
        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await api.delete(`/collections/delete/${collection_id}`, config)
            alert("Collection deleted successfully!");
            fetchCollections();
        } catch (error) {
            console.log(error);
            alert("Error deleting Category");
        }
    }

    const editCollection = (collection) => {
        setIsEditCollection(true);
        setEditingCollection(collection);
        setShowCollectionModal(true);
    };

    return (
        <CollectionContext.Provider value={{
            showCollectionModal,
            setShowCollectionModal,
            addCollection,
            deleteCollection,
            updateCollection,
            isEditCollection,
            setIsEditCollection,
            editingCollection,
            setEditingCollection,
            editCollection,
        }}>
            {children}
        </CollectionContext.Provider>
    )
}