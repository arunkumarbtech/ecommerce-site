import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";

export default function CreateEmployeeModal({ onClose }) {
    const {
        createEmployee,
        updateEmployee,
        isEditEmployee,
        setIsEditEmployee,
        editingEmployee,
        roles
    } = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role_id, setRole_id] = useState('');

    useEffect(() => {
        if (isEditEmployee && editingEmployee) {
            setUsername(editingEmployee.username);
            setName(editingEmployee.name);
            setPassword(editingEmployee.password);
            setRole_id(editingEmployee.role_id)
        } else {
            setUsername('');
            setName('');
            setPassword('');
            setRole_id('');
        }
    }, [isEditEmployee, editingEmployee]);

    const handleSubmit = async () => {
        if (isEditEmployee) {
            await updateEmployee({ id: editingEmployee.id, username, name, role_id });
            setIsEditEmployee(false);
        } else {
            await createEmployee({ username, name, password, role_id });
        }
        setUsername('');
        setName('');
        setPassword('');
        setRole_id('');
        onClose();
    };

    const handleClose = () => {
        setIsEditEmployee(false);
        onClose();
    };


    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-49">
            <div className="bg-gradient-to-tr from-[#0493fb] to-[#000060] text-white rounded-xl shadow-lg w-96 p-6">
                <h2 className="text-xl font-semibold mb-4">{isEditEmployee ? "Edit Employee" : "Create Employee"}</h2>
                <form onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmit({ username, password, name, role_id });
                }} className="space-y-4">

                    <div>
                        <label
                            htmlFor="username"
                            className="block text-[20px] font-medium"
                        >
                            UserName<span className="text-red-700">*</span>
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter User Name"
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2  focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-[20px] font-medium"
                        >
                            Password<span className="text-red-700">*</span>
                        </label>
                        <input
                            id="password"
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter Password"
                            className={`mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none ${isEditEmployee ? 'cursor-not-allowed !bg-black/10 !text-white ' : ''
                                }`}
                            required
                            disabled={isEditEmployee}
                        />
                    </div>


                    <div className="addproduct-element">
                        <label className="addproduct-element-label flex items-center justify-between">
                            Role :
                        </label>
                        <select
                            name="role"
                            value={role_id}
                            onChange={(e) => setRole_id(e.target.value)}
                            className="addproduct-element-input"

                        >
                            <option className="h-10" value="">-- Select Role --</option>
                            {roles.map((role) => (
                                <option key={role.role_id} value={role.role_id}>
                                    {role.role_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label
                            htmlFor="name"
                            className="block text-[20px] font-medium"
                        >
                            Name<span className="text-red-700">*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter Name"
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2  focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
                            required
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 space-x-2">
                        <button
                            type="button"
                            onClick={() => {
                                handleClose()
                                onClose();
                            }}
                            className="px-4 py-2 rounded-lg bg-[#0493fb]  hover:bg-red-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-[#0493fb] text-white hover:bg-[#000060]"
                        >
                            {isEditEmployee ? "Update" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
