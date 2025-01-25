const Chat = require('../models/chat.model');
const User = require('../models/user.model');
const errorHandler = require('../utils/error');

/**
 * POST /api/v1/chat/init
 * Body: { astrologerId, userDetails: { name, gender, date, time, place } }
 */
exports.initChat = async (req, res, next) => {
  try {
    const { astrologerId, userDetails } = req.body;
    const userId = req.user.id; // from verifyToken

    // Check if the astrologer (which is also stored in user collection) exists
    const astrologerUser = await User.findById(astrologerId);
    if (!astrologerUser) {
      return next(errorHandler(404, 'Astrologer user not found'));
    }
    
    // 1) Find existing Chat or create a new one
    let chat = await Chat.findOne({ userId, astrologerId });
    if (!chat) {
      chat = new Chat({
        userId,
        astrologerId,
        messages: [],
      });
      await chat.save();
    }

    // 2) Insert system message with user details
    const astrologerName = astrologerUser.name;
    const { name, gender, date, time, place } = userDetails;
    const systemMessage = {
      sender: userId, 
      content: `Hi ${astrologerName},\nBelow are my details:\nName: ${name}\nGender: ${gender}\nDOB: ${date}\nTOB: ${time}\nPOB: ${place}`,
      type: 'system',
    };
    
    chat.messages.push(systemMessage);
    await chat.save();

    return res.status(200).json({
      success: true,
      chatId: chat._id,
      message: 'Chat initialized with user details.'
    });
  } catch (error) {
    next(error);
  }
};


exports.getUserChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({
      $or: [
        { userId: req.user.id },
        { astrologerId: req.user.id }
      ]
    })
      .populate('userId', 'name avatar')
      .populate('astrologerId', 'name avatar')
      .sort('-updatedAt');
    
    res.status(200).json(chats);
  } catch (error) {
    next(error);
  }
};

exports.getChatMessages = async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate('userId', 'name avatar')
      .populate('astrologerId', 'name avatar')
      .populate('messages.sender', 'name avatar');
    
    if (!chat) {
      return next(errorHandler(404, 'Chat not found'));
    }

    // Check if user has access to this chat
    if (
      chat.userId._id.toString() !== req.user.id && 
      chat.astrologerId._id.toString() !== req.user.id
    ) {
      return next(errorHandler(403, 'Access denied'));
    }

    res.status(200).json(chat);
  } catch (error) {
    next(error);
  }
};
