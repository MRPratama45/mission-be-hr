const express = require('express');
const router = express.Router();
const {
  register,
  login,
  verifyEmail,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email', verifyEmail);

// Protected routes
router.get('/', authenticate, authorize('admin'), getAllUsers);
router.get('/:id', authenticate, getUserById);
router.patch('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

module.exports = router;




// ============ be-inter-2 ===========
// const express = require('express');
// const router = express.Router();
// const {
//   getAllUsers,
//   getUserById,
//   createUser,
//   updateUser,
//   deleteUser
// } = require('../controllers/userController');

// // GET all users
// router.get('/', getAllUsers);

// // GET user by ID
// router.get('/:id', getUserById);

// // POST create new user
// router.post('/', createUser);

// // PATCH update user
// router.patch('/:id', updateUser);

// // DELETE user
// router.delete('/:id', deleteUser);

// module.exports = router;