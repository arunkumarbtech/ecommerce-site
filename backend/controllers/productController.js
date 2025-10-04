import pool from "../db.js";

const getProducts = async (req, res) => {
    try {
        const result = await pool.query(`
        SELECT 
        p.*,
        c.category_name AS category,
        co.collection_name AS collection
        FROM products p
        LEFT JOIN categories c 
        ON p.category_id = c.category_id
        LEFT JOIN collections co ON p.collection_id = co.collection_id
        WHERE p.status = 'active'
        ORDER BY p.product_id DESC;
    `);
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching products:", err.message);
        res.status(500).json({ error: "Server error while fetching products" });
    }
};

const getadminProducts = async (req, res) => {
    try {
        const result = await pool.query(`SELECT p.*, c.category_name AS category,co.collection_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.category_id
        LEFT JOIN collections co ON p.collection_id = co.collection_id
        ORDER BY p.product_id DESC`);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server Error' });
    }
};

export const getSingleProduct = async (req, res) => {
    const { id } = req.params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
    }

    try {
        const result = await pool.query(
            `SELECT p.*, c.category_name AS category
                FROM products p
                LEFT JOIN categories c ON p.category_id = c.category_id
                WHERE p.product_id = $1`,
            [productId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching product:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const addProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            category_id,
            productCode,
            brand,
            price,
            stockQuantity,
            mrp,
            status,
            discount,
            collection_id,
            alt_tag,
            bestseller,
            title_id
        } = req.body;

        const imagePaths = req.files && req.files.length > 0
            ? req.files.map(file => `/uploads/${file.filename}`)
            : [];

        const result = await pool.query(
            `INSERT INTO products 
            (product_name,
            description,
            category_id,
            product_code,
            brand,
            price,
            stock_quantity,
            mrp,
            status,
            discount,
            image_path,
            collection_id,
            alt_tag,
            bestseller,
            title_id) 
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
            [
                name,
                description,
                category_id,
                productCode,
                brand,
                price,
                stockQuantity,
                mrp,
                status,
                discount,
                imagePaths,
                collection_id,
                alt_tag,
                bestseller,
                title_id
            ]
        );

        res.json({ message: "Product added successfully", product: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

const updateProduct = async (req, res) => {
    const { productCode } = req.params;
    const {
        name,
        description,
        category_id,
        brand,
        price,
        stockQuantity,
        status,
        mrp,
        discount,
        collection_id,
        alt_tag,
        bestseller,
        title_id
    } = req.body;

    let existingImages = [];
    if (req.body.existingImages) {
        existingImages = JSON.parse(req.body.existingImages);
    }

    const newImages = req.files && req.files.length > 0
        ? req.files.map(file => `/uploads/${file.filename}`)
        : [];

    const finalImages = [...existingImages, ...newImages];

    try {
        const query = `
            UPDATE products
            SET 
                product_name = $1,
                description = $2,
                category_id = $3,
                brand = $4,
                price = $5,
                stock_quantity = $6,
                status = $7,
                mrp = $8,
                discount = $9,
                image_path = $10,
                collection_id = $11,
                alt_tag = $12,
                bestseller = $13,
                title_id = $14,
                updated_at = NOW()
            WHERE product_code = $15
        `;
        const normalize = (val) => (val === "" || val === undefined ? null : val);

        const values = [
            normalize(name),
            normalize(description),
            normalize(category_id),
            normalize(brand),
            normalize(price),
            normalize(stockQuantity),
            normalize(status),
            normalize(mrp),
            normalize(discount),
            finalImages.length > 0 ? finalImages : null,
            normalize(collection_id),
            normalize(alt_tag),
            normalize(bestseller),
            normalize(title_id),
            productCode,
        ];

        await pool.query(query, values);

        res.status(200).json({ message: "Product updated successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating product", error });
    }
};

const deleteProduct = async (req, res) => {
    const { productCode } = req.params;
    try {
        const query = `DELETE FROM products WHERE product_code = $1`;
        await pool.query(query, [productCode]);
        res.status(200).json({ message: "Product deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting product", error });
    }
};

const outofstockProducts = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM products WHERE stock_quantity = 0"
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

const updateOutOfStockProduct = async (req, res) => {
    const { id } = req.params;
    const { quantity, status } = req.body;
    try {
        const result = await pool.query(
            "UPDATE products SET stock_quantity = $1, status = $2 WHERE product_id = $3 RETURNING *",
            [quantity, status, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

export {
    getProducts,
    addProduct,
    deleteProduct,
    getadminProducts,
    updateProduct,
    outofstockProducts,
    updateOutOfStockProduct
};
