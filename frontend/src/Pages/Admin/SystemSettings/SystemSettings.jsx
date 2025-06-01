import { useState, useEffect } from "react";
import { User } from "lucide-react";
import TopBar from "../../../Components/TopBar/TopBar"; 
import api from "../../../api/axios";

export default function SystemSettings({ handleNavigation }) {
  const [searchText, setSearchText] = useState("");

  // Threshold states
  const [wasteType, setWasteType] = useState("Organic");
  const [threshold, setThreshold] = useState(75);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Reminders states
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState("09:00");
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [appNotificationEnabled, setAppNotificationEnabled] = useState(true);
  
  // Features states
  const [overflowAlertsEnabled, setOverflowAlertsEnabled] = useState(true);
  const [smartRouteEnabled, setSmartRouteEnabled] = useState(true);

  // Device states
  const devices = [
    { id: 1, name: "Device 1", status: "Connected", lastSync: "Today, 14:32" },
    { id: 2, name: "Device 2", status: "Disconnected", lastSync: "Today, 09:17" },
  ];

  const handleThresholdChange = (e) => setThreshold(e.target.value);
 

  // Save threshold to backend (stub implementation)
  const saveThreshold = async () => {
  try {
    const response = await api.put("/settings", {
      wasteThresholds: {
        [wasteType]: parseInt(threshold),
      },
    });

    if (response.data.success) {
      alert("Threshold saved successfully!");
    }
  } catch (error) {
    console.error("Failed to save threshold:", error);
    alert("Failed to save threshold.");
  }
};


//save reminders to backend (stub implementation)
const saveReminders = async () => {
  try {
    const response = await api.put("/settings", {
      reminders: {
        enabled: remindersEnabled,
        time: reminderTime,
        email: emailEnabled,
        sms: smsEnabled,
        appNotification: appNotificationEnabled,
      },
    });

    if (response.data.success) {
      alert("Reminders saved successfully!");
    }
  } catch (error) {
    console.error("Failed to save reminders:", error);
    alert("Failed to save reminders.");
  }
};




 //Refresh device status from backend (stub implementation)
const refreshDevices = () => {
  api.get("/devices/refresh")
    .then(() => alert("Device statuses refreshed"))
    .catch((err) => console.error("Failed to refresh devices", err));
};

  
//save features to backend (stub implementation)
const saveFeatures = async () => {
  try {
    const response = await api.put("/settings", {
      features: {
        overflowAlerts: overflowAlertsEnabled,
        smartRoute: smartRouteEnabled,
      },
    });

    if (response.data.success) {
      alert("Features saved successfully!");
    }
  } catch (error) {
    console.error("Failed to save features:", error);
    alert("Failed to save features.");
  }
};








  useEffect(() => {
  if (!hasLoaded) {
    api.get("/settings")
      .then((res) => {
        const data = res.data;
        if (data) {
          setThreshold(data.wasteThresholds?.[wasteType] || 75); // only runs once at load
          setRemindersEnabled(data.reminders?.enabled ?? true);
          setReminderTime(data.reminders?.time || "09:00");
          setEmailEnabled(data.reminders?.email ?? true);
          setSmsEnabled(data.reminders?.sms ?? true);
          setAppNotificationEnabled(data.reminders?.app ?? true);
          setOverflowAlertsEnabled(data.features?.overflowAlerts ?? true);
          setSmartRouteEnabled(data.features?.smartRoute ?? true);
        }
        setHasLoaded(true);
      })
      .catch((err) => {
        console.error("Failed to load settings:", err);
      });
  } else {
    // Only update threshold when wasteType changes *after* initial load
    api.get("/settings")
      .then((res) => {
        const newThreshold = res.data?.wasteThresholds?.[wasteType];
        if (newThreshold !== undefined) setThreshold(newThreshold);
      })
      .catch((err) => console.error("Failed to update threshold on wasteType change:", err));
  }
}, [wasteType, hasLoaded]);


  return (
    <div className="flex-1 flex flex-col ml-64">
      <TopBar
        title="System Settings"
        searchText={searchText}
        setSearchText={setSearchText}
        onProfileClick={() => handleNavigation("Profile")}
      />

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
                    <div
                      className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                        remindersEnabled ? "translate-x-5 bg-green-500" : "translate-x-0 bg-red-500"
                      }`}
                    ></div>
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
                <Checkbox label="Email" checked={emailEnabled} onChange={() => setEmailEnabled(!emailEnabled)} disabled={!remindersEnabled} />
                <Checkbox label="SMS" checked={smsEnabled} onChange={() => setSmsEnabled(!smsEnabled)} disabled={!remindersEnabled} />
                <Checkbox label="App Notification" checked={appNotificationEnabled} onChange={() => setAppNotificationEnabled(!appNotificationEnabled)} disabled={!remindersEnabled} />
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
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            device.status === "Connected"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
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
              <Toggle
                label="Enable overflow alerts"
                checked={overflowAlertsEnabled}
                onChange={() => setOverflowAlertsEnabled(!overflowAlertsEnabled)}
              />
              <Toggle
                label="Enable smart route optimization"
                checked={smartRouteEnabled}
                onChange={() => setSmartRouteEnabled(!smartRouteEnabled)}
              />
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

// Reusable toggle switch component
function Toggle({ label, checked, onChange }) {
  return (
    <div className="flex justify-between items-center">
      <span>{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-10 h-5 bg-gray-200 rounded-full peer">
          <div
            className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
              checked ? "translate-x-5 bg-green-500" : "translate-x-0 bg-red-500"
            }`}
          ></div>
        </div>
      </label>
    </div>
  );
}

// Reusable checkbox component
function Checkbox({ label, checked, onChange, disabled }) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
        disabled={disabled}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
