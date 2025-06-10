const RoomChat = require("../../models/rooms-chat.model");
module.exports.isAccess = async (req, res, next)=>{
    const roomChatId = req.params.roomChatId;
    const userId = res.locals.user.id;

    const existUserInRoomchat = await RoomChat.findOne({
        _id: roomChatId,
        "users.user_id": userId,
        deleted: false
    })

    if(existUserInRoomchat){
        next()
    }
    else{
        res.redirect("/");
    }


}