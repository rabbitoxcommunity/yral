const Category = require('../models/Category');
const Product = require('../models/Product');



exports.createProduct = async (req, res) => {
  try {
    const { title, category } = req.body;

    console.log(req?.file,'test')

    // Check if the image file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    // Remove the 'public/' prefix from the image path
    const image = req.file.path.replace(/^public\//, '');

    const newBlog = new Product({ title, category, image });
    await newBlog.save();

    res.status(201).json(newBlog);
  } catch (error) {
    console.error('Error creating Product:', error);
    res.status(500).json({ message: 'Error creating Product', error });
  }
};

exports.editProduct = async (req, res) => {
  try {
    const { id } = req.params; // Product ID from URL
    const { title, category } = req.body;

    // Find the blog by ID
    const blog = await Product.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if a new image file was uploaded
    let updatedImage = blog.image;
    if (req.file) {
      updatedImage = req.file.path.replace(/^public\//, '');
    }

    // Update the blog fields
    blog.title = title || blog.title;
    blog.category = category || blog.category;
    blog.image = updatedImage;

    // Save the updated blog
    await blog.save();

    res.status(200).json({ success: true, blog });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ success: false, message: 'Error updating blog', error });
  }
};


exports.getAllProducts = async () => {
  try {
    // Fetch blogs sorted by creation date (newest first)
    const products = await Product.find().sort({ date: -1 });

    if (products.length === 0) {
      return false;
    }

    console.log(products)

    return products;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category }).sort({ date: -1 });

    console.log(category,'category')

    res.render('products', { products, selectedCategory: category });
  } catch (error) {
    console.error('Error fetching category products:', error);
    res.status(500).send('Internal Server Error');
  }
};

// Fetch blog by ID
exports.getProductById = async (blogId) => {
  try {
    // Find blog by ID
    const blog = await Product.findById(blogId);

    // If no blog is found, return null
    if (!blog) {
      return null;
    }

    // Return the found blog
    return blog;
  } catch (error) {
    console.error('Error fetching blog:', error);
    throw error;  // Throw the error to handle it in the route
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the form by its id
    const deletedBlog= await Product.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ message: 'Product deleted successfully', form: deletedBlog });
  } catch (error) {
    console.error('Error deleting form:', error);
    return res.status(500).json({ message: 'Server error while deleting form' });
  }
};
