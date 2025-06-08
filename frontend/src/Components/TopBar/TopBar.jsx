import React from 'react';
import { Search, User } from 'lucide-react';

export default function TopBar({ title, searchText, setSearchText, onProfileClick }) {
  console.log('TopBar: Rendering with title', title);

  return (
    <div className="bg-white shadow-md p-4 flex items-center justify-between">
      <h1 className="text-xl font-semibold text-green-800">{title}</h1>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
          />
        </div>
        <button
          onClick={onProfileClick}
          className="text-gray-600 hover:text-green-600"
        >
          <User size={24} />
        </button>
      </div>
    </div>
  );
}