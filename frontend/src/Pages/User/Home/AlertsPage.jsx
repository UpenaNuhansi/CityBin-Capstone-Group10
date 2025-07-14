import React, { useEffect, useState } from 'react';
import api from '../../../api/axios';  

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
      await api.put(`/notifications/${notificationId}/read`); // <-- use api here
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, status: 'Read' } : n)
      );
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map(notification => (
            <li
              key={notification._id}
              className={`p-4 rounded-md shadow-md ${
                notification.status === 'Unread' ? 'bg-yellow-100' : 'bg-gray-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{notification.message}</span>
                {notification.status === 'Unread' && (
                  <button
                    className="text-sm text-blue-600 underline"
                    onClick={() => markAsRead(notification._id)}
                  >
                    Mark as read
                  </button>
                )}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {new Date(notification.createdAt).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AlertPage;
