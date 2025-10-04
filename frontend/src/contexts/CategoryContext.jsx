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
    const [categories, setCategories] = useState([]);

    const fetchCategoryTitle = async () => {
        try {
            const res = await api.get('/categorytitle');
            setCategoryTitle(res.data);
            setCategoryTitleKeys(Object.keys(res.data[0]));
        } catch (err) {
            console.error("Error fetching Category Title:", err);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get(`/category`);
            setCategories(res.data);
        } catch (err) {
            console.error("Error fetching Categories:", err);
        }
    };

    useEffect(() => {
        fetchCategories()
        fetchCategoryTitle();
    }, []);

    const addCategoryTitle = async (FormData) => {
        try {
            const config = {
                headers: { "Content-Type": "application/json" }
            }
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
            await api.delete(`/categorytitle/delete/${title_id}`)
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
            await api.put(`/categorytitle/update/${title_id}`, { title_name });
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
            editCategoryTitle,
            categories
        }} >
            {children}
        </CategoryContext.Provider>
    )
}