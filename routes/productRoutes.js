const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// GET all products
router.get('/', getAllProducts);

// GET product by ID
router.get('/:id', getProductById);

// POST create new product
router.post('/', createProduct);

// PATCH update product
router.patch('/:id', updateProduct);

// DELETE product
router.delete('/:id', deleteProduct);

module.exports = router;