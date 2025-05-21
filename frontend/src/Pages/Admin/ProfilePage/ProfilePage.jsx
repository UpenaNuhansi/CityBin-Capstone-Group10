import { useState } from 'react';
import { Check, Clock, Mail, Calendar, BarChart2, Bell, Settings, Users, Trash2, LogOut, User, Edit } from 'lucide-react';
import TopBar from '../../../Components/TopBar/TopBar';

export default function ProfilePage({ handleNavigation }) {
  const [activePage, setActivePage] = useState('ProfilePage');
  const [searchText, setSearchText] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUserData, setEditUserData] = useState({
    name: "John Smith",
    email: "john.smith@example.com",
  });

  const userData = {
    name: editUserData.name,
    role: "Admin",
    status: "Active",
    lastLogin: "2025-05-15 14:03",
    email: editUserData.email,
    accountCreated: "2024-01-10",
    profileImage: null
  };

  const handlePageNavigation = (page) => {
    setActivePage(page);
    handleNavigation(page);
  };

  const handleLogout = () => {
    console.log('User logged out');
  };

  const handleEditUser = () => {
    if (!editUserData.name.trim() || !editUserData.email.trim()) {
      console.log('Error: Name and email cannot be empty');
      return;
    }
    console.log('User data updated:', editUserData);
    setShowEditModal(false);
  };

  const handleCancelEdit = () => {
    console.log('Edit cancelled, reverting changes');
    setEditUserData({
      name: userData.name,
      email: userData.email,
    });
    setShowEditModal(false);
  };

  const menuItems = [
    {
      icon: <Check size={18} />,
      label: "Status",
      description: userData.status,
      action: () => console.log("Status clicked")
    },
    {
      icon: <Clock size={18} />,
      label: "Last Login",
      description: userData.lastLogin,
      action: () => console.log("Login info clicked")
    },
    {
      icon: <Mail size={18} />,
      label: "Email Address",
      description: userData.email,
      action: () => console.log("Email clicked")
    },
    {
      icon: <Calendar size={18} />,
      label: "Account Created",
      description: userData.accountCreated,
      action: () => console.log("Account created clicked")
    }
  ];

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col ml-64">
        <div>
          <TopBar
            title="Profile"
            searchText={searchText}
            setSearchText={setSearchText}
            onProfileClick={() => handlePageNavigation('ProfilePage')}
          />
        </div>

        <div className="flex-1 p-6 bg-gray-100 flex justify-center items-start pt-12">
          <div className="w-96 bg-white rounded-lg shadow overflow-hidden">
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
                  onClick={handleCancelEdit}
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
