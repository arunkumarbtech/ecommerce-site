import React, { createContext, useState, useEffect } from "react";
import api from "../api/api";
export const ProductListContext = createContext();
export function ProductListProvider({ children }) {
    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showAddCollectionProductModal, setShowAddCollectionProductModal] = useState(false);
    const [showEditOutOfStockModal, setShowEditOutOfStockModal] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [products, setProducts] = useState([]);
    const [outOfStockProducts, setOutOfStockProducts] = useState([]);
    const [outOfStockProductsKeys, setOutOfStockProductsKeys] = useState([]);
    const [collections, setCollections] = useState([]);
    const [collectionsKeys, setcollectionsKeys] = useState([]);
    const [collectionProducts, setCollectionProducts] = useState([]);
    const [collectionProductsKey, setCollectionProductsKey] = useState([]);
    const [productKeys, setProductKeys] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoriesKeys, setCategoriesKeys] = useState([]);
    const [isEditProduct, setIsEditProduct] = useState(false);
    const [isEditCategory, setIsEditCategory] = useState(false);
    const [isEditCollectionProduct, setIsEditCollectionProduct] = useState(false);
    const [editingCollectionProduct, setEditingCollectionProduct] = useState(null);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingOutOfStockProduct, setEditingOutOfStockProduct] = useState(null);

    const [formData, setFormData] = useState({
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
        title_id: ""
    });

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const res = await api.get(`/products/adminProducts`, config);
            setProducts(res.data);
            setProductKeys(Object.keys(res.data[0]));
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get(`/category`);
            setCategories(res.data);
            setCategoriesKeys(Object.keys(res.data[0]));
        } catch (err) {
            console.error("Error fetching Categories:", err);
        }
    };

    const fetchCollections = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const res = await api.get(`/collections`, config);
            setCollections(res.data);
            setcollectionsKeys(Object.keys(res.data[0]));
        } catch (err) {
            console.error("Error fetching Collections:", err);
        }
    };

    const fetchCollectionProducts = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const res = await api.get(`/collections/collectionproducts`, config);
            setCollectionProducts(res.data);
            setCollectionProductsKey(Object.keys(res.data[0]));
        } catch (err) {
            console.error("Error fetching Collections:", err);
        }
    };

    const fetchOutOfStockProducts = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const res = await api.get(`/products/outofstocks`, config);
            setOutOfStockProducts(res.data);
            setOutOfStockProductsKeys(Object.keys(res.data[0]));
        } catch (err) {
            console.error("Error fetching products:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchCollections();
        fetchCollectionProducts();
        fetchOutOfStockProducts();
    }, []);

    const addProduct = async (formData, files) => {
        const data = new FormData();

        Object.keys(formData).forEach((key) => {
            if (key !== "imagePath") {
                data.append(key, formData[key]);
            }
        });

        if (files && files.length > 0) {
            files.forEach((file) => data.append("images", file));
        }

        try {
            const token = localStorage.getItem('adminToken');
            await api.post(`/products/addnewproduct`, data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                },

            });
            alert("Product added successfully!");
            fetchProducts();
        } catch (error) {
            console.error(error);
            alert("Error adding product");
        }
    };


    const editProduct = (product) => {
        setIsEditProduct(true);
        setFormData({
            name: product.product_name || "",
            description: product.description || "",
            category_id: product.category_id || "",
            brand: product.brand || "",
            productCode: product.product_code || "",
            price: product.price || 0,
            stockQuantity: product.stock_quantity || 0,
            status: product.status || "",
            mrp: product.mrp || 0,
            discount: product.discount || 0,
            imagePath: product.image_path || "",
            collection_id: product.collection_id || "",
            alt_tag: product.alt_tag || "",
            bestseller: product.bestseller || false,
            title_id: product.title_id || ""
        });
        setShowAddProductModal(true);
    };

    const updateProduct = async (formData, files) => {
        const data = new FormData();

        Object.keys(formData).forEach((key) => {
            if (key !== "imagePath") {
                data.append(key, formData[key]);
            }
        });

        if (formData.imagePath && Array.isArray(formData.imagePath)) {
            data.append("existingImages", JSON.stringify(formData.imagePath));
        }

        if (files && files.length > 0) {
            files.forEach((file) => data.append("images", file));
        }

        try {
            const token = localStorage.getItem('adminToken');
            await api.put(
                `/products/update/${formData.productCode}`,
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`
                    },
                }
            );
            alert("Product updated successfully!");
            fetchProducts();
        } catch (error) {
            console.error(error);
            alert("Error updating product");
        }
    };


    const deleteProduct = async (productCode) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await api.delete(`/products/delete/${productCode}`, config);
            alert("Product deleted successfully!");
            fetchProducts();
        } catch (error) {
            console.error(error);
            alert("Error deleting product");
        }
    };

    const addCategory = async (formData) => {
        const token = localStorage.getItem('adminToken');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const res = await api.post(`/category/addcategory`, formData, config);
        alert("Category Added successfully!");
        try {
            await fetchCategories();
        } catch (err) {
            console.error("Error refreshing categories after add:", err);
        }
        return res.data;
    };

    const updateCategory = async (id, formData) => {
        const token = localStorage.getItem('adminToken');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const res = await api.put(`/category/update/${id}`, formData, config);
        alert("Category updated successfully!");
        try {
            await fetchCategories();
        } catch (err) {
            console.error("Error refreshing categories after update:", err);
        }
        return res.data;
    };

    const deleteCategory = async (categoryId) => {
        if (!window.confirm("Are you sure you want to delete this Category?")) return;
        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await api.delete(`/category/delete/${categoryId}`, config)
            alert("Category deleted successfully!");
            fetchCategories();
        } catch (error) {
            console.log(error);
            alert("Error deleting Category");
        }
    }

    // Edit category function
    const editCategory = (category) => {
        setIsEditCategory(true);
        setEditingCategoryId(category.category_id);
        setCategoryName(category.category_name);
        setShowCategoryModal(true);
    };

    const addCollectionProducts = async (CollectionProducts) => {
        try {
            const token = localStorage.getItem('adminToken');
            await api.post(`/collections/create/${CollectionProducts.collection_id}/products`, { product_id: CollectionProducts.product_id }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            });
            alert("Collection Product Added successfully!");
            fetchCollectionProducts();
        } catch (error) {
            console.error("Error saving category:", error);
        }
    }

    const deleteCollectionProduct = async (collectionProduct) => {
        if (!window.confirm("Are you sure you want to delete this Category?")) return;
        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await api.delete(`/collections/delete/${collectionProduct.collection_id}/products/${collectionProduct.product_id}`, config)
            alert("Category deleted successfully!");
            fetchCollectionProducts();
        } catch (error) {
            console.log(error);
            alert("Error deleting Category");
        }
    }

    const editCollectionProduct = (collectionProduct) => {
        setIsEditCollectionProduct(true);
        setEditingCollectionProduct(collectionProduct);
        setShowAddCollectionProductModal(true);
    };


    const updateCollectionProduct = async (collectionProduct) => {
        try {
            const token = localStorage.getItem('adminToken');

            await api.put(
                `/collections/update/collectionproduct/${collectionProduct.collection_products_id}`,
                { collection_id: collectionProduct.collection_id, product_id: collectionProduct.product_id },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            alert("CollectionProduct updated successfully!");
            fetchCollectionProducts();
        } catch (error) {
            console.error(error);
            alert("Error updating category");
        }
    };

    const updateOutOfStockproduct = async (product) => {
        const token = localStorage.getItem('adminToken');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        const res = await api.put(`/products/${product.product_id}/update-stock`, { quantity: product.stock_quantity, status: product.status }, config);
        alert("product updated successfully!");
        try {
            await fetchOutOfStockProducts();
        } catch (err) {
            console.error("Error Updating the Status", err);
        }
        return res.data;
    };

    return (
        <ProductListContext.Provider value={{
            categoryName,
            setCategoryName,
            showCategoryModal,
            setShowCategoryModal,
            deleteCategory,
            addCategory,
            categories,
            categoriesKeys,
            deleteProduct,
            editProduct,
            updateProduct,
            isEditProduct,
            setIsEditProduct,
            formData,
            setFormData,
            productKeys,
            showAddProductModal,
            setShowAddProductModal,
            addProduct,
            products,
            isEditCategory,
            setIsEditCategory,
            editCategory,
            updateCategory,
            editingCategoryId,
            collections,
            setCollections,
            showAddCollectionProductModal,
            setShowAddCollectionProductModal,
            addCollectionProducts,
            collectionsKeys,
            setcollectionsKeys,
            collectionProducts,
            collectionProductsKey,
            deleteCollectionProduct,
            editCollectionProduct,
            updateCollectionProduct,
            setIsEditCollectionProduct,
            editingCollectionProduct,
            isEditCollectionProduct,
            fetchCollections,
            setShowEditOutOfStockModal,
            showEditOutOfStockModal,
            outOfStockProductsKeys,
            outOfStockProducts,
            editingOutOfStockProduct,
            setEditingOutOfStockProduct,
            updateOutOfStockproduct,
            fetchOutOfStockProducts,
        }}>
            {children}
        </ProductListContext.Provider>
    )
}