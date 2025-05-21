import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active-nav' : '';
  };

  return (
    <div className="bg-citybin-green bg-green-700 text-white h-screen flex flex-col min-w-[200px] lg:min-w-[240px]">
      <div className="p-5 mb-8">
        <h1 className="text-3xl font-bold">CityBin</h1>
      </div>
      
      <nav className="flex-grow">
        <ul className="space-y-1">
          <li 
            className={`py-3 px-5 cursor-pointer hover:bg-green-800 transition-colors flex items-center ${isActive('/')}`}
            onClick={() => navigate('/')}
          >
            <span>Home</span>
            <span className="ml-auto">
              {isActive('/') && <span className="text-xl">›</span>}
            </span>
          </li>
          
          <li 
            className={`py-3 px-5 cursor-pointer hover:bg-green-800 transition-colors flex items-center ${isActive('/report')}`}
            onClick={() => navigate('/report')}
          >
            <span>Report</span>
            <span className="ml-auto">
              {isActive('/report') && <span className="text-xl">›</span>}
            </span>
          </li>
          
          <li 
            className={`py-3 px-5 cursor-pointer hover:bg-green-800 transition-colors flex items-center ${isActive('/alerts')}`}
            onClick={() => navigate('/alerts')}
          >
            <span>Alerts & Notifications</span>
            <span className="ml-auto">
              {isActive('/alerts') && <span className="text-xl">›</span>}
            </span>
          </li>
          
          <li 
            className={`py-3 px-5 cursor-pointer hover:bg-green-800 transition-colors flex items-center ${isActive('/settings')}`}
            onClick={() => navigate('/settings')}
          >
            <span>Settings</span>
            <span className="ml-auto">
              {isActive('/settings') && <span className="text-xl">›</span>}
            </span>
          </li>
        </ul>
      </nav>
      
      <div 
        className="p-5 cursor-pointer hover:bg-green-800 transition-colors flex items-center mt-auto mb-8"
        onClick={() => navigate('/login')}
      >
        <span className="mr-2">➔</span>
        <span>Log Out</span>
      </div>
    </div>
  );
}

export default Sidebar;