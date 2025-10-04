import { Router } from 'express';
const router = Router();
import { addtocart, getCartItems, reduceItemQuantity, deleteItem, emptycart, getCartPriceDetails } from '../controllers/cartController.js'
import authenticateToken from '../middleware/authenticateToken.js';
import authenticateAdminToken from '../middleware/authenticateAdminToken.js';
import authorize from '../middleware/authorize.js';

router.post("/addtocart", authenticateToken, addtocart);
router.get("/", authenticateToken, getCartItems);
router.post("/removeitem", authenticateToken, reduceItemQuantity);
router.delete("/deleteitem", authenticateToken, deleteItem);
router.delete("/emptycart", authenticateToken, emptycart);
router.get("/price-details", authenticateToken, getCartPriceDetails);

export default router;