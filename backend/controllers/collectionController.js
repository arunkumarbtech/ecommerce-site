import pool from '../db.js';

export const getCollections = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM collections ORDER BY collection_id');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const createCollection = async (req, res) => {
    try {
        const { collection_name, description } = req.body;
        let collection_image = req.file ? `/uploads/${req.file.filename}` : null;

        const result = await pool.query(
            `INSERT INTO collections (collection_name, description, collection_image) 
       VALUES ($1, $2, $3) RETURNING *`,
            [collection_name, description, collection_image]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};


export const updateCollection = async (req, res) => {
    try {
        const { id } = req.params;
        const { collection_name, description, remove_image } = req.body;

        let collection_image = null;

        if (req.file) {
            // new image uploaded
            collection_image = `/uploads/${req.file.filename}`;
        } else if (remove_image === "true") {
            // remove existing image
            collection_image = null;
        } else {
            // keep existing image
            const { rows } = await pool.query(
                "SELECT collection_image FROM collections WHERE collection_id = $1",
                [id]
            );
            collection_image = rows[0]?.collection_image || null;
        }

        const result = await pool.query(
            `UPDATE collections 
       SET collection_name = $1, description = $2, collection_image = $3, updated_at = CURRENT_TIMESTAMP
       WHERE collection_id = $4 RETURNING *`,
            [collection_name, description, collection_image, id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

export const deleteCollection = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM collections WHERE collection_id = $1', [id]);
        res.json({ msg: 'Collection deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const getCollectionProducts = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                cp.collection_products_id,
                cp.collection_id,
                c.collection_name,
                cp.product_id,
                p.product_name,
                cp.created_at
            FROM collection_products cp
            JOIN collections c ON cp.collection_id = c.collection_id
            JOIN products p ON cp.product_id = p.product_id
            ORDER BY cp.collection_id
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};


export const addProductToCollection = async (req, res) => {
    try {
        const { collection_id } = req.params;
        const { product_id } = req.body;

        const result = await pool.query(
            'INSERT INTO collection_products (collection_id, product_id) VALUES ($1, $2) RETURNING *',
            [collection_id, product_id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const removeProductFromCollection = async (req, res) => {
    try {
        const { collection_id, product_id } = req.params;

        await pool.query(
            'DELETE FROM collection_products WHERE collection_id = $1 AND product_id = $2',
            [collection_id, product_id]
        );

        res.json({ msg: 'Product removed from collection' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const getProductsInCollection = async (req, res) => {
    try {
        const { collection_id } = req.params;
        const result = await pool.query(
            `SELECT p.* 
       FROM products p
       JOIN collection_products cp ON p.product_id = cp.product_id
       WHERE cp.collection_id = $1`,
            [collection_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

export const updateCollectionProduct = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { collection_id, product_id } = req.body;

        const result = await pool.query(
            `UPDATE collection_products 
             SET collection_id = $1, product_id = $2
             WHERE collection_products_id = $3 
             RETURNING *`,
            [collection_id, product_id, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Collection product not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};
