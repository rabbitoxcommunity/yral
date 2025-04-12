const Category = require('../models/Category');



exports.createCategory = async (req, res) => {
  try {
    const { title } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // Check if category exists
    const existingCategory = await Category.findOne({ title });
    if (existingCategory) {
      return res.status(400).json({ msg: 'Category already exists' });
    }

    // Create new category
    const newCategory = new Category({ title });
    await newCategory.save();

    res.json({ msg: 'Category created successfully', category: newCategory });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.editCategory = async (req, res) => {
  try {
    const { id } = req.params; // Category ID from URL
    const { title } = req.body;

    // Find the blog by ID
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Update the blog fields
    category.title = title || blog.title;

    // Save the updated blog
    await category.save();

    res.status(200).json({ success: true, blog });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, message: 'Error updating blog', error });
  }
};


exports.getAllCategories = async () => {
  try {
    // Fetch blogs sorted by creation date (newest first)
    const categories = await Category.find().sort({ date: -1 });

    if (categories.length === 0) {
      return []; 
    }

    // Separate the first blog as featured and the rest as the list
    // const featured = blogs[0];
    // const list = blogs.slice(1);

    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};

// Fetch blog by ID
exports.getCategoryById = async (catID) => {
  try {
    // Find blog by ID
    const category = await Category.findById(catID);

    // If no blog is found, return null
    if (!category) {
      return null;
    }

    // Return the found blog
    return category;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;  // Throw the error to handle it in the route
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id)

    // Find and delete the form by its id
    const deletedCat= await Category.findByIdAndDelete(id);

    if (!deletedCat) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.status(200).json({ message: 'Category deleted successfully', form: deletedCat });
  } catch (error) {
    console.error('Error deleting form:', error);
    return res.status(500).json({ message: 'Server error while deleting form' });
  }
};
