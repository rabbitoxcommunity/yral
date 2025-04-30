require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/database');
const adminRoutes = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRoutes');
const formRoutes = require('./routes/formRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cookieParser = require('cookie-parser');


const productController = require('./controllers/productController');
const formController = require('./controllers/formController');
const categoryController = require('./controllers/categoryController');
const auth = require('./middleware/auth');
const Product = require('./models/Product');

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
app.use('/api/product', productRoutes);
app.use('/api/form', formRoutes);
app.use('/api/category', categoryRoutes);

app.locals.IMAGE_URL = process.env.IMAGE_URL;


// Add a route for your main page
app.get('/', async (req, res) => {
  try {
    const response = await categoryController.getAllCategories();

    console.log(response)

    // Filter out null or undefined blogs
    res.render('frontend/index', {
      categories: response
    });

  } catch (error) {
    console.error('Error fetching Categories:', error);
    res.status(500).render('error', { message: 'Error fetching blogs' });
  }
});

app.get('/about', (req, res) => {
  res.render('frontend/about');
});

app.get('/contact', async (req, res) => {
  try {
    const response = await categoryController.getAllCategories();

    console.log(response)

    // Filter out null or undefined blogs
    res.render('frontend/contact', {
      categories: response
    });

  } catch (error) {
    console.error('Error fetching Categories:', error);
    res.status(500).render('error', { message: 'Error fetching blogs' });
  }
});

app.get('/products', async (req, res) => {
  try {
    const selectedCategory = req.query.category;

    // Get all categories
    const categories = await categoryController.getAllCategories();

    // Get products based on selected category
    let products;
    if (selectedCategory) {
      products = await Product.find({ category: selectedCategory }).sort({ date: -1 });
    } else {
      products = await productController.getAllProducts();
    }

    // Render the page
    res.render('frontend/products', {
      title: "Our Products",
      products,
      categories,
      selectedCategory,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).render('error', { message: 'Error fetching products' });
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
    // Filter out null or undefined blogs
    const products = await productController.getAllProducts();

    // Fetch appointments and ensure you're accessing the appointments array correctly
    const result = await formController.getForm();


    const appointments = result && result.appointments ? result.appointments : [];  // Access the appointments array from the returned object

    // Log the appointments array
    console.log(`Appointments array:`, appointments);

    res.render('admin/index', {
      products: products,
      appointments: result  // Pass the appointments array to the view
    });

  } catch (error) {
    console.error('Error fetching products or appointments:', error);
    res.status(500).render('error', { message: 'Error fetching data' });
  }
});



app.get('/category', auth, async (req, res) => {
  try {
    const response = await categoryController.getAllCategories();

    console.log(response)

    // Filter out null or undefined blogs
    res.render('admin/category', {
      categories: response
    });

  } catch (error) {
    console.error('Error fetching Categories:', error);
    res.status(500).render('error', { message: 'Error fetching blogs' });
  }
});




app.get('/add-product', auth, async (req, res) => {
  try {
    const response = await categoryController.getAllCategories();

    // Filter out null or undefined blogs
    console.log(response, 'response')
    res.render('admin/add-product', {
      categories: response
    });

  } catch (error) {
    console.error('Error fetching Categories:', error);
    res.status(500).render('error', { message: 'Error fetching blogs' });
  }
});

app.get('/product/edit/:id', auth, async (req, res) => {
  try {
    const blogId = req.params.id;
    console.log('Product ID:', blogId);
    const blog = await Product.findById(blogId);
    const response = await categoryController.getAllCategories();


    if (!blog) {
      // If no blog is found, send a 404 response
      return res.status(404).json({ message: 'Product not found' });
    }

    // Render the edit page and pass the blog data
    res.render('admin/edit-product', { blog: blog, categories: response });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Error fetching blog' });
  }
});




app.get('/manage-product', auth, async (req, res) => {
  try {
    const products = await productController.getAllProducts();

    res.render('admin/manage-products', {
      products
    });

  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).render('error', { message: 'Error fetching blogs' });
  }
});

app.get('/enquiries', auth, async (req, res) => {
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