import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Search, Settings, User } from 'lucide-react';

function Header({ onSearch }) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <header className="fixed top-0 left-64 right-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm">
      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Search anything..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-gray-100 border border-gray-300 rounded-full py-2 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
        <button
          onClick={handleSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600 transition"
          title="Search"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
          </svg>
        </button>
      </div>

      {/* Settings/Profile */}
      <div className="ml-6 flex items-center space-x-3">
        <button
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
          title="Profile / Settings"
        >
          <User className="h-5 w-5 text-gray-700" />
          <span className="text-sm font-medium text-gray-700">Profile</span>
        </button>
      </div>
    </header>
  );
}

export default Header;