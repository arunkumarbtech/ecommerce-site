import React, { useEffect, useState } from "react";
import api from '../api/api';

export default function RolePermissionsModal({ role, onClose }) {
    const [allPermissions, setAllPermissions] = useState([]);
    const [assigned, setAssigned] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const permsRes = await api.get("/permissions", config);
                setAllPermissions(permsRes.data);

                const rolePermRes = await api.get(`/roles/${role.role_id}/permissions`);
                setAssigned(rolePermRes.data.map(p => p.permission_id));
            } catch (err) {
                console.error("Error fetching permissions:", err);
            }
        };
        fetchData();
    }, [role.role_id]);

    const togglePermission = async (permId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };
            if (assigned.includes(permId)) {
                // Remove permission
                await api.delete(`/roles/${role.role_id}/permissions/${permId}`, config);
                setAssigned(assigned.filter(id => id !== permId));
            } else {
                // Assign permission
                await api.post(`/roles/${role.role_id}/permissions`, { permission_id: permId }, config);
                setAssigned([...assigned, permId]);
            }
        } catch (err) {
            console.error("Error updating permission:", err);
            alert("Failed to update permission");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
            <div className="bg-white text-[#000060] rounded-lg p-6 w-96 max-h-[80vh] scrollbar-hidden overflow-y-auto">

                <div className="text-2xl font-extrabold mb-2">
                    Assign Permissions for Role: {role.role_name}
                </div>

                {/* <hr className="border-black mb-2" /> */}

                {/* Table header */}
                <div className="grid grid-cols-[1fr_auto] gap-2 border-b border-black font-semibold pb-2 mb-2">
                    <span>Permission Name</span>
                    <span>Assigned</span>
                </div>

                {/* Permissions rows */}
                <div className="grid gap-1">
                    {allPermissions.map((perm) => (
                        <div
                            key={perm.permission_id}
                            className="grid grid-cols-[1fr_auto] items-center border-b border-black/30 py-1"
                        >
                            <span className="truncate">{perm.permissions_name}</span>
                            <input
                                type="checkbox"
                                checked={assigned.includes(perm.permission_id)}
                                onChange={() => togglePermission(perm.permission_id)}
                                disabled={loading}
                                className="w-4 h-4"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-white rounded bg-[#000060] hover:bg-red-600 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>

    );
}
