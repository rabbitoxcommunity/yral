const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const blogController = require('../controllers/blogController'); // Adjust path as necessary
const multer = require('multer');

// Configure storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Set up multer with the defined storage
const upload = multer({ storage });

// Blog creation route with file upload
router.post('/create', upload.single('image'), blogController.createBlog);
router.put('/:id', upload.single('image'), blogController.editBlog);
router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.delete('/delete/:id', blogController.deleteBlog);


module.exports = router;