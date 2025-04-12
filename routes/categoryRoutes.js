const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.post('/create', categoryController.createCategory);
router.put('/:id', categoryController.editCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.delete('/delete/:id', categoryController.deleteCategory);

module.exports = router;