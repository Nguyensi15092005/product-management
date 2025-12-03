const mongoose = require("mongoose");

const chatboxSchema = new mongoose.Schema({
    user_id: String,
    messages: [
        {
            role: String,
            content: String,
            createdAt: { type: Date, default: Date.now }
        }
    ],
    deleted: {
        type: Boolean,
        default: false
    },
},
    {
        timestamps: true
    });

const Chatbox = mongoose.model('Chatbox', chatboxSchema, "chatbox");

module.exports = Chatbox