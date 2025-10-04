import pool from "../db.js";

// Add a review
export const addReview = async (req, res) => {
    const user_id = req.user.id;
    const { product_id, rating, comment } = req.body;

    if (!product_id || !user_id || !rating || !comment) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const result = await pool.query(
            "INSERT INTO product_reviews (product_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *",
            [product_id, user_id, rating, comment]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error adding review:", err.message);
        res.status(500).json({ error: "Server error" });
    }
};

export const getReviews = async (req, res) => {
    const productId = parseInt(req.params.productId, 10);
    if (isNaN(productId)) return res.status(400).json({ error: "Invalid product ID" });

    try {
        const result = await pool.query(
            `SELECT r.*, u.username AS user
             FROM product_reviews r
             JOIN users u ON r.user_id = u.id
             WHERE r.product_id = $1
             ORDER BY r.created_at DESC`,
            [productId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching reviews:", err.message);
        res.status(500).json({ error: "Server error" });
    }
};

