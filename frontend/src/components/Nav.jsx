import React, { useContext, useState } from "react";
import { CartContext } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { ProductContext } from "../contexts/ProductContext";
import { CategoryContext } from "../contexts/CategoryContext";
export default function Nav({ ontoggle, screensize }) {
    const { setCategoryname} = useContext(ProductContext);
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
        <div className="navbar">
            <div className='navlist'>
                <div className="navlinks" onClick={home}>Home</div>
                <div className="hover-area-category">
                    <div className="navlinks" >Categories</div>
                    <div className="dropdown-category">
                        {categoryArr.map((item) => (
                            <div key={item.category_id} className="dropdown-button" onClick={() => handleCategoryClick(item)}>{item.category_name}</div>
                        ))}
                    </div>
                </div>
                <div className="navlinks" onClick={handlewishlist}>Wishlist</div>
            </div>
            <div className="hamburger">
                <i className="fa fa-bars" onClick={() => setShowNav(prev => !prev)}></i>
                {showNav && (
                    <div className="navlist-mob">
                        <div className="mob-list-nav" onClick={home}>Home</div>
                        <div className="mob-list-nav" onClick={() => setMobcategoryshow(prev => !prev)}>
                            Categories
                            {mobcategoryshow && (
                                <div className="dropdown-mob-category">
                                    {categoryArr.map((item) => (
                                        <div key={item.category_id} className="dropdown-mob-button" onClick={() => handleCategoryClick(item)}>
                                            {item.category_name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="mob-list-nav" onClick={handlewishlist}>Wishlist</div>
                    </div>
                )}
            </div>
            <div onClick={home} className="webname">Ecommerce Site</div>
            <div className="nav-list-right">
                {loggedInUser ?
                    <>
                        <div className="hover-area flex-display">
                            <div className="user-name">{loggedInUser.username}</div>
                            <div className="navlinkscart">
                                <i class="fa-solid fa-circle-user"></i>
                                <div className="dropdown">
                                    <div className="dropdown-button" onClick={profile}>Profile</div>
                                    <div className="dropdown-button" onClick={logoutpage}>Logout</div>
                                </div>
                            </div>
                        </div>
                    </>
                    : <div className="navlinkscart" onClick={login}>Login</div>}
                <div className="navlinkscart" onClick={() => {
                    if (screensize >= 1125) {
                        ontoggle();
                    } else {
                        navigate('/cart');
                    }
                }}>
                    <i class="fa-solid fa-cart-shopping">
                        {cartCount() > 0 && <span className="cartcount">{cartCount()}</span>}
                    </i>
                </div>
            </div>
        </div>
    )
}