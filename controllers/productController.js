const db = require('../config/database');

// GET all products with filtering, sorting, searching
const getAllProducts = async (req, res) => {
  try {
    const { 
      search, 
      minPrice, 
      maxPrice, 
      sortBy = 'created_at', 
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;
    
    let query = db('products').select('*');
    
    // Search
    if (search) {
      query = query.where(function() {
        this.where('name', 'like', `%${search}%`)
          .orWhere('description', 'like', `%${search}%`);
      });
    }
    
    // Price filter
    if (minPrice) {
      query = query.where('price', '>=', parseFloat(minPrice));
    }
    
    if (maxPrice) {
      query = query.where('price', '<=', parseFloat(maxPrice));
    }
    
    // Sorting
    query = query.orderBy(sortBy, sortOrder);
    
    // Pagination
    const offset = (page - 1) * limit;
    query = query.offset(offset).limit(limit);
    
    const products = await query;
    
    // Get total count for pagination
    let countQuery = db('products').count('* as total');
    
    if (search) {
      countQuery = countQuery.where(function() {
        this.where('name', 'like', `%${search}%`)
          .orWhere('description', 'like', `%${search}%`);
      });
    }
    
    if (minPrice) {
      countQuery = countQuery.where('price', '>=', parseFloat(minPrice));
    }
    
    if (maxPrice) {
      countQuery = countQuery.where('price', '<=', parseFloat(maxPrice));
    }
    
    const totalResult = await countQuery.first();
    const total = totalResult.total;
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages
      }
    });
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

// POST create new product with image upload
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const image = req.file ? req.file.filename : null;
    
    const [productId] = await db('products').insert({
      name,
      description,
      price,
      stock,
      image
    });
    
    const newProduct = await db('products').where({ id: productId }).first();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PATCH update product with optional image upload
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    const image = req.file ? req.file.filename : undefined;
    
    const updateData = {
      name,
      description,
      price,
      stock,
      updated_at: db.fn.now()
    };
    
    if (image) {
      updateData.image = image;
    }
    
    const updated = await db('products')
      .where({ id })
      .update(updateData);
    
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


// ============== be-inter-2 ==============
// const db = require('../config/database');

// // GET all products
// const getAllProducts = async (req, res) => {
//   try {
//     const products = await db('products').select('*');
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





// //  ==================================================== error ====================================================
// // const db = require('../config/database');

// // // GET all products
// // const getAllProducts = async (req, res) => {
// //   try {
// //     // const products = await db.select('*').from('products');
// //     const products = await db('products').select('*');
// //     res.json(products);
// //     res.json(products);
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // // GET product by ID
// // const getProductById = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const product = await db('products').where({ id }).first();
    
// //     if (!product) {
// //       return res.status(404).json({ error: 'Product not found' });
// //     }
    
// //     res.json(product);
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // // POST create new product
// // const createProduct = async (req, res) => {
// //   try {
// //     const { name, description, price, stock } = req.body;
    
// //     const [productId] = await db('products').insert({
// //       name,
// //       description,
// //       price,
// //       stock
// //     });
    
// //     const newProduct = await db('products').where({ id: productId }).first();
// //     res.status(201).json(newProduct);
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // // PATCH update product
// // const updateProduct = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { name, description, price, stock } = req.body;
    
// //     const updated = await db('products')
// //       .where({ id })
// //       .update({
// //         name,
// //         description,
// //         price,
// //         stock,
// //         updated_at: db.fn.now()
// //       });
    
// //     if (!updated) {
// //       return res.status(404).json({ error: 'Product not found' });
// //     }
    
// //     const updatedProduct = await db('products').where({ id }).first();
// //     res.json(updatedProduct);
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // // DELETE product
// // const deleteProduct = async (req, res) => {
// //   try {
// //     const { id } = req.params;
    
// //     const deleted = await db('products').where({ id }).del();
    
// //     if (!deleted) {
// //       return res.status(404).json({ error: 'Product not found' });
// //     }
    
// //     res.json({ message: 'Product deleted successfully' });
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // };

// // module.exports = {
// //   getAllProducts,
// //   getProductById,
// //   createProduct,
// //   updateProduct,
// //   deleteProduct
// // };