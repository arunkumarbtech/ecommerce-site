import React, { createContext, useEffect, useState } from "react";
import api from "../api/api";
//created context
export const UserContext = createContext();

export default function UserProvider({ children }) {
    //loggedin state
    const [loggedInUser, setLoggedInUser] = useState();
    const [loadingUser, setLoadingUser] = useState(true);
    const [adminUsers, setAdminUsers] = useState([]);
    const [adminUsersKeys, setAdminUsersKeys] = useState([]);
    const [showCreateEmployeeModal, setShowCreateEmployeeModal] = useState(false);
    const [isEditEmployee, setIsEditEmployee] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [roles, setRoles] = useState([]);


    const fetchUser = async () => {
        const token = localStorage.getItem("adminToken");

        if (!token) {
            setLoadingUser(false);
            return;
        }

        try {
            const res = await api.get("/admin/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLoggedInUser({
                id: res.data.id,
                username: res.data.username,
                name: res.data.name,
                role: res.data.role,
                permissions: res.data.permissions || []
            });
        } catch (error) {
            localStorage.removeItem("adminToken");
            setLoggedInUser(null);
        } finally {
            setLoadingUser(false);
        }
    };

    const fetchAdminUsers = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            const res = await api.get("/admin/all", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAdminUsers(res.data);
            setAdminUsersKeys(Object.keys(res.data[0]))
        } catch (err) {
            console.error("Error fetching admins:", err);
        }
    };

    useEffect(() => {
        fetchUser();
        fetchAdminUsers();
    }, []);

    const adminlogin = async (user) => {
        try {
            const res = await api.post("/admin/login", {
                username: user.username,
                password: user.password,
            });
            localStorage.setItem("adminToken", res.data.token);
            setLoggedInUser({
                id: res.data.id,
                username: res.data.username,
                name: res.data.name,
                role: res.data.role,
                permissions: res.data.permissions || []
            });
            alert("Login Successful!");
            return true;
        } catch (err) {
            alert("Invalid login");
            return false;
        }
    }

    //logout method
    const logOut = () => {
        localStorage.removeItem('adminToken');
        setLoggedInUser(null);
    }

    const createEmployee = async (user) => {
        try {
            const token = localStorage.getItem('adminToken')
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            };
            await api.post('/admin/create/employee', {
                username: user.username,
                password: user.password,
                name: user.name,
                role_id: user.role_id
            }, config)
            alert("Employee Created Successfully");
            fetchAdminUsers();
            return true;
        } catch (error) {
            console.error("Error while Adding Category Title", error);
            return false;
        }
    };


    const deleteEmployee = async (id) => {
        if (!window.confirm("Are you sure you want to delete this Employee?")) return;
        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await api.delete(`/employee/delete/${id}`, config);
            alert("Employee deleted successfully!");
            fetchAdminUsers();
        } catch (error) {
            console.error("Error deleting coupon", error);
        }
    };

    const updateEmployee = async (employee) => {
        try {
            const token = localStorage.getItem('adminToken');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await api.put(`/employee/update/${employee.id}`, employee, config);
            alert("Employee Updated Successfully");
            fetchAdminUsers();
        } catch (error) {
            console.error("Error while updating employee", error);
        }
    };

    const editEmployee = (employee) => {
        setIsEditEmployee(true);
        setEditingEmployee(employee);
        setShowCreateEmployeeModal(true);
    };

    const fetchRoles = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const res = await api.get("/roles",config);
            setRoles(res.data);
        } catch (err) {
            console.error("Error fetching roles:", err);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);


    return (
        <UserContext.Provider value={{
            loadingUser,
            loggedInUser,
            logOut,
            adminlogin,
            adminUsersKeys,
            adminUsers,
            showCreateEmployeeModal,
            setShowCreateEmployeeModal,
            createEmployee,
            updateEmployee,
            deleteEmployee,
            isEditEmployee,
            setIsEditEmployee,
            editingEmployee,
            setEditingEmployee,
            editEmployee,
            roles,
            setRoles
        }}>
            {children}
        </UserContext.Provider>
    )
}