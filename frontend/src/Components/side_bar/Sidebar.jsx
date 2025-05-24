import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home,  BarChart2,  Settings,  Bell,  LogOut } from 'lucide-react'; // Import Lucide icons

const Sidebar = ({ activePage, handleLogoutClick }) => {
  const location = useLocation();

  const menuItems = [
    { 
      name: 'Home', 
      path: '/user/home', 
      icon: <Home className="w-5 h-5" /> 
    },
    { 
      name: 'Report', 
      path: '/user/report', 
      icon: <BarChart2 className="w-5 h-5" />  
    },
    { 
      name: 'Settings', 
      path: '/user/settings', 
      icon: <Settings className="w-5 h-5" /> 
    },
    { 
      name: 'Alerts', 
      path: '/user/alerts', 
      icon: <Bell className="w-5 h-5" />  
    },
  ];

  return (
    <div className="w-64 bg-green-800 text-white h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-green-700">
        <h2 className="text-xl font-bold">CityBin</h2>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-green-700 hover:text-white'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Logout Button */}
      <div className="p-4 border-t border-green-700">
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center p-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors duration-200"
        >
          <LogOut className="mr-3 w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;