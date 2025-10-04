import pool from '../db.js';
import {calculatePriceDetails} from '../utils/cartPriceCalculator.js';

export const addtocart = async (req, res) => {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;
    try {
        let cartResult = await pool.query(
            "SELECT cart_id FROM cart WHERE user_id = $1",
            [userId]
        );

        let cartId;
        if (cartResult.rows.length === 0) {
            const newCart = await pool.query("INSERT INTO cart (user_id) VALUES ($1) RETURNING cart_id", [userId])
            cartId = newCart.rows[0].cart_id;
        } else {
            cartId = cartResult.rows[0].cart_id;
        }

        const itemResult = await pool.query("SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2", [cartId, product_id])

        if (itemResult.rows.length > 0) {
            const updatedItem = await pool.query(
                "UPDATE cart_items SET quantity = quantity + $1 WHERE cart_id = $2 AND product_id = $3 RETURNING *",
                [quantity, cartId, product_id]
            );
            return res.json(updatedItem.rows[0]);
        } else {
            const newItem = await pool.query(
                "INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *",
                [cartId, product_id, quantity]
            );
            return res.json(newItem.rows[0]);
        }
    }
    catch (error) {
        console.error("Error adding to cart:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

export const getCartItems = async (req, res) => {
    const userId = req.user.id;
    try {
        const cartResult = await pool.query(
            "SELECT cart_id FROM cart WHERE user_id = $1",
            [userId]
        );

        if (cartResult.rows.length === 0) {
            return res.json([]);
        }

        const cartId = cartResult.rows[0].cart_id;

        const itemsResult = await pool.query(
            `SELECT ci.cart_item_id, ci.product_id, ci.quantity, 
                p.*
                FROM cart_items ci
                JOIN products p ON ci.product_id = p.product_id
                WHERE ci.cart_id = $1`,
            [cartId]
        );

        res.json(itemsResult.rows);
    } catch (error) {
        console.error("Error adding to cart:", error.message);
        res.status(500).json({ error: "Server error" });
    }
}

export const reduceItemQuantity = async (req, res) => {
    const userId = req.user.id;
    const { product_id } = req.body;
    try {
        const cartResult = await pool.query(
            "SELECT cart_id FROM cart WHERE user_id = $1",
            [userId]
        );
        if (cartResult.rows.length === 0) {
            return res.status(404).json({ error: "Cart not found" });
        }
        const cartId = cartResult.rows[0].cart_id;

        const itemResult = await pool.query(
            "SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2",
            [cartId, product_id]
        );
        if (itemResult.rows.length === 0) {
            return res.status(404).json({ error: "Product not found in cart" });
        }

        const item = itemResult.rows[0];

        if (item.quantity > 1) {
            const updatedItem = await pool.query(
                "UPDATE cart_items SET quantity = quantity - 1 WHERE cart_id = $1 AND product_id = $2 RETURNING *",
                [cartId, product_id]
            );
            return res.json(updatedItem.rows[0]);
        } else {
            await pool.query(
                "DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2",
                [cartId, product_id]
            );
            return res.json({ message: "Item removed from cart" });
        }
    } catch (error) {
        console.error("Error reduce Item Quantity:", error.message);
        res.status(500).json({ error: "Server error" });
    }
}

export const deleteItem = async (req, res) => {
    const userId = req.user.id;
    const { product_id } = req.body;
    try {

        const cartResult = await pool.query("SELECT cart_id FROM cart WHERE user_id = $1", [userId]);

        if (cartResult.rows.length === 0) {
            return res.status(404).json({ error: "Cart not found" });
        }

        const cartId = cartResult.rows[0].cart_id;

        const itemResult = await pool.query(
            "SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2",
            [cartId, product_id]
        );

        if (itemResult.rows.length === 0) {
            return res.status(404).json({ error: "Item not found in cart" });
        }

        await pool.query(
            "DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2",
            [cartId, product_id]
        );

        return res.json({ message: "Item deleted successfully" });

    } catch (error) {
        console.error("Error while deleting item:", error.message);
        res.status(500).json({ error: "Server error" });
    }
}

export const emptycart = async (req, res) => {
    const userId = req.user.id;
    try {
        const cartResult = await pool.query("SELECT cart_id FROM cart WHERE user_id = $1", [userId]);

        if (cartResult.rows.length === 0) {
            return res.status(404).json({ error: "Cart not found" });
        }

        const cartId = cartResult.rows[0].cart_id;

        await pool.query("DELETE FROM cart_items WHERE cart_id = $1", [cartId]);

        return res.json({ message: "Items removed Successfully" });

    } catch (error) {
        console.error("Error while deleting item:", error.message);
        res.status(500).json({ error: "Server error" });
    }
}

export const getCartPriceDetails = async (req, res) => {
    const userId = req.user.id;
    try {
        const query = `
            SELECT 
                ci.cart_item_id, 
                ci.quantity, 
                p.product_id, 
                p.product_name, 
                p.price, 
                p.category_id
            FROM cart c
            JOIN cart_items ci ON c.cart_id = ci.cart_id
            JOIN products p ON ci.product_id = p.product_id
            WHERE c.user_id = $1
        `;
        const { rows: items } = await pool.query(query, [userId]);

        const priceDetails = calculatePriceDetails(items);

        res.json({ items, priceDetails });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to calculate price details" });
    }
};
