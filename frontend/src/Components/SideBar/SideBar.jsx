import { BarChart2, Settings, Users, Trash2, Bell, LogOut, User } from 'lucide-react';

function NavItem({ active, icon, text, onClick }) {
  return (
    <div
      className={`flex items-center p-4 cursor-pointer transition-colors duration-200 rounded-lg ${active === text ? 'bg-green-600 border-l-4 border-white' : 'hover:bg-green-700'}`}
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
      <div className="p-4 text-xl font-bold border-b border-green-700">
        CityBin Admin
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-2">
        <NavItem 
          active={activePage === 'Dashboard'} 
          icon={<BarChart2 size={20} />} 
          text="Dashboard" 
          onClick={() => handleNavigation('Dashboard')}
        />
        {!isOperator && (
            <>
        <NavItem 
          active={activePage === 'User Management'} 
          icon={<Users size={20} />} 
          text="User Management" 
          onClick={() => handleNavigation('User Management')}
        />
        <NavItem 
          active={activePage === 'Bin Management'} 
          icon={<Trash2 size={20} />} 
          text="Bin Management" 
          onClick={() => handleNavigation('Bin Management')}
        />
        <NavItem 
          active={activePage === 'Data Analytics & Reports'} 
          icon={<BarChart2 size={20} />} 
          text="Data Analytics & Reports" 
          onClick={() => handleNavigation('Data Analytics & Reports')}
        />
        <NavItem 
          active={activePage === 'Alerts & Notifications'} 
          icon={<Bell size={20} />} 
          text="Alerts & Notifications" 
          onClick={() => handleNavigation('Alerts & Notifications')}
        />
        <NavItem 
          active={activePage === 'System Settings'} 
          icon={<Settings size={20} />} 
          text="System Settings" 
          onClick={() => handleNavigation('System Settings')}
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
      <NavItem
            active={activePage}
            icon={<LogOut size={20} />}
            text="Logout"
            onClick={handleLogoutClick}
          />
        </div>
      </div>
    </div>
  );
}
