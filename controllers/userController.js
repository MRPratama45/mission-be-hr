const db = require('../config/database');
const bcrypt = require('bcryptjs');
const { generateToken, verifyToken } = require('../config/jwt'); // ✅ tambahin verifyToken
const { sendVerificationEmail } = require('../config/email');

// Register new user
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validasi input
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    
    // Check if user already exists
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const [userId] = await db('users').insert({
      name,
      email,
      password: hashedPassword,
      email_verified: false,
      role: 'user',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    const newUser = await db('users').where({ id: userId }).first();
    
    // Generate verification token (24 jam)
    const verificationToken = generateToken(
      { id: newUser.id, email: newUser.email, purpose: 'email_verification' },
      "24h" // ⏰ token email berlaku 24 jam
    );
    
    // Send verification email
    try {
      await sendVerificationEmail(newUser, verificationToken);
      console.log('Verification email sent to:', newUser.email);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Jangan gagal registrasi hanya karena email error
    }
    
    // Generate auth token untuk login otomatis (pakai default expiry dari .env)
    const authToken = generateToken(
      { id: newUser.id, email: newUser.email, purpose: 'authentication' }
    );
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    
    // Return verification link in development
    const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${verificationToken}`;
    
    res.status(201).json({
      message: 'User registered successfully. Please check your email for verification.',
      user: userWithoutPassword,
      token: authToken,
      verificationLink: process.env.NODE_ENV === 'production' ? undefined : verificationLink
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await db('users').where({ email }).first();
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = generateToken(
      { id: user.id, email: user.email, purpose: 'authentication' }
    );
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    const decoded = verifyToken(token);
    console.log("Decoded verification token:", decoded); // ✅ untuk debug

    // Pastikan token memiliki purpose yang benar
    if (decoded.purpose !== 'email_verification') {
      return res.status(400).json({ error: 'Invalid token purpose' });
    }
    
    // Periksa apakah user exists
    const user = await db('users').where({ id: decoded.id }).first();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Periksa apakah email sudah diverifikasi
    if (user.email_verified) {
      return res.status(400).json({ error: 'Email already verified' });
    }
    
    // Update status verifikasi
    await db('users')
      .where({ id: decoded.id })
      .update({ 
        email_verified: true,
        updated_at: db.fn.now()
      });
    
    res.json({ 
      message: 'Email verified successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        email_verified: true
      }
    });
  } catch (error) {
    console.error('Verify email error:', error.message);
    
    if (error.message === 'Invalid or expired token') {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllUsers = async (req, res) => { /* ... tetap sama ... */ };
const getUserById = async (req, res) => { /* ... tetap sama ... */ };
const updateUser = async (req, res) => { /* ... tetap sama ... */ };
const deleteUser = async (req, res) => { /* ... tetap sama ... */ };

module.exports = {
  register,
  login,
  verifyEmail,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};






// ==========================================
// const db = require('../config/database');
// const bcrypt = require('bcryptjs');
// const { generateToken, verifyToken } = require('../config/jwt');
// // const { sendVerificationEmail } = require('../config/email');
// const { sendVerificationEmail } = require('../config/email-mock');

// // Register new user
// const register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
    
//     // Validasi input
//     if (!name || !email || !password) {
//       return res.status(400).json({ error: 'Name, email, and password are required' });
//     }
    
//     // Check if user already exists
//     const existingUser = await db('users').where({ email }).first();
//     if (existingUser) {
//       return res.status(400).json({ error: 'User already exists' });
//     }
    
//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 12);
    
//     // Create user
//     const [userId] = await db('users').insert({
//       name,
//       email,
//       password: hashedPassword,
//       email_verified: false,
//       role: 'user',
//       created_at: new Date(),
//       updated_at: new Date()
//     });
    
//     const newUser = await db('users').where({ id: userId }).first();
    
//     // Generate verification token dengan purpose yang jelas
//     const verificationToken = generateToken({ 
//       id: newUser.id,
//       email: newUser.email,
//       purpose: 'email_verification',
//       timestamp: Date.now() // Tambahkan timestamp untuk debugging
//     });
    
//     // Send verification email
//     try {
//       await sendVerificationEmail(newUser, verificationToken);
//       console.log('Verification email sent to:', newUser.email);
//     } catch (emailError) {
//       console.error('Email sending error:', emailError);
//       // Jangan gagal registrasi hanya karena email error
//     }
    
//     // Generate auth token untuk login otomatis
//     const authToken = generateToken({ 
//       id: newUser.id, 
//       email: newUser.email,
//       purpose: 'authentication'
//     });
    
//     // Remove password from response
//     const { password: _, ...userWithoutPassword } = newUser;
    
//     // Return verification link in development
//     const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${verificationToken}`;
    
//     res.status(201).json({
//       message: 'User registered successfully. Please check your email for verification.',
//       user: userWithoutPassword,
//       token: authToken,
//       verificationLink: process.env.NODE_ENV === 'production' ? undefined : verificationLink
//     });
//   } catch (error) {
//     console.error('Register error:', error);
//     res.status(500).json({ error: error.message });
//   }
// };


// // const register = async (req, res) => {
// //   try {
// //     const { name, email, password } = req.body;
    
// //     // Check if user already exists
// //     const existingUser = await db('users').where({ email }).first();
// //     if (existingUser) {
// //       return res.status(400).json({ error: 'User already exists' });
// //     }
    
// //     // Hash password
// //     const hashedPassword = await bcrypt.hash(password, 12);
    
// //     // Create user
// //     const [userId] = await db('users').insert({
// //       name,
// //       email,
// //       password: hashedPassword,
// //       email_verified: false
// //     });
    
// //     const newUser = await db('users').where({ id: userId }).first();
    
// //     // Generate verification token
// //     const verificationToken = generateToken({ 
// //       id: newUser.id, 
// //       purpose: 'email_verification' 
// //     });
    
// //     // Send verification email
// //     await sendVerificationEmail(newUser, verificationToken);
    
// //     // Generate auth token
// //     const authToken = generateToken({ 
// //       id: newUser.id, 
// //       email: newUser.email 
// //     });
    
// //     // Remove password from response
// //     const { password: _, ...userWithoutPassword } = newUser;
    
// //     res.status(201).json({
// //       message: 'User registered successfully. Please check your email for verification.',
// //       user: userWithoutPassword,
// //       token: authToken
// //     });
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // const register = async (req, res) => {
// //   try {
// //     const { name, email, password } = req.body;
    
// //     // Check if user already exists
// //     const existingUser = await db('users').where({ email }).first();
// //     if (existingUser) {
// //       return res.status(400).json({ error: 'User already exists' });
// //     }
    
// //     // Hash password
// //     const hashedPassword = await bcrypt.hash(password, 12);
    
// //     // Create user
// //     const [userId] = await db('users').insert({
// //       name,
// //       email,
// //       password: hashedPassword,
// //       email_verified: false,
// //       role: 'user'
// //     });
    
// //     const newUser = await db('users').where({ id: userId }).first();
    
// //     // Generate verification token
// //     const verificationToken = generateToken({ 
// //       id: newUser.id, 
// //       purpose: 'email_verification' 
// //     });
    
// //     // Send verification email
// //     try {
// //       await sendVerificationEmail(newUser, verificationToken);
// //     } catch (emailError) {
// //       console.error('Email error:', emailError);
// //       // Jangan gagal registrasi hanya karena email error
// //     }
    
// //     // Generate auth token
// //     const authToken = generateToken({ 
// //       id: newUser.id, 
// //       email: newUser.email 
// //     });
    
// //     // Remove password from response
// //     const { password: _, ...userWithoutPassword } = newUser;
    
// //     // Return verification link in development
// //     const verificationLink = `${process.env.BASE_URL}/api/auth/verify-email?token=${verificationToken}`;
    
// //     res.status(201).json({
// //       message: 'User registered successfully.',
// //       user: userWithoutPassword,
// //       token: authToken,
// //       verificationLink: process.env.NODE_ENV === 'production' ? undefined : verificationLink
// //     });
// //   } catch (error) {
// //     console.error('Register error:', error);
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // Login user
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     // Find user
//     const user = await db('users').where({ email }).first();
//     if (!user) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }
    
//     // Check password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }
    
//     // Generate token
//     const token = generateToken({ 
//       id: user.id, 
//       email: user.email 
//     });
    
//     // Remove password from response
//     const { password: _, ...userWithoutPassword } = user;
    
//     res.json({
//       message: 'Login successful',
//       user: userWithoutPassword,
//       token
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Verify email
// const verifyEmail = async (req, res) => {
//   try {
//     const { token } = req.query;
    
//     if (!token) {
//       return res.status(400).json({ error: 'Verification token is required' });
//     }

//     // Debug: log token yang diterima
//     console.log('Verification token received:', token);
    
//     const decoded = verifyToken(token);
    
//     // Debug: log decoded token
//     console.log('Decoded token:', decoded);
    
//     // Pastikan token memiliki purpose yang benar
//     if (decoded.purpose !== 'email_verification') {
//       console.log('Token purpose mismatch. Expected: email_verification, Got:', decoded.purpose);
//       return res.status(400).json({ error: 'Invalid token purpose' });
//     }
    
//     // Periksa apakah user exists
//     const user = await db('users').where({ id: decoded.id }).first();
//     if (!user) {
//       console.log('User not found with ID:', decoded.id);
//       return res.status(404).json({ error: 'User not found' });
//     }
    
//     // Periksa apakah email sudah diverifikasi
//     if (user.email_verified) {
//       console.log('Email already verified for user:', user.email);
//       return res.status(400).json({ error: 'Email already verified' });
//     }
    
//     // Update status verifikasi
//     await db('users')
//       .where({ id: decoded.id })
//       .update({ 
//         email_verified: true,
//         updated_at: db.fn.now()
//       });
    
//     console.log('Email verified successfully for user:', user.email);
    
//     res.json({ 
//       message: 'Email verified successfully',
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         email_verified: true
//       }
//     });
//   } catch (error) {
//     console.error('Verify email error details:', error);
    
//     if (error.message === 'Invalid or expired token') {
//       return res.status(400).json({ error: 'Invalid or expired verification token' });
//     }
    
//     res.status(500).json({ error: 'Internal server error during verification' });
//   }
// };

// // const verifyEmail = async (req, res) => {
// //   try {
// //     const { token } = req.query;
    
// //     if (!token) {
// //       return res.status(400).json({ error: 'Verification token is required' });
// //     }

// //     const decoded = verifyToken(token);
    
// //     // Pastikan token memiliki purpose yang benar
// //     if (decoded.purpose !== 'email_verification') {
// //       return res.status(400).json({ error: 'Invalid token purpose' });
// //     }
    
// //     // Periksa apakah user exists
// //     const user = await db('users').where({ id: decoded.id }).first();
// //     if (!user) {
// //       return res.status(404).json({ error: 'User not found' });
// //     }
    
// //     // Periksa apakah email sudah diverifikasi
// //     if (user.email_verified) {
// //       return res.status(400).json({ error: 'Email already verified' });
// //     }
    
// //     // Update status verifikasi
// //     await db('users')
// //       .where({ id: decoded.id })
// //       .update({ 
// //         email_verified: true,
// //         updated_at: db.fn.now()
// //       });
    
// //     res.json({ 
// //       message: 'Email verified successfully',
// //       user: {
// //         id: user.id,
// //         name: user.name,
// //         email: user.email,
// //         email_verified: true
// //       }
// //     });
// //   } catch (error) {
// //     console.error('Verify email error:', error.message);
    
// //     if (error.message === 'Invalid or expired token') {
// //       return res.status(400).json({ error: 'Invalid or expired verification token' });
// //     }
    
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // };

// // const verifyEmail = async (req, res) => {
// //   try {
// //     const { token } = req.query;
    
// //     const decoded = verifyToken(token);
// //     if (decoded.purpose !== 'email_verification') {
// //       return res.status(400).json({ error: 'Invalid token purpose' });
// //     }
    
// //     await db('users')
// //       .where({ id: decoded.id })
// //       .update({ email_verified: true });
    
// //     res.json({ message: 'Email verified successfully' });
// //   } catch (error) {
// //     res.status(400).json({ error: 'Invalid or expired verification token' });
// //   }
// // };


// // Token verifikasi email (24 jam)
// const verificationToken = generateToken(
//   { id: newUser.id, email: newUser.email, purpose: 'email_verification' },
//   "24h"
// );

// // Token login (default dari .env, misalnya "1h")
// const authToken = generateToken(
//   { id: newUser.id, email: newUser.email, purpose: 'authentication' }
// );



// // GET all users (with filtering, sorting, searching)
// const getAllUsers = async (req, res) => {
//   try {
//     const { 
//       search, 
//       sortBy = 'created_at', 
//       sortOrder = 'desc',
//       page = 1,
//       limit = 10
//     } = req.query;
    
//     let query = db('users').select('id', 'name', 'email', 'email_verified', 'created_at');
    
//     // Search
//     if (search) {
//       query = query.where(function() {
//         this.where('name', 'like', `%${search}%`)
//           .orWhere('email', 'like', `%${search}%`);
//       });
//     }
    
//     // Sorting
//     query = query.orderBy(sortBy, sortOrder);
    
//     // Pagination
//     const offset = (page - 1) * limit;
//     query = query.offset(offset).limit(limit);
    
//     const users = await query;
    
//     // Get total count for pagination
//     let countQuery = db('users').count('* as total');
//     if (search) {
//       countQuery = countQuery.where(function() {
//         this.where('name', 'like', `%${search}%`)
//           .orWhere('email', 'like', `%${search}%`);
//       });
//     }
    
//     const totalResult = await countQuery.first();
//     const total = totalResult.total;
//     const totalPages = Math.ceil(total / limit);
    
//     res.json({
//       users,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         totalPages
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // GET user by ID
// const getUserById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await db('users')
//       .where({ id })
//       .select('id', 'name', 'email', 'email_verified', 'created_at')
//       .first();
    
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
    
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // PATCH update user
// const updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, email } = req.body;
    
//     const updated = await db('users')
//       .where({ id })
//       .update({
//         name,
//         email,
//         updated_at: db.fn.now()
//       });
    
//     if (!updated) {
//       return res.status(404).json({ error: 'User not found' });
//     }
    
//     const updatedUser = await db('users')
//       .where({ id })
//       .select('id', 'name', 'email', 'email_verified', 'created_at')
//       .first();
    
//     res.json(updatedUser);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // DELETE user
// const deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const deleted = await db('users').where({ id }).del();
    
//     if (!deleted) {
//       return res.status(404).json({ error: 'User not found' });
//     }
    
//     res.json({ message: 'User deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = {
//   register,
//   login,
//   verifyEmail,
//   getAllUsers,
//   getUserById,
//   updateUser,
//   deleteUser
// };

// // ================= be-inter-2 =================
// // const db = require('../config/database');

// // // GET all users
// // const getAllUsers = async (req, res) => {
// //   try {
// //     const users = await db('users').select('*');
// //     res.json(users);
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // // GET user by ID
// // const getUserById = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const user = await db('users').where({ id }).first();
    
// //     if (!user) {
// //       return res.status(404).json({ error: 'User not found' });
// //     }
    
// //     res.json(user);
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // // POST create new user
// // const createUser = async (req, res) => {
// //   try {
// //     const { name, email, password } = req.body;
    
// //     const [userId] = await db('users').insert({
// //       name,
// //       email,
// //       password
// //     });
    
// //     const newUser = await db('users').where({ id: userId }).first();
// //     res.status(201).json(newUser);
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // // PATCH update user
// // const updateUser = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { name, email } = req.body;
    
// //     const updated = await db('users')
// //       .where({ id })
// //       .update({
// //         name,
// //         email,
// //         updated_at: db.fn.now()
// //       });
    
// //     if (!updated) {
// //       return res.status(404).json({ error: 'User not found' });
// //     }
    
// //     const updatedUser = await db('users').where({ id }).first();
// //     res.json(updatedUser);
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // // DELETE user
// // const deleteUser = async (req, res) => {
// //   try {
// //     const { id } = req.params;
    
// //     const deleted = await db('users').where({ id }).del();
    
// //     if (!deleted) {
// //       return res.status(404).json({ error: 'User not found' });
// //     }
    
// //     res.json({ message: 'User deleted successfully' });
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // module.exports = {
// //   getAllUsers,
// //   getUserById,
// //   createUser,
// //   updateUser,
// //   deleteUser
// // };