import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import TopBar from '../../../Components/TopBar/TopBar';
import EditUserModal from '../../../Components/UserManagement/EditUserModal';
import DeleteUserModal from '../../../Components/UserManagement/DeleteUserModal';
import Notification from '../../../Components/UserManagement/Notification';
import api from '../../../api/axios';

export default function UserManagement({ handleNavigation }) {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ username: '', role: 'User', status: 'Active' });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('UserManagement: Fetching users');
    fetchUsers();
  }, []);

 const fetchUsers = async () => {
  try {
    setIsLoading(true);
    const res = await api.get('/users');
    console.log('Fetched users response:', res.data); // log the actual structure
    setUsers(res.data.data); // is this an array?
  } catch (err) {
    console.error('UserManagement: Fetch error', err);
    showNotification('Failed to fetch users', 'error');
  } finally {
    setIsLoading(false);
  }
};


  const handleEditUser = (userId) => {
    const user = users.find((u) => u._id === userId);
    if (user) {
      setCurrentUser(user);
      setEditFormData({ username: user.username, role: user.role, status: user.status });
      setShowEditDialog(true);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    try {
      const res = await api.put(`/users/${currentUser._id}`, editFormData);
      setUsers(users.map((user) => (user._id === currentUser._id ? res.data : user)));
      setShowEditDialog(false);
      showNotification('User successfully updated!', 'success');
    } catch (err) {
      console.error('UserManagement: Edit error', err.response?.data || err.message);
      showNotification('Failed to update user', 'error');
    }
  };

  const handleDeleteUser = (userId) => {
    const user = users.find((u) => u._id === userId);
    if (user) {
      setCurrentUser(user);
      setShowDeleteDialog(true);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/users/${currentUser._id}`);
      setUsers(users.filter((user) => user._id !== currentUser._id));
      setShowDeleteDialog(false);
      showNotification('User successfully deleted!', 'success');
    } catch (err) {
      console.error('UserManagement: Delete error', err.response?.data || err.message);
      showNotification('Failed to delete user', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

 const filteredUsers = Array.isArray(users)
  ? users.filter((user) => {
      const username = user.username?.toLowerCase() || '';
      const uniqueId = user.uniqueId?.toLowerCase() || '';
      const query = searchText.toLowerCase();
      return username.includes(query) || uniqueId.includes(query);
    })
  : [];



  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col ml-64">
        <TopBar
          title="User Management"
          searchText={searchText}
          setSearchText={setSearchText}
         
        />
        <div className="flex-1 p-4 bg-white flex items-center justify-center">
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col ml-64 bg-gray-100 min-h-screen">
      <TopBar
        title="User Management"
        searchText={searchText}
        setSearchText={setSearchText}
        onProfileClick={() => handleNavigation("Profile")}
      />
      <div className="flex-1 p-4 bg-white flex flex-col items-center">
        <div className="w-full max-w-6xl flex justify-end mb-4">
                  </div>
        <div className="bg-white shadow-md rounded-xl overflow-hidden border">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-green-100 font-roboto text-gray-700 text-left">
            <tr>
              <th className="py-3 px-4">Unique ID</th>
              <th className="py-3 px-4">Username</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Last Login</th>
              <th className="py-3 px-4 text-right">Actions</th>
              <th className="py-3 px-4"></th>

            </tr>
          </thead>
          <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 px-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`transition duration-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
                  >
                    <td className="py-3 px-4 border-t">{user.uniqueId}</td>
                    <td className="py-3 px-4 border-t">{user.username}</td>
                    <td className="py-3 px-4 border-t">{user.email}</td>
                    <td className="py-3 px-4 border-t">{user.role}</td>
                    <td className="py-3 px-4 border-t">{user.status}</td>
                    <td className="py-3 px-4 border-t">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 border-t">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                    </td>
                    <td className="py-3 px-4 border-t text-right">
                      <button
                        className="text-blue-600 hover:text-blue-800 font-medium mr-3 transition"
                        onClick={() => handleEditUser(user._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800 font-medium transition"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <EditUserModal
        show={showEditDialog}
        onCloseForm={() => setShowEditDialog(false)}
        formData={editFormData}
        onFormChange={handleEditFormChange}
        onSave={handleEditSave}
        currentUser={currentUser}
      />
      <DeleteUserModal
        show={showDeleteDialog}
        onCloseForm={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        currentUser={currentUser}
      />
      <Notification show={notification.show} message={notification.message} type={notification.type} />
    </div>
  );
}