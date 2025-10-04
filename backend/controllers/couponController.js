import pool from "../db.js";
import { calculatePriceDetails } from '../utils/cartPriceCalculator.js';

export const getCoupons = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) return res.status(400).json({ error: "User ID is required" });

        const cartIdQuery = `
            SELECT cart_id
            FROM cart
            WHERE user_id = $1
            LIMIT 1
        `;
        const cartIdResult = await pool.query(cartIdQuery, [userId]);

        if (cartIdResult.rows.length === 0) {
            return res.json({ subtotal: 0, coupons: [] });
        }

        const cartId = cartIdResult.rows[0].cart_id;

        const subtotalQuery = `
            SELECT SUM(ci.quantity * p.price) AS subtotal
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.product_id
            WHERE ci.cart_id = $1
        `;
        const subtotalResult = await pool.query(subtotalQuery, [cartId]);
        const subtotal = Number(subtotalResult.rows[0].subtotal) || 0;

        const couponsQuery = `
            SELECT * FROM coupons WHERE status = 'active' AND valid_from <= NOW() AND valid_to >= NOW() ORDER BY valid_to ASC;
        `;
        const { rows: coupons } = await pool.query(couponsQuery);

        res.json({ subtotal, coupons });
    } catch (error) {
        console.error("Error fetching coupons:", error);
        res.status(500).json({ error: "Failed to fetch coupons" });
    }
};

export const getAllCoupons = async (req, res) => {
    try {
        const result = await pool.query(`SELECT coupon_id,
        coupon_code,
        description,
        discount_type,
        discount_value,
        min_order_amount,
        max_discount_amount,
        TO_CHAR(valid_from, 'YYYY-MM-DD') AS valid_from,
        TO_CHAR(valid_to, 'YYYY-MM-DD') AS valid_to,
        usage_limit,
        status FROM coupons ORDER BY coupon_id ASC`);
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching coupons:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const applyCoupon = async (req, res) => {
    try {
        const user_id = req.user.id;
        const { coupon_code } = req.body;
        if (!user_id || !coupon_code) {
            return res.status(400).json({ error: "User ID and coupon code are required" });
        }

        const couponQuery = `
            SELECT * FROM coupons
            WHERE coupon_code = $1
              AND status = 'active'
              AND valid_from <= NOW()
              AND valid_to >= NOW()
            LIMIT 1
        `;
        const { rows: couponRows } = await pool.query(couponQuery, [coupon_code]);
        if (couponRows.length === 0) {
            return res.status(400).json({ error: "Invalid or expired coupon" });
        }
        const coupon = couponRows[0];

        const cartQuery = `
            SELECT ci.quantity, p.product_id, p.product_name, p.price, p.category_id
            FROM cart c
            JOIN cart_items ci ON c.cart_id = ci.cart_id
            JOIN products p ON ci.product_id = p.product_id
            WHERE c.user_id = $1
        `;
        const { rows: items } = await pool.query(cartQuery, [user_id]);
        if (items.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        const priceDetails = calculatePriceDetails(items);

        const subtotal = priceDetails.subtotal;
        if (subtotal < Number(coupon.min_order_amount || 0)) {
            return res.status(400).json({ error: `Cart subtotal must be at least ₹${coupon.min_order_amount} to use this coupon` });
        }

        let couponDiscount = 0;
        if (coupon.discount_type === "percentage") {
            couponDiscount = (subtotal * Number(coupon.discount_value)) / 100;
            if (coupon.max_discount_amount && couponDiscount > coupon.max_discount_amount) {
                couponDiscount = Number(coupon.max_discount_amount);
            }
        } else if (coupon.discount_type === "flat") {
            couponDiscount = Number(coupon.discount_value);
        }

        const grandTotal = subtotal - priceDetails.discount - couponDiscount + priceDetails.deliveryFee;

        const updatedPriceDetails = {
            ...priceDetails,
            couponCode: coupon.coupon_code,
            couponDiscount,
            grandTotal
        };

        res.json({ items, priceDetails: updatedPriceDetails });

    } catch (error) {
        console.error("Error applying coupon:", error);
        res.status(500).json({ error: "Failed to apply coupon" });
    }
};

export const addCoupon = async (req, res) => {
    try {
        const {
            coupon_code,
            description,
            discount_type,
            discount_value,
            min_order_amount,
            max_discount_amount,
            valid_from,
            valid_to,
            usage_limit,
            status
        } = req.body;

        if (!coupon_code || !discount_type || !discount_value) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const result = await pool.query(
            `INSERT INTO coupons 
        (coupon_code, description, discount_type, discount_value, 
         min_order_amount, max_discount_amount, valid_from, valid_to, 
         usage_limit, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
            [
                coupon_code,
                description || null,
                discount_type,
                discount_value,
                min_order_amount || 0,
                max_discount_amount || null,
                valid_from || null,
                valid_to || null,
                usage_limit || null,
                status || 'active'
            ]
        );

        res.status(201).json({
            message: "Coupon created successfully",
            coupon: result.rows[0],
        });
    } catch (error) {
        console.error("Error creating coupon:", error.message);
        res.status(500).json({ error: "Failed to create coupon" });
    }
};

export const updateCoupon = async (req, res) => {
    try {
        const { coupon_id } = req.params;
        const {
            coupon_code,
            description,
            discount_type,
            discount_value,
            min_order_amount,
            max_discount_amount,
            valid_from,
            valid_to,
            usage_limit,
            status,
        } = req.body;

        if (!coupon_id) {
            return res.status(400).json({ error: "Coupon ID is required" });
        }

        const result = await pool.query(
            `UPDATE coupons
       SET coupon_code = $1,
           description = $2,
           discount_type = $3,
           discount_value = $4,
           min_order_amount = $5,
           max_discount_amount = $6,
           valid_from = $7,
           valid_to = $8,
           usage_limit = $9,
           status = $10
       WHERE coupon_id = $11
       RETURNING *`,
            [
                coupon_code,
                description,
                discount_type,
                discount_value,
                min_order_amount,
                max_discount_amount,
                valid_from,
                valid_to,
                usage_limit,
                status,
                coupon_id,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Coupon not found" });
        }

        res.json({
            message: "Coupon updated successfully",
            coupon: result.rows[0],
        });
    } catch (error) {
        console.error("Error updating coupon:", error.message);
        res.status(500).json({ error: "Failed to update coupon" });
    }
};

export const deleteCoupon = async (req, res) => {
    try {
        const { coupon_id } = req.params;

        if (!coupon_id) {
            return res.status(400).json({ error: "Coupon ID is required" });
        }

        const result = await pool.query(
            "DELETE FROM coupons WHERE coupon_id = $1 RETURNING *",
            [coupon_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Coupon not found" });
        }

        res.json({ message: "Coupon deleted successfully", deleted: result.rows[0] });
    } catch (error) {
        console.error("Error deleting coupon:", error.message);
        res.status(500).json({ error: "Failed to delete coupon" });
    }
};
