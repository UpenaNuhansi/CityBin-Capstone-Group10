import { useState } from 'react';
import SideBar from '../../../Components/SideBar/SideBar';
import SystemSettingsContent from './SystemSettingsContent';
import LogoutModal from '../../../Components/LogoutModal/LogoutModal';

export default function SystemSettings() {
  const [activePage, setActivePage] = useState('System Settings');
  const [searchText, setSearchText] = useState('');
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Threshold states
  const [wasteType, setWasteType] = useState('Organic');
  const [threshold, setThreshold] = useState(75);

  // Reminders states
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [appNotificationEnabled, setAppNotificationEnabled] = useState(true);

  // Features states
  const [overflowAlertsEnabled, setOverflowAlertsEnabled] = useState(true);
  const [smartRouteEnabled, setSmartRouteEnabled] = useState(true);

  // Device states
  const devices = [
    { id: 1, name: 'Device 1', status: 'Connected', lastSync: 'Today, 14:32' },
    { id: 2, name: 'Device 2', status: 'Disconnected', lastSync: 'Today, 09:17' },
  ];

  const handleNavigation = (page) => {
    setActivePage(page);
    console.log(`Navigating to ${page}`);
  };

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    console.log('User logged out');
    setShowLogoutDialog(false);
  };

  const handleThresholdChange = (e) => {
    setThreshold(e.target.value);
  };

  const saveThreshold = () => {
    console.log(`Saved ${wasteType} threshold: ${threshold}%`);
  };

  const saveReminders = () => {
    console.log('Saved reminder settings');
  };

  const refreshDevices = () => {
    console.log('Refreshing device status');
  };

  const saveFeatures = () => {
    console.log('Saved feature settings');
  };

  return (
    <div className="flex h-screen bg-white">
      <SideBar 
        activePage={activePage} 
        handleNavigation={handleNavigation} 
        handleLogoutClick={handleLogoutClick} 
      />
      <div className="flex-1 flex flex-col ml-64">
        <SystemSettingsContent 
          searchText={searchText}
          setSearchText={setSearchText}
          wasteType={wasteType}
          setWasteType={setWasteType}
          threshold={threshold}
          handleThresholdChange={handleThresholdChange}
          saveThreshold={saveThreshold}
          remindersEnabled={remindersEnabled}
          setRemindersEnabled={setRemindersEnabled}
          reminderTime={reminderTime}
          setReminderTime={setReminderTime}
          emailEnabled={emailEnabled}
          setEmailEnabled={setEmailEnabled}
          smsEnabled={smsEnabled}
          setSmsEnabled={setSmsEnabled}
          appNotificationEnabled={appNotificationEnabled}
          setAppNotificationEnabled={setAppNotificationEnabled}
          saveReminders={saveReminders}
          devices={devices}
          refreshDevices={refreshDevices}
          overflowAlertsEnabled={overflowAlertsEnabled}
          setOverflowAlertsEnabled={setOverflowAlertsEnabled}
          smartRouteEnabled={smartRouteEnabled}
          setSmartRouteEnabled={setSmartRouteEnabled}
          saveFeatures={saveFeatures}
          handleNavigation={handleNavigation}
        />
        <LogoutModal 
          show={showLogoutDialog} 
          onClose={() => setShowLogoutDialog(false)} 
          onConfirm={confirmLogout} 
        />
      </div>
    </div>
  );
}