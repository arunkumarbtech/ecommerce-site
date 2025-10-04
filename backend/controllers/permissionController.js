import pool from "../db.js";

export const getAllPermissions = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM permissions ORDER BY permission_id");
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching permissions:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const addPermission = async (req, res) => {
    const { permissions_name } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO permissions (permissions_name) VALUES ($1) RETURNING *",
            [permissions_name]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Error adding permission:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// Update permission
export const updatePermission = async (req, res) => {
    const { id } = req.params;
    const { permissions_name } = req.body;
    try {
        const result = await pool.query(
            "UPDATE permissions SET permissions_name = $1 WHERE permission_id = $2 RETURNING *",
            [permissions_name, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Permission not found" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error updating permission:", err);
        res.status(500).json({ error: "Server error" });
    }
};

// Delete permission
export const deletePermission = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "DELETE FROM permissions WHERE permission_id = $1 RETURNING *",
            [id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Permission not found" });
        }
        res.json({ message: "Permission deleted successfully" });
    } catch (err) {
        console.error("Error deleting permission:", err);
        res.status(500).json({ error: "Server error" });
    }
};