import { useState } from 'react';
import CreateAlertModal from '../../../Components/AlertsNotifications/CreateAlertModal';
import TopBar from '../../../Components/TopBar/TopBar';
import { format, isToday } from 'date-fns';
import { User, Search, ToggleLeft, ToggleRight, Bell } from 'lucide-react';

// Sample notifications data
const initialNotifications = [
  { id: 1, time: '10:22', type: 'Full Bin', message: 'Bin A02 is full.', read: false },
  { id: 2, time: '09:53', type: 'Maintenance', message: 'Bin C17 requires maintenance.', read: false },
  { id: 3, time: '09:22', type: 'Delayed Collection', message: 'Collection delayed at Bin B10.', read: true },
  { id: 4, time: '09:05', type: 'Sensor Offline', message: 'Sensor B disconnected.', read: false },
  { id: 5, time: '08:41', type: 'Full Bin', message: 'Bin D04 is full.', read: true },
];

// Sample alert settings
const initialAlertSettings = [
  { 
    id: 1, 
    name: 'Notify when bin is full', 
    description: 'Bin A02 is full.', 
    enabled: true,
    condition: 'Bin A02 is full.',
    lastTriggered: new Date('2025-05-13T10:22:00')
  },
  { 
    id: 2, 
    name: 'Maintenance required alerts', 
    description: 'Bin C17 requires maintenance.', 
    enabled: true,
    condition: 'Bin C17 requires maintenance.',
    lastTriggered: new Date('2025-05-13T09:53:00')
  },
  { 
    id: 3, 
    name: 'Collection delayed alerts', 
    description: 'Collection delayed at Bin B10.', 
    enabled: false,
    condition: 'Collection delayed at Bin B10.',
    lastTriggered: new Date('2025-05-13T09:22:00')
  },
  { 
    id: 4, 
    name: 'Sensor connectivity loss', 
    description: 'Sensor B disconnected.', 
    enabled: true,
    condition: 'Sensor B disconnected.',
    lastTriggered: new Date('2025-05-13T09:05:00')
  },
  { 
    id: 5, 
    name: 'Low battery warnings', 
    description: 'Bin D04 is full.', 
    enabled: false,
    condition: 'Bin D04 is full.',
    lastTriggered: new Date('2025-05-13T08:41:00')
  },
];

function formatLastTriggered(timestamp) {
  if (!timestamp) return 'Never';
  const date = new Date(timestamp);
  return isToday(date) ? format(date, 'HH:mm') + ' today' : format(date, 'dd/MM/yyyy HH:mm');
}

export default function AlertsNotifications({ handleNavigation }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [alertSettings, setAlertSettings] = useState(initialAlertSettings);
  const [searchText, setSearchText] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [activeTab, setActiveTab] = useState('recent');
  const [showCreateAlertModal, setShowCreateAlertModal] = useState(false);
  const [newAlertFormData, setNewAlertFormData] = useState({
    name: '',
    condition: '',
    description: '',
    enabled: true,
  });

  const toggleAlertSetting = (id) => {
    const updatedSettings = alertSettings.map(setting =>
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    );
    setAlertSettings(updatedSettings);
    const setting = alertSettings.find(s => s.id === id);
    if (setting) {
      const status = !setting.enabled ? 'enabled' : 'disabled';
      showNotification(`Alert "${setting.name}" ${status}!`, "success");
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAsUnread = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: false } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showNotification("All notifications cleared!", "success");
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const getNotificationTypeColor = (type) => {
    switch (type) {
      case 'Full Bin': return 'bg-pink-100 text-pink-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Delayed Collection': return 'bg-blue-100 text-blue-800';
      case 'Sensor Offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const handleCreateAlert = () => {
    setShowCreateAlertModal(true);
  };

  const handleAddAlertFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAlertFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddAlertSave = () => {
    if (newAlertFormData.name.trim() && newAlertFormData.condition.trim()) {
      const newAlert = {
        id: alertSettings.length > 0 ? Math.max(...alertSettings.map(s => s.id)) + 1 : 1,
        name: newAlertFormData.name,
        condition: newAlertFormData.condition,
        description: newAlertFormData.description,
        enabled: newAlertFormData.enabled,
        lastTriggered: null,
      };
      setAlertSettings([...alertSettings, newAlert]);
      setShowCreateAlertModal(false);
      showNotification("New alert created successfully!", "success");
      setNewAlertFormData({
        name: '',
        condition: '',
        description: '',
        enabled: true,
      });
    } else {
      showNotification("Please fill in all required fields!", "error");
    }
  };

  const filteredNotifications = notifications.filter(notif =>
    notif.message.toLowerCase().includes(searchText.toLowerCase()) ||
    notif.type.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredAlertSettings = alertSettings.filter(setting =>
    setting.name.toLowerCase().includes(searchText.toLowerCase()) ||
    setting.condition.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col ml-64">
      <TopBar
        title="Alerts & Notifications"
        searchText={searchText}
        setSearchText={setSearchText}
        onProfileClick={() => handleNavigation("Profile")}
      />

      <div className="flex-1 p-6 bg-white">
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
            className={`py-2 px-6 font-medium ${activeTab === 'settings' ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-600 hover:text-green-700'}`}
            onClick={() => setActiveTab('settings')}
          >
            Customizable Alerts
          </button>
        </div>

        {activeTab === 'recent' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Recent Notifications</h2>
              {notifications.length > 0 && (
                <button 
                  className="text-red-600 hover:text-red-800"
                  onClick={clearAllNotifications}
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-green-100">
                    <th className="py-3 px-4 text-left">Time</th>
                    <th className="py-3 px-4 text-left">Type</th>
                    <th className="py-3 px-4 text-left">Message</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notif, index) => (
                      <tr 
                        key={notif.id} 
                        className={`hover:bg-gray-50 ${notif.read ? '' : 'font-bold'} ${index % 2 === 0 ? 'bg-green-50' : 'bg-white'}`}
                      >
                        <td className="py-3 px-4 border-t">{notif.time}</td>
                        <td className="py-3 px-4 border-t">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${getNotificationTypeColor(notif.type)}`}>
                            {notif.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 border-t">{notif.message}</td>
                        <td className="py-3 px-4 border-t text-right space-x-2">
                          {notif.read ? (
                            <button 
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() => markAsUnread(notif.id)}
                            >
                              Mark as Unread
                            </button>
                          ) : (
                            <button 
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() => markAsRead(notif.id)}
                            >
                              Mark as Read
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-500">
                        <Bell size={36} className="mx-auto text-gray-400 mb-2" />
                        No notifications at the moment
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Customizable Alerts</h2>
              <button 
                className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition-colors duration-200 text-sm"
                onClick={handleCreateAlert}
              >
                Create New Alert
              </button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-green-100">
                    <th className="py-3 px-4 text-left">Alert Type</th>
                    <th className="py-3 px-4 text-left">Condition</th>
                    <th className="py-3 px-4 text-left">Last Triggered</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAlertSettings.length > 0 ? (
                    filteredAlertSettings.map((setting, index) => (
                      <tr 
                        key={setting.id} 
                        className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-green-50' : 'bg-white'}`}
                      >
                        <td className="py-3 px-4 border-t font-medium">{setting.name}</td>
                        <td className="py-3 px-4 border-t">{setting.condition}</td>
                        <td className="py-3 px-4 border-t">{formatLastTriggered(setting.lastTriggered)}</td>
                        <td className="py-3 px-4 border-t text-center">
                          <button className="focus:outline-none" onClick={() => toggleAlertSetting(setting.id)}>
                            {setting.enabled ? (
                              <div className="flex items-center justify-center">
                                <span className="mr-2 text-green-700">Enabled</span>
                                <ToggleRight size={22} className="text-green-700" />
                              </div>
                            ) : (
                              <div className="flex items-center justify-center">
                                <span className="mr-2 text-gray-500">Disabled</span>
                                <ToggleLeft size={22} className="text-gray-500" />
                              </div>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-500">
                        <Bell size={36} className="mx-auto text-gray-400 mb-2" />
                        No alerts configured yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showCreateAlertModal && (
        <CreateAlertModal
          show={showCreateAlertModal}
          onClose={() => setShowCreateAlertModal(false)}
          formData={newAlertFormData}
          onFormChange={handleAddAlertFormChange}
          onSave={handleAddAlertSave}
        />
      )}
    </div>
  );
}
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
  const [notificationStatus, setNotificationStatus] = useState(''); // or false, null, etc. depending on use


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
    specificIds: [],
  };

  if (notificationTarget === "SpecificUsers") {
    payload.specificIds = specificIds
      .split(',')
      .map(id => id.trim())
      .filter(id => id.length > 0);
  }

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
    await api.put(`/reports/${reportId}/review`); // or `/reviewed` if you match route
    setReports(prevReports =>
      prevReports.map(r => r._id === reportId ? { ...r, reviewed: true } : r)
    );
    showNotification('Report marked as reviewed', 'success');
  } catch (error) {
    showNotification('Failed to update report', 'error');
  }
};



  return (
    <div className="flex-1 flex flex-col ml-64">
      <TopBar
        title="Alerts & Notifications"
        searchText={searchText}
        setSearchText={setSearchText}
        onProfileClick={() => handleNavigation('Profile')}
      />

      <div className="flex-1 p-6 bg-white">
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
            User Reports
          </button>
        </div>

        {activeTab === 'recent' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Recent Notifications</h2>
              {notifications.length > 0 && (
                <button
                  className="text-red-600 hover:text-red-800"
                  onClick={clearAllNotifications}
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-green-100">
                    <th className="py-3 px-4 text-left">Time</th>
                    <th className="py-3 px-4 text-left">Type</th>
                    <th className="py-3 px-4 text-left">Message</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notif, index) => (
                      <tr
                        key={notif.id}
                        className={`hover:bg-gray-50 ${notif.read ? '' : 'font-bold'} ${index % 2 === 0 ? 'bg-green-50' : 'bg-white'}`}
                      >
                        <td className="py-3 px-4 border-t">{notif.time}</td>
                        <td className="py-3 px-4 border-t">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${getNotificationTypeColor(notif.type)}`}>
                            {notif.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 border-t">{notif.message}</td>
                        <td className="py-3 px-4 border-t text-right space-x-2">
                          {notif.read ? (
                            <button className="text-blue-600 hover:text-blue-800" onClick={() => markAsUnread(notif.id)}>Mark as Unread</button>
                          ) : (
                            <button className="text-blue-600 hover:text-blue-800" onClick={() => markAsRead(notif.id)}>Mark as Read</button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-500">
                        <Bell size={36} className="mx-auto text-gray-400 mb-2" />
                        No notifications at the moment
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {activeTab === 'reports' && (
          <div className="space-y-6">
            {isLoading ? (
              <div className="p-4 text-center">Loading reports...</div>
            ) : (
              <>
                {/* Reports Table */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-green-100">
                <th className="py-3 px-4 text-left">User ID</th>
                <th className="py-3 px-4 text-left">Bin Category</th>
                <th className="py-3 px-4 text-left">Problem</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Reviewed</th>
              </tr>
            </thead>
            <tbody>
  {Array.isArray(reports) && reports.length > 0 ? (
    reports.map((report, index) => (
      <tr key={report._id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-green-50' : 'bg-white'}`}>
        <td className="py-3 px-4 border-t">{report.userId?.uniqueId || 'N/A'}</td>
        <td className="py-3 px-4 border-t">{report.binCategory || 'N/A'}</td>
        <td className="py-3 px-4 border-t">{report.problem || 'N/A'}</td>
        <td className="py-3 px-4 border-t">{report.description || 'N/A'}</td>
        <td className="py-3 px-4 border-t">
        {report.createdAt ? format(new Date(report.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}
      </td>
        <td className="py-3 px-4 border-t">
          {report.reviewed ? (
            <span className="text-green-600">✓ Reviewed</span>
          ) : (
            <button
              onClick={() => markAsReviewed(report._id)}
              className="bg-green-100 text-green-800 px-3 py-1 rounded hover:bg-green-200"
            >
              Mark Reviewed
            </button>
          )}
        </td>
        {/* Optional: Add a date column if needed */}
        {/* <td className="py-3 px-4 border-t">
          {new Date(report.createdAt).toLocaleString()}
        </td> */}
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={5} className="py-8 text-center text-gray-500">
        <Bell size={36} className="mx-auto text-gray-400 mb-2" />
        No reports found
      </td>
    </tr>
  )}
</tbody>

          </table>
        </div>

                {/* Send Notification Section */}
                <div className="border rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Send Bulk Notification</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Target</label>
                      <select
                        value={notificationTarget}
                        onChange={(e) => setNotificationTarget(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      >
                        <option value="AllUsers">All Users</option>
                        <option value="AllOperators">All Operators</option>
                        <option value="SpecificUsers">Specific Users</option>
                        <option value="SpecificOperators">Specific Operators</option>
                      </select>
                    </div>
                    {(notificationTarget === 'SpecificUsers' || notificationTarget === 'SpecificOperators') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Specific IDs (comma-separated, e.g., CBU001, CBU002)
                        </label>
                        <input
                          type="text"
                          value={specificIds}
                          onChange={(e) => setSpecificIds(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                          placeholder="CBU001, CBU002"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Message</label>
                      <textarea
                        value={notificationMessage}
                        onChange={(e) => setNotificationMessage(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        rows="4"
                        required
                      />
                    </div>
                    <button
                      onClick={handleSendBulkNotification}
                      className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
                    >
                      Send Notification
                    </button>
                    {notificationStatus && (
                      <div
                        className={`mt-2 p-2 rounded ${
                          notificationStatus.includes('successfully')
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {notificationStatus}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {showCreateAlertModal && (
        <CreateAlertModal
          show={showCreateAlertModal}
          onClose={() => setShowCreateAlertModal(false)}
          formData={newNotificationFormData}
          onFormChange={handleNotificationFormChange}
          onSave={handleSendNotification}
        />
      )}
    </div>
  );
}
