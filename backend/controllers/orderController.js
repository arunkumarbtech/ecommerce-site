import pool from "../db.js";
import { calculatePriceDetails } from '../utils/cartPriceCalculator.js';
import { generateInvoicePDF } from "../utils/invoiceGenerator.js";

export const placeOrder = async (req, res) => {
    const client = await pool.connect();

    try {
        const { address_id, payment_method, products, coupon_code } = req.body;
        const user_id = req.user?.id;

        if (!user_id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!address_id || !payment_method || !products || products.length === 0) {
            return res.status(400).json({ error: "Missing fields" });
        }

        // fetch product details
        const productIds = products.map(p => p.product_id);
        const dbProductsRes = await client.query(
            `SELECT product_id, price, category_id FROM products WHERE product_id = ANY($1)`,
            [productIds]
        );
        const dbProducts = dbProductsRes.rows;

        const items = products.map(p => {
            const dbProduct = dbProducts.find(d => d.product_id === Number(p.product_id));
            if (!dbProduct) {
                throw new Error("Invalid product_id");
            }
            if (typeof p.quantity !== "number") {
                throw new Error("Invalid quantity");
            }
            return {
                ...dbProduct,
                quantity: p.quantity
            };
        });

        // calculate base price details
        const priceDetails = calculatePriceDetails(items);

        // default coupon discount
        let couponDiscount = 0;

        // if coupon code provided → validate and apply
        if (coupon_code) {
            const couponQuery = `
                SELECT * FROM coupons
                WHERE coupon_code = $1
                  AND status = 'active'
                  AND valid_from <= NOW()
                  AND valid_to >= NOW()
                LIMIT 1
            `;
            const { rows: couponRows } = await client.query(couponQuery, [coupon_code]);

            if (couponRows.length > 0) {
                const coupon = couponRows[0];

                if (priceDetails.subtotal >= Number(coupon.min_order_amount || 0)) {
                    if (coupon.discount_type === "percentage") {
                        couponDiscount = (priceDetails.subtotal * Number(coupon.discount_value)) / 100;
                        if (coupon.max_discount_amount && couponDiscount > coupon.max_discount_amount) {
                            couponDiscount = Number(coupon.max_discount_amount);
                        }
                    } else if (coupon.discount_type === "flat") {
                        couponDiscount = Number(coupon.discount_value);
                    }
                }
            }
        }

        // final total after both category discount + coupon
        const finalGrandTotal =
            priceDetails.subtotal - priceDetails.discount - couponDiscount + priceDetails.deliveryFee;

        await client.query("BEGIN");

        const orderResult = await client.query(
            `INSERT INTO orders 
             (user_id, address_id, payment_method, total_amount, discount, coupon_discount, delivery_fee, final_amount, coupon_code) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
             RETURNING order_id`,
            [
                user_id,
                address_id,
                payment_method,
                priceDetails.subtotal,
                priceDetails.discount,
                couponDiscount,
                priceDetails.deliveryFee,
                finalGrandTotal,
                coupon_code || null
            ]
        );

        const order_id = orderResult.rows[0].order_id;

        // insert order items
        const insertItemsQuery = `
            INSERT INTO order_items (order_id, product_id, quantity, price) 
            VALUES ($1, $2, $3, $4)
        `;
        for (let item of items) {
            await client.query(insertItemsQuery, [
                order_id,
                item.product_id,
                item.quantity,
                item.price * item.quantity
            ]);

            const updateStockQuery = `
            UPDATE products
            SET stock_quantity = stock_quantity - $1
            WHERE product_id = $2
            AND stock_quantity >= $1
            `;

            const stockResult = await client.query(updateStockQuery, [
                item.quantity,
                item.product_id
            ]);

            if (stockResult.rowCount === 0) {
                throw new Error(`Insufficient stock for product_id ${item.product_id}`);
            }
        }


        await client.query("COMMIT");

        res.status(201).json({
            message: "Order placed",
            order_id,
            priceDetails: {
                ...priceDetails,
                coupon_code: coupon_code || null,
                couponDiscount,
                grandTotal: finalGrandTotal
            }
        });

    } catch (error) {
        await client.query("ROLLBACK");
        res.status(500).json({ error: error.message || "Failed to place order" });
    } finally {
        client.release();
    }
};

export const getOrders = async (req, res) => {
    const userId = req.user.id;

    try {
        const query = `
            SELECT 
                o.*,
                a.* AS selected_address, -- include all address columns
                json_agg(
                    json_build_object(
                        'order_item_id', oi.order_item_id,
                        'quantity', oi.quantity,
                        'price', oi.price,
                        'product', to_jsonb(p)  -- all product columns
                    )
                ) AS items
            FROM orders o
            LEFT JOIN order_items oi ON o.order_id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.product_id
            LEFT JOIN addresses a ON o.address_id = a.address_id  -- join with addresses
            WHERE o.user_id = $1
            GROUP BY o.order_id, a.address_id
            ORDER BY o.created_at DESC;
        `;

        const { rows } = await pool.query(query, [userId]);

        res.json(rows);
    } catch (error) {
        console.error("Error getting orders:", error);
        res.status(500).json({ error: "Failed to get orders list" });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM orders ORDER BY order_id');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const getOrderById = async (req, res) => {
    const client = await pool.connect();
    try {
        const { orderId } = req.params;

        const query = `
      SELECT 
        o.*,
        a.*,
        json_agg(
          json_build_object(
            'order_item_id', oi.order_item_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'product', to_jsonb(p)
          )
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.product_id
      LEFT JOIN addresses a ON o.address_id = a.address_id
      WHERE o.order_id = $1
      GROUP BY o.order_id, a.address_id
    `;

        const { rows } = await client.query(query, [orderId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ error: "Failed to fetch order details" });
    } finally {
        client.release();
    }
}

export const downloadInvoice = async (req, res) => {
    const client = await pool.connect();
    try {
        const { orderId } = req.params;

        const query = `
      SELECT 
        o.*,
        a.*,
        json_agg(
          json_build_object(
            'order_item_id', oi.order_item_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'product', to_jsonb(p)
          )
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.product_id
      LEFT JOIN addresses a ON o.address_id = a.address_id
      WHERE o.order_id = $1
      GROUP BY o.order_id, a.address_id
    `;

        const { rows } = await client.query(query, [orderId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        const order = rows[0];

        generateInvoicePDF(order, res, orderId);

    } catch (error) {
        console.error("Error generating invoice:", error);
        res.status(500).json({ error: "Failed to generate invoice" });
    } finally {
        client.release();
    }
};
