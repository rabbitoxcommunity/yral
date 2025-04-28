const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: String, required: true }
}, { timestamps: true }); 


module.exports = mongoose.model('Form', FormSchema);