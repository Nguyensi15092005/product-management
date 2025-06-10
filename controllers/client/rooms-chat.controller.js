const Users = require("../../models/users.model");
const RoomsChat = require("../../models/rooms-chat.model");
// [GET] /rooms-chat
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id
    const roomschat = await RoomsChat.find({
        deleted: false,
        typeRome: "group",
        "users.user_id": userId
    });
    res.render("client/pages/rooms-chat/index", {
        pageTitle: "Danh sách phòng chát",
        roomschat: roomschat
    })
}

// [GET] /rooms-chat/create
module.exports.create = async (req, res) => {
    const friendList = res.locals.user.friendList;
    for (const friend of friendList) {
        const infoFriend = await Users.findOne({
            _id: friend.user_id,
            deleted: false
        }).select("fullName avatar");
        friend.infoFriend = infoFriend;
    }
    res.render("client/pages/rooms-chat/create", {
        pageTitle: "Tạo phong",
        friendList: friendList
         
    })
}

// [Post] /rooms-chat/create
module.exports.createPost = async (req, res) => {
    const title = req.body.title;
    const usersId = req.body.userId;

    const dataRoonchat = {
        title: title,
        typeRome: "group",
        users: []
    }

    for (const userId of usersId) {
        dataRoonchat.users.push({
            user_id: userId,
            role: "user"
        })
    }

    dataRoonchat.users.push({
        user_id: res.locals.user.id,
        role: "superAdmin"
    })

    const roomchat = new RoomsChat(dataRoonchat);
    await roomchat.save();
    
    res.redirect(`/chat/room-chat/${roomchat.id}`);
}