import { User, Plus } from 'lucide-react';

export default function UserManagementContent({ users, searchText, setSearchText, handleAddUser, handleEditUser, handleDeleteUser, handleNavigation }) {
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white p-4 border-b flex justify-between items-center sticky top-0 z-10">
        <div className="text-xl font-bold">User Management</div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search something"
            className="bg-gray-200 rounded-full pl-8 pr-4 py-1 w-64 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <span className="absolute left-2 top-2 text-gray-500">🔍</span>
        </div>
        <div 
          className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-green-800 transition-colors duration-200"
          onClick={() => handleNavigation('Profile')}
        >
          <User size={18} />
        </div>
      </div>
            {/* User Management Content */}
      <div className="flex-1 p-4 bg-white flex flex-col items-center">
        {/* Header with Add User Button */}
        <div className="w-full max-w-4xl flex justify-end mb-4">
          <button 
            className="bg-green-700 text-white px-4 py-2 rounded flex items-center hover:bg-green-800 transition-colors duration-200"
            onClick={handleAddUser}
          >
            <Plus size={18} className="mr-1" />
            Add User
          </button>
        </div>
        
        {/* Users Table */}
        <div className="w-full max-w-4xl border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-green-100">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Last Login</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr 
                  key={user.id} 
                  className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-green-50' : 'bg-white'}`}
                >
                  <td className="py-3 px-4 border-t">{user.name}</td>
                  <td className="py-3 px-4 border-t">{user.role}</td>
                  <td className="py-3 px-4 border-t">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-t">{user.lastLogin}</td>
                  <td className="py-3 px-4 border-t text-right">
                    <button 
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      onClick={() => handleEditUser(user.id)}
                    >
                      Edit
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}