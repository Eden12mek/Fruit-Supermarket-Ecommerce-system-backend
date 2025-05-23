import Notification from "../../models/notificationModel.js";
import ErrorHandler from "../../utils/ErrorHandler.js";
import catchAsyncErrors from "../../middleware/catchAsyncErrors.js";

// Get all notifications for a user
export const getNotifications = catchAsyncErrors(async (req, res, next) => {
  const { userId } = req.query;

  if (!userId) {
    return next(new ErrorHandler("User ID is required", 400));
  }

  const notifications = await Notification.find({ user_id: userId })
    .sort({ createdAt: -1 })
    .limit(20);

  const unreadCount = await Notification.countDocuments({
    user_id: userId,
    read: false,
  });

  res.status(200).json({
    success: true,
    notifications,
    unreadCount,
  });
});

// Mark single notification as read
export const markAsRead = catchAsyncErrors(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new ErrorHandler("Notification not found", 404));
  }

  notification.read = true;
  await notification.save();

  res.status(200).json({
    success: true,
    message: "Notification marked as read",
  });
});

// Mark all notifications as read for a user
export const markAllAsRead = catchAsyncErrors(async (req, res, next) => {
  const { userId } = req.query;

  if (!userId) {
    return next(new ErrorHandler("User ID is required", 400));
  }

  await Notification.updateMany(
    { user_id: userId, read: false },
    { $set: { read: true } }
  );

  res.status(200).json({
    success: true,
    message: "All notifications marked as read",
  });
});

// Create new notification
export const createNotification = catchAsyncErrors(async (req, res, next) => {
  const { user_id, type, message, related_id } = req.body;

  if (!user_id || !type || !message) {
    return next(
      new ErrorHandler("User ID, type and message are required fields", 400)
    );
  }

  const newNotification = await Notification.create({
    user_id,
    type,
    message,
    related_id,
    read: false,
  });

  res.status(201).json({
    success: true,
    message: "Notification created successfully",
    notification: newNotification,
  });
});