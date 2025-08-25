const db = require('../config/database');

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await db('users').select('*');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db('users').where({ id }).first();
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST create new user
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const [userId] = await db('users').insert({
      name,
      email,
      password
    });
    
    const newUser = await db('users').where({ id: userId }).first();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PATCH update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    
    const updated = await db('users')
      .where({ id })
      .update({
        name,
        email,
        updated_at: db.fn.now()
      });
    
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const updatedUser = await db('users').where({ id }).first();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await db('users').where({ id }).del();
    
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};