import Message from "../../models/messageModel.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";

// Create new message
export const createMessage = catchAsyncErrors(async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  const newMessage = await Message.create({
    name,
    email,
    subject,
    message,
  });

  res.status(201).json({
    success: true,
    message: "Message sent successfully",
    message: newMessage,
  });
});

// Get all messages (admin only)
export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
  const messages = await Message.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    messages,
  });
});

// Delete message (admin only)
export const deleteMessage = catchAsyncErrors(async (req, res, next) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    return next(new ErrorHandler("Message not found", 404));
  }

  await message.deleteOne();

  res.status(200).json({
    success: true,
    message: "Message deleted successfully",
  });
});