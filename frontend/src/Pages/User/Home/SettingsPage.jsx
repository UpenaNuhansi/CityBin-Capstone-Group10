import { useState, useEffect } from 'react';
import api from '../../../api/axios';
import BinImage from '../../../assets/BIN.jpg';

function SettingsPage() {
  const user = JSON.parse(localStorage.getItem('user'));

  // const [notifications, setNotifications] = useState({
  //   binStatus: true,
  //   collectionReminders: true,
  //   maintenanceAlerts: true,
  //   rewardsAchievements: true,
  //   systemUpdates: true
  // });

  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    contactNo: '',
    avatar: ''
  });

  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUserInfo, setEditedUserInfo] = useState({ ...userInfo });
  const [message, setMessage] = useState({ text: '', type: '' });

  const [avatarPreview, setAvatarPreview] = useState(null);

  // Fetch user settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get(`/user-settings/${user._id}`);
        if (res.data.success) {
          const { user: u, reminders } = res.data.data;
          setUserInfo(u);
          setEditedUserInfo(u);
          setNotifications(reminders || {});
          if (u.avatar) {
            setAvatarPreview(`http://localhost:5001/${u.avatar}`);
          }
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();
  }, []);

  // const handleNotificationToggle = (key) => {
  //   setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  // };

  const handleEditStart = () => {
    setIsEditing(true);
    setEditedUserInfo({ ...userInfo });
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleEditSave = async () => {
    try {
      const res = await api.put(`/user-settings/${user._id}/profile`, {
        username: editedUserInfo.name,
        email: editedUserInfo.email,
        contactNo: editedUserInfo.contactNo
      });
      if (res.data.success) {
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
      const res = await api.put(`/user-settings/${user._id}/reminders`, { reminders: notifications });
      if (res.data.success) {
        setMessage({ text: 'Settings saved successfully!', type: 'success' });
      }
    } catch {
      setMessage({ text: 'Failed to save settings.', type: 'error' });
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 2500);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedUserInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = async () => {
    try {
      const res = await api.put(`/users/change-password/${user._id}`, passwords);
      if (res.data.success) {
        setMessage({ text: 'Password changed successfully!', type: 'success' });
        setPasswords({ oldPassword: '', newPassword: '' });
      }
    } catch {
      setMessage({ text: 'Failed to change password.', type: 'error' });
    }
    setTimeout(() => setMessage({ text: '', type: '' }), 2500);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('avatar', file);
  
    try {
      const res = await api.post(`/users/upload-avatar/${user._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setAvatarPreview(`http://localhost:5001/${res.data.data.avatar}`);
        setMessage({ text: 'Avatar uploaded!', type: 'success' });
      }
    } catch (err) {
      setMessage({ text: 'Avatar upload failed.', type: 'error' });
    }
  };
  

  const handlePasswordInput = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="ml-64 mt-15 relative p-6 min-h-screen bg-gradient-to-br from-green-50 to-green-100 font-sans">
      <h1 className="text-3xl font-bold text-green-900 mb-6">Profile Settings</h1>

      {message.text && (
        <div className={`p-4 mb-6 rounded-md shadow-md transition-all duration-300 border ${
          message.type === 'success' ? 'bg-green-100 text-green-800 border-green-300'
            : 'bg-red-100 text-red-800 border-red-300'
        }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10 ml-20">
        {/* User Info */}
        <div className="bg-white rounded-xl shadow-md p-6 ml-10">
          <h2 className="text-xl font-semibold text-green-800 mb-4">User Information</h2>

          <div className="flex justify-center mb-4 relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-green-300 shadow-md">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-green-200 flex items-center justify-center text-2xl text-green-800">👤</div>
              )}
            </div>
          </div>

          <input type="file" accept="image/*" onChange={handleAvatarUpload} 
            className="block mx-auto mb-4 text-sm text-gray-600" />

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
                <button onClick={handleEditSave}
                  className="flex-1 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Save</button>
                <button onClick={handleEditCancel}
                  className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-md">Cancel</button>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between"><span className="font-medium">Name:</span><span>{userInfo.name}</span></div>
              <div className="flex justify-between"><span className="font-medium">Email:</span><span>{userInfo.email}</span></div>
              <div className="flex justify-between"><span className="font-medium">Contact:</span><span>{userInfo.contactNo}</span></div>
              <button onClick={handleEditStart}
                className="w-full mt-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Edit Info</button>
            </div>
          )}
        </div>

        {/* Notification Settings */}
        {/* <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="capitalize text-gray-700">{key.replace(/([A-Z])/g, ' $1')}</span>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handleNotificationToggle(key)}
                  className="form-checkbox h-5 w-5 text-green-600"
                />
              </div>
            ))}
            <button onClick={handleSaveSettings}
              className="w-full mt-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Save Notification Settings
            </button>
          </div>
        </div> */}

        {/* Password Reset */}
        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2 mt-4 mr-70">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Change Password</h2>
          <div className="space-y-4">
            <input type="password" name="oldPassword" placeholder="Old Password"
              value={passwords.oldPassword} onChange={handlePasswordInput}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:outline-none" />
            <input type="password" name="newPassword" placeholder="New Password"
              value={passwords.newPassword} onChange={handlePasswordInput}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:outline-none" />
            <button onClick={handlePasswordChange}
              className="w-full py-2 bg-green-700 text-white rounded-md hover:bg-green-800">
              Change Password
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:block fixed right-0 bottom-0 w-64 opacity-20 z-0 pointer-events-none">
        <img src={BinImage} alt="Bin" className="w-full h-auto" />
      </div>
    </div>
  );
}

export default SettingsPage;