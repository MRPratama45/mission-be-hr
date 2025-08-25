const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../config/multer');

// Public routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Protected routes
router.post('/', authenticate, authorize('admin'), upload.single('image'), createProduct);
router.patch('/:id', authenticate, authorize('admin'), upload.single('image'), updateProduct);
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);

module.exports = router;



// ============== be-inter-2 ==============
// const express = require('express');
// const router = express.Router();
// const {
//   getAllProducts,
//   getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct
// } = require('../controllers/productController');

// // GET all products
// router.get('/', getAllProducts);

// // GET product by ID
// router.get('/:id', getProductById);

// // POST create new product
// router.post('/', createProduct);

// // PATCH update product
// router.patch('/:id', updateProduct);

// // DELETE product
// router.delete('/:id', deleteProduct);

// module.exports = router;