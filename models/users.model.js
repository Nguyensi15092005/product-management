const mongoose = require("mongoose");
const generate = require("../helper/generate");
const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    phone: String,
    password: String,
    tokenUser: {
        type: String,
        default: generate.generateRandomString(20)
    },
    avatar: String,
    status: {
        type: String,
        default: "active"
    },
    deleted: {
        type: Boolean,
        default: false
    },
    updatedBy:[
        {
            account_id: String,
            updatedAt: Date
        }
    ],
    deletedBy: {
        account_id: String,
        deletedAt: Date
    },
    acceptFriends: Array,
    requestFriends: Array,
    friendList: Array,
    statusOnline: {
        type: String,
        default: "offline"
    },
},
    {
        timestamps: true
    });

const User = mongoose.model('User', userSchema, "users");

module.exports = User;