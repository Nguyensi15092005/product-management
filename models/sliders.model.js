const mongoose = require("mongoose")

const sliderSchema = new mongoose.Schema({
    title: String, 
    status: String, 
    image: String,
    url: String,
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

const Slider = mongoose.model('Slider', sliderSchema, "sliders");

module.exports = Slider