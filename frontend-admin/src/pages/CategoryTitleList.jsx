import React, { useContext } from "react";
import AddCategoryTitleModal from '../modals/AddCategoryTitleModal';
import ResizableTable from "../components/ResizableTable"
import { CategoryContext } from "../contexts/CategoryContext";
export default function CategoryTitleList() {
    const {
        categoryTitle,
        categoryTitleKeys,
        showAddCategoryTitleModal,
        setShowAddCategoryTitleModal,
        deleteCategorytitle,
        editCategoryTitle
    } = useContext(CategoryContext)

    return (
        <>
            <div className="search-container">
                <div className="search-element-container">
                    <div className="search-element-box">
                        <label htmlFor="name" className="search-label">Category Title Name : </label>
                        <input className="search-input" name="name" type="text" placeholder="Category Title Name" />
                    </div>
                </div>
                <div className="search-btn-container">
                    <button className="admin-search-button">Search</button>
                    <button className="admin-search-button">Clear</button>
                </div>
            </div>
            <div className="add-new-product">
                <i class="fa-solid fa-plus"></i>
                <button onClick={() => setShowAddCategoryTitleModal(true)} className="text-center w-full cursor-pointer text-white">Add Category title</button>
            </div>
            <ResizableTable
                columns={categoryTitleKeys}
                data={categoryTitle}
                onEdit={(categoryTitle) => editCategoryTitle(categoryTitle)}
                onDelete={(categorytitle) => deleteCategorytitle(categorytitle.title_id)}
            />

            {showAddCategoryTitleModal && <AddCategoryTitleModal onClose={() => setShowAddCategoryTitleModal(false)} />}
        </>
    )
}