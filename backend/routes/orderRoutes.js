import { Router } from 'express';
const router = Router();
import authenticateToken from '../middleware/authenticateToken.js';
import authenticateAdminToken from '../middleware/authenticateAdminToken.js';
import authorize from '../middleware/authorize.js';
import { placeOrder, getOrders, getAllOrders, downloadInvoice } from '../controllers/orderController.js';

// router.post("/placeOrder", authenticateToken, placeOrder);
// router.get("/orderlist", authenticateToken, getOrders);
// router.get('/allorders', getAllOrders);
// router.get("/:orderId/invoice", downloadInvoice);

router.post(
    "/placeOrder",
    authenticateToken,
    placeOrder
);

// Get orders of the logged-in customer
router.get(
    "/orderlist",
    authenticateToken,
    getOrders
);


router.get(
    "/:orderId/invoice",
    authenticateToken,
    downloadInvoice
);

// -------------------- ADMIN ROUTES --------------------
// Admin: get all orders
router.get(
    '/allorders',
    authenticateAdminToken,
    authorize(["view_orders"]),
    getAllOrders
);


export default router;