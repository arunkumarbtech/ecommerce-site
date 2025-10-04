import React, { useState, useEffect } from "react";
import api from '../api/api';

export default function AddPermissionsModal({ onClose, permission, isEdit }) {
    const [permissionName, setPermissionName] = useState("");
    const [loading, setLoading] = useState(false);

    // Pre-fill data if editing
    useEffect(() => {
        if (isEdit && permission) {
            setPermissionName(permission.permissions_name);
        } else {
            setPermissionName("");
        }
    }, [isEdit, permission]);

    const handleSave = async () => {
        if (!permissionName.trim()) return alert("Permission name is required");

        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            if (isEdit) {
                await api.put(`/permissions/${permission.permission_id}`, { permissions_name: permissionName }, config);
                alert("Permission Updated Successfully");
            } else {
                await api.post("/permissions", { permissions_name: permissionName }, config);
                alert("Permission Added Successfully");
            }

            onClose();
        } catch (err) {
            console.error("Error saving permission:", err);
            alert("Failed to save permission");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
            <div className="bg-gradient-to-tr from-[#0493fb] to-[#000060] text-white rounded-lg p-6 w-96">
                <h3 className="text-xl font-semibold mb-4">
                    {isEdit ? "Edit Permission" : "Add New Permission"}
                </h3>
                <input
                    type="text"
                    placeholder="Permission Name"
                    value={permissionName}
                    onChange={(e) => setPermissionName(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-gray-700 border border-[#0493fb] mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-red-500 hover:bg-red-600"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded bg-[#0493fb] hover:bg-[#000060]"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : isEdit ? "Update" : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}
