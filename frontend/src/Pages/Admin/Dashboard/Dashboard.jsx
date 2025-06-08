import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import SensorStatus from '../../../Components/SensorStatus/SensorStatus';
import TopBar from '../../../Components/TopBar/TopBar';
import api from '../../../api/axios';
import BinMap from '../../../Components/BinManagement/BinMap';



const wasteData = [
  { month: 'May', value: 210 },
  { month: 'Jun', value: 320 },
  { month: 'Jul', value: 280 },
  { month: 'Aug', value: 480 },
  { month: 'Sep', value: 380 },
  { month: 'Oct', value: 430 },
  { month: 'Nov', value: 350 },
  { month: 'Dec', value: 420 },
];

const recentActivity = [
  { time: '09:00', message: 'Bin #18 marked as full.' },
  { time: '09:15', message: 'Maintenance ticket created for Bin #42.' },
  { time: '09:16', message: 'User John Smith logged in.' },
  { time: '09:18', message: 'Collection completed for Bin #7.' },
  { time: '09:22', message: 'Sensor B disconnected.' },
];

export default function Dashboard({ activePage, setActivePage, handleNavigation }) {
  const [searchText, setSearchText] = useState('');
  const [sensorStatus, setSensorStatus] = useState({
    'Sensor A': true,
    'Sensor B': false,
    'Sensor C': true,
    'Sensor D': true,
    'Gateway 1': false
  });

const [tasks, setTasks] = useState([]);
const [user, setUser] = useState({});
const [loadingTasks, setLoadingTasks] = useState(true);
const [taskSectionOpen, setTaskSectionOpen] = useState(true); // Collapsible section
const [commonNotifications, setCommonNotifications] = useState([]);
const [operatorNotifications, setOperatorNotifications] = useState([]);
const navigate = useNavigate();
const [operatorBins, setOperatorBins] = useState([]);
const [binSearchText, setBinSearchText] = useState('');
const [suggestedRoad, setSuggestedRoad] = useState('');
const [routeToBin, setRouteToBin] = useState(null);


//  Mark maintenance task as done
const markTaskDone = async (notificationId, binId) => {
  console.log('📤 Sending to backend:', { notificationId, binId });
  if (!binId) {
    alert('⚠ Cannot mark task as done: missing bin ID!');
    return;
  }

  try {
    await api.put(`/notifications/${notificationId}/done`, { binId });
    toast.success('✅ Task marked as done!');
    fetchTasks(); // Refresh tasks after marking
  } catch (err) {
    console.error('❌ Failed to mark task as done', err?.response?.data || err.message);
  }
};

// Fetch operator-specific notifications (from admin)
const fetchOperatorNotifications = async () => {
  try {
    console.log('📡 Fetching operator notifications...');
    const res = await api.get('/notifications/operator');
    console.log('✅ Operator notifications loaded:', res.data.notifications.length);
    setOperatorNotifications(res.data.notifications || []);
  } catch (err) {
    toast.error('Failed to load operator notifications');
    console.error('❌ Error:', err.message);
  }
};


//  Fetch system-wide announcements (common)
const fetchCommonNotifications = async () => {
  try {
    const res = await api.get('/notifications/common');
    setCommonNotifications(res.data.notifications || []);
  } catch (err) {
    toast.error('Failed to load announcements');
    console.error(err.message);
  }
};



//  Extended unified useEffect — load extra notifications based on role
useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  setUser(storedUser);

  if (storedUser.role === 'Operator') {
    fetchTasks();
    fetchOperatorNotifications();

    const fetchOperatorBins = async () => {
      try {
        const res = await api.get('/bins/assigned-to-operator');

        const formatted = res.data.data
          .filter(bin => bin.coordinates && typeof bin.coordinates.lat === 'number')
          .map(bin => ({
            id: bin.binId,
            location: bin.location,
            wasteLevel: bin.wasteLevel,
            coordinates: bin.coordinates,
          }));

        setOperatorBins(formatted);
      } catch (error) {
        console.error(
          'Failed to fetch bins for operator:',
          error?.message || error?.response?.data?.message || 'Unknown error'
        );
      }
    };

    fetchOperatorBins();
  }

  fetchCommonNotifications();
}, []);

useEffect(() => {
  setOperatorBins([
    {
      id: 'CB001',
      location: 'Test Bin',
      wasteLevel: 50,
      coordinates: { lat: 6.7132, lng: 80.7873 },
    }
  ]);
}, []);



useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  setUser(storedUser);

  if (storedUser.role === 'Operator') {
    fetchTasks();
  } else {
    setLoadingTasks(false);
  }
}, []);

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


  const uniqueOperatorNotifications = Array.from(
  new Map(operatorNotifications.map(item => [`${item.message}-${item.createdAt}`, item])).values()
);
  const uniqueCommonNotifications = Array.from(
    new Map(commonNotifications.map(item => [`${item.message}-${item.createdAt}`, item])).values()
  );

  return (
    <div className="flex-1 flex flex-col ml-64">
      <TopBar
        title="Dashboard"
        searchText={searchText}
        setSearchText={setSearchText}
        onProfileClick={() => handleNavigation("/admin/profile")}
      />

      <div className="flex-1 p-4 bg-white">
        <h2 className="text-2xl font-bold text-green-800">Welcome, {user.username || 'Admin'}!</h2>        
      </div>

      <div className="flex-1 p-4 bg-gray-100">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <StatusBox title="Total Bins" value="128" onClick={() => handleNavigation('/admin/bin-management')} />
          <StatusBox title="Active Bins" value="103" onClick={() => handleNavigation('/admin/bin-management')} />
          <StatusBox title="Full Bins" value="16" onClick={() => handleNavigation('/admin/bin-management')} />
          <StatusBox title="Maintenance Issues" value="5" onClick={() => handleNavigation('/admin/bin-management')} />
        </div>

        <div className="grid grid-cols-3 gap-4">
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
        </div>

        {user.role === 'Operator' && (
  <div className="bg-white rounded-lg p-4 mt-4">
    <div className="flex justify-between items-center">
      <h3 className="font-bold mb-2">Assigned Maintenance Tasks</h3>
      <button
        className="text-green-700 text-sm hover:underline"
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
        onClick={() => 

          markTaskDone(task._id, task.binId)}
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
)}

{/* Common Announcements Section */}
        <div className="bg-white rounded-lg p-4 mt-4">
          <h3 className="font-bold mb-4">Common Announcements</h3>
          {commonNotifications.length > 0 ? (
            commonNotifications.map((notification, index) => (
              <div key={index} className="mb-2 p-2 border-b last:border-none">
                <p className="text-gray-800">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No announcements available.</p>
          )}
        </div>

{user.role === 'Operator' && (
  <div className="bg-white rounded-lg p-4 mt-4">
    <h3 className="font-bold mb-4">Operator Notifications</h3>
    {uniqueOperatorNotifications.length > 0 ? (
      uniqueOperatorNotifications.map((notification, index) => (
        <div key={notification._id || index} className="mb-2 p-2 border-b last:border-none">
          <p className="text-gray-800">{notification.message}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>
      ))
    ) : (
      <p className="text-gray-500">No operator notifications available.</p>
    )}
  </div>
)}

{/* Bin map section */}
{user.role === 'Operator' && (
  <div className="bg-white rounded-lg p-4 mt-4">
    <h3 className="font-bold mb-4">Your Bin Locations (Map View)</h3>
    <div style={{ height: '400px' }}>
      {operatorBins.length > 0 ? (
        <BinMap bins={operatorBins} routeToBin={routeToBin} role="Operator" />
      ) : (
        <p className="text-gray-500">No bin data available.</p>
      )}
    </div>

    {/* Search & Route */}
    <h3 className="font-bold mb-2 mt-4">Find Route to Bin</h3>
    <input
      type="text"
      placeholder="Enter Bin ID or Location"
      value={binSearchText}
      onChange={(e) => setBinSearchText(e.target.value)}
      className="border px-3 py-2 rounded w-full mb-2"
    />
    <button
      onClick={async () => {
        const bin = operatorBins.find(
          b =>
            b.id.toLowerCase() === binSearchText.toLowerCase() ||
            b.location.toLowerCase().includes(binSearchText.toLowerCase())
        );

        if (bin) {
          setRouteToBin(bin);
          const lat = bin.coordinates.lat;
          const lng = bin.coordinates.lng;
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

          try {
            const res = await fetch(url);
            const data = await res.json();
            const road = data?.address?.road || 'Road info not found';
            setSuggestedRoad(`Suggested Route: ${road}`);
          } catch (err) {
            console.error('Reverse geocoding failed:', err);
            setSuggestedRoad('Failed to get road info.');
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
)}
 </div>
    </div>
  );
}

function StatusBox({ title, value, onClick }) {
  return (
    <div
      className="bg-white rounded-lg p-4 text-center border border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-green-500 cursor-pointer"
      onClick={onClick}
    >
      <div className="text-gray-600 text-sm">{title}</div>
      <div className="font-bold text-lg">{value}</div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
