import { useState, useEffect } from 'react';
import { BarChart2, Bell, Settings, Users, Trash2, LogOut, User, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import TopBar from '../../../Components/TopBar/TopBar';
import { exportPDF } from '../../../utils/dataExport';
import { exportCSV } from '../../../utils/dataExport';
import { getFillColor } from '../../../utils/getFillColor';

export default function DataAnalyticsReports({ handleNavigation }) {
  const [activePage, setActivePage] = useState('Data Analytics & Reports');
  const [searchText, setSearchText] = useState('');
  const [avgBinFillTime, setAvgBinFillTime] = useState(10.5);
  const [collectionFrequency, setCollectionFrequency] = useState(2.1);

  const [collectionData, setCollectionData] = useState([
    { month: '2024/05', January: 600, February: 800, March: 450, April: 920, May: 700 },
    { month: '2024/06', January: 700, February: 900, March: 500, April: 800, May: 950 },
    { month: '2024/07', January: 650, February: 750, March: 400, April: 700, May: 800 },
    { month: '2024/08', January: 750, February: 850, March: 600, April: 850, May: 900 },
    { month: '2024/09', January: 800, February: 900, March: 550, April: 890, May: 950 },
  ]);

  const [binData, setBinData] = useState([
    { date: '2024-04-14', binsEmptied: 51, avgFillPercent: 85, fullAlerts: 7 },
    { date: '2024-04-15', binsEmptied: 46, avgFillPercent: 79, fullAlerts: 12 },
    { date: '2024-04-16', binsEmptied: 50, avgFillPercent: 88, fullAlerts: 9 },
    { date: '2024-04-17', binsEmptied: 54, avgFillPercent: 92, fullAlerts: 11 },
    { date: '2024-04-18', binsEmptied: 49, avgFillPercent: 84, fullAlerts: 8 },
  ]);

  useEffect(() => {
    const loadDataFromDB = () => {
      console.log("Connected to database and loaded data");
    };

    loadDataFromDB();

    const intervalId = setInterval(() => {
      setAvgBinFillTime(prev => +(prev + (Math.random() * 0.4 - 0.2)).toFixed(1));
      setCollectionFrequency(prev => +(prev + (Math.random() * 0.2 - 0.1)).toFixed(1));
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const handlePageNavigation = (page) => {
    setActivePage(page);
    handleNavigation(page);
  };

  return (
    <div className="flex-1 flex flex-col ml-64">
      {/* Top Bar */}
      <div>
        <TopBar
          title="Data Analytics & Reports"
          searchText={searchText}
          setSearchText={setSearchText}
          onProfileClick={() => handlePageNavigation("Profile")}
        />
      </div>

      {/* Analytics Content */}
      <div className="flex-1 p-6 bg-gray-100">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-600">Avg. Bin Fill Time</h3>
            <p className="text-2xl font-bold">{avgBinFillTime}h</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-600">Collection Frequency</h3>
            <p className="text-2xl font-bold">{collectionFrequency}x / day</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <button
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition-colors duration-200 flex items-center space-x-2"
              onClick={() => exportCSV(binData)}
            >
              <Download size={16} />
              <span>Export CSV</span>
            </button>
            <button
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 transition-colors duration-200 flex items-center space-x-2"
              onClick={() => exportPDF(binData)}
            >
              <Download size={16} />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Waste Collection Trend</h2>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={collectionData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="January" fill="#82ca9d" />
                <Bar dataKey="February" fill="#8884d8" />
                <Bar dataKey="March" fill="#ff7300" />
                <Bar dataKey="April" fill="#ff4d4d" />
                <Bar dataKey="May" fill="#4cd964" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Bins Emptied</th>
                <th className="text-left py-3 px-4">Avg Fill %</th>
                <th className="text-left py-3 px-4">Full Alerts</th>
              </tr>
            </thead>
            <tbody>
              {binData.map((row, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 px-4">{row.date}</td>
                  <td className="py-3 px-4">{row.binsEmptied}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div
                        className="h-4 w-4 rounded-full mr-2"
                        style={{ backgroundColor: getFillColor(row.avgFillPercent) }}
                      ></div>
                      {row.avgFillPercent}%
                    </div>
                  </td>
                  <td className="py-3 px-4">{row.fullAlerts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
