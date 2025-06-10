const mongoose = require("mongoose")
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const articleCategorySchema = new mongoose.Schema({
    title: String, 
    parent_id: {
        type: String,
        default: ""
    },
    content: String,  
    thumbnail: String,
    status: String,
    position: Number,
    deleted: {
        type: Boolean,
        default: false
    },
    slug: {  // thư viện npm dùng để có cái trên trang ở trên url đường dẫn
        type: String,
        slug: "title", 
        unique: true  // duy nhất
    },
    createdBy: {
        account_id: String,
        createAt: {
            type: Date,
            default: Date.now
        }
    },
    deletedBy: {
        account_id: String,
        deletedAt: Date
    },
    updatedBy: [
        {
            account_id: String,
            updatedAt: Date
        }
    ]
},
    {
        timestamps: true
    });

const ArticelCategory = mongoose.model('ArticelCategory',articleCategorySchema , "articles-category");


module.exports = ArticelCategory