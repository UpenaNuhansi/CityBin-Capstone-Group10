import { BarChart2, Bell, Settings, Users, Trash2, LogOut, User, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import NavItem from '../../../Components/DataAnalyticsReports/NavItem';
import TopBar from '../../../Components/TopBar/TopBar';
import { exportPDF } from '../../../utils/dataExport';
import { exportCSV } from '../../../utils/dataExport';
import { getFillColor } from '../../../utils/getFillColor';

export default function DataAnalyticsReportsContent({
  activePage,
  searchText,
  setSearchText,
  avgBinFillTime,
  collectionFrequency,
  collectionData,
  binData,
  handleNavigation,
}) {
  return (
      <div className="flex-1 flex flex-col ml-64">
        {/* Top Bar */}
        <div>
              <TopBar
                title="Data Analytics & Reports"
                searchText={searchText}
                setSearchText={setSearchText}
                onProfileClick={() => handleNavigation("Profile")}
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