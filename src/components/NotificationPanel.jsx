import React, { useEffect, useRef } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { X, CheckCircle, AlertCircle, Trash2, Clock, Bell } from 'lucide-react';

const NotificationPanel = ({ onClose }) => {
  const { notifications, markAsRead } = useNotifications();
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'create':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'update':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case 'delete':
        return <Trash2 className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diff = now - notificationDate;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 max-h-96 overflow-hidden animate-in slide-in-from-top-2 duration-200"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/50 rounded-xl transition-all duration-200 hover:scale-105"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="overflow-y-auto max-h-80">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-200" />
            <p className="text-lg font-medium text-gray-400 mb-1">No notifications yet</p>
            <p className="text-sm text-gray-400">You'll see updates here when projects change</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.map((notification) => (
              <div
                key={notification._id || notification.id}
                className={`p-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer group ${
                  !notification.read ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : ''
                }`}
                onClick={() => markAsRead(notification._id || notification.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm leading-relaxed ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTime(notification.createdAt)}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2 animate-pulse"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500">
            {notifications.filter(n => !n.read).length} unread notifications
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;