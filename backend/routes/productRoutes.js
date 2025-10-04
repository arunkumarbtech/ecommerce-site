import express from "express";
import {
    getProducts,
    getSingleProduct,
    addProduct,
    getadminProducts,
    updateProduct,
    deleteProduct,
    outofstockProducts,
    updateOutOfStockProduct
} from "../controllers/productController.js";
import upload from '../middleware/upload.js';
import authenticateToken from '../middleware/authenticateToken.js';
import authenticateAdminToken from '../middleware/authenticateAdminToken.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

// router.get("/", getProducts);
// router.get("/adminProducts", getadminProducts);
// router.post("/addnewproduct", upload.array("images", 10), addProduct);
// router.get('/outofstocks', outofstockProducts);
// router.put("/update/:productCode", upload.array("images", 10), updateProduct);
// router.delete('/delete/:productCode', deleteProduct);
// router.put('/:id/update-stock', updateOutOfStockProduct);
// router.get("/:id", getSingleProduct);

router.get("/adminProducts", authenticateAdminToken, authorize(["view_products"]), getadminProducts);
router.get("/outofstocks", authenticateAdminToken, authorize(["view_outOfStock_products"]), outofstockProducts);
router.put("/:id/update-stock", authenticateAdminToken, authorize(["manage_outOfStock_products"]), updateOutOfStockProduct);
router.post("/addnewproduct", authenticateAdminToken, authorize(["manage_products"]), upload.array("images", 10), addProduct);
router.put("/update/:productCode", authenticateAdminToken, authorize(["manage_products"]), upload.array("images", 10), updateProduct);
router.delete("/delete/:productCode", authenticateAdminToken, authorize(["manage_products"]), deleteProduct);

// PUBLIC ROUTES
router.get("/", getProducts);
router.get("/:id", getSingleProduct);

export default router;