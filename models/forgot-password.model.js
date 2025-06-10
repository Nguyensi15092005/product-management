const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema(
    {
        email: String,
        otp: String,
        expireAt: { //thời gian nó tự đông hết hạng lấy thời gian hiện tại + 10ss
            type: Date,
            expires: 180
        }
    },
    {
        timestamps: true
    });

const ForgetPassword = mongoose.model('ForgetPassword', forgotPasswordSchema, "forgot-password");

module.exports = ForgetPassword