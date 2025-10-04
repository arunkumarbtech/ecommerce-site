import React, { useState, useEffect } from "react";
import api from '../api/api';

export default function AddRoleModal({ onClose, role, isEdit }) {
    const [roleName, setRoleName] = useState("");
    const [loading, setLoading] = useState(false);

    // Pre-fill data if editing
    useEffect(() => {
        if (isEdit && role) {
            setRoleName(role.role_name);
        } else {
            setRoleName("");
        }
    }, [isEdit, role]);

    const handleSave = async () => {
        if (!roleName.trim()) return alert("Role name is required");
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            if (isEdit) {
                await api.put(`/roles/${role.role_id}`, { role_name: roleName }, config);
                alert('Role Updated Successfully');
            } else {
                await api.post("/roles", { role_name: roleName }, config);
                alert('Role Added successfully');
            }
            onClose();
        } catch (err) {
            console.error("Error saving role:", err);
            alert("Failed to save role");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
            <div className="bg-gradient-to-tr from-[#0493fb] to-[#000060] text-white rounded-lg p-6 w-96">
                <h3 className="text-xl font-semibold mb-4">
                    {isEdit ? "Edit Role" : "Add New Role"}
                </h3>
                <input
                    type="text"
                    placeholder="Role Name"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
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
                        {loading ? "Saving..." : (isEdit ? "Update" : "Save")}
                    </button>
                </div>
            </div>
        </div>
    );
}
