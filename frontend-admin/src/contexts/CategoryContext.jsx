import React, { useEffect, useState } from "react";
import api from '../api/api';
import { createContext } from "react";
export const CategoryContext = createContext();
export default function CategoryProvider({ children }) {
    const [showAddCategoryTitleModal, setShowAddCategoryTitleModal] = useState(false);
    const [categoryTitle, setCategoryTitle] = useState([]);
    const [categoryTitleKeys, setCategoryTitleKeys] = useState([]);
    const [isEditCategoryTitle, setIsEditCategoryTitle] = useState(false);
    const [editingCategoryTitle, setEditingCategoryTitle] = useState(null);

    const fetchCategoryTitle = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const res = await api.get('/categorytitle', config);
            setCategoryTitle(res.data);
            setCategoryTitleKeys(Object.keys(res.data[0]));
        } catch (err) {
            console.error("Error fetching Category Title:", err);
        }
    };

    useEffect(() => {
        fetchCategoryTitle();
    }, []);

    const addCategoryTitle = async (FormData) => {
        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await api.post('/categorytitle/addcategorytitle', FormData, config)
            alert("Category Title Added Successfully");
            fetchCategoryTitle();
        } catch (error) {
            console.error("Error while Adding Category Title", error);
        }
    }


    const deleteCategorytitle = async (title_id) => {
        if (!window.confirm("Are you sure you want to delete this Ctegory Title?")) return;
        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await api.delete(`/categorytitle/delete/${title_id}`, config)
            alert("Category Title deleted successfully!");
            fetchCategoryTitle();
        } catch (error) {
            console.log(error);
            alert("Error deleting Category Title");
        }
    }

    const updateCategoryTitle = async (categoryTitleData) => {
        try {
            const { title_id, title_name } = categoryTitleData;
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await api.put(`/categorytitle/update/${title_id}`, { title_name }, config);
            alert("Category Title updated successfully!");
            fetchCategoryTitle();
        } catch (error) {
            console.error("Error updating Category Title", error);
        }
    };

    // Edit function
    const editCategoryTitle = (categoryTitle) => {
        setIsEditCategoryTitle(true);
        setEditingCategoryTitle(categoryTitle);
        setShowAddCategoryTitleModal(true);
    };
    return (
        <CategoryContext.Provider value={{
            categoryTitle,
            categoryTitleKeys,
            showAddCategoryTitleModal,
            setShowAddCategoryTitleModal,
            addCategoryTitle,
            deleteCategorytitle,
            isEditCategoryTitle,
            setIsEditCategoryTitle,
            editingCategoryTitle,
            setEditingCategoryTitle,
            updateCategoryTitle,
            editCategoryTitle
        }} >
            {children}
        </CategoryContext.Provider>
    )
}