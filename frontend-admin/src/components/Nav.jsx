import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import logo from '../assets/logo.png';

export default function Nav() {
  const { loggedInUser, logOut } = useContext(UserContext);
  const navigate = useNavigate();
  const [userDropdown, setUserDropdown] = useState(false);
  const dropdownRef = useRef(); const [mobileMenu, setMobileMenu] = useState(false);

  const goHome = () => {
    navigate('/');
    setUserDropdown(false);
  };

  const login = () => navigate('/auth');

  const logout = () => {
    logOut();
    navigate('/');
    setUserDropdown(false);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-[#0493fb] text-white shadow-md  top-0 z-50">
      <div className=" px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          <img
            src={logo}
            alt="Logo"
            className="h-15 w-15 object-contain cursor-pointer"
            onClick={goHome}
          />

          {/* Left: Home */}
          <div className="flex-1 flex items-center space-x-3">
            <div
              onClick={goHome}
              className="cursor-pointer text-lg font-semibold"
            >
              Home
            </div>
          </div>

          {/* Center: Site Name */}
          <div className="flex-1 text-center font-bold text-2xl cursor-pointer" onClick={goHome}>
            Ecommerce Site Admin Portal
          </div>

          {/* Right: User menu */}
          <div className="flex-1 flex justify-end items-center space-x-4">
            {loggedInUser ? (
              <div className="relative" ref={dropdownRef}>
                <div
                  className="flex text-lg font-semibold items-center space-x-2 cursor-pointer"
                  onClick={() => setUserDropdown(!userDropdown)}
                >
                  <i className="fa-solid fa-circle-user text-xl"></i>
                  <span>{loggedInUser.username}</span>
                </div>

                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-40 bg-white text-black border rounded-md shadow-lg py-1 z-10">
                    {/* <div
                      onClick={() => alert("Profile clicked")}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Profile
                    </div> */}
                    <div
                      onClick={logout}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Logout
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                onClick={login}
                className="cursor-pointer text-lg font-semibold"
              >
                Login
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>

  );
}
