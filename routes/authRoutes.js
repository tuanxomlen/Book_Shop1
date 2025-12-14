const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

// Debug
console.log('Kiểm tra Controller:', authController); 

// --- ĐĂNG KÝ ---
router.get('/register', authController.showRegister);
router.post('/register', authController.register);

// --- ĐĂNG NHẬP ---
router.get('/login', authController.showLogin);
router.post('/login', authController.login);

// --- HỒ SƠ & ĐĂNG XUẤT ---
router.get('/profile', authController.showProfile);    // Xem hồ sơ
router.post('/profile', authController.updateProfile); // Đổi mật khẩu
router.get('/logout', authController.logout);          // Đăng xuất

module.exports = router;