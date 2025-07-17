import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import BinImage from "../../../assets/BIN.jpg";
import api from '../../../api/axios';

function HomePage() {
  const [search, setSearch] = useState('');
  const [userBins, setUserBins] = useState([]);
  const [avgFill, setAvgFill] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch bin data from backend
  const fetchUserBins = async () => {
    if (!user?._id) return;
    try {
      const res = await api.get(`/user-bins/user/${user._id}`);
      const bins = res.data.data || [];
      setUserBins(bins);

      const totalFill = bins.reduce((sum, b) => sum + (b.fillLevel || 0), 0);
      const avg = bins.length > 0 ? (totalFill / bins.length).toFixed(1) : 0;
      const rewards = bins.reduce((sum, b) => sum + (b.rewardPoints || 0), 0);

      setAvgFill(avg);
      setTotalPoints(rewards);
    } catch (err) {
      console.error("Failed to fetch user bins", err);
    }
  };

  // Run once on mount + every 30s for live update
  useEffect(() => {
    fetchUserBins();

    const interval = setInterval(() => {
      fetchUserBins();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ml-64 mt-10 relative p-6 min-h-screen bg-gradient-to-br from-green-50 to-green-100 font-sans">
      {/* Main Content */}
      <main className="flex-1">
        <div className="p-6">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Welcome Back</h1>

          {/* Current Bin Status (Dynamic) */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Current Bin Status</h2>
            <div className="flex items-center gap-4 mb-2">
              <p className="w-32 font-medium text-gray-600">Bin Fill Level</p>
              <div className="w-full bg-gray-200 h-5 rounded-full overflow-hidden">
                <div
                  className="bg-green-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${avgFill}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center mt-2 text-2xl font-bold text-green-700">{avgFill}%</div>
          </div>

          {/* Rewards Section (Dynamic) */}
          <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-xl shadow-md mb-6 flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Rewards</h2>
              <p className="text-lg font-medium text-gray-700">
                Points: <span className="text-green-700 font-bold">{totalPoints}</span>
              </p>
              <div className="flex text-2xl text-yellow-400 mt-2">
                {Array.from({ length: Math.floor(totalPoints / 40) }).map((_, i) => (
                  <span key={i}>★</span>
                ))}
                {Array.from({ length: 4 - Math.floor(totalPoints / 40) }).map((_, i) => (
                  <span key={i} className="text-gray-300">★</span>
                ))}
              </div>
            </div>
            <img
              src={BinImage}
              alt="Recycle bin"
              className="w-36 mt-4 md:mt-0 md:w-48 rounded-lg shadow-sm"
            />
          </div>

          {/* Bin List Section */}
          {userBins.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Bins</h2>
              <div className="space-y-4">
                {userBins.map((bin) => {
                  let fillColor = 'bg-green-500';
                  if (bin.fillLevel > 80) fillColor = 'bg-red-500';
                  else if (bin.fillLevel > 50) fillColor = 'bg-yellow-400';

                  return (
                    <div
                      key={bin.binId}
                      className="border border-gray-200 p-4 rounded-md shadow-sm bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-800">{bin.binType || 'Unknown Bin'}</p>
                          <p className="text-sm text-gray-600">Bin ID: {bin.binId}</p>
                          <p className="text-sm text-gray-500 mt-1">Location: {bin.location || 'N/A'}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="w-32 bg-gray-200 h-4 rounded-full overflow-hidden mb-1">
                            <div
                              className={`h-full transition-all duration-500 ${fillColor}`}
                              style={{ width: `${bin.fillLevel}%` }}
                            />
                          </div>
                          <p className="text-sm font-bold text-gray-700">{bin.fillLevel}% Full</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}


          {/* Report a Problem */}
          <button
            onClick={() => navigate('/user/report')}
            className="w-full bg-green-700 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-800 transition-colors shadow-md"
          >
            Report a Problem
          </button>
        </div>
      </main>
    </div>
  );
}

export default HomePage;