import { BarChart2, Settings, Users, Trash2, Bell, LogOut, User } from 'lucide-react';

function NavItem({ active, icon, text, onClick }) {
  return (
    <div
      className={`flex items-center p-4 cursor-pointer transition-colors duration-200 rounded-lg ${active === text 
        ? 'bg-green-700 border-l-4 border-white shadow-md' 
        : 'hover:bg-green-700'}
      `}
      onClick={() => onClick(text)}
    >
      {icon}
      <span className="ml-3 text-white text-sm">{text}</span>
    </div>
  );
}

export default function SideBar({ user,activePage, handleNavigation, handleLogoutClick }) {
    const isOperator = user?.role === 'Operator';

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-green-900 text-white flex flex-col shadow-lg">
      <div className="px-6 py-6 border-b border-green-700">
        <h1 className="text-2xl font-extrabold tracking-wide items-center">🌿 CityBin</h1>
        <p className="text-sm text-green-200 mt-1">Smart Waste Manager</p>
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-2">
        <NavItem 
          active={activePage} 
          icon={<BarChart2 size={20} />} 
          text="Dashboard" 
          onClick={handleNavigation}
        />
        {!isOperator && (
            <>
        <NavItem 
          active={activePage} 
          icon={<Users size={20} />} 
          text="User Management" 
          onClick={handleNavigation}
        />
        <NavItem 
          active={activePage} 
          icon={<Trash2 size={20} />} 
          text="Bin Management" 
          onClick={handleNavigation}
        />
        <NavItem 
          active={activePage} 
          icon={<BarChart2 size={20} />} 
          text="Data Analytics & Reports" 
          onClick={handleNavigation}
        />
        <NavItem 
          active={activePage} 
          icon={<Bell size={20} />} 
          text="Alerts & Notifications" 
          onClick={handleNavigation}
        />
        <NavItem 
          active={activePage} 
          icon={<Settings size={20} />} 
          text="System Settings" 
          onClick={handleNavigation}
        />
            </>
        )}
        <NavItem
            active={activePage}
            icon={<User size={20} />}
            text="Profile"
            onClick={handleNavigation}
          />
        </div>
        <div>
        <div className="flex justify-center text-xl">
      <NavItem
        active={activePage}
        icon={<LogOut size={25} />}
        text="Logout"
        onClick={handleLogoutClick}
      />
        </div>
        </div>
      </div>
    </div>
  );
}
