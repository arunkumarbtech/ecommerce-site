import express from 'express';
import {
    getCollections,
    createCollection,
    updateCollection,
    deleteCollection,
    addProductToCollection,
    removeProductFromCollection,
    getProductsInCollection,
    getCollectionProducts,
    updateCollectionProduct
} from '../controllers/collectionController.js';
import upload from '../middleware/upload.js';
import authenticateToken from '../middleware/authenticateToken.js';
import authenticateAdminToken from '../middleware/authenticateAdminToken.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

// //collections
// router.get('/', getCollections);
// router.post("/create", upload.single("collection_image"), createCollection);
// router.put("/update/:id", upload.single("collection_image"), updateCollection);
// router.delete('/delete/:id', deleteCollection);

// //collection products 
// router.get('/collectionproducts',getCollectionProducts)
// router.post('/create/:collection_id/products', addProductToCollection);
// router.delete('/delete/:collection_id/products/:product_id', removeProductFromCollection);
// router.get('/:collection_id/products', getProductsInCollection);
// router.put('/update/collectionproduct/:id', updateCollectionProduct);


// View all collections
router.get(
    '/',
    authenticateAdminToken,
    authorize(["view_collections"]),
    getCollections
);

// Create a new collection
router.post(
    "/create",
    authenticateAdminToken,
    authorize(["manage_collections"]),
    upload.single("collection_image"),
    createCollection
);

// Update a collection
router.put(
    "/update/:id",
    authenticateAdminToken,
    authorize(["manage_collections"]),
    upload.single("collection_image"),
    updateCollection
);

// Delete a collection
router.delete(
    '/delete/:id',
    authenticateAdminToken,
    authorize(["manage_collections"]),
    deleteCollection
);

// -------------------- COLLECTION PRODUCTS --------------------
// View all collection products
router.get(
    '/collectionproducts',
    authenticateAdminToken,
    authorize(["view_collection_products"]),
    getCollectionProducts
);

// Add product to a collection
router.post(
    '/create/:collection_id/products',
    authenticateAdminToken,
    authorize(["manage_collection_products"]),
    addProductToCollection
);

// Remove product from a collection
router.delete(
    '/delete/:collection_id/products/:product_id',
    authenticateAdminToken,
    authorize(["manage_collection_products"]),
    removeProductFromCollection
);

// Get products in a specific collection
router.get(
    '/:collection_id/products',
    authenticateAdminToken,
    authorize(["view_collection_products"]),
    getProductsInCollection
);

// Update a product in a collection
router.put(
    '/update/collectionproduct/:id',
    authenticateAdminToken,
    authorize(["manage_collection_products"]),
    updateCollectionProduct
);



export default router;