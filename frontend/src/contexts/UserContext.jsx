import React, { createContext, useEffect, useState } from "react";
import api from "../api/api";
import axiosInstance from '../utils/axiosInstance';
//created context
export const UserContext = createContext();

export default function UserProvider({ children }) {

    //toggle states for Profile 
    const [activeSession, setActiveSession] = useState("profile");

    //loggedin state
    const [loggedInUser, setLoggedInUser] = useState();
    const [userAddresses, setUserAddresses] = useState();
    const [loadingUser, setLoadingUser] = useState(true);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setLoadingUser(false);
                return;
            }

            try {
                const res = await api.get("/users/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setLoggedInUser(res.data);
            } catch (error) {
                localStorage.removeItem("token");
                setLoggedInUser(null);
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUser();
    }, []);

    // useEffect(() => {
    //     const token = localStorage.getItem("token");

    //     if (!token) {
    //         setLoggedInUser(null);
    //         setLoadingUser(false);
    //         return;
    //     }

    //     apiInstance
    //         .get("/users/me")
    //         .then((res) => setLoggedInUser(res.data))
    //         .catch((err) => {
    //             console.error("Failed to fetch user", err);
    //             setLoggedInUser(null);
    //         })
    //         .finally(() => setLoadingUser(false));
    // }, []);


    const sendOtp = async (number) => {
        try {
            const response = await api.post(`/users/request-otp`, {
                number,
            });

            const { message, isNewUser, otp } = response.data;

            alert(`${message}\n\n OTP: ${otp}`);

            return { success: true, needProfile: isNewUser };
        } catch (error) {
            if (error.response) {
                alert(`❌ ${error.response.data.error || "OTP request failed"}`);
            } else {
                console.error("Error while sending OTP:", error);
                alert("Something went wrong while sending OTP");
            }
            return { success: false };
        }
    };

    // verify OTP
    const verifyOtp = async (number, otp) => {
        try {
            const res = await api.post(`/users/verify-otp`, { number, otp });
            if (res.data.needProfile) {
                return { needProfile: true };
            } else {
                localStorage.setItem('token', res.data.accessToken);
                // localStorage.setItem('refreshtoken', res.data.refreshToken);
                setLoggedInUser(res.data.user);
                return { success: true };
            }
        } catch (err) {
            alert(err.response?.data?.error || "OTP verification failed");
            return { success: false };
        }
    };

    // complete profile
    const completeProfile = async (number, username, email, dob) => {
        try {
            const res = await api.post(`/users/complete-profile`, { number, username, email, dob });
            localStorage.setItem('token', res.data.accessToken);
            // localStorage.setItem('refreshtoken', res.data.refreshToken);
            setLoggedInUser(res.data.user);
            return true;
        } catch (err) {
            alert(err.response?.data?.error || "Profile completion failed");
            return false;
        }
    };

    //logout method
    const logOut = () => {
        localStorage.removeItem('token');
        setLoggedInUser(null);
        setUserAddresses(null);
        setFavorites([]);
    }

    const updateUser = async (updatedData) => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.put(`/users/${updatedData.id}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setLoggedInUser(response.data);
            alert("User Updated");
            return true;
        } catch (err) {
            console.error("Update error:", err);
            alert(err.response?.data?.error || "Something went wrong");
            return false;
        }
    };


    //sync address to state
    const fetchAddress = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const res = await api.get(`/address/user`, config)
            setUserAddresses(res.data)
        }
        catch (error) {
            console.error('error fetching address', error)
        }
    }

    useEffect(() => {
        fetchAddress()
    }, [loggedInUser])

    //edit address
    const editAddress = async (addressName, addressNumber, address, addressId) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
            const res = await api.put(`address/${addressId}`, { addressName, addressNumber, address }, config)
            alert(res.data.message);
            fetchAddress()
        }
        catch (error) {
            console.error('error while updating address', error)
        }
    }


    //add address method
    const addAddress = async (addressName, addressNumber, address) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
            const res = await api.post(`/address/addAddress`, { addressName, addressNumber, address }, config);
            alert(res.data.message);
            fetchAddress()
        } catch (error) {
            console.error('Error While Adding Address', error)
        }
    }

    //delete address
    const deleteAddress = async (addressId) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
            const res = await api.delete(`/address/deleteaddress/${addressId}`, config)
            alert(res.data.message);
            fetchAddress();
        } catch (error) {
            console.error('error while deleting address', error);
        }
    }

    return (
        <UserContext.Provider value={{
            favorites,
            setFavorites,
            addAddress,
            deleteAddress,
            loadingUser,
            userAddresses,
            activeSession,
            setActiveSession,
            loggedInUser,
            logOut,
            updateUser,
            editAddress,
            completeProfile,
            verifyOtp,
            sendOtp
        }}>
            {children}
        </UserContext.Provider>
    )
}