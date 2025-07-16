import BinImage from "../../../assets/BIN.jpg";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaSearch, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

function HomePage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  return (
    <div className="ml-64 mt-10 relative p-6 min-h-screen bg-gradient-to-br from-green-50 to-green-100 font-sans">
      {/* Main Content */}
      <main className="flex-1">
            {/* Page Content */}
        <div className="p-6">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Welcome Back</h1>

          {/* Current Bin Status */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Current Bin Status</h2>
            <div className="flex items-center gap-4 mb-2">
              <p className="w-32 font-medium text-gray-600">Bin Fill Level</p>
              <div className="w-full bg-gray-200 h-5 rounded-full overflow-hidden">
                <div
                  className="bg-green-600 h-full rounded-full transition-all duration-500"
                  style={{ width: '70%' }}
                ></div>
              </div>
            </div>
            <div className="text-center mt-2 text-2xl font-bold text-green-700">70%</div>
          </div>

          {/* Rewards Section */}
          <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-xl shadow-md mb-6 flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Your Rewards</h2>
              <p className="text-lg font-medium text-gray-700">Points: <span className="text-green-700 font-bold">100</span></p>
              <div className="flex text-2xl text-yellow-400 mt-2">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span className="text-gray-300">★</span>
              </div>
            </div>
            <img
              src={BinImage}
              alt="Recycle bin"
              className="w-36 mt-4 md:mt-0 md:w-48 rounded-lg shadow-sm"
            />
          </div>

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