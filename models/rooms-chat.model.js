const mongoose = require("mongoose");

const RoomChat = new mongoose.Schema({
    title: String,
    avatar: String,
    status: String, 
    typeRome: String,
    users: [
        {
            user_id: String,
            role: String,
        }
    ],

    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date,
},
    {
        timestamps: true
    });

const RoomsChat = mongoose.model('RoomsChat', RoomChat, "rooms-chat");

module.exports = RoomsChat