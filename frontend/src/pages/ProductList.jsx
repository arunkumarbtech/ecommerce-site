import React, { useState, useEffect } from "react";
import ProductCard from '../components/ProductCard';
import { useContext } from "react";
import { ProductContext } from "../contexts/ProductContext";
import Loading from '../components/Loading';

export default function ProductList() {

    //useContext
    const { categoryname, productsList } = useContext(ProductContext);
    //fetch product API
    const products = productsList;

    //States for productListing
    const [searchInput, setSearchInput] = useState('');
    const [filteredList, setFilteredList] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (productsList.length > 0) {
            setLoading(false);
        }
    }, [productsList]);

    //handle search
    const handlesearch = (e) => {
        const input = e.target.value;
        setSearchInput(input);
        const filtered = products.filter((item) => item.product_name.toLowerCase().includes(input.toLowerCase()));
        setFilteredList(filtered);

    }

    //search functionality
    const search = () => {
        const filtered = products.filter((item) => item.product_name.toLowerCase().includes(searchInput.toLowerCase()));
        setFilteredList(filtered);
    }

    useEffect(() => {
        if (categoryname) {
            const filteredByCategory = products.filter(
                (item) => item.category === categoryname
            );
            setFilteredList(filteredByCategory);
        }
    }, [categoryname, products]);

    //which state product should render condition
    const display = searchInput.length > 0 || categoryname ? filteredList : products;

    return (
        loading ? <Loading fullscreen /> : <div className="flex-display product-list">
            <div className="search-outline">
                <input
                    className="search-bar"
                    value={searchInput}
                    onChange={handlesearch}
                    type="text"
                    placeholder="Search...." />
                <button className="search-button " onClick={search}>Search</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '6px', height: '650px', marginTop: '5px' }}>
                <div className="scrollbar-hidden" style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', overflowY: 'auto', alignItems: 'center', justifyContent: 'center' }}>
                    {display.map(product => (<ProductCard key={product.product_id} product={product} />))}
                </div>
            </div>
        </div>
    )
};