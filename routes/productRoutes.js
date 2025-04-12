const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const productController = require('../controllers/productController'); // Adjust path as necessary
const multer = require('multer');

// Configure storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname.replace(/\s+/g, '-').toLowerCase(); // remove spaces
    cb(null, Date.now() + '-' + originalName);
  },
});

// Set up multer with the defined storage
const upload = multer({ storage });

// Blog creation route with file upload
router.post('/create', upload.single('image'), productController.createProduct);
router.put('/:id', upload.single('image'), productController.editProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.delete('/delete/:id', productController.deleteProduct);
router.get('/category/:category', productController.getProductsByCategory);



module.exports = router;