import { useState } from 'react';
import SystemSettingsContent from './SystemSettingsContent';

export default function SystemSettings({handleNavigation}) {
  const [searchText, setSearchText] = useState('');
  
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
    <div className="flex-1 flex flex-col ml-64" >
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
        </div>
  );
}