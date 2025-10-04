import express from "express";
import {
    getRoles,
    deleteRole,
    addRole,
    getRolePermissions,
    assignPermissionToRole,
    removePermissionFromRole,
    updateRole
} from "../controllers/roleController.js";
import authenticateToken from '../middleware/authenticateToken.js';
import authenticateAdminToken from '../middleware/authenticateAdminToken.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

// //roles
// router.get("/", getRoles);
// router.post("/", addRole);
// router.put("/:id", updateRole);
// router.delete("/:id", deleteRole);

// //permissions
// router.get("/:roleId/permissions", getRolePermissions);
// router.post("/:roleId/permissions", assignPermissionToRole);
// router.delete("/:roleId/permissions/:permId", removePermissionFromRole);

router.get(
    "/",
    authenticateAdminToken,
    authorize(["view_roles"]),
    getRoles
);

// Add a new role
router.post(
    "/",
    authenticateAdminToken,
    authorize(["manage_roles"]),
    addRole
);

// Update a role
router.put(
    "/:id",
    authenticateAdminToken,
    authorize(["manage_roles"]),
    updateRole
);

// Delete a role
router.delete(
    "/:id",
    authenticateAdminToken,
    authorize(["manage_roles"]),
    deleteRole
);

// -------------------- ROLE-PERMISSION MANAGEMENT --------------------

// Get permissions for a role
router.get(
    "/:roleId/permissions",
    authenticateAdminToken,
    authorize(["view_permissions"]),
    getRolePermissions
);

// Assign permission to a role
router.post(
    "/:roleId/permissions",
    authenticateAdminToken,
    authorize(["manage_permissions"]),
    assignPermissionToRole
);

// Remove permission from a role
router.delete(
    "/:roleId/permissions/:permId",
    authenticateAdminToken,
    authorize(["manage_permissions"]),
    removePermissionFromRole
);

export default router;
