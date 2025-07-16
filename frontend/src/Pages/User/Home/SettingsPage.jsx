import { useState, useEffect } from 'react';
import api from '../../../api/axios';
import BinImage from '../../../assets/BIN.jpg';

function SettingsPage() {
  const [notifications, setNotifications] = useState({
    binStatus: true,
    collectionReminders: true,
    maintenanceAlerts: true,
    rewardsAchievements: true,
    systemUpdates: true
  });

  const [userInfo, setUserInfo] = useState({
    name: 'N. Rubasinghe',
    email: 'nai@gmail.com',
    contactNo: '+94 716695238'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUserInfo, setEditedUserInfo] = useState({ ...userInfo });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        setNotifications(response.data.data.reminders || notifications);
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleEditStart = () => {
    setIsEditing(true);
    setEditedUserInfo({ ...userInfo });
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleEditSave = async () => {
    try {
      const response = await api.put('/users/' + JSON.parse(localStorage.getItem('user'))._id, {
        username: editedUserInfo.name,
        email: editedUserInfo.email,
      });
      if (response.data.success) {
        setUserInfo({ ...editedUserInfo });
        setMessage({ text: 'User info updated successfully!', type: 'success' });
      }
    } catch {
      setMessage({ text: 'Failed to update user info.', type: 'error' });
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 2500);
    setIsEditing(false);
  };

  const handleSaveSettings = async () => {
    try {
      const response = await api.put('/settings', { reminders: notifications });
      if (response.data.success) {
        setMessage({ text: 'Settings saved successfully!', type: 'success' });
      }
    } catch {
      setMessage({ text: 'Failed to save settings.', type: 'error' });
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 2500);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="ml-64 mt-10 relative p-6 min-h-screen bg-gradient-to-br from-green-50 to-green-100 font-sans">
      <h1 className="text-3xl font-bold text-green-900 mb-6">User Settings</h1>

      {message.text && (
        <div
          className={`p-4 mb-6 rounded-md shadow-md transition-all duration-300 border ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border-green-300'
              : 'bg-red-100 text-red-800 border-red-300'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            {[
              ['binStatus', 'Bin Status Alerts'],
              ['collectionReminders', 'Collection Reminders'],
              ['maintenanceAlerts', 'Maintenance Alerts'],
              ['rewardsAchievements', 'Rewards & Achievements'],
              ['systemUpdates', 'System Updates / General Info'],
            ].map(([key, label]) => (
              <div className="flex justify-between items-center" key={key}>
                <span className="text-gray-700">{label}</span>
                <button
                  onClick={() => handleNotificationToggle(key)}
                  className={`relative inline-flex h-6 w-11 rounded-full transition-colors duration-200 ${
                    notifications[key] ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block w-5 h-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                      notifications[key] ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleSaveSettings}
            className="w-full mt-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition"
          >
            Save Notification Settings
          </button>
        </div>

        {/* User Info */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-green-800 mb-4">User Information</h2>

          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-green-200 rounded-full flex items-center justify-center shadow-md">
              <svg
                className="w-10 h-10 text-green-800"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4">
              {['name', 'email', 'contactNo'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    value={editedUserInfo[field]}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:outline-none"
                  />
                </div>
              ))}
              <div className="flex space-x-2">
                <button
                  onClick={handleEditSave}
                  className="flex-1 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={handleEditCancel}
                  className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span>{userInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{userInfo.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Contact:</span>
                <span>{userInfo.contactNo}</span>
              </div>
              <button
                onClick={handleEditStart}
                className="w-full mt-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Edit Info
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bin Image Background */}
      <div className="hidden md:block fixed right-0 bottom-0 w-64 opacity-20 z-0 pointer-events-none">
        <img src={BinImage} alt="Bin" className="w-full h-auto" />
      </div>
    </div>
  );
}

export default SettingsPage;