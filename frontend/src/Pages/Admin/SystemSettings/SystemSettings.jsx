import { useState, useEffect } from "react";
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

  // Dummy device list
  const devices = [
    { id: 1, name: "Device 1", status: "Connected", lastSync: "Today, 14:32" },
    { id: 2, name: "Device 2", status: "Disconnected", lastSync: "Today, 09:17" },
  ];

  const handleThresholdChange = (e) => setThreshold(e.target.value);

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

  const refreshDevices = () => {
    api.get("/devices/refresh")
      .then(() => alert("Device statuses refreshed"))
      .catch((err) => console.error("Failed to refresh devices", err));
  };

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
            setThreshold(data.wasteThresholds?.[wasteType] || 75);
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
        .catch((err) => console.error("Failed to load settings:", err));
    } else {
      api.get("/settings")
        .then((res) => {
          const newThreshold = res.data?.wasteThresholds?.[wasteType];
          if (newThreshold !== undefined) setThreshold(newThreshold);
        })
        .catch((err) => console.error("Failed to update threshold:", err));
    }
  }, [wasteType, hasLoaded]);

  return (
    <div className="flex-1 flex flex-col ml-64 mt-18 min-h-screen bg-gray-100">
      <TopBar
        title="System Settings"
        searchText={searchText}
        setSearchText={setSearchText}
        onProfileClick={() => handleNavigation("Profile")}
      />

      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Configure Alert and Device Settings</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Device Panel */}
          <Panel title="IoT Device Connectivity">
            <table className="w-full text-sm mb-4">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="text-left py-2">Device</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Last Sync</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => (
                  <tr key={device.id} className="border-b last:border-b-0">
                    <td className="py-2">{device.name}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${device.status === "Connected"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                        }`}>
                        {device.status}
                      </span>
                    </td>
                    <td className="py-2">{device.lastSync}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pt-4 border-t">
              <button
                onClick={refreshDevices}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-200"
              >
                Refresh Status
              </button>
            </div>
          </Panel>

          {/* Features Panel */}
          <Panel title="Enable/Disable Features">
            <div className="space-y-4 mb-6">
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

            <div className="pt-4 border-t">
              <button
                onClick={saveFeatures}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-200"
              >
                Save Changes
              </button>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

//  Reusable Panel wrapper
function Panel({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      {children}
    </div>
  );
}

// Toggle Switch
function Toggle({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-700">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-300 rounded-full peer-focus:ring-2 peer-focus:ring-green-500 peer-checked:bg-green-500 transition duration-300"></div>
        <div className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full shadow-md transform transition ${
          checked ? "translate-x-5" : ""
        }`}></div>
      </label>
    </div>
  );
}