import { User, Search } from 'lucide-react';

export default function SystemSettingsContent({
  searchText,  setSearchText,  wasteType,  setWasteType,  threshold,  handleThresholdChange,  saveThreshold,  remindersEnabled,
  setRemindersEnabled,
  reminderTime,
  setReminderTime,
  emailEnabled,
  setEmailEnabled,
  smsEnabled,
  setSmsEnabled,
  appNotificationEnabled,
  setAppNotificationEnabled,
  saveReminders,
  devices,
  refreshDevices,
  overflowAlertsEnabled,
  setOverflowAlertsEnabled,
  smartRouteEnabled,
  setSmartRouteEnabled,
  saveFeatures,
  handleNavigation,
}) {
  return (
    <div className="flex-1 flex flex-col ml-64">
      {/* Top Bar */}
      <div className="bg-white p-4 border-b flex justify-between items-center sticky top-0 z-10">
        <div className="text-xl font-bold">System Settings</div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search something"
            className="bg-gray-200 rounded-full pl-8 pr-4 py-1 w-64 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-gray-500">
            <Search size={16} />
          </span>
        </div>
        <div 
          className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-green-800 transition-colors duration-200"
          onClick={() => handleNavigation('Profile')}
        >
          <User size={18} />
        </div>
      </div>
      
      {/* System Settings Content */}
      <div className="flex-1 p-4 bg-white">
        <h2 className="text-lg font-medium mb-2">Configure threshold, alert and device settings</h2>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Waste Level Thresholds */}
          <div className="border rounded-lg p-4 bg-gray-50 relative" style={{ minHeight: "350px" }}>
            <h3 className="font-medium mb-3">Waste Level Thresholds</h3>
            
            <div className="mb-4">
              <select 
                className="w-full p-2 border rounded-md bg-white"
                value={wasteType}
                onChange={(e) => setWasteType(e.target.value)}
              >
                <option value="Organic">Organic</option>
                <option value="Recyclable">Recyclable</option>
                <option value="General">General</option>
                <option value="Hazardous">Hazardous</option>
              </select>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Current threshold: {threshold}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={threshold}
                onChange={handleThresholdChange}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="mb-6">
              <div className="absolute bottom-4 left-4 right-4">
                <button 
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors duration-200"
                  onClick={saveThreshold}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
          
          {/* Automated Reminders */}
          <div className="border rounded-lg p-4 bg-gray-50 relative" style={{ minHeight: "350px" }}>
            <h3 className="font-medium mb-3">Automated Reminders</h3>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span>Frequency</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={remindersEnabled} 
                    onChange={() => setRemindersEnabled(!remindersEnabled)}
                    className="sr-only peer" 
                  />
                  <div className="w-10 h-5 bg-gray-200 rounded-full peer">
                    <div className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${remindersEnabled ? 'translate-x-5 bg-green-500' : 'translate-x-0 bg-red-500'}`}></div>
                  </div>
                </label>
              </div>
              
              <div className="mb-4">
                <span className="block text-sm mb-1">Time</span>
                <input 
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  disabled={!remindersEnabled}
                />
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="email" 
                    checked={emailEnabled} 
                    onChange={() => setEmailEnabled(!emailEnabled)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    disabled={!remindersEnabled}
                  />
                  <label htmlFor="email">Email</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="sms" 
                    checked={smsEnabled} 
                    onChange={() => setSmsEnabled(!smsEnabled)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    disabled={!remindersEnabled}
                  />
                  <label htmlFor="sms">SMS</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="app-notification" 
                    checked={appNotificationEnabled} 
                    onChange={() => setAppNotificationEnabled(!appNotificationEnabled)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    disabled={!remindersEnabled}
                  />
                  <label htmlFor="app-notification">App Notification</label>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="absolute bottom-4 left-4 right-4">
                <button 
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors duration-200"
                  onClick={saveReminders}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
          
          {/* IoT Device Connectivity */}
          <div className="border rounded-lg p-4 bg-gray-50 relative" style={{ minHeight: "350px" }}>
            <h3 className="font-medium mb-3">IoT Device Connectivity</h3>
            
            <div className="mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Device</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Last Sync</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((device) => (
                    <tr key={device.id} className="border-b">
                      <td className="py-2">{device.name}</td>
                      <td className="py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          device.status === 'Connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {device.status}
                        </span>
                      </td>
                      <td className="py-2">{device.lastSync}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mb-6">
              <div className="absolute bottom-4 left-4 right-4">
                <button 
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors duration-200"
                  onClick={refreshDevices}
                >
                  Refresh Status
                </button>
              </div>
            </div>
          </div>
          
          {/* Enable/Disable Features */}
          <div className="border rounded-lg p-4 bg-gray-50 relative" style={{ minHeight: "350px" }}>
            <h3 className="font-medium mb-3">Enable/Disable Features</h3>
            
            <div className="space-y-4 mb-4">
              <div className="flex justify-between items-center">
                <span>Enable overflow alerts</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={overflowAlertsEnabled} 
                    onChange={() => setOverflowAlertsEnabled(!overflowAlertsEnabled)}
                    className="sr-only peer" 
                  />
                  <div className="w-10 h-5 bg-gray-200 rounded-full peer">
                    <div className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${overflowAlertsEnabled ? 'translate-x-5 bg-green-500' : 'translate-x-0 bg-red-500'}`}></div>
                  </div>
                </label>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Enable smart route optimization</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={smartRouteEnabled} 
                    onChange={() => setSmartRouteEnabled(!smartRouteEnabled)}
                    className="sr-only peer" 
                  />
                  <div className="w-10 h-5 bg-gray-200 rounded-full peer">
                    <div className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${smartRouteEnabled ? 'translate-x-5 bg-green-500' : 'translate-x-0 bg-red-500'}`}></div>
                  </div>
                </label>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="absolute bottom-4 left-4 right-4">
                <button 
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors duration-200"
                  onClick={saveFeatures}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}