import { Router } from 'express';
const router = Router();
import authenticateToken from '../middleware/authenticateToken.js';
import authenticateAdminToken from '../middleware/authenticateAdminToken.js';
import authorize from '../middleware/authorize.js';
import { getCoupons, applyCoupon, getAllCoupons, addCoupon, updateCoupon, deleteCoupon } from '../controllers/couponController.js';

// router.get('/', authenticateToken, getCoupons);
// router.post('/apply-coupon', authenticateToken, applyCoupon);
// router.get('/getallcoupons', getAllCoupons);
// router.post('/create', addCoupon);
// router.put("/update/:coupon_id", updateCoupon);
// router.delete("/delete/:coupon_id", deleteCoupon);

router.get(
    '/',
    authenticateToken,
    getCoupons
);

// Customers can apply a coupon
router.post(
    '/apply-coupon',
    authenticateToken,
    applyCoupon
);

// -------------------- ADMIN ROUTES --------------------
// Admins can view all coupons
router.get(
    '/getallcoupons',
    authenticateAdminToken,
    authorize(["view_coupons"]),
    getAllCoupons
);

// Admins can create a new coupon
router.post(
    '/create',
    authenticateAdminToken,
    authorize(["manage_coupons"]),
    addCoupon
);

// Admins can update a coupon
router.put(
    "/update/:coupon_id",
    authenticateAdminToken,
    authorize(["manage_coupons"]),
    updateCoupon
);

// Admins can delete a coupon
router.delete(
    "/delete/:coupon_id",
    authenticateAdminToken,
    authorize(["manage_coupons"]),
    deleteCoupon
);

export default router;