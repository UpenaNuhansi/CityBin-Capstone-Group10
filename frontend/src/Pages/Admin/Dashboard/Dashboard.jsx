import { useState,useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, User } from 'lucide-react';
import SensorStatus from '../../../Components/SensorStatus/SensorStatus';
import TopBar from '../../../Components/TopBar/TopBar';
import api from '../../../api/axios';

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
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [searchText, setSearchText] = useState('');
  const [sensorStatus, setSensorStatus] = useState({
    'Sensor A': true,
    'Sensor B': false,
    'Sensor C': true,
    'Sensor D': true,
    'Gateway 1': false
  });

  useEffect(() => {
    console.log('Dashboard.jsx: Rendering for user', user);
  }, []);

  const toggleSensor = (name) => {
    setSensorStatus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <div className="flex-1 flex flex-col ml-64">

      <div>
      <TopBar
        title="Dashboard"
        searchText={searchText}
        setSearchText={setSearchText}
        onProfileClick={() => handleNavigation("/admin/profile")}
      />
    </div>

    <div className="flex-1 p-4 bg-white">
        <h2 className="text-2xl font-bold text-green-800">Welcome, {user.username || 'Admin'}!</h2>
        <p className="mt-2 text-gray-600">This is the CityBin Admin Dashboard.</p>
        <div className="mt-4 p-4 bg-green-100 rounded-lg">
          <p className="text-green-800">Debug: Admin Dashboard Loaded Successfully</p>
        </div>
      </div>

      <div className="flex-1 p-4 bg-gray-100">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <StatusBox title="Total Bins" value="128" onClick={() => handleNavigation('/admin/bin-management')} />
          <StatusBox title="Active Bins" value="103" onClick={() => handleNavigation('Bin Management')}/>
          <StatusBox title="Full Bins" value="16" onClick={() => handleNavigation('Bin Management')}/>
          <StatusBox title="Maintenance Issues" value="5" onClick={() => handleNavigation('Bin Management')}/>
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
          <div 
            className="bg-white rounded-lg p-4 hover:shadow-lg transition-all duration-200 cursor-pointer"
            onClick={() => handleNavigation('/admin/alerts-notifications')}
          >
            <h3 className="font-bold mb-4">Sensor & Connectivity Status</h3>
            {Object.keys(sensorStatus).map((sensor) => (
              <SensorStatus 
                key={sensor} 
                name={sensor} 
                active={sensorStatus[sensor]} 
                onToggle={() => toggleSensor(sensor)}
              />
            ))}
          </div>
        </div>
        <div 
          className="bg-white rounded-lg p-4 mt-4 hover:shadow-lg transition-all duration-200 cursor-pointer"
          onClick={() => handleNavigation('/admin/alerts-notifications')}
        >
          <h3 className="font-bold mb-4">Recent Activity</h3>
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start mb-2 p-2 hover:bg-gray-50 rounded transition-colors duration-200">
              <div className="text-gray-500 w-12">{activity.time}</div>
              <div className="w-2 h-2 bg-green-700 rounded-full mt-2 mx-2"></div>
              <div>{activity.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusBox({ title, value, onClick }) {
  return (
    <div className="bg-white rounded-lg p-4 text-center border border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-green-500 cursor-pointer" onClick={onClick}>
      <div className="text-gray-600 text-sm">{title}</div>
      <div className="font-bold text-lg">{value}</div>
    </div>
  );
}
