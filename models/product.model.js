const mongoose = require("mongoose")
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
    title: String,   //San pham 1
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    position: Number,
    deleted: {
        type: Boolean,
        default: false
    },
    slug: {  // thư viện npm dùng để có cái trên trang ở trên url đường dẫn
        type: String,
        slug: "title", //San pham 1
        unique: true  // duy nhất
    },
    deletedAt:Date
},
{
    timestamps: true
});

const Product = mongoose.model('Product', productSchema, "products");
console.log(Product);

module.exports = Product