import { Search, User } from "lucide-react";

export default function TopBar({ title, searchText, setSearchText, onProfileClick }) {
  return (
    
    <div className="bg-white p-4 border-b flex justify-between items-center sticky top-0 z-10">
      <div className="text-xl font-bold">{title}</div>
      
      <div className="relative">
        <input
          type="text"
          placeholder="Search something"
          className="bg-gray-200 rounded-full pl-8 pr-4 py-1 w-64 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <span className="absolute left-2 top-2 text-gray-500">
          <Search size={16} />
        </span>
      </div>
      {/*profile icon align on the top bar..... */}
      <div className="inset-0 ">
             <div 
       className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-green-800 transition-colors duration-200"
        onClick={onProfileClick}
      />
        <User size={18} />
      </div>
      </div>
      );
}
