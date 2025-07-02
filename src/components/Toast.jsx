import React, { useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { CheckCircle, AlertCircle, AlertTriangle, X, Info } from 'lucide-react';

const Toast = () => {
  const { toasts, removeToast } = useNotifications();

  const getToastIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getToastColors = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 shadow-green-100';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800 shadow-yellow-100';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 shadow-red-100';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800 shadow-blue-100';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className={`flex items-center p-4 rounded-2xl border shadow-2xl max-w-sm transform transition-all duration-300 animate-in slide-in-from-right-full ${getToastColors(toast.type)}`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex-shrink-0">
            {getToastIcon(toast.type)}
          </div>
          <p className="ml-3 text-sm font-semibold flex-1 leading-relaxed">
            {toast.message}
          </p>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-3 hover:bg-black hover:bg-opacity-10 rounded-xl p-1.5 transition-all duration-200 hover:scale-110"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;