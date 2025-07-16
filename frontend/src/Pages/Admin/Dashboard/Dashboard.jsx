import { useState, useEffect, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopBar from '../../../Components/TopBar/TopBar';
import api from '../../../api/axios';
import BinMap from '../../../Components/BinManagement/BinMap';
import { BinContext } from '/src/Components/BinManagement/BinContext.jsx';


// const wasteData = [
//   { month: 'May', value: 210 },
//   { month: 'Jun', value: 320 },
//   { month: 'Jul', value: 280 },
//   { month: 'Aug', value: 480 },
//   { month: 'Sep', value: 380 },
//   { month: 'Oct', value: 430 },
//   { month: 'Nov', value: 350 },
//   { month: 'Dec', value: 420 },
// ];



export default function Dashboard({ activePage, setActivePage, handleNavigation }) {
  const { binData, loading, stats } = useContext(BinContext);
  const [searchText, setSearchText] = useState('');
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState({});
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [taskSectionOpen, setTaskSectionOpen] = useState(true);
  const [commonNotifications, setCommonNotifications] = useState([]);
  const [operatorNotifications, setOperatorNotifications] = useState([]);
  const [operatorBins, setOperatorBins] = useState([]);
  const [binSearchText, setBinSearchText] = useState('');
  const [suggestedRoad, setSuggestedRoad] = useState('');
  const [routeToBin, setRouteToBin] = useState(null);
  


const [totalBins, setTotalBins] = useState(0);
const [activeBins, setActiveBins] = useState(0);
const [fullBins, setFullBins] = useState(0);
const [maintenanceBins, setMaintenanceBins] = useState(0);

const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const res = await api.get('/bins/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const stats = res.data;
      if (!stats || typeof stats !== 'object' || stats.error) {
        throw new Error(stats?.error || 'Invalid response format from /bins/stats');
      }
      setTotalBins(Number(stats.total) || 0);
      setActiveBins(Number(stats.active) || 0);
      setFullBins(Number(stats.full) || 0);
      setMaintenanceBins(Number(stats.maintenance) || 0);
    } catch (error) {
      toast.error('Failed to load bin statistics');
      // Fallback to binData from BinContext
      if (binData) {
        setTotalBins(binData.length);
        setActiveBins(binData.filter(bin => bin.deviceStatus === 'online').length);
        setFullBins(binData.filter(bin => bin.wasteLevel >= 90).length);
        setMaintenanceBins(binData.filter(bin => bin.maintenance === 'Required').length);
      } else {
        setTotalBins(0);
        setActiveBins(0);
        setFullBins(0);
        setMaintenanceBins(0);
      }
    }
  };


  const markTaskDone = async (notificationId, binId) => {
    if (!binId) {
      alert('⚠ Cannot mark task as done: missing bin ID!');
      return;
    }
    try {
      await api.put(`/notifications/${notificationId}/done`, { binId });
      toast.success(' Task marked as done!');
      fetchTasks();
    } catch (err) {
      console.error(' Failed to mark task as done', err?.response?.data || err.message);
    }
  };

  const fetchOperatorNotifications = async () => {
    try {
      const res = await api.get('/notifications/operator');
      setOperatorNotifications(res.data.notifications || []);
    } catch (err) {
      toast.error('Failed to load operator notifications');
      console.error(' Error:', err.message);
    }
  };

  const fetchCommonNotifications = async () => {
    try {
      const res = await api.get('/notifications/common');
      setCommonNotifications(res.data.notifications || []);
    } catch (err) {
      toast.error('Failed to load announcements');
      console.error(err.message);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      const res = await api.get('/notifications/operator-tasks');
      setTasks(res.data.notifications || []);
    } catch (err) {
      toast.error('Failed to load tasks');
      console.error(err.message);
    } finally {
      setLoadingTasks(false);
    }
  };

   const fetchOperatorBins = async () => {
    try {
      const res = await api.get('/bins/assigned-to-operator');
      const formatted = res.data.data
        .filter(bin => bin.coordinates && typeof bin.coordinates.lat === 'number' && typeof bin.coordinates.lng === 'number')
        .map(bin => ({
          id: bin.binId,
          location: bin.location,
          wasteLevel: Number(bin.wasteLevel),
          coordinates: {
            lat: Number(bin.coordinates.lat),
            lng: Number(bin.coordinates.lng),
          },
        }));
      console.log('Formatted operator bins:', formatted); // Debug log
      setOperatorBins(formatted);
    } catch (error) {
      console.error('Failed to fetch bins for operator:', error.message, error.response?.status, error.response?.data);
      toast.error('Failed to load assigned bins');
    }
  };

  const toggleNotificationReadStatus = async (notificationId, newStatus) => {
    try {
      await api.put(`/notifications/${notificationId}/read-status`, {
        isRead: newStatus,
      });      
      toast.success(`Marked as ${newStatus ? 'read' : 'unread'}`);

      // update the local state instantly
      setOperatorNotifications(prev =>
        prev.map(n =>
          n._id === notificationId ? { ...n, isRead: newStatus } : n
        )
      );      
    } catch (err) {
      toast.error('Failed to update notification status');
      console.error(err.message);
    }
  };
  


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser);

    if (storedUser.role === 'Operator') {
      fetchTasks();
      fetchOperatorNotifications();
      fetchOperatorBins();
    }

    fetchCommonNotifications();
    fetchDashboardStats();
  }, []);

  const uniqueOperatorNotifications = Array.from(
    new Map(operatorNotifications.map(item => [`${item.message}-${item.createdAt}`, item])).values()
  );
  const uniqueCommonNotifications = Array.from(
    new Map(commonNotifications.map(item => [`${item.message}-${item.createdAt}`, item])).values()
  );

  return (
    <div className="flex-1 flex flex-col ml-64 min-h-screen bg-gray-50 text-gray-800">
      <TopBar
        title="Dashboard"
        searchText={searchText}
        setSearchText={setSearchText}
        onProfileClick={() => handleNavigation("/admin/profile")}
      />

      <div className="flex-1 px-6 pt-6 pb-4 bg-white">
        <h2 className="text-3xl font-semibold text-green-900">Welcome, {user.username || 'Admin'}!</h2>
      </div>

      <div className="flex-1 p-4 bg-gray-100 gap-6">
     
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center shadow hover:shadow-md transition">
          <div className="text-lg font-semibold text-green-800">Total Bins</div>
          <div className="text-3xl font-bold text-green-700 mt-2">{totalBins}</div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-center shadow hover:shadow-md transition">
          <div className="text-lg font-semibold text-blue-800">Active Bins</div>
          <div className="text-3xl font-bold text-blue-700 mt-2">{activeBins}</div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center shadow hover:shadow-md transition">
          <div className="text-lg font-semibold text-red-800">Full Bins</div>
          <div className="text-3xl font-bold text-red-700 mt-2">{fullBins}</div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 text-center shadow hover:shadow-md transition">
          <div className="text-lg font-semibold text-orange-800">Maintenance Issues</div>
          <div className="text-3xl font-bold text-orange-700 mt-2">{maintenanceBins}</div>
        </div>
      </div>

        
        {/* <div className="grid grid-cols-3 flex gap-6 mt-6">
          <div
            className="col-span-2 bg-green-800 rounded-lg p-4 text-white hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => handleNavigation('/admin/data-analytics-reports')}
          >
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={wasteData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="month" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip contentStyle={{ backgroundColor: '#333', color: '#fff', border: 'none' }} />
                  <Line type="monotone" dataKey="value" stroke="#fff" strokeWidth={2} dot={{ fill: '#fff', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2">
              <h3 className="font-bold">Waste Collection Trends</h3>
              <p className="text-sm text-gray-300">(1131) collected in liters</p>
              <div className="text-xs text-gray-300 mt-2">
                <span className="inline-block w-3 h-3 bg-gray-400 rounded-full mr-1"></span>
                updated 4 min ago
              </div>
            </div>
          </div>
        </div> */}

        {/* Operator-specific sections */}
        {user.role === 'Operator' && (
          <>
            <div className="bg-white rounded-lg p-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold mb-2">Assigned Maintenance Tasks</h3>
                <button
                  className="text-green-700 text-sm hover:underline px-3 py-1 rounded-md"
                  onClick={() => setTaskSectionOpen(!taskSectionOpen)}
                >
                  {taskSectionOpen ? 'Hide' : 'Show'}
                </button>
              </div>
              {loadingTasks ? (
                <p className="text-gray-500 text-sm">Loading tasks...</p>
              ) : taskSectionOpen ? (
                tasks.length > 0 ? (
                  tasks.map((task) => (
                    <div
                      key={task._id}
                      className={`flex justify-between items-center mb-2 p-3 rounded border ${
                        task.done ? 'bg-green-100 border-green-300' : 'bg-white border-gray-300'
                      }`}
                    >
                      <div>
                        <p className="text-gray-800 font-semibold">Bin ID: {task.binId}</p>
                        <p className="text-sm text-gray-500">
                          Assigned: {new Date(task.createdAt).toLocaleString()}
                        </p>
                        {task.done && (
                          <p className="text-xs text-green-600 font-medium mt-1">✔ Marked as Done</p>
                        )}
                      </div>
                      {!task.done && (
                        <button
                          onClick={() => markTaskDone(task._id, task.binId)}
                          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                        >
                          Mark as Done
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No tasks assigned.</p>
                )
              ) : null}
            </div>

            <div className="bg-white rounded-lg p-4 mt-4">
              <h3 className="font-bold mb-4">Your Bin Locations (Map View)</h3>
              <div style={{ height: '400px' }}>
                <BinMap
                  key={operatorBins.length}
                  bins={operatorBins}
                  routeToBin={routeToBin}
                  role="Operator"
                />

              </div>
              <h3 className="font-bold mb-2 mt-4">Find Route to Bin</h3>
              <input
                type="text"
                placeholder="Enter Bin ID or Location"
                value={binSearchText}
                onChange={(e) => setBinSearchText(e.target.value.trim())}
                className="border px-3 py-2 rounded w-full mb-2"
              />
              <button
                onClick={async () => {
                  if (!binSearchText.trim()) {
                    setSuggestedRoad("Please enter a bin ID or location.");
                    return;
                  }
                  const bin = operatorBins.find(b => {
                    const idMatch = b?.binId?.toLowerCase() === binSearchText.toLowerCase();
                    const locationMatch = b?.location?.toLowerCase().includes(binSearchText.toLowerCase());
                    return idMatch || locationMatch;
                  });
                  console.log("Searching for bin:", binSearchText);               
                  console.log('Found bin:', bin);
                  if (bin) {
                    console.log("Selected Bin:", bin); // Debug
                  
                    if (bin?.coordinates?.lat && bin?.coordinates?.lng) {
                      setRouteToBin(bin); // this triggers map routing
                  
                      try {
                        const res = await fetch(
                          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${bin.coordinates.lat}&lon=${bin.coordinates.lng}`
                        );
                        const data = await res.json();
                        const road = data?.address?.road || 'Road info not found';
                        setSuggestedRoad(`Suggested Route: ${road}`);
                      } catch (err) {
                        setSuggestedRoad('Failed to get road info.');
                        console.error("Reverse geocode fetch failed:", err);
                      }
                    } else {
                      console.warn("Coordinates missing for selected bin:", bin);
                      setSuggestedRoad('Coordinates missing for this bin.');
                    }
                  } else {
                    setSuggestedRoad('Bin not found.');
                  }                  
                }}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Find Route
              </button>
              {suggestedRoad && <p className="mt-2 text-green-700">{suggestedRoad}</p>}
            </div>
          </>
        )}

                {/*Common Announcements */}
      <div className="bg-white rounded-xl shadow p-6 mt-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Common Announcements</h3>

        {uniqueCommonNotifications.length > 0 ? (
          uniqueCommonNotifications.map((notification, index) => (
            <div
              key={index}
              className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50 hover:shadow-sm transition"
            >
              <p className="text-gray-800 font-medium">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No announcements available.</p>
        )}
      </div>

             {/*Operator Notifications (Only for Operators) */}
      {user.role === 'Operator' && (
        <div className="bg-white rounded-xl shadow p-6 mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Operator Notifications</h3>

          {uniqueOperatorNotifications.length > 0 ? (
            uniqueOperatorNotifications.map((notification, index) => (
              <div
                key={notification._id || index}
                className={`flex justify-between items-start gap-4 p-4 border rounded-lg mb-3 ${
                  notification.isRead
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-yellow-50 border-yellow-300'
                }`}
              >
                <div>
                  <p className="text-gray-800 font-medium">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleString()} ·{' '}
                    {notification.isRead ? (
                      <span className="text-green-600">Read</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Unread</span>
                    )}
                  </p>
                </div>

                <button
                  onClick={() =>
                    toggleNotificationReadStatus(notification._id, !notification.isRead)
                  }
                  className="text-sm px-3 py-1 rounded border hover:bg-gray-100 transition"
                >
                  {notification.isRead ? 'Mark as Unread' : 'Mark as Read'}
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No operator notifications available.</p>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
