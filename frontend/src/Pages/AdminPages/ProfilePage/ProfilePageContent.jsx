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
  showEditModal,
  setShowEditModal,
  editUserData,
  setEditUserData,
  handleEditUser,
  handleCancelEdit,
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
                  
                </div>
              ))}
            </div>

            {/* Edit profile Button */}
            <div className="p-4 border-t border-gray-200 flex justify-center">
              <button 
                className="flex items-center justify-center text-green-700 hover:bg-green-50 p-2 rounded transition-colors duration-200 w-full"
                onClick={() => setShowEditModal(true)}
              >
                <Edit size={20} className="mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
        </div>
        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editUserData.name}
                    onChange={(e) => setEditUserData({ ...editUserData, name: e.target.value })}
                    className="w-full bg-gray-100 rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editUserData.email}
                    onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                    className="w-full bg-gray-100 rounded p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition-colors duration-200"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 transition-colors duration-200"
                  onClick={handleEditUser}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}