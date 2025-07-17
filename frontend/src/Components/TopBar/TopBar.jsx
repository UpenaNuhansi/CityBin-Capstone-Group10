import React from 'react';
import { Search, User } from 'lucide-react';

export default function TopBar({ title, searchText, setSearchText, onProfileClick }) {
  return (
    <div className="fixed top-0 left-64 right-0 z-50 bg-gradient-to-r from-green-900 to-green-700 text-white px-6 py-4 shadow-md flex items-center justify-between">
      {/* Title */}
      <h1 className="text-2xl font-bold tracking-wide">{title}</h1>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-green-200" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-full bg-white text-gray-800 text-sm shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all duration-200 w-64"
          />
        </div>

        {/* Profile Icon */}
        <button
          onClick={onProfileClick}
          className="flex items-center justify-center p-2 rounded-full bg-white text-green-800 hover:bg-green-100 shadow-sm transition duration-150"
          title="Profile"
        >
          <User size={20} />
        </button>
      </div>
    </div>
  );
}