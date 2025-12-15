// routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controller/bookController');


// 1. Trang chủ (Hiển thị sách)
router.get('/', bookController.showProducts);

// 2. Giỏ hàng
router.get('/cart', bookController.showCart);
router.post('/cart/add', bookController.addToCart);

// 3. Liên hệ
router.get('/contact', bookController.showContact);
router.get('/contact', (req, res) => {
    res.render('books/contact'); 
});

// Router khi ấn nút gửi
router.post('/contact', (req, res) => {
    console.log(req.body); // Xem dữ liệu gửi lên
    res.send("Cảm ơn bạn đã liên hệ! (Chức năng đang phát triển)");
});

// 4. Thêm Review (Comment)
router.post('/add-review', bookController.addReview);

// Xử lý Đặt hàng
router.post('/checkout', bookController.checkout);

// Xóa khỏi giỏ hàng
router.post('/cart/remove', bookController.removeFromCart);

// ⚠️ QUAN TRỌNG: 
// Nếu bạn thấy dòng router.post('/delete', ...) ở đây thì XÓA NÓ ĐI.
// Chức năng xóa đã chuyển sang adminRoutes rồi.

module.exports = router;