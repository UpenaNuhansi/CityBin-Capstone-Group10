import { useState, useEffect } from 'react';
import {
  Download
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import TopBar from '../../../Components/TopBar/TopBar';
import { exportPDF, exportCSV } from '../../../utils/dataExport';
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
    <div className="flex-1 flex flex-col ml-64 mt-18 bg-gray-50 min-h-screen">
      {/* Top Bar */}
      <TopBar
        title="Data Analytics & Reports"
        searchText={searchText}
        setSearchText={setSearchText}
        onProfileClick={() => handlePageNavigation("Profile")}
      />

      {/* Content */}
      <div className="flex-1 p-6 space-y-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-sm text-gray-500 mb-1">Avg. Bin Fill Time</h4>
            <p className="text-3xl font-semibold text-green-800">{avgBinFillTime}h</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h4 className="text-sm text-gray-500 mb-1">Collection Frequency</h4>
            <p className="text-3xl font-semibold text-green-800">{collectionFrequency}x/day</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center gap-4">
            <button
              onClick={() => exportCSV(binData)}
              className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              <Download size={18} />
              Export CSV
            </button>
            <button
              onClick={() => exportPDF(binData)}
              className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm transition"
            >
              <Download size={18} />
              Export PDF
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Waste Collection Trend</h2>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={collectionData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="January" fill="#10B981" />
                <Bar dataKey="February" fill="#3B82F6" />
                <Bar dataKey="March" fill="#F59E0B" />
                <Bar dataKey="April" fill="#EF4444" />
                <Bar dataKey="May" fill="#22C55E" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md p-6 overflow-auto">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Daily Bin Activity</h2>
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="py-3 px-4 font-medium text-gray-700">Date</th>
                <th className="py-3 px-4 font-medium text-gray-700">Bins Emptied</th>
                <th className="py-3 px-4 font-medium text-gray-700">Avg Fill %</th>
                <th className="py-3 px-4 font-medium text-gray-700">Full Alerts</th>
              </tr>
            </thead>
            <tbody>
              {binData.map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{row.date}</td>
                  <td className="py-3 px-4">{row.binsEmptied}</td>
                  <td className="py-3 px-4 flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: getFillColor(row.avgFillPercent) }}
                    />
                    {row.avgFillPercent}%
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