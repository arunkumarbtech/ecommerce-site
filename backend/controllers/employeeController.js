import pool from "../db.js";

export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM admins WHERE id = $1', [id]);
        res.json({ msg: 'Employee deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { username, name, role_id } = req.body;

    try {
        const result = await pool.query(
            "UPDATE admins SET username = $1, name = $2, role_id = $3 WHERE id = $4 RETURNING *",
            [username, name, role_id, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json({
            message: "Employee updated successfully",
            employee: result.rows[0]
        });
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};