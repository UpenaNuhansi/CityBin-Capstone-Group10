import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, Settings, Bell, LogOut } from 'lucide-react';

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
    }
  ];

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-gradient-to-b from-green-900 to-green-800 text-white shadow-xl flex flex-col justify-between">
      {/* Logo/Header */}
      <div className="px-6 py-6 border-b border-green-700">
        <h1 className="text-2xl font-extrabold tracking-wide">🌿 CityBin</h1>
        <p className="text-sm text-green-200 mt-1">Smart Waste Manager</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto custom-scrollbar">
        <ul className="space-y-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-green-100 hover:bg-green-700 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-green-700">
        <button
          onClick={handleLogoutClick}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;