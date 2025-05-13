import { BarChart2, Settings, Users, Trash2, Bell, LogOut } from 'lucide-react';

export default function SideBar({ activePage, handleNavigation, handleLogoutClick }) {
  return (
    <div className="w-64 bg-green-700 text-white flex flex-col h-full fixed left-0 top-0">
      <div className="p-4 text-2xl font-bold border-b border-green-600 text-center">CityBin</div>
      <nav className="flex-1">
        <NavItem 
          active={activePage === 'Dashboard'} 
          icon={<BarChart2 size={20} />} 
          text="Dashboard" 
          onClick={() => handleNavigation('Dashboard')}
        />
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
      </nav>
      <div className="p-4 border-t border-green-600 flex justify-center">
        <button className="flex items-center justify-center text-white hover:bg-green-800 p-2 rounded transition-colors duration-200 w-full" onClick={handleLogoutClick}>
          <LogOut size={20} className="mr-2" />
          Log Out
        </button>
      </div>
    </div>
  );
}

function NavItem({ icon, text, active, onClick }) {
  return (
    <div 
      className={`p-4 flex items-center cursor-pointer transition-colors duration-200 ${active ? 'bg-green-900' : 'hover:bg-green-600'}`}
      onClick={onClick}
    >
      <span className="mr-2">{icon}</span>
      <span>{text}</span>
      {active && <span className="ml-auto">›</span>}
    </div>
  );
}
