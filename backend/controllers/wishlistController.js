import pool from "../db.js";

// Add or Remove from wishlist (toggle)
export const toggleWishlist = async (req, res) => {
  const userId = req.user.id; // from token
  const { productId } = req.body;

  try {
    // Check if already in wishlist
    const existing = await pool.query(
      "SELECT * FROM wishlist WHERE user_id=$1 AND product_id=$2",
      [userId, productId]
    );

    if (existing.rows.length > 0) {
      // remove
      await pool.query("DELETE FROM wishlist WHERE user_id=$1 AND product_id=$2", [userId, productId]);
      return res.json({ message: "Removed from wishlist", removed: true });
    } else {
      // add
      await pool.query("INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2)", [userId, productId]);
      return res.json({ message: "Added to wishlist", added: true });
    }
  } catch (err) {
    console.error("Wishlist error:", err.message);
    res.status(500).json({ error: "Server error while updating wishlist" });
  }
};

// Get wishlist for user
export const getWishlist = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await pool.query(
      `SELECT 
      p.*,
      c.category_name AS category,
      co.collection_name AS collection
      FROM wishlist w
      JOIN products p 
      ON p.product_id = w.product_id
      LEFT JOIN categories c 
      ON p.category_id = c.category_id
      LEFT JOIN collections co 
      ON p.collection_id = co.collection_id
      WHERE w.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching wishlist:", err.message);
    res.status(500).json({ error: "Server error fetching wishlist" });
  }
};
