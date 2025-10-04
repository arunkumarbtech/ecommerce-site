import express from "express";
import { addReview, getReviews } from "../controllers/reviewController.js";
import authenticateToken from '../middleware/authenticateToken.js';
import authenticateAdminToken from '../middleware/authenticateAdminToken.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

router.post("/", authenticateToken, addReview);
router.get("/:productId", getReviews);

export default router;
