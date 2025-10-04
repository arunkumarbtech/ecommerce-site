import express from "express";
import { getCategoryTitle, addCategoryTitle, deleteCategorytitle, updateCategoryTitle } from '../controllers/categorytitleController.js';
import authenticateToken from '../middleware/authenticateToken.js';
import authenticateAdminToken from '../middleware/authenticateAdminToken.js';
import authorize from '../middleware/authorize.js';
const router = express.Router();

// router.get("/", getCategoryTitle);
// router.post('/addcategorytitle', addCategoryTitle);
// router.delete('/delete/:title_id', deleteCategorytitle);
// router.put("/update/:title_id", updateCategoryTitle);

router.get("/", authenticateAdminToken, authorize(["view_category_title"]), getCategoryTitle);

// Add a category title
router.post(
    '/addcategorytitle',
    authenticateAdminToken,
    authorize(["manage_category_title"]),
    addCategoryTitle
);

// Delete a category title
router.delete(
    '/delete/:title_id',
    authenticateAdminToken,
    authorize(["manage_category_title"]),
    deleteCategorytitle
);

// Update a category title
router.put(
    "/update/:title_id",
    authenticateAdminToken,
    authorize(["manage_category_title"]),
    updateCategoryTitle
);

export default router;