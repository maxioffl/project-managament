import { Notification } from '../models/Notification.js';
import { isDatabaseConnected } from '../config/database.js';

// In-memory storage fallback
let notifications = [];

export const createNotification = async (message, type, projectId, userId) => {
  try {
    if (isDatabaseConnected()) {
      const notification = new Notification({ message, type, projectId, userId });
      await notification.save();
      return notification;
    } else {
      const notification = {
        id: Date.now().toString(),
        message,
        type,
        projectId,
        userId,
        read: false,
        createdAt: new Date()
      };
      notifications.push(notification);
      return notification;
    }
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

export const getNotifications = async () => {
  try {
    if (isDatabaseConnected()) {
      return await Notification.find().sort({ createdAt: -1 }).limit(50);
    } else {
      return notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 50);
    }
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    if (isDatabaseConnected()) {
      return await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
    } else {
      const notificationIndex = notifications.findIndex(n => n.id === notificationId);
      if (notificationIndex !== -1) {
        notifications[notificationIndex].read = true;
        return notifications[notificationIndex];
      }
      return null;
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return null;
  }
};