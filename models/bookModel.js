// models/bookModel.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    price: Number,
    description: String,
    // Thêm trường image, nếu không nhập thì lấy ảnh mặc định
    image: { 
        type: String, 
        default: 'https://via.placeholder.com/300x400?text=No+Image' 
    }, 
    reviews: [String]
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;