import pool from "../db.js";

export const getCategories = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM categories ORDER BY category_id");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching categories:", err.message);
        res.status(500).send("Server Error");
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM categories WHERE category_id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.json({ message: "Category deleted successfully", deleted: result.rows[0] });
    } catch (err) {
        console.error("Error deleting category:", err.message);
        res.status(500).send("Server Error");
    }
};

export const addCategory = async (req, res) => {
    try {
        const { category_name } = req.body;
        let category_image = req.file ? `/uploads/${req.file.filename}` : null;

        const result = await pool.query(
            "INSERT INTO categories (category_name, category_image) VALUES ($1, $2) RETURNING *",
            [category_name, category_image]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error adding category:", err.message);
        res.status(500).send("Server Error");
    }
};

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { category_name, remove_image } = req.body;
        let category_image = req.file ? `/uploads/${req.file.filename}` : null;

        let query = `UPDATE categories SET category_name = $1, updated_at = NOW()`;
        let values = [category_name];

        if (category_image) {
            // New image uploaded
            query += `, category_image = $2 WHERE category_id = $3 RETURNING *`;
            values = [category_name, category_image, id];
        } else if (remove_image === "true") {
            // Remove existing image
            query += `, category_image = NULL WHERE category_id = $2 RETURNING *`;
            values = [category_name, id];
        } else {
            // Keep existing image
            query += ` WHERE category_id = $2 RETURNING *`;
            values = [category_name, id];
        }

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error updating category:", err.message);
        res.status(500).send("Server Error");
    }
};

export const getProductsByCategory = async (req, res) => {
    try {
        const { category_id } = req.params;

        const result = await pool.query(
            `SELECT 
            p.*,
            c.*
            FROM products p
            JOIN categories c ON p.category_id = c.category_id
            WHERE p.category_id = $1
            ORDER BY p.product_id`,
            [category_id]
        );

        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching products by category:", err.message);
        res.status(500).send("Server Error");
    }
};

