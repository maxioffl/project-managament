import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const socket = useSocket('http://localhost:3001');
  const { isAuthenticated, token } = useAuth();

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchNotifications();
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (socket && isAuthenticated) {
      socket.on('projectCreated', ({ project, notification }) => {
        if (notification) {
          setNotifications(prev => [notification, ...prev]);
          addToast(`New project "${project.title}" was created`, 'success');
        }
      });

      socket.on('projectUpdated', ({ project, notification }) => {
        if (notification) {
          setNotifications(prev => [notification, ...prev]);
          addToast(`Project "${project.title}" was updated`, 'info');
        }
      });

      socket.on('projectDeleted', ({ projectId, notification }) => {
        if (notification) {
          setNotifications(prev => [notification, ...prev]);
          addToast(notification.message, 'warning');
        }
      });

      return () => {
        socket.off('projectCreated');
        socket.off('projectUpdated');
        socket.off('projectDeleted');
      };
    }
  }, [socket, isAuthenticated]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/notifications', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n._id === notificationId || n.id === notificationId ? { ...n, read: true } : n)
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const addToast = (message, type = 'info') => {
    const toast = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    setToasts(prev => [toast, ...prev]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(toast.id);
    }, 5000);
  };

  const removeToast = (toastId) => {
    setToasts(prev => prev.filter(t => t.id !== toastId));
  };

  const value = {
    notifications,
    toasts,
    markAsRead,
    addToast,
    removeToast,
    unreadCount: notifications.filter(n => !n.read).length
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};