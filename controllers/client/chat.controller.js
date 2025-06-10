const Chat = require("../../models/chat.model");
const User = require("../../models/users.model");
const chatSocketIO = require("../../socketIO/client/chat.socket");



// [GET] /chat/:roomChatId
module.exports.index = async (req, res) => {
  const roomChatId = req.params.roomChatId;
  try {
    // socketIO
    chatSocketIO(req, res);
    // End socketIO

    //lấy data từ db
    const chats = await Chat.find({
      rom_chat_id: roomChatId,
      deleted: false
    });
    for (const chat of chats) {
      const inforUser = await User.findOne({
        _id: chat.user_id
      }).select("fullName");

      chat.inforUser = inforUser

    }

    res.render("client/pages/chat/index", {
      pageTitle: "Chat",
      chats: chats
    })
  } catch (error) {

  }

}