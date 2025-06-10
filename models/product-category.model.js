const mongoose = require("mongoose")
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema({
    title: String,   //San pham 1
    parent_id: {
        type: String,
        default: ""
    },
    description: String,
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
    createdBy:{
        account_id: String,
        createAt:{
            type:Date,
            default: Date.now
        }
    },
    deletedBy:{
        account_id: String,
        deletedAt: Date
    },
    updatedBy:[
        {
            account_id: String,
            updatedAt: Date
        }
    ]
},
    {
        timestamps: true
    });

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema, "products-category");
console.log(ProductCategory);

module.exports = ProductCategory