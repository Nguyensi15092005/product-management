const Chat = require("../../models/chat.model");
const uploadTocloudinary = require("../../helper/uploadCloudinary");

module.exports = (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;
  const roomChatId = req.params.roomChatId
  // SocketIO
  _io.once('connection', (socket) => {
    socket.join(roomChatId);
    socket.on('CLIENT_SEND_MESSAGE', async (data) => {
      let images = [];
      for (const key in data.images) {
        const link = await uploadTocloudinary(data.images[key]);
        images.push(link);
      }
      const chat = new Chat({
        user_id: userId,
        content: data.content,
        images: images,
        rom_chat_id: roomChatId

      });
      await chat.save();

      _io.to(roomChatId).emit('CLIENT_RETURN _MESSAGE', {
        user_id: userId,
        fullName: fullName,
        content: data.content,
        images: images
      });

    });
    socket.on('CLIENT_SEND_TYPING', async (type) => {
      socket.broadcast.to(roomChatId).emit("CLIENT_RETURN_TYPING", {
        user_id: userId,
        fullName: fullName,
        type: type
      })

    });
  });
  // End socket
}