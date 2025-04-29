// src/components/NotificationSystem.js
"use client";

import { useState, useEffect, useRef } from 'react';
import { FiBell, FiX, FiCheck, FiClock } from 'react-icons/fi';

export default function NotificationSystem({ userRole, userId }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const notificationPanelRef = useRef(null);
  const API_BASE_URL = "https://dokument-guru-backend.vercel.app/api";

  // Determine recipient ID based on role
  const getRecipient = () => {
    if (userRole === 'staff_manager') return 'staff-manager';
    if (userRole === 'staff') return `staff-${userId}`;
    if (userRole === 'agent') return `agent-${userId}`;
    return null;
  };

  const recipient = getRecipient();

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!recipient) return;
    console.log("rece = ",recipient)
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/notifications?recipient=${recipient}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch notifications: ${response.status}`);
      }
      
      const data = await response.json()
      setNotifications(data.notifications);
      setUnreadCount(data.notifications.filter(n => !n.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mark notifications as read
  const markAsRead = async (notificationIds) => {
    if (!notificationIds || notificationIds.length === 0) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: notificationIds }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to mark notifications as read: ${response.status}`);
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notificationIds.includes(notification._id) 
            ? { ...notification, read: true } 
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - notificationIds.length));
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n._id);
    if (unreadIds.length > 0) {
      markAsRead(unreadIds);
    }
  };

  // Close notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationPanelRef.current && !notificationPanelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Poll for new notifications
  useEffect(() => {
    fetchNotifications();
    
    // Poll every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [recipient]);

  // When notification panel is opened, mark visible notifications as read
  useEffect(() => {
    if (isOpen && notifications.length > 0) {
      // Mark as read after a short delay to ensure user has had time to see them
      const timer = setTimeout(() => {
        const visibleUnreadIds = notifications
          .filter(n => !n.read)
          .slice(0, 5) // Only mark visible ones as read
          .map(n => n._id);
        
        if (visibleUnreadIds.length > 0) {
          markAsRead(visibleUnreadIds);
        }
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, notifications]);

  // Format the time display
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application_created':
        return <FiClock className="text-blue-500" />;
      case 'staff_assigned':
        return <FiCheck className="text-green-500" />;
      case 'status_updated':
        return <FiCheck className="text-purple-500" />;
      default:
        return <FiBell className="text-gray-500" />;
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <FiBell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div 
          ref={notificationPanelRef}
          className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50"
        >
          <div className="py-2 px-3 bg-gray-100 flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="py-4 text-center text-gray-500">
                <FiBell className="animate-pulse h-5 w-5 mx-auto mb-2" />
                <p className="text-sm">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-4 text-center text-gray-500">
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {notifications.map(notification => (
                  <li 
                    key={notification._id} 
                    className={`p-3 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(notification.createdAt)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}