const Blog = require('../models/Blog');



exports.createBlog = async (req, res) => {
  try {
    const { title, short_description, description, author } = req.body;

    // Check if the image file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    // Remove the 'public/' prefix from the image path
    const image = req.file.path.replace(/^public\//, '');

    const newBlog = new Blog({ title, description,short_description, author, image });
    await newBlog.save();

    res.status(201).json(newBlog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ message: 'Error creating blog', error });
  }
};

exports.editBlog = async (req, res) => {
  try {
    const { id } = req.params; // Blog ID from URL
    const { title, short_description, description, author } = req.body;

    // Find the blog by ID
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if a new image file was uploaded
    let updatedImage = blog.image;
    if (req.file) {
      updatedImage = req.file.path.replace(/^public\//, '');
    }

    // Update the blog fields
    blog.title = title || blog.title;
    blog.short_description = short_description || blog.short_description;
    blog.description = description || blog.description;
    blog.author = author || blog.author;
    blog.image = updatedImage;

    // Save the updated blog
    await blog.save();

    res.status(200).json({ success: true, blog });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ success: false, message: 'Error updating blog', error });
  }
};


exports.getAllBlogs = async () => {
  try {
    // Fetch blogs sorted by creation date (newest first)
    const blogs = await Blog.find().sort({ date: -1 });

    if (blogs.length === 0) {
      return { featured: null, list: [] }; // No blogs found
    }

    // Separate the first blog as featured and the rest as the list
    const featured = blogs[0];
    const list = blogs.slice(1);

    return { featured, list };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};

// Fetch blog by ID
exports.getBlogById = async (blogId) => {
  try {
    // Find blog by ID
    const blog = await Blog.findById(blogId);

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

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the form by its id
    const deletedBlog= await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    return res.status(200).json({ message: 'Blog deleted successfully', form: deletedBlog });
  } catch (error) {
    console.error('Error deleting form:', error);
    return res.status(500).json({ message: 'Server error while deleting form' });
  }
};
