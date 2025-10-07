import React, { useContext, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { ProductContext } from "../contexts/ProductContext";
import { CategoryContext } from "../contexts/CategoryContext";
import logo from '../assets/istockphoto-1355944902-612x612.png';
export default function Nav({ ontoggle, screensize }) {
    const { setCategoryname } = useContext(ProductContext);
    const { categories } = useContext(CategoryContext);
    const { cartCount, setItems } = useContext(CartContext);
    const { loggedInUser, logOut, setActiveSession } = useContext(UserContext);
    const navigate = useNavigate();
    const [showNav, setShowNav] = useState(false);
    const [mobcategoryshow, setMobcategoryshow] = useState(false);

    //goto home
    const home = () => {
        navigate('/');
        setCategoryname(null);
        if (showNav) {
            setShowNav(prev => !prev)
        }
    }
    //goto login
    const login = () => {
        navigate('/auth');
    }
    //goto profile
    const profile = () => {
        navigate('/profile');
        setActiveSession('profile')
    }
    //logout function
    const logoutpage = () => {
        logOut();
        setItems([]);
        navigate('/');
    }

    const categoryArr = categories;

    //handle Category Click
    const handleCategoryClick = (name) => {
        navigate('/')
        setCategoryname(name.category_name);
    }

    //handle wishlist
    const handlewishlist = () => {
        if (loggedInUser) {
            navigate('/profile');
            setActiveSession('favorites');
        } else {
            navigate('/auth');
        }
    }

    return (
        <nav className="w-full bg-[#0493fb] text-white shadow-md top-0 left-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Logo */}
                    <div className="flex-shrink-0 cursor-pointer" onClick={home}>
                        <img src={logo} alt="Logo" className="h-20 w-auto" />
                    </div>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        <div className="cursor-pointer hover:text-[#000060]" onClick={home}>Home</div>

                        {/* Categories Dropdown */}
                        <div className="relative group">
                            <div className="cursor-pointer hover:text-[#000060]">Categories</div>
                            <div className="absolute mt-2 w-40 bg-white  text-black shadow-lg rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                                {categoryArr.map((item) => (
                                    <div
                                        key={item.category_id}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-md"
                                        onClick={() => handleCategoryClick(item)}
                                    >
                                        {item.category_name}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="cursor-pointer hover:text-[#000060]" onClick={handlewishlist}>Wishlist</div>
                    </div>

                    {/* Right Side: User / Cart */}
                    <div className="flex items-center space-x-4">
                        {loggedInUser ? (
                            <div className="relative group flex items-center space-x-2 cursor-pointer">
                                <i className="fa-solid fa-circle-user text-xl"></i>
                                <span>{loggedInUser.username}</span>
                                <div className="absolute top-4 right-0 mt-2 w-32 bg-white text-black shadow-lg rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                                    <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-md" onClick={profile}>Profile</div>
                                    <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer rounded-md" onClick={logoutpage}>Logout</div>
                                </div>
                            </div>
                        ) : (
                            <div className="cursor-pointer hover:text-[#000060]" onClick={login}>Login</div>
                        )}

                        <div
                            className="relative cursor-pointer hover:text-[#000060]"
                            onClick={() => {
                                if (screensize >= 1125) {
                                    ontoggle();
                                } else {
                                    navigate('/cart');
                                }
                            }}
                        >
                            <i className="fa-solid fa-cart-shopping text-xl"></i>
                            {cartCount() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
                                    {cartCount()}
                                </span>
                            )}
                        </div>

                        {/* Mobile Hamburger */}
                        <div className="md:hidden">
                            <button onClick={() => setShowNav(!showNav)} className="focus:outline-none">
                                <i className="fa fa-bars text-xl"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {showNav && (
                <div className="md:hidden bg-white shadow-md">
                    <div className="flex flex-col space-y-2 px-4 py-3">
                        <div className="cursor-pointer text-black hover:text-[#000060]" onClick={home}>Home</div>

                        {/* Mobile Categories */}
                        <div>
                            <div
                                className="cursor-pointer text-black hover:text-[#000060] flex justify-between items-center"
                                onClick={() => setMobcategoryshow(!mobcategoryshow)}
                            >
                                Categories
                                <i className={`fa fa-chevron-${mobcategoryshow ? 'up' : 'down'}`}></i>
                            </div>
                            {mobcategoryshow && (
                                <div className="ml-4 mt-1 flex flex-col space-y-1">
                                    {categoryArr.map((item) => (
                                        <div
                                            key={item.category_id}
                                            className="cursor-pointer text-black hover:text-[#000060]"
                                            onClick={() => handleCategoryClick(item)}
                                        >
                                            {item.category_name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="cursor-pointer text-black hover:text-[#000060]" onClick={handlewishlist}>Wishlist</div>
                        {loggedInUser ? (
                            <>
                                <div className="cursor-pointer text-black hover:text-[#000060]" onClick={profile}>Profile</div>
                                <div className="cursor-pointer text-black hover:text-[#000060]" onClick={logoutpage}>Logout</div>
                            </>
                        ) : (
                            <div className="cursor-pointer text-black hover:text-[#000060]" onClick={login}>Login</div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}