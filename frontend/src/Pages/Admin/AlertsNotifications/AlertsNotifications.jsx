import React, { useState, useEffect } from 'react';
import TopBar from '../../../Components/TopBar/TopBar';
import CreateAlertModal from '../../../Components/AlertsNotifications/CreateAlertModal';
import { format, isToday } from 'date-fns';
import { Bell } from 'lucide-react';
import api from '../../../api/axios';

function formatLastTriggered(timestamp) {
  if (!timestamp) return 'Never';
  const date = new Date(timestamp);
  return isToday(date) ? `${format(date, 'HH:mm')} today` : format(date, 'dd/MM/yyyy HH:mm');
}

export default function AlertsNotifications({ handleNavigation }) {
  const [notifications, setNotifications] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [activeTab, setActiveTab] = useState('recent');
  const [showCreateAlertModal, setShowCreateAlertModal] = useState(false);
  const [newNotificationFormData, setNewNotificationFormData] = useState({
    message: '',
    userRole: 'user',
    userId: '',
    type: 'report'
  });
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationTarget, setNotificationTarget] = useState('AllUsers');
  const [specificIds, setSpecificIds] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationStatus, setNotificationStatus] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const res = await api.get(`/notifications/user/${user._id}`);
        const formatted = res.data.data.map(notif => ({
          id: notif._id,
          time: new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: notif.type === 'AdminNotification' ? 'Maintenance' : notif.type,
          message: notif.message,
          read: notif.status === 'Read'
        }));
        setNotifications(formatted);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/reports');
        const reportsData = response.data?.reports || response.data || [];
        setReports(reportsData);
      } catch (err) {
        console.error('Failed to fetch user reports:', err.response?.data || err.message);
        showNotification('Failed to fetch user reports', 'error');
        setReports([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (activeTab === 'reports') {
      fetchReports();
    }
  }, [activeTab]);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const markAsRead = id => setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  const markAsUnread = id => setNotifications(notifications.map(n => n.id === id ? { ...n, read: false } : n));
  const clearAllNotifications = () => {
    setNotifications([]);
    showNotification('All notifications cleared!', 'success');
  };

  const getNotificationTypeColor = type => {
    switch (type) {
      case 'Full Bin': return 'bg-pink-100 text-pink-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Delayed Collection': return 'bg-blue-100 text-blue-800';
      case 'Sensor Offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const filteredNotifications = notifications.filter(notif =>
    notif.message.toLowerCase().includes(searchText.toLowerCase()) ||
    notif.type.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredReports = Array.isArray(reports)
    ? reports.filter(report => {
        const term = searchText.toLowerCase();
        return (
          (report.userId?.uniqueId || '').toLowerCase().includes(term) ||
          (report.binCategory || '').toLowerCase().includes(term) ||
          (report.problem || '').toLowerCase().includes(term) ||
          (report.description || '').toLowerCase().includes(term)
        );
      })
    : [];

  const handleSendBulkNotification = async () => {
    if (!notificationMessage.trim()) {
      showNotification('Please enter a message before sending.', 'error');
      return;
    }

    const payload = {
      message: notificationMessage,
      target: notificationTarget,
      specificIds: notificationTarget.includes('Specific')
        ? specificIds.split(',').map(id => id.trim()).filter(Boolean)
        : []
    };

    try {
      await api.post('/notifications/bulk', payload);
      showNotification('Notification sent successfully!', 'success');
      setNotificationMessage('');
      setSpecificIds('');
    } catch (error) {
      console.error('Failed to send bulk notification:', error);
      showNotification('Failed to send notification.', 'error');
    }
  };

  const markAsReviewed = async (reportId) => {
    try {
      await api.put(`/reports/${reportId}/review`);
      setReports(prev =>
        prev.map(r => r._id === reportId ? { ...r, reviewed: true } : r)
      );
      showNotification('Report marked as reviewed', 'success');
    } catch (error) {
      showNotification('Failed to update report', 'error');
    }
  };

  return (
    <div className="mt-18 flex-1 flex flex-col ml-64 bg-gray-50 min-h-screen">
      <TopBar
        title="Alerts & Notifications"
        searchText={searchText}
        setSearchText={setSearchText}
        onProfileClick={() => handleNavigation('Profile')}
      />

      <div className="flex-1 p-6">
        {notification.show && (
          <div className={`p-4 mb-4 rounded border ${notification.type === 'success' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
            {notification.message}
          </div>
        )}

        <div className="flex mb-6 border-b">
          <button
            className={`py-2 px-6 font-medium ${activeTab === 'recent' ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-600 hover:text-green-700'}`}
            onClick={() => setActiveTab('recent')}
          >
            Recent Notifications
          </button>
          <button
            className={`py-2 px-6 font-medium ${activeTab === 'reports' ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-600 hover:text-green-700'}`}
            onClick={() => setActiveTab('reports')}
          >
            User Reports & Notifications
          </button>
        </div>

        {/* Recent Notifications Tab */}
        {activeTab === 'recent' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Recent Notifications</h2>
              {notifications.length > 0 && (
                <button className="text-red-600 hover:underline" onClick={clearAllNotifications}>
                  Clear All
                </button>
              )}
            </div>

            <div className="overflow-x-auto border rounded-lg shadow-sm">
              <table className="w-full table-auto">
                <thead className="bg-green-100 text-sm text-left text-green-900">
                  <tr>
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Message</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notif, index) => (
                      <tr
                        key={notif.id}
                        className={`text-sm ${notif.read ? 'bg-white' : 'bg-green-50 font-semibold'} hover:bg-green-100 transition-colors`}
                      >
                        <td className="px-4 py-3 border-t">{notif.time}</td>
                        <td className="px-4 py-3 border-t">
                          <span className={`px-2 py-1 rounded-full text-xs ${getNotificationTypeColor(notif.type)}`}>
                            {notif.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-t">{notif.message}</td>
                        <td className="px-4 py-3 border-t text-right">
                          <button
                            onClick={() => notif.read ? markAsUnread(notif.id) : markAsRead(notif.id)}
                            className="text-blue-600 hover:underline"
                          >
                            {notif.read ? 'Mark Unread' : 'Mark Read'}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-10 text-center text-gray-500">
                        <Bell size={36} className="mx-auto mb-2" />
                        No notifications available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* User Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-8">
            {/* Reports Table */}
            <div className="border rounded-lg shadow-sm overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-green-100 text-green-900 text-sm text-left">
                  <tr>
                    <th className="px-4 py-3">User ID</th>
                    <th className="px-4 py-3">Bin Category</th>
                    <th className="px-4 py-3">Problem</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Reviewed</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report, index) => (
                      <tr key={report._id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-green-50'} hover:bg-green-100 transition`}>
                        <td className="px-4 py-3 border-t">{report.userId?.uniqueId || '—'}</td>
                        <td className="px-4 py-3 border-t">{report.binCategory || '—'}</td>
                        <td className="px-4 py-3 border-t">{report.problem || '—'}</td>
                        <td className="px-4 py-3 border-t">{report.description || '—'}</td>
                        <td className="px-4 py-3 border-t">{report.createdAt ? format(new Date(report.createdAt), 'dd/MM/yyyy HH:mm') : '—'}</td>
                        <td className="px-4 py-3 border-t">
                          {report.reviewed ? (
                            <span className="text-green-600 font-semibold">✓ Reviewed</span>
                          ) : (
                            <button
                              onClick={() => markAsReviewed(report._id)}
                              className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
                            >
                              Mark Reviewed
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-10 text-center text-gray-500">
                        <Bell size={36} className="mx-auto mb-2" />
                        No reports available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Send Bulk Notification Section */}
            <div className="border rounded-lg p-6 shadow-sm bg-white">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Send Bulk Notification</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Target Audience</label>
                  <select
                    value={notificationTarget}
                    onChange={(e) => setNotificationTarget(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="AllUsers">All Users</option>
                    <option value="AllOperators">All Operators</option>
                    <option value="SpecificUsers">Specific Users</option>
                    <option value="SpecificOperators">Specific Operators</option>
                  </select>
                </div>

                {(notificationTarget === 'SpecificUsers' || notificationTarget === 'SpecificOperators') && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Specific IDs (comma separated)</label>
                    <input
                      type="text"
                      value={specificIds}
                      onChange={(e) => setSpecificIds(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="CBU001, CBU002"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={4}
                  />
                </div>

                <button
                  onClick={handleSendBulkNotification}
                  className="bg-green-700 hover:bg-green-800 text-white font-medium px-4 py-2 rounded transition"
                >
                  Send Notification
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showCreateAlertModal && (
        <CreateAlertModal
          show={showCreateAlertModal}
          onClose={() => setShowCreateAlertModal(false)}
          formData={newNotificationFormData}
          onFormChange={(form) => setNewNotificationFormData(form)}
          onSave={handleSendBulkNotification}
        />
      )}
    </div>
  );
}