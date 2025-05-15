import { User, Search, ToggleLeft, ToggleRight, Bell } from 'lucide-react';
import TopBar from '../../../Components/TopBar/TopBar';
export default function AlertsNotificationsContent({
  notifications,
  alertSettings,
  searchText,
  setSearchText,
  activeTab,
  setActiveTab,
  markAsRead,
  markAsUnread,
  clearAllNotifications,
  toggleAlertSetting,
  getNotificationTypeColor,
  showNotification,
  handleNavigation,
  handleCreateAlert,
  notificationState,
}) {
  const filteredNotifications = notifications.filter(notif =>
    notif.message.toLowerCase().includes(searchText.toLowerCase()) ||
    notif.type.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col ml-64">
      {/* Top Bar */}
      <div>
      <TopBar
        title="Alerts & Notifications"
        searchText={searchText}
        setSearchText={setSearchText}
        onProfileClick={() => handleNavigation("Profile")}
      />
    </div>

      {/* Notification */}
      <div className="flex-1 p-6 bg-white">
        {notificationState.show && (
          <div className={`p-4 mb-4 rounded border ${notificationState.type === 'success' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
            {notificationState.message}
          </div>
        )}
        
        {/* Tabs */}
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
        
        {/* Recent Notifications */}
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
        
        {/* Customizable Alerts */}
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
                  {alertSettings.map((setting, index) => (
                    <tr 
                      key={setting.id} 
                      className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-green-50' : 'bg-white'}`}
                    >
                      <td className="py-3 px-4 border-t font-medium">{setting.name}</td>
                      <td className="py-3 px-4 border-t">{setting.condition}</td>
                      <td className="py-3 px-4 border-t">{setting.lastTriggered}</td>
                      <td className="py-3 px-4 border-t text-center">
                        <button 
                          className="focus:outline-none"
                          onClick={() => toggleAlertSetting(setting.id)}
                        >
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}