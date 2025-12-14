// controller/bookController.js
const Book = require('../models/bookModel');
const Order = require('../models/orderModel');

// 1. Hiển thị trang chủ (Lấy sách từ DB)
exports.showProducts = async (req, res) => {
    try {
        // Lấy toàn bộ sách trong database
        const books = await Book.find({}); 
        res.render('books/index', { books: books });
    } catch (err) {
        res.status(500).send('Lỗi lấy dữ liệu: ' + err.message);
    }
};

// 2. Hiển thị giỏ hàng (Lấy từ Session)
exports.showCart = (req, res) => {
    // Nếu chưa có giỏ thì tạo mảng rỗng
    const cart = req.session.cart || [];
    
    let total = 0;
    cart.forEach(item => total += item.price);
    
    res.render('books/cart', { cart: cart, total: total });
};

// 3. Thêm vào giỏ (Lưu vào Session)
exports.addToCart = async (req, res) => {
    const bookId = req.body.id; // Lấy ID sách gửi lên

    try {
        // Tìm sách trong Database bằng ID
        const book = await Book.findById(bookId);
        
        if (book) {
            // Khởi tạo giỏ hàng nếu chưa có
            if (!req.session.cart) {
                req.session.cart = [];
            }
            // Thêm sách vào session
            req.session.cart.push(book);
        }
        res.redirect('/cart');
    } catch (err) {
        res.status(500).send('Lỗi thêm giỏ hàng');
    }
};

// 4. Các chức năng khác
exports.showContact = (req, res) => res.render('books/contact');

// 5. Thêm Review (Lưu vào DB)
exports.addReview = async (req, res) => {
    try {
        const { id, content } = req.body;
        // Tìm sách và push review vào mảng
        await Book.findByIdAndUpdate(id, {
            $push: { reviews: content }
        });
        res.redirect('/');
    } catch (err) {
        res.send('Lỗi thêm review');
    }
};

exports.checkout = async (req, res) => {
    // 1. Chặn nếu chưa đăng nhập
    if (!req.session.user) {
        return res.send('<script>alert("Bạn phải đăng nhập để đặt hàng!"); window.location.href="/login"</script>');
    }

    // 2. Chặn nếu giỏ hàng rỗng
    const cart = req.session.cart;
    if (!cart || cart.length === 0) {
        return res.send('<script>alert("Giỏ hàng đang trống!"); window.location.href="/"</script>');
    }

    const { address, phone } = req.body;
    
    // Tính tổng tiền lại cho chắc chắn
    let total = 0;
    cart.forEach(item => total += item.price);

    try {
        // 3. Tạo đơn hàng mới
        const newOrder = new Order({
            username: req.session.user.username,
            items: cart,
            totalPrice: total,
            address: address,
            phone: phone
        });

        await newOrder.save(); // Lưu vào MongoDB

        // 4. Xóa sạch giỏ hàng
        req.session.cart = [];

        // 5. Thông báo
        res.send('<script>alert("Đặt hàng thành công! Chúng tôi sẽ sớm liên hệ."); window.location.href="/"</script>');

    } catch (err) {
        res.send('Lỗi đặt hàng: ' + err.message);
    }
};

exports.removeFromCart = (req, res) => {
    const itemIndex = req.body.index; // Lấy vị trí sản phẩm cần xóa

    if (req.session.cart) {
        // Hàm splice(vị_trí, số_lượng_cần_xóa)
        req.session.cart.splice(itemIndex, 1); 
    }
    
    // Xóa xong thì load lại trang giỏ hàng
    res.redirect('/cart');
};