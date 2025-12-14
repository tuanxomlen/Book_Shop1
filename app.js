// app.js
const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session'); // Thư viện Session
const connectDB = require('./config/db.js');
connectDB();

const bookRoutes = require('./routes/bookRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes'); // Route đăng nhập




// 1. Cấu hình View & Body Parser
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// 2. Cấu hình SESSION (Bắt buộc để nhớ đăng nhập)
app.use(session({
    secret: 'ma_bi_mat_khong_tiet_lo', // Khóa bí mật để mã hóa session
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // false vì đang chạy localhost (http)
}));

// 3. Middleware toàn cục (Để giao diện biết ai đang login)
app.use((req, res, next) => {
    // Biến user sẽ được dùng ở mọi file EJS (để hiện nút Logout chẳng hạn)
    res.locals.currentUser = req.session.user || null;
    next();
});

// 4. Kết nối Routes
app.use('/', authRoutes); // Login/Register
app.use('/', bookRoutes);
app.use('/admin', adminRoutes); // Admin (đã được bảo vệ bên trong file routes)

// 5. Chạy Server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`✅ Server chạy tại: http://localhost:${PORT}`);
    console.log(`👉 Trang Login: http://localhost:${PORT}/login`);
    console.log(`👉 Thử vào Admin (sẽ bị chặn): http://localhost:${PORT}/admin`);
});