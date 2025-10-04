import express from "express";
import { getCategories, addCategory, deleteCategory, updateCategory, getProductsByCategory } from "../controllers/categoryController.js";
import upload from '../middleware/upload.js';
import authenticateToken from '../middleware/authenticateToken.js';
import authenticateAdminToken from '../middleware/authenticateAdminToken.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

// Routes
router.get("/", getCategories);

router.post(
    "/addcategory",
    authenticateAdminToken,
    authorize(["manage_categories"]),
    upload.single("category_image"),
    addCategory
);

router.put(
    "/update/:id",
    authenticateAdminToken,
    authorize(["manage_categories"]),
    upload.single("category_image"),
    updateCategory
);

router.delete(
    "/delete/:id",
    authenticateAdminToken,
    authorize(["manage_categories"]),
    deleteCategory
);

router.get(
    "/:category_id/products", getProductsByCategory
);

export default router;
