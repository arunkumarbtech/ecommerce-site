import React, { useContext, useEffect, useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { UserContext } from "../contexts/UserContext";
import ResizableTable from '../components/ResizableTable';
import CreateEmployeeModal from "../modals/CreateEmployeeModal";

export default function EmployeesList() {
    const {
        adminUsersKeys,
        adminUsers,
        showCreateEmployeeModal,
        setShowCreateEmployeeModal,
        deleteEmployee,
        editEmployee
    } = useContext(UserContext);
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");

    const handleSearch = () => {
        console.log("Search clicked", { username, name });
    };

    const handleClear = () => {
        setUsername("");
        setName("");
    };

    

    return (
        <div className="p-6">
            <h1 className="text-white text-center m">
                Employee List
            </h1>
            <div className="flex flex-wrap gap-4 mt-4 mb-4">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    onClick={() => setShowCreateEmployeeModal(true)}
                    className="flex items-center gap-2 bg-[#0493fb] text-white px-4 py-3 rounded-lg hover:bg-[#000060] transition"
                >
                    <FaUserPlus size={20} />
                    Create New Employee
                </button>
            </div>


            <ResizableTable
                columns={adminUsersKeys}
                data={adminUsers}
                onEdit={(emp) => editEmployee(emp)}
                onDelete={(emp) => deleteEmployee(emp.id)}
            />

            {showCreateEmployeeModal && <CreateEmployeeModal onClose={() => setShowCreateEmployeeModal(false)} />}
        </div>
    );
}
