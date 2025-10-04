import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// export const adminLogin = async (req, res) => {
//     const { username, password } = req.body;
//     try {
//         const result = await pool.query(
//             "SELECT * FROM admins WHERE username = $1",
//             [username]
//         );

//         if (result.rows.length === 0) {
//             return res.status(401).json({ error: "Invalid username or password" });
//         }

//         const admin = result.rows[0];

//         const isMatch = await bcrypt.compare(password, admin.password);
//         if (!isMatch) {
//             return res.status(401).json({ error: "Invalid username or password" });
//         }

//         const token = jwt.sign(
//             { id: admin.id, username: admin.username },
//             process.env.ACCESS_TOKEN_SECRET,
//             { expiresIn: "8h" }
//         );

//         res.json({ token, username: admin.username, name: admin.name });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Server error" });
//     }
// };

export const getEmployees = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                a.*,
                r.role_name,
                TO_CHAR(a.created_at, 'YYYY-MM-DD HH24:MI') AS created_at
            FROM admins a
            JOIN roles r ON r.role_id = a.role_id
            ORDER BY a.id ASC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

// export const getAdminMe = async (req, res) => {
//     try {
//         const { id } = req.user;

//         const result = await pool.query("SELECT id, username,name FROM admins WHERE id = $1", [id]);

//         if (result.rows.length === 0) {
//             return res.status(404).json({ error: "Admin not found" });
//         }

//         res.json(result.rows[0]);
//     } catch (error) {
//         console.error("Error in getAdminMe:", error);
//         res.status(500).json({ error: "Server error" });
//     }
// };

export const createEmployee = async (req, res) => {
    const { username, password, name, role_id } = req.body;
    try {

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const result = await pool.query(
            "INSERT INTO admins (username, password, name, role_id, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *",
            [username, hashedPassword, name, role_id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

export const adminLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query(
            "SELECT * FROM admins WHERE username = $1",
            [username]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        const admin = result.rows[0];

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Fetch role and permissions
        const roleRes = await pool.query(
            `SELECT r.role_name, p.permissions_name
            FROM roles r
            LEFT JOIN role_permissions rp ON r.role_id = rp.role_id
            LEFT JOIN permissions p ON rp.permission_id = p.permission_id
            WHERE r.role_id = $1`,
            [admin.role_id]
        );

        const permissions = roleRes.rows.map(row => row.permissions_name).filter(Boolean);
        const roleName = roleRes.rows.length > 0 ? roleRes.rows[0].role_name : null;

        // Create JWT with role and permissions
        const token = jwt.sign(
            {
                id: admin.id,
                username: admin.username,
                role: roleName,
                permissions: permissions
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "8h" }
        );

        res.json({
            token,
            username: admin.username,
            name: admin.name,
            role: roleName,
            permissions
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

export const getAdminMe = async (req, res) => {
    try {
        const { id } = req.user;

        // Fetch admin info + role + permissions
        const result = await pool.query(
            `SELECT a.id, a.username, a.name, r.role_name, p.permissions_name
             FROM admins a
             LEFT JOIN roles r ON a.role_id = r.role_id
             LEFT JOIN role_permissions rp ON r.role_id = rp.role_id
             LEFT JOIN permissions p ON rp.permission_id = p.permission_id
             WHERE a.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Admin not found" });
        }

        const admin = {
            id: result.rows[0].id,
            username: result.rows[0].username,
            name: result.rows[0].name,
            role: result.rows[0].role_name,
            permissions: result.rows.map(row => row.permissions_name).filter(Boolean) // remove nulls
        };

        res.json(admin);
    } catch (error) {
        console.error("Error in getAdminMe:", error);
        res.status(500).json({ error: "Server error" });
    }
};

