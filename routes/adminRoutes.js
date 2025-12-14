// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');

// --- 1. CẤU HÌNH UPLOAD ẢNH (Multer) ---
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// --- 2. HÀM KIỂM TRA QUYỀN (QUAN TRỌNG) ---
const checkAdmin = (req, res, next) => {
    // Nếu session có user VÀ role là admin
    if (req.session.user && req.session.user.role === 'admin') {
        next(); // Cho phép đi tiếp vào Controller
    } else {
        // Nếu không phải admin hoặc chưa đăng nhập
        res.redirect('/login'); // Đá về trang đăng nhập
    }
};

// --- 3. CÁC ROUTE (Đã gắn checkAdmin vào giữa) ---

// Trang Dashboard: Phải qua checkAdmin mới được vào
router.get('/', checkAdmin, adminController.showDashboard);

// Thêm sách: Phải là Admin mới được thêm
router.post('/add', checkAdmin, upload.single('imageFile'), adminController.addProduct);

// Xóa sách
router.post('/delete', checkAdmin, adminController.deleteProduct);

router.post('/user/delete', checkAdmin, adminController.deleteUser);

// Cập nhật đơn hàng
router.post('/order/update', checkAdmin, adminController.updateOrderStatus);

module.exports = router;