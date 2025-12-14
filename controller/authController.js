// controller/authController.js
const User = require('../models/userModel');

// 1. Đăng ký
exports.showRegister = (req, res) => res.render('auth/register');

exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Kiểm tra trùng tên
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.send('<script>alert("Tên đã tồn tại!"); window.location.href="/register"</script>');
        }

        // Tạo user mới (Mặc định là customer)
        // Mẹo: Nếu tên là "admin" thì set quyền admin luôn để test
        const role = (username === 'admin') ? 'admin' : 'customer';

        await User.create({ username, password, role });
        res.redirect('/login');
    } catch (err) {
        res.send('Lỗi đăng ký: ' + err.message);
    }
};

// 2. Đăng nhập
exports.showLogin = (req, res) => res.render('auth/login');

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        // Tìm user trong DB
        const user = await User.findOne({ username, password });
        
        if (user) {
            req.session.user = user; // Lưu vào session
            
            // Điều hướng dựa trên quyền
            if (user.role === 'admin') return res.redirect('/admin');
            return res.redirect('/');
        } else {
            res.send('<script>alert("Sai tài khoản/mật khẩu!"); window.location.href="/login"</script>');
        }
    } catch (err) {
        res.send('Lỗi đăng nhập');
    }
};

// 3. Các hàm phụ
exports.showProfile = (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('auth/profile', { user: req.session.user });
};

exports.updateProfile = async (req, res) => {
    // Logic đổi mật khẩu cập nhật vào DB (Bạn tự làm thêm nhé, dùng User.findByIdAndUpdate)
    res.send('Tính năng đang cập nhật...');
};

exports.logout = (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
};