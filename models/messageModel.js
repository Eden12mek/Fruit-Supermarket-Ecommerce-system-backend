const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
  },
  subject: {
    type: String,
    required: [true, "Please enter message subject"],
  },
  message: {
    type: String,
    required: [true, "Please enter your message"],
  },
}, { timestamps: true });

const messageModel = mongoose.model("Message", messageSchema);

module.exports = messageModel
