const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    order_id: String,
    amount: Number,
    vnp_ResponseCode: String, // mã trả về từ vnpay sau khi thanh toán
    vnp_TransactionNo: String, // số giao dịch của vnpay
    vnp_BankCode: String, // mã ngân hàng thanh toán
    deleted: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    });

const Payment = mongoose.model('Payment', paymentSchema, "payment");

module.exports = Payment