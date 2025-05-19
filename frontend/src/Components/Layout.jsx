import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

function Layout() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle (for small screens) */}
      <div className="md:hidden sticky top-0 bg-citybin-green text-white p-4 flex justify-between items-center z-10">
        <h1 className="text-xl font-bold">CityBin</h1>
        <button className="text-white">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      {/* Sidebar - hidden on mobile, visible on medium screens and up */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      
      {/* Main content area */}
      <div className="flex-grow flex flex-col">
        <Header />
        <div className="border-t border-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;