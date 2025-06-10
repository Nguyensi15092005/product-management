const mongoose = require("mongoose")
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const articleSchema = new mongoose.Schema({
    title: String,   //San pham 1
    article_category_id: {
        type: String,
        default: ""
    },
    content: String,
    thumbnail: String,
    featured: String,
    status: String,
    position: Number,
    deleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    slug: {  // thư viện npm dùng để có cái trên trang ở trên url đường dẫn
        type: String,
        slug: "title", //San pham 1
        unique: true  // duy nhất
    },
    updatedBy: [
        {
            account_id: String,
            updatedAt: Date  
        }
    ],
    // deletedAt: Date
    deletedBy: {
        account_id: String,
        deletedAt: Date
    },
},
    {
        timestamps: true
    });

const Acticles = mongoose.model('Acticles', articleSchema, "acticles");


module.exports = Acticles