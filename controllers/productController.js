const db = require('../config/database');

// GET all products
const getAllProducts = async (req, res) => {
  try {
    const products = await db('products').select('*');
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await db('products').where({ id }).first();
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST create new product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    
    const [productId] = await db('products').insert({
      name,
      description,
      price,
      stock
    });
    
    const newProduct = await db('products').where({ id: productId }).first();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PATCH update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    
    const updated = await db('products')
      .where({ id })
      .update({
        name,
        description,
        price,
        stock,
        updated_at: db.fn.now()
      });
    
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const updatedProduct = await db('products').where({ id }).first();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await db('products').where({ id }).del();
    
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};





//  ==================================================== error ====================================================
// const db = require('../config/database');

// // GET all products
// const getAllProducts = async (req, res) => {
//   try {
//     // const products = await db.select('*').from('products');
//     const products = await db('products').select('*');
//     res.json(products);
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // GET product by ID
// const getProductById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const product = await db('products').where({ id }).first();
    
//     if (!product) {
//       return res.status(404).json({ error: 'Product not found' });
//     }
    
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // POST create new product
// const createProduct = async (req, res) => {
//   try {
//     const { name, description, price, stock } = req.body;
    
//     const [productId] = await db('products').insert({
//       name,
//       description,
//       price,
//       stock
//     });
    
//     const newProduct = await db('products').where({ id: productId }).first();
//     res.status(201).json(newProduct);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // PATCH update product
// const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, description, price, stock } = req.body;
    
//     const updated = await db('products')
//       .where({ id })
//       .update({
//         name,
//         description,
//         price,
//         stock,
//         updated_at: db.fn.now()
//       });
    
//     if (!updated) {
//       return res.status(404).json({ error: 'Product not found' });
//     }
    
//     const updatedProduct = await db('products').where({ id }).first();
//     res.json(updatedProduct);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // DELETE product
// const deleteProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const deleted = await db('products').where({ id }).del();
    
//     if (!deleted) {
//       return res.status(404).json({ error: 'Product not found' });
//     }
    
//     res.json({ message: 'Product deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = {
//   getAllProducts,
//   getProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct
// };