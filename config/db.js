// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Thay 'mybookstore' bằng tên database bạn muốn
        await mongoose.connect('mongodb://127.0.0.1:27017/mybookstore');
        console.log('✅ Đã kết nối MongoDB thành công!');
    } catch (error) {
        console.error('❌ Lỗi kết nối MongoDB:', error.message);
        process.exit(1); // Dừng chương trình nếu lỗi
    }
};

module.exports = connectDB;