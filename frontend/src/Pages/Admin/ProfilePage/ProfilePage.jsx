import { useEffect, useState } from 'react';
import { User, Mail, Shield, Calendar } from 'lucide-react';
import TopBar from '../../../Components/TopBar/TopBar';

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
        <div className="flex-1 p-4 flex items-center justify-center bg-gray-100">
          <p className="text-gray-500 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col ml-64 mt-18 min-h-screen bg-gray-100">
      <TopBar
        title="Profile"
        searchText={searchText}
        setSearchText={setSearchText}
        onProfileClick={() => {}}
      />

      <div className="p-6 max-w-4xl mx-auto w-full">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-900 to-green-800 px-6 py-5">
            <h2 className="text-2xl font-bold text-white">User Profile</h2>
          </div>

          {/* Info Content */}
          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username */}
              <InfoItem icon={<User className="text-green-700" />} label="Username" value={user.username} />
              {/* Email */}
              <InfoItem icon={<Mail className="text-green-700" />} label="Email" value={user.email} />
              {/* Role */}
              <InfoItem icon={<Shield className="text-green-700" />} label="Role" value={user.role?.toLowerCase()} />
              {/* Last Login */}
              <InfoItem
                icon={<Calendar className="text-green-700" />}
                label="Last Login"
                value={user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never logged in'}
              />
            </div>

            {/* Account Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Details</h3>
              <div className="space-y-4">
                <DetailRow
                  label="Account Status"
                  value={user.status || 'Active'}
                  isBadge={true}
                />
                <DetailRow
                  label="Member Since"
                  value={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🧩 Small reusable item block with icon
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center space-x-4">
      <div className="bg-green-100 p-3 rounded-full">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-base font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}

// 🧩 Reusable row for account details
function DetailRow({ label, value, isBadge }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600">{label}</span>
      {isBadge ? (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium 
            ${value === 'Active'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'}`}
        >
          {value}
        </span>
      ) : (
        <span className="text-gray-800">{value}</span>
      )}
    </div>
  );
}