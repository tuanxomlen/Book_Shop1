// controller/adminController.js
const Book = require('../models/bookModel');
const User = require('../models/userModel');
const Order = require('../models/orderModel'); 

// 1. Dashboard tổng quan
exports.showDashboard = async (req, res) => {
    try {
        const bookCount = await Book.countDocuments();
        const userCount = await User.countDocuments();
        const orderCount = await Order.countDocuments();

        const books = await Book.find({});
        const users = await User.find({});
        // Lấy danh sách đơn hàng mới nhất
        const orders = await Order.find({}).sort({ createdAt: -1 });

        res.render('admin/dashboard', { 
            bookCount, 
            userCount, 
            orderCount,
            books, 
            users, 
            orders,
            user: req.session.user
        });
    } catch (err) {
        res.send('Lỗi Admin: ' + err.message);
    }
};

// 2. Thêm sách (Logic mới: Xử lý Upload hoặc URL)
exports.addProduct = async (req, res) => {
    try {
        const { title, author, price, imageURL } = req.body;
        let finalImage = '';

        // Ưu tiên 1: Nếu có file upload từ máy
        if (req.file) {
            finalImage = '/uploads/' + req.file.filename;
        } 
        // Ưu tiên 2: Nếu có Link URL
        else if (imageURL && imageURL.trim() !== '') {
            finalImage = imageURL;
        } 
        // Ưu tiên 3: Ảnh mặc định
        else {
            finalImage = 'https://via.placeholder.com/300x400?text=No+Image';
        }

        const newBook = new Book({
            title,
            author,
            price,
            image: finalImage
        });

        await newBook.save();
        res.redirect('/admin');
    } catch (err) {
        res.send('Lỗi thêm sách: ' + err.message);
    }
};

// 3. Xóa sách
exports.deleteProduct = async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.body.id);
        res.redirect('/admin'); 
    } catch (err) {
        res.send('Lỗi xóa sách');
    }
};

// 4. Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
    const { id, status } = req.body;
    try {
        await Order.findByIdAndUpdate(id, { status: status });
        res.redirect('/admin');
    } catch (err) {
        res.send('Lỗi cập nhật đơn hàng');
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const idToDelete = req.body.id;
        
        // Ngăn chặn admin tự xóa chính mình (nếu muốn kỹ hơn)
        if (req.session.user && req.session.user._id === idToDelete) {
             return res.send('<script>alert("Không thể tự xóa tài khoản đang đăng nhập!"); window.location.href="/admin";</script>');
        }

        await User.findByIdAndDelete(idToDelete);
        res.redirect('/admin');
    } catch (err) {
        res.send('Lỗi xóa user: ' + err.message);
    }
};