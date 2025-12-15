// middleware/authMiddleware.js

const requireAdmin = (req, res, next) => {
    // 1. Chưa đăng nhập -> Cút về Login
    if (!req.session || !req.session.user) {
        return res.redirect('/login');
    }

    // 2. Đã đăng nhập nhưng không phải Admin -> Cút về Trang chủ
    if (req.session.user.role !== 'admin') {
        return res.send('<h1>Bạn chỉ là khách, không được vào đây!</h1><a href="/">Về trang chủ</a>');
    }

    // 3. Đúng là Admin -> Mời vào
    next();
};

module.exports = requireAdmin;