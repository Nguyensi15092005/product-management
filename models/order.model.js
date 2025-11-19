const mongoose = require("mongoose");
const { priceNewProduct } = require("../helper/products");

const orderSchema = new mongoose.Schema({
    // user_id: String,
    cart_id: String,
    userInfo: {
        fullname: String,
        phone: String,
        address: String
    },
    products: [
        {
            product_id: String,
            title: String,
            price: Number,
            discountPercentage: Number,
            quantity: Number,
            thumbnail: String
        }
    ],
    totalPrice: Number,
    totalQuantity: Number,
    status: {
        type: String,
        default: "notcomfirm"
    },
    paymentStatus: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
},
    {
        timestamps: true
    });

const Order = mongoose.model('Order', orderSchema, "order");

module.exports = Order