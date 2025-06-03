import { useEffect, useState } from 'react';
import { User, Mail, Shield, Calendar, Clock } from 'lucide-react';
import TopBar from '../../../Components/TopBar/TopBar';
import api from '../../../api/axios';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser);
  }, []);

  if (!user) {
    return (
      <div className="flex-1 flex flex-col ml-64">
        <TopBar
          title="Profile"
          searchText={searchText}
          setSearchText={setSearchText}
          onProfileClick={() => {}}
        />
        <div className="flex-1 p-4 bg-white flex items-center justify-center">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col ml-64">
      <TopBar
        title="Profile"
        searchText={searchText}
        setSearchText={setSearchText}
        onProfileClick={() => {}}
      />
      
      <div className="flex-1 p-4 bg-white">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-green-800 p-6 text-white">
            <h1 className="text-2xl font-bold">User Profile</h1>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <User className="text-green-800" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Username</p>
                  <p className="font-medium">{user.username}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Mail className="text-green-800" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Shield className="text-green-800" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium capitalize">{user.role.toLowerCase()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Calendar className="text-green-800" size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Login</p>
                  <p className="font-medium">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never logged in'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Details</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Account Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status || 'Active'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member Since</span>
                  <span className="text-gray-800">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

//need to profile edit option and reset password functionality