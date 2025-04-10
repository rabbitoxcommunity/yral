const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');

router.post('/submit', formController.submitForm);
router.get('/', formController.getForm);
router.delete('/:id', formController.deleteForm);

module.exports = router;