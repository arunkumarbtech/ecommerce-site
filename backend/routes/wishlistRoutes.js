import express from "express";
import { toggleWishlist, getWishlist } from "../controllers/wishlistController.js";
import authenticateToken from '../middleware/authenticateToken.js';
import authenticateAdminToken from '../middleware/authenticateAdminToken.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

// toggle add/remove
router.post("/toggle", authenticateToken, toggleWishlist);

// get wishlist for logged in user
router.get("/", authenticateToken, getWishlist);

export default router;
