import { getNotifications, markNotificationAsRead } from '../services/notificationService.js';

export const getAllNotifications = async (req, res) => {
  try {
    const userNotifications = await getNotifications();
    res.json(userNotifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await markNotificationAsRead(id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};