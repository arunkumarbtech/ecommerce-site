import express from "express";
import {
    getAllPermissions,
    addPermission,
    updatePermission,
    deletePermission
} from "../controllers/permissionController.js";
import authenticateToken from '../middleware/authenticateToken.js';
import authenticateAdminToken from '../middleware/authenticateAdminToken.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

// router.get("/", getAllPermissions);

// router.post("/", addPermission);

// router.put("/:id", updatePermission);

// router.delete("/:id", deletePermission);


// View all permissions
router.get(
    "/",
    authenticateAdminToken,
    authorize(["view_permissions"]),
    getAllPermissions
);

// Add a new permission
router.post(
    "/",
    authenticateAdminToken,
    authorize(["manage_permissions"]),
    addPermission
);

// Update a permission
router.put(
    "/:id",
    authenticateAdminToken,
    authorize(["manage_permissions"]),
    updatePermission
);

// Delete a permission
router.delete(
    "/:id",
    authenticateAdminToken,
    authorize(["manage_permissions"]),
    deletePermission
);
export default router;