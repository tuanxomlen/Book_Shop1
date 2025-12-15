// models/orderModel.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    username: String,        // Tên người mua
    items: Array,            // Danh sách sách đã mua
    totalPrice: Number,      // Tổng tiền
    address: String,         // Địa chỉ giao hàng
    phone: String,           // Số điện thoại
    status: { type: String, default: 'Chờ xác nhận' }, // Trạng thái đơn
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;