const Chat = require('../models/chat.model');
const { generateSummary } = require('../utils/ai');
const User = require('../../models/user.model');
const mongoose = require('mongoose');

module.exports = function setupChatHandlers(io, socket, onlineUsers) {

  // Join Room
  socket.on('joinRoom', ({ chatId }) => {
    socket.join(chatId);
    console.log(`User ${socket.user.id} joined room ${chatId}`);
  });

  // Send Message
  socket.on("sendMessage", async ({ chatId, message, replyTo }, callback) => {
    try {
      // Validate input
      if (!chatId || !message) {
        if (callback) callback({ success: false, error: 'Invalid message data' });
        return;
      }

      const chat = await Chat.findById(chatId);
      if (!chat) {
        if (callback) callback({ success: false, error: 'Chat not found' });
        return;
      }

      // Add console logs for debugging
      console.log('Received message:', {
        chatId,
        message,
        userId: socket.user.id
      });

      // Verify user has access to this chat
      if (chat.userId.toString() !== socket.user.id &&
        chat.astrologerId.toString() !== socket.user.id) {
        callback({ success: false, error: 'Access denied' });
        return;
      }

      const user = await User.findById(socket.user.id).select('name avatar');

      const newMessage = {
        _id: new mongoose.Types.ObjectId(),
        sender: socket.user.id,
        content: message,
        type: "text",
        reactions: new Map(),
        replyTo: replyTo || null,  // This stores just the message ID
        createdAt: new Date()
      };

      chat.messages.push(newMessage);
      await chat.save();

      const savedMessage = chat.messages[chat.messages.length - 1];

      // Get replied message details
      let replyToPayload = null;
      if (savedMessage.replyTo) {
        // Find the original message in chat history
        const originalMessage = chat.messages.find(msg =>
          msg._id.equals(savedMessage.replyTo)
        );

        if (originalMessage) {
          // Get sender info of original message
          const originalSender = await User.findById(originalMessage.sender)
            .select('name avatar');

          replyToPayload = {
            _id: originalMessage._id,
            content: originalMessage.content,
            sender: {
              _id: originalSender._id,
              name: originalSender.name,
              avatar: originalSender.avatar
            }
          };
        }
      }

      // Construct final message payload
      const messagePayload = {
        _id: savedMessage._id,
        sender: {
          _id: user._id,
          name: user.name,
          avatar: user.avatar
        },
        content: savedMessage.content,
        createdAt: savedMessage.createdAt,
        type: savedMessage.type,
        replyTo: replyToPayload,  // Use the properly populated payload
        reactions: {}
      };

      // Emit to all clients in the chat room
      io.to(chatId).emit("newMessage", { chatId, message: messagePayload });

      // Check if callback exists before calling
      if (callback) {
        callback({
          success: true,
          message: messagePayload
        });
      }

    } catch (error) {
      console.error("Error in sendMessage:", error);
      if (callback) callback({ success: false, error: error.message }); // Add callback check
    }
  });

  // Edit Message
  socket.on('editMessage', async ({ chatId, messageId, newContent }) => {
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) {
        console.error(`Chat not found: ${chatId}`);
        return;
      }

      const message = chat.messages.id(messageId);
      if (!message) return;

      // Check if the user is the sender and within 10 minutes
      if (message.sender.toString() !== socket.user.id) return;
      const messageTime = new Date(message.createdAt);
      const now = new Date();
      const diffMinutes = (now - messageTime) / (1000 * 60);
      if (diffMinutes > 10) return;

      message.content = newContent;
      await chat.save();

      io.to(chatId).emit('messageEdited', {
        chatId,
        message: {
          _id: message._id,
          sender: message.sender,
          content: message.content,
          createdAt: message.createdAt,
          type: message.type,
          replyTo: message.replyTo
        }
      });
      console.log(`Message ${messageId} edited in chat ${chatId} by user ${socket.user.id}`);
    } catch (error) {
      console.error("Error in editMessage:", error);
    }
  });

  // Delete Message
  socket.on('deleteMessage', async ({ chatId, messageId }) => {
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) return;

      const message = chat.messages.id(messageId);
      if (!message) return;

      // Allow delete if sender or if message is less than 10 minutes old
      const canDelete = message.sender.toString() === socket.user.id ||
        (Date.now() - message.createdAt.getTime()) <= 600000;

      if (!canDelete) return;

      await chat.updateOne({ $pull: { messages: { _id: messageId } } });
      io.to(chatId).emit('messageDeleted', { chatId, messageId });
    } catch (error) {
      console.error("Error in deleteMessage:", error);
    }
  });


  // Typing Indicators
  socket.on('typing', ({ chatId, isTyping }) => {
    socket.to(chatId).emit('typing', { userId: socket.user.id, isTyping });
  });

  // Handle reactions
  socket.on("reactToMessage", async ({ chatId, messageId, emoji }) => {
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) throw new Error('Chat not found');

      const message = chat.messages.id(messageId);
      if (!message) throw new Error('Message not found');

      // Initialize reactions if needed
      if (!message.reactions) {
        message.reactions = new Map();
      }

      // Toggle reaction
      if (message.reactions.get(socket.user.id) === emoji) {
        message.reactions.delete(socket.user.id);
      } else {
        message.reactions.set(socket.user.id, emoji);
      }

      await chat.save();

      // Convert Map to plain object for emitting
      const reactionsObj = {};
      message.reactions.forEach((value, key) => {
        reactionsObj[key] = value;
      });

      io.to(chatId).emit("messageReactionUpdated", {
        chatId,
        messageId,
        reactions: reactionsObj
      });

    } catch (error) {
      console.error("Error in reactToMessage:", error);
      socket.emit("errorMessage", {
        message: "Failed to add reaction",
        error: error.message
      });
    }
  });


  // Generate AI Summary
  socket.on('generateSummary', async ({ chatId }) => {
    try {
      const chat = await Chat.findById(chatId);
      if (!chat) {
        console.error(`Chat not found: ${chatId}`);
        return;
      }

      const promptText = chat.messages.map(msg => {
        const senderName = msg.sender ? msg.sender.name : 'System'; 
        return `${senderName}: ${msg.content}`;
      }).join('\n');


      const summary = await generateSummary(promptText);

      io.to(chatId).emit('summary', { summary });
    } catch (error) {
      console.error(error);
    }
  });

};
