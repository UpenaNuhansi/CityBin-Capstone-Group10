import { useState } from 'react';
import BinImage from './../assets/BIN.jpg'

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
  const [editedUserInfo, setEditedUserInfo] = useState({...userInfo});
  
  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handleEditStart = () => {
    setIsEditing(true);
    setEditedUserInfo({...userInfo});
  };
  
  const handleEditCancel = () => {
    setIsEditing(false);
  };
  
  const handleEditSave = () => {
    setUserInfo({...editedUserInfo});
    setIsEditing(false);
  };
  
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications Settings */}
        <div className="bg-citybin-light-green p-6 rounded-lg bg-green-200">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Bin Status Alerts</span>
              <button 
                className={`relative inline-flex items-center h-6 rounded-full w-11 ${notifications.binStatus ? 'bg-citybin-green' : 'bg-gray-300'}`}
                onClick={() => handleNotificationToggle('binStatus')}
              >
                <span 
                  className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${notifications.binStatus ? 'translate-x-6' : 'translate-x-1'}`} 
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Collection Reminders</span>
              <button 
                className={`relative inline-flex items-center h-6 rounded-full w-11 ${notifications.collectionReminders ? 'bg-citybin-green' : 'bg-gray-300'}`}
                onClick={() => handleNotificationToggle('collectionReminders')}
              >
                <span 
                  className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${notifications.collectionReminders ? 'translate-x-6' : 'translate-x-1'}`} 
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Maintenance Alerts</span>
              <button 
                className={`relative inline-flex items-center h-6 rounded-full w-11 ${notifications.maintenanceAlerts ? 'bg-citybin-green' : 'bg-gray-300'}`}
                onClick={() => handleNotificationToggle('maintenanceAlerts')}
              >
                <span 
                  className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${notifications.maintenanceAlerts ? 'translate-x-6' : 'translate-x-1'}`} 
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span>Rewards & Achievements</span>
              <button 
                className={`relative inline-flex items-center h-6 rounded-full w-11 ${notifications.rewardsAchievements ? 'bg-citybin-green' : 'bg-gray-300'}`}
                onClick={() => handleNotificationToggle('rewardsAchievements')}
              >
                <span 
                  className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${notifications.rewardsAchievements ? 'translate-x-6' : 'translate-x-1'}`} 
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span>System Updates/General Info</span>
              <button 
                className={`relative inline-flex items-center h-6 rounded-full w-11 ${notifications.systemUpdates ? 'bg-citybin-green' : 'bg-gray-300'}`}
                onClick={() => handleNotificationToggle('systemUpdates')}
              >
                <span 
                  className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${notifications.systemUpdates ? 'translate-x-6' : 'translate-x-1'}`} 
                />
              </button>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="w-full bg-citybin-green text-black rounded-md py-3 font-medium">
              Save Changes
            </button>
          </div>
        </div>
        
        {/* User Information */}
        <div className="bg-citybin-light-green p-6 rounded-lg bg-green-200">
          <h2 className="text-xl font-semibold mb-4">User Info</h2>
          
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-green-200 flex items-center justify-center">
              {/* User avatar placeholder */}
              <svg className="h-11 w-11 text-gray-600 bg-green-400 rounded-2xl"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editedUserInfo.name}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={editedUserInfo.email}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact No</label>
                <input
                  type="tel"
                  name="contactNo"
                  value={editedUserInfo.contactNo}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={handleEditSave}
                  className="flex-1 bg-citybin-green text-white bg-green-500 rounded-md py-2"
                >
                  Save
                </button>
                <button 
                  onClick={handleEditCancel}
                  className="flex-1 bg-gray-300 text-gray-600 rounded-md py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="space-y-3">
                <div className="flex">
                  <span className="font-medium w-24">Name</span>
                  <span className="flex-1">: {userInfo.name}</span>
                </div>
                
                <div className="flex">
                  <span className="font-medium w-24">E-mail</span>
                  <span className="flex-1">: {userInfo.email}</span>
                </div>
                
                <div className="flex">
                  <span className="font-medium w-24">Contact No</span>
                  <span className="flex-1">: {userInfo.contactNo}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <button 
                  onClick={handleEditStart}
                  className="w-full bg-green-500 text-white rounded-md py-3 font-medium"
                >
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Bin image - hidden on small screens */}
      <div className="hidden md:block fixed left-70 bottom-6 w-1/8 max-w-xs">
        <img 
          src={BinImage} 
          alt="Recycle bin" 
          className="w-full"
        />
      </div>
    </div>
  );
}

export default SettingsPage;