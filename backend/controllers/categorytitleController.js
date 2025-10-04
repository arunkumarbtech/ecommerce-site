import pool from "../db.js";

export const getCategoryTitle = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM category_title ORDER BY title_id");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching Category title:", error.message);
        res.status(500).send("Server Error");
    }
};

export const addCategoryTitle = async (req, res) => {
    try {
        const { title_name } = req.body;

        if (!title_name) {
            return res.status(400).json({ error: "title_name is required" });
        }

        const result = await pool.query(
            `INSERT INTO category_title (title_name, created_at, updated_at)
                VALUES ($1, NOW(), NOW())
                RETURNING *`,
            [title_name]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error adding category title:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteCategorytitle = async (req, res) => {
    try {
        const { title_id } = req.params;

        if (!title_id) {
            return res.status(400).json({ error: "Title ID is required" });
        }

        const result = await pool.query(
            "DELETE FROM category_title WHERE title_id = $1 RETURNING *",
            [title_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Category Title not found" });
        }

        res.json({ message: "category title deleted successfully", deleted: result.rows[0] });
    } catch (error) {
        console.error("Error deleting Category title:", error.message);
        res.status(500).json({ error: "Failed to delete category title" });
    }
};

export const updateCategoryTitle = async (req, res) => {
    try {
        const { title_id } = req.params;
        const { title_name } = req.body;

        if (!title_id || !title_name) {
            return res.status(400).json({ error: "title_name is required" });
        }

        const result = await pool.query(
            `UPDATE category_title
            SET title_name = $1, updated_at = NOW()
            WHERE title_id = $2
            RETURNING *`,
            [title_name, title_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Category Title not found" });
        }

        res.json({ message: "Category Title updated successfully", updated: result.rows[0] });

    } catch (error) {
        console.error("Error updating category title:", error.message);
        res.status(500).json({ error: "Failed to update category title" });
    }
};
