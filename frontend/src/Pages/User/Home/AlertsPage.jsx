import React, { useEffect, useState } from 'react';
import api from '../../../api/axios';
import { Bell, CheckCircle } from 'lucide-react';

const AlertPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get(`/notifications/user/${userId}`);
        setNotifications(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setLoading(false);
      }
    };

    if (userId) fetchNotifications();
  }, [userId]);

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(n =>
          n._id === notificationId ? { ...n, status: 'Read' } : n
        )
      );
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  if (loading) return <div className="p-6 text-center text-lg">Loading notifications...</div>;

  return (
    <div className="ml-64 mt-12 p-6 min-h-screen bg-gradient-to-br from-green-50 to-green-100 font-sans">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-green-900 mb-6 flex items-center gap-2 text-center">
          <Bell className="w-6 h-6" />
          Your Notifications
        </h2>

        {notifications.length === 0 ? (
          <p className="text-gray-600 text-center">No notifications found.</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className={`p-5 rounded-lg shadow-md transition-all duration-300 ${
                  notification.status === 'Unread'
                    ? 'bg-yellow-100 border-l-4 border-yellow-400'
                    : 'bg-white border-l-4 border-green-300'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="text-md text-gray-800">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    {notification.status === 'Unread' ? (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Mark as read
                      </button>
                    ) : (
                      <span className="inline-flex items-center text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" /> Read
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AlertPage;