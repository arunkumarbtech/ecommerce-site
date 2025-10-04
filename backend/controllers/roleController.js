import pool from "../db.js";

export const getRoles = async (req, res) => {
  try {
    const query = `
      SELECT r.role_id, r.role_name, COUNT(rp.permission_id) AS permissions_count
      FROM roles r
      LEFT JOIN role_permissions rp ON r.role_id = rp.role_id
      GROUP BY r.role_id, r.role_name
      ORDER BY r.role_id
    `;

    const result = await pool.query(query);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching roles:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteRole = async (req, res) => {
  const roleId = req.params.id;

  try {
    const systemRoles = ["Superadmin"];
    const roleCheck = await pool.query(
      "SELECT role_name FROM roles WHERE role_id = $1",
      [roleId]
    );
    if (roleCheck.rows.length === 0) {
      return res.status(404).json({ error: "Role not found" });
    }
    if (systemRoles.includes(roleCheck.rows[0].role_name)) {
      return res.status(403).json({ error: "Cannot delete system role" });
    }

    await pool.query(
      "DELETE FROM role_permissions WHERE role_id = $1",
      [roleId]
    );

    await pool.query(
      "DELETE FROM roles WHERE role_id = $1",
      [roleId]
    );

    res.json({ message: "Role deleted successfully" });
  } catch (err) {
    console.error("Error deleting role:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addRole = async (req, res) => {
  const { role_name } = req.body;

  if (!role_name || !role_name.trim()) {
    return res.status(400).json({ error: "Role name is required" });
  }

  try {
    const existing = await pool.query(
      "SELECT * FROM roles WHERE role_name = $1",
      [role_name.trim()]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Role already exists" });
    }

    const result = await pool.query(
      "INSERT INTO roles (role_name) VALUES ($1) RETURNING *",
      [role_name.trim()]
    );

    res.status(201).json({ message: "Role added successfully", role: result.rows[0] });
  } catch (err) {
    console.error("Error adding role:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const getRolePermissions = async (req, res) => {
  const { roleId } = req.params;

  try {
    const query = `
      SELECT p.permission_id, p.permissions_name
      FROM permissions p
      JOIN role_permissions rp ON p.permission_id = rp.permission_id
      WHERE rp.role_id = $1
      ORDER BY p.permission_id
    `;
    const result = await pool.query(query, [roleId]);

    res.json(result.rows); 
  } catch (err) {
    console.error("Error fetching role permissions:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const assignPermissionToRole = async (req, res) => {
  const { roleId } = req.params;
  const { permission_id } = req.body;

  if (!permission_id) {
    return res.status(400).json({ error: "Permission ID is required" });
  }

  try {
    const exists = await pool.query(
      "SELECT * FROM role_permissions WHERE role_id = $1 AND permission_id = $2",
      [roleId, permission_id]
    );

    if (exists.rows.length > 0) {
      return res.status(409).json({ error: "Permission already assigned to this role" });
    }

    await pool.query(
      "INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)",
      [roleId, permission_id]
    );

    res.json({ message: "Permission assigned successfully" });
  } catch (err) {
    console.error("Error assigning permission:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const removePermissionFromRole = async (req, res) => {
  const { roleId, permId } = req.params;

  try {
    await pool.query(
      "DELETE FROM role_permissions WHERE role_id = $1 AND permission_id = $2",
      [roleId, permId]
    );

    res.json({ message: "Permission removed successfully" });
  } catch (err) {
    console.error("Error removing permission:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateRole = async (req, res) => {
    const { id } = req.params;      
    const { role_name } = req.body; 

    try {
        if (!role_name || !role_name.trim()) {
            return res.status(400).json({ error: "Role name is required" });
        }

        const result = await pool.query(
            "UPDATE roles SET role_name = $1 WHERE role_id = $2 RETURNING *",
            [role_name, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Role not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error updating role:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

