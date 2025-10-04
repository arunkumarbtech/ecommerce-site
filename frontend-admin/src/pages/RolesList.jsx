import React, { useEffect, useState } from "react";
import RolePermissionsModal from "../modals/RolePermissionsModal";
import AddRoleModal from "../modals/AddRoleModal";
import { FaEdit, FaTrash, FaKey } from "react-icons/fa";
import api from '../api/api';

export default function RolesList() {
    const [roles, setRoles] = useState([]);
    const [showAddRole, setShowAddRole] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [showPermissionsModal, setShowPermissionsModal] = useState(false);

    const handleAddRole = () => {
        setIsEdit(false);
        setSelectedRole(null);
        setShowAddRole(true);
    };

    const handleEditRole = (role) => {
        setIsEdit(true);
        setSelectedRole(role);
        setShowAddRole(true);
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

    const deleteRole = async (roleId) => {
        if (!window.confirm("Are you sure you want to delete this role?")) return;
        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await api.delete(`/roles/${roleId}`,config);
            alert('Role Deleted Successfully');
            fetchRoles();
        } catch (err) {
            console.error("Error deleting role:", err);
        }
    };

    const assignPermissions = (role) => {
        setSelectedRole(role);
        setShowPermissionsModal(true);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4 text-center text-white">Roles Management</h2>
            <div className="flex flex-wrap gap-4 mt-4 mb-4">
                <input
                    type="text"
                    placeholder="Role Name"
                    // value={username}
                    // onChange={(e) => setUsername(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    className="bg-[#0493fb] text-white px-4 py-2 rounded-lg hover:bg-[#000060] transition"
                >
                    Search
                </button>
                <button
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                >
                    Clear
                </button>
            </div>
            <div className="mt-4 mb-4">
                <button
                    onClick={() => handleAddRole()}
                    className="bg-[#0493fb] text-white px-4 py-2 rounded hover:bg-[#000060] transition"
                >
                    Add Role
                </button>
            </div>
            <table className="min-w-full bg-gray-800 text-white overflow-hidden">
                <thead>
                    <tr>
                        {roles.length > 0 &&
                            Object.keys(roles[0]).map((key) => (
                                <th key={key} className="px-4 py-2 text-left">
                                    {key.replace(/_/g, " ").toUpperCase()}
                                </th>
                            ))}
                        <th className="px-4 py-2 text-left">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map((role) => (
                        <tr key={role.role_id} className="border-b border-gray-700">
                            {Object.keys(role).map((key) => (
                                <td key={key} className="px-4 py-2">
                                    {role[key]}
                                </td>
                            ))}
                            <td className="px-3 py-2 flex gap-4">
                                <FaEdit
                                    className="text-yellow-500 hover:text-yellow-600 cursor-pointer"
                                    size={23}
                                    onClick={() => handleEditRole(role)}
                                />
                                <FaTrash
                                    className="text-red-500 hover:text-red-600 cursor-pointer"
                                    size={23}
                                    onClick={() => deleteRole(role.role_id)}
                                />
                                <FaKey
                                    className="text-green-500 hover:text-green-600 cursor-pointer"
                                    size={23}
                                    onClick={() => assignPermissions(role)}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modals */}
            {showAddRole && (
                <AddRoleModal
                    onClose={() => {
                        setShowAddRole(false);
                        fetchRoles();
                    }}
                    role={selectedRole}
                    isEdit={isEdit}
                />
            )}

            {showPermissionsModal && selectedRole && (
                <RolePermissionsModal
                    role={selectedRole}
                    onClose={() => {
                        setShowPermissionsModal(false);
                        fetchRoles();
                    }}
                />
            )}
        </div>
    );
}
