import BinImage from "../../../assets/BIN.jpg";
import { useNavigate } from 'react-router-dom';


import { useState } from 'react';
import { FaSearch, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import ReportPage from './ReportPage';

function HomePage() {
  const [search, setSearch] = useState('');

  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen font-sans">
      
      {/* Main Content */}
      <main className="flex-1 bg-white">
        {/* Top Bar */}
        

        {/* Content Section */}
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Hi, User</h1>

          {/* Current Bin Status */}
          <div className="bg-green-100 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">Current Bin Status</h2>
            <div className="flex items-center mb-4">
              <p className="w-28">Bin fill level</p>
              <div className="w-full max-w-md bg-gray-200 h-6 rounded-full overflow-hidden">
                <div className="bg-green-600 h-full rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            <div className="text-center text-2xl font-bold mt-2">70%</div>
          </div>

          {/* Rewards */}
          <div className="bg-green-100 p-6 rounded-lg mb-6 relative flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Rewards</h2>
              <p className="font-semibold">Points : 100</p>
              <div className="flex text-2xl mt-2">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span className="text-gray-400">★</span>
              </div>
            </div>
            <img
              src={BinImage}// Replace this path with your actual bin image path
              alt="Recycle bin"
              className="w-40 mt-4 md:mt-0 md:w-48"
            />
          </div>

          {/* Report a Problem */}
          
          <button onClick={() => navigate('/report')} className="bg-green-800 text-white w-full py-3 rounded-md text-lg hover:bg-green-900">
            Report a Problem
          </button>
          
        </div>
      </main>
    </div>
  );
}

export default HomePage;
