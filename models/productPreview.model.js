const mongoose = require("mongoose");

const ProductPreviewSchema = new mongoose.Schema({
    product_Id: String,
    user_Id: String,
    content: String,
    createdBy: {
        account_id: String,
        createdAt:{
            type:Date,
            default: Date.now
        }
    },
    deleted: {
        type: Boolean,
        default: false
    },
    deletedBy:{
        account_id:String,
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

const ProductPreview = mongoose.model('ProductPreview', ProductPreviewSchema, "productPreviews");

module.exports = ProductPreview;