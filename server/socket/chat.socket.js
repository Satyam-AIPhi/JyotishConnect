const Chat = require('../models/chat.model');

module.exports = function setupChatHandlers(io, socket, onlineUsers) {

  // ============= CHAT EVENTS =============
  socket.on('joinRoom', ({ chatId }) => {
    socket.join(chatId);
  });

  socket.on("sendMessage", async ({ chatId, message }) => {
    // Save message to DB
    const chat = await Chat.findById(chatId);
    if (!chat) return;

    chat.messages.push({
      sender: socket.user.id,
      content: message,
      type: "text"
    });
    await chat.save();

    // Re-populate messages to get sender info
    await chat.populate("messages.sender", "name avatar");

    const lastMsg = chat.messages[chat.messages.length - 1];

    // Broadcast message to everyone in this chat room
    io.to(chatId).emit("newMessage", {
      chatId,
      message: lastMsg,
    });
  });
};
