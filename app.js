require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/database');
const adminRoutes = require('./routes/adminRoutes');
const blogRoutes = require('./routes/blogRoutes');
const formRoutes = require('./routes/formRoutes');
const cookieParser = require('cookie-parser');


const blogController = require('./controllers/blogController');
const formController = require('./controllers/formController');
const auth = require('./middleware/auth');
const Blog = require('./models/Blog');

const app = express();


// Connect to database
connectDB();

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/form', formRoutes);

// Add a route for your main page
app.get('/', (req, res) => {
  res.render('frontend/index');
});

app.get('/about', (req, res) => {
  res.render('frontend/about');
});

app.get('/contact', (req, res) => {
  res.render('frontend/contact');
});



app.get('/products', async (req, res) => {
  try {
    // Fetch the featured blog and the list of other blogs
    const { featured, list } = await blogController.getAllBlogs();

    // Render the EJS template with the featured blog and list
    res.render('frontend/products', {
      title: "Our Products",
      featured, // Pass the featured blog separately
      blogs: list // Pass the rest as the list of blogs
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).render('error', { message: 'Error fetching blogs' });
  }
});





// ADMIN PANEL
app.get('/admin', (req, res) => {
  res.render('admin/login');
});
app.get('/admin/login', (req, res) => {
  res.render('admin/login');
});

app.get('/dashboard', auth, async (req, res) => {
  try {
    // Fetch the featured blog and the list of other blogs
    const { list = [], featured = null } = await blogController.getAllBlogs();

    // Filter out null or undefined blogs
    const includeFeatured = [featured, ...list].filter(blog => blog !== null && blog !== undefined);

    // Fetch appointments and ensure you're accessing the appointments array correctly
    const result = await formController.getForm();

    // Log the full result to inspect the structure
    console.log('Form result:', result);

    const appointments = result?.appointments || [];  // Access the appointments array from the returned object
    
    // Log the appointments array
    console.log(`Appointments array:`, appointments);

    res.render('admin/index', {
      blogs: includeFeatured,
      appointments: result  // Pass the appointments array to the view
    });

  } catch (error) {
    console.error('Error fetching blogs or appointments:', error);
    res.status(500).render('error', { message: 'Error fetching data' });
  }
});




app.get('/add-blog',auth, (req, res) => {
  res.render('admin/add-blog');
});

app.get('/blog/edit/:id', auth, async (req, res) => {
  try {
    const blogId = req.params.id;
    console.log('Blog ID:', blogId);
    const blog = await Blog.findById(blogId); // Fetch the blog by ID

    if (!blog) {
      // If no blog is found, send a 404 response
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Render the edit page and pass the blog data
    res.render('admin/edit-blog', { blog });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Error fetching blog' });
  }
});




app.get('/manage-blog',auth, async (req, res) => {
  try {
    const { list = [], featured = null } = await blogController.getAllBlogs();

    // Filter out null or undefined blogs
    const includeFeatured = [featured, ...list].filter(blog => blog !== null && blog !== undefined);

    res.render('admin/manage-blog', {
      blogs: includeFeatured
    });

  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).render('error', { message: 'Error fetching blogs' });
  }
});

app.get('/appointments',auth, async (req, res) => {
  try {
    // Fetch the featured blog and the list of other blogs
    const appointments = await formController.getForm();

    res.render('admin/view-appointments', {
      appointments
    });

  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).render('error', { message: 'Error fetching blogs' });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));