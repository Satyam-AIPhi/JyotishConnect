const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'system'],
    default: 'text'
  }
}, { timestamps: true });

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    astrologerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    messages: [messageSchema],
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active'
    }
  },
  { timestamps: true }
);

// Compound index to ensure unique user-astrologer pairs
chatSchema.index({ userId: 1, astrologerId: 1 }, { unique: true });

module.exports = mongoose.model('Chat', chatSchema);