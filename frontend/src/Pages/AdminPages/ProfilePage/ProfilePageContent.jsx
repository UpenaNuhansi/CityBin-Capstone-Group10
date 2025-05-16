import { BarChart2, Bell, Settings, Users, Trash2, LogOut, User, ChevronRight, Edit } from 'lucide-react';
import TopBar from '../../../Components/TopBar/TopBar';

export default function ProfilePageContent({
  activePage,
  searchText,
  setSearchText,
  userData,
  menuItems,
  handleNavigation,
  handleLogout,
}) {
  return (
    <div className="flex h-screen bg-white">
      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Top Bar */}
        <div>
          <TopBar
            title="Profile"
            searchText={searchText}
            setSearchText={setSearchText}
            onProfileClick={() => handleNavigation('ProfilePage')}
          />
        </div>

        {/* Profile Content */}
        <div className="flex-1 p-6 bg-gray-100 flex justify-center items-start pt-12">
          <div className="w-96 bg-white rounded-lg shadow overflow-hidden">
            {/* Profile Header */}
            <div className="flex flex-col items-center p-6 border-b border-gray-200">
              <div className="w-20 h-20 bg-green-700 rounded-full flex items-center justify-center text-white mb-4">
                {userData.profileImage ? (
                  <img 
                    src={userData.profileImage} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover" 
                  />
                ) : (
                  <User size={40} />
                )}
              </div>
              <h2 className="text-xl font-bold">{userData.name}</h2>
              <p className="text-gray-600">{userData.role}</p>
            </div>

            {/* Profile Menu Items */}
            <div className="divide-y divide-gray-200">
              {menuItems.map((item, index) => (
                <div 
                  key={index}
                  className="p-4 hover:bg-gray-50 cursor-pointer flex items-center"
                  onClick={item.action}
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 mr-3">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              ))}
            </div>

            {/* Edit profile Button */}
            <div className="p-4 border-t border-gray-200 flex justify-center">
              <button 
                className="flex items-center justify-center text-green-700 hover:bg-green-50 p-2 rounded transition-colors duration-200 w-full"
                onClick={handleLogout}
              >
                <Edit size={20} className="mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}