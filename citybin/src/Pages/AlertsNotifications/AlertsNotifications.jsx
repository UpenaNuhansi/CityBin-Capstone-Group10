import { useState } from 'react';
import AlertsNotificationsContent from './AlertsNotificationsContent';
import CreateAlertModal from '../../Components/AlertsNotifications/CreateAlertModal';
import { format, isToday } from 'date-fns';

// Sample notifications data
const initialNotifications = [
  { id: 1, time: '10:22', type: 'Full Bin', message: 'Bin A02 is full.', read: false },
  { id: 2, time: '09:53', type: 'Maintenance', message: 'Bin C17 requires maintenance.', read: false },
  { id: 3, time: '09:22', type: 'Delayed Collection', message: 'Collection delayed at Bin B10.', read: true },
  { id: 4, time: '09:05', type: 'Sensor Offline', message: 'Sensor B disconnected.', read: false },
  { id: 5, time: '08:41', type: 'Full Bin', message: 'Bin D04 is full.', read: true },
];

// Sample alert settings with real timestamps
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

// Format function
function formatLastTriggered(timestamp) {
  if (!timestamp) return 'Never';
  const date = new Date(timestamp);
  return isToday(date) ? format(date, 'HH:mm') + ' today' : format(date, 'dd/MM/yyyy HH:mm');
}

export default function AlertsNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [alertSettings, setAlertSettings] = useState([]);
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
        lastTriggered: null, // New alerts haven't triggered yet
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

  return (
    <div className="flex-1 flex flex-col">
      <AlertsNotificationsContent 
        notifications={notifications} 
        alertSettings={alertSettings} 
        searchText={searchText} 
        setSearchText={setSearchText} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        markAsRead={markAsRead} 
        markAsUnread={markAsUnread}
        clearAllNotifications={clearAllNotifications} 
        toggleAlertSetting={toggleAlertSetting} 
        getNotificationTypeColor={getNotificationTypeColor} 
        showNotification={showNotification}
        handleCreateAlert={handleCreateAlert}
        notificationState={notification}
        formatLastTriggered={formatLastTriggered} 
      />

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
