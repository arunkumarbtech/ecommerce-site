import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { MdOutlineDoNotDisturbAlt } from "react-icons/md";

export default function ProtectedRoute({ element, requiredPermissions = [] }) {
    const { loggedInUser, loadingUser } = useContext(UserContext);

    if (loadingUser) {
        return <div>Loading...</div>;
    }

    if (!loggedInUser) {
        return <Navigate to="/auth" replace />;
    }

    const userPermissions = loggedInUser.permissions || [];
    const hasPermission = requiredPermissions.every((perm) =>
        userPermissions.includes(perm)
    );

    if (!hasPermission) {
        return (
            <div className="h-screen flex flex-col items-center justify-center">
                <h2 className="text-red-600 text-2xl flex font-semibold mb-4">
                     <MdOutlineDoNotDisturbAlt size={50}/><span className="text-justify items-center justify-center flex"> Access Denied</span>
                </h2>
                <p className="text-white text-lg text-center max-w-md">
                    You don’t have permission to view this page.
                </p>
            </div>
        )
    }

    return element;
}
