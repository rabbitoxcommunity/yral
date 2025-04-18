const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', ProductSchema);