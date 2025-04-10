const mongoose = require('mongoose');

const FormSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  service: { type: String, required: true },
  stage: { type: String, required: true }
}, { timestamps: true }); 


module.exports = mongoose.model('Form', FormSchema);