import React, { useContext, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import ResizableTable from '../components/ResizableTable';
import AddPermissionsModal from "../modals/AddPermissionsModal";
import api from '../api/api';

export default function PermissionsList() {

    const [permissions, setPermissions] = useState([]);
    const [permissionsKeys, setPermissionsKeys] = useState([]);
    const [permissionName, setPermissionName] = useState("");
    const [showPermissionModal, setShowPermissionModal] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [selectedPermission, setSelectedPermission] = useState(null);

    const handleSearch = () => {
        console.log("Search clicked", { permissionName });
    };

    const handleClear = () => {
        setPermissionName("");
    };

    const fetchPremissions = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            const res = await api.get("/permissions", config);
            setPermissions(res.data);
            setPermissionsKeys(Object.keys(res.data[0]));
        } catch (err) {
            console.error("Error fetching roles:", err);
        }
    };

    useEffect(() => {
        fetchPremissions();
    }, []);

    const handleAddPermission = () => {
        setIsEdit(false);
        setSelectedPermission(null);
        setShowPermissionModal(true);
    };

    const handleEditPermission = (permission) => {
        setIsEdit(true);
        setSelectedPermission(permission);
        setShowPermissionModal(true);
    };

    const deletePermission = async (permissionId) => {
        if (!window.confirm("Are you sure you want to delete this permission?")) return;
        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            await api.delete(`/permissions/${permissionId}`, config);
            alert("Permission Deleted Successfully");
            fetchPremissions();
        } catch (err) {
            console.error("Error deleting permission:", err);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-white text-center m">
                Permissions List
            </h1>
            <div className="flex flex-wrap gap-4 mt-4 mb-4">
                <input
                    type="text"
                    placeholder="Permission Name"
                    value={permissionName}
                    onChange={(e) => setPermissionName(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSearch}
                    className="bg-[#0493fb] text-white px-4 py-2 rounded-lg hover:bg-[#000060] transition"
                >
                    Search
                </button>
                <button
                    onClick={handleClear}
                    className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                >
                    Clear
                </button>
            </div>

            <div className="flex justify-end mb-6">
                <button
                    onClick={handleAddPermission}
                    className="flex items-center gap-2 bg-[#0493fb] text-white px-4 py-3 rounded-lg hover:bg-[#000060] transition"
                >
                    <FaPlus size={20} />
                    Add new Permission
                </button>
            </div>


            <ResizableTable
                columns={permissionsKeys}
                data={permissions}
                onEdit={(permission) => handleEditPermission(permission)}
                onDelete={(permission) => deletePermission(permission.permission_id)}
            />

            {showPermissionModal && (
                <AddPermissionsModal
                    onClose={() => {
                        setShowPermissionModal(false);
                        fetchPremissions();
                    }}
                    permission={selectedPermission}
                    isEdit={isEdit}
                />
            )}
        </div>
    );
}
