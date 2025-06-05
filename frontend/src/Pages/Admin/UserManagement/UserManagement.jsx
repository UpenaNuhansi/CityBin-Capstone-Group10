import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import TopBar from '../../../Components/TopBar/TopBar';
import AddUserModal from '../../../Components/UserManagement/AddUserModal';
import EditUserModal from '../../../Components/UserManagement/EditUserModal';
import DeleteUserModal from '../../../Components/UserManagement/DeleteUserModal';
import Notification from '../../../Components/UserManagement/Notification';
// Axios instance
import api from '../../../api/axios';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ username: '', role: 'User', status: 'Active' });
  const [addFormData, setAddFormData] = useState({ username: '', role: 'User', email: '', password: '', status: 'Active' });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch users from backend on page load
  useEffect(() => {
    console.log('UserManagement: Fetching users');
    fetchUsers();
  }, []); 

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(res.data);
      console.log('UserManagement: Users fetched', res.data);
    } catch (err) {
      console.error('UserManagement: Fetch error', err);
      showNotification('Failed to fetch users', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = () => {
    setAddFormData({ username: '', role: 'User', email: '', password: '', status: 'Active' });
    setShowAddDialog(true);
  };

 const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSave = async () => {
    try {
      const res = await api.post('/users', addFormData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers([...users, res.data]);
      setShowAddDialog(false);
      showNotification('User successfully added!', 'success');
      console.log('UserManagement: User added', res.data);
    } catch (err) {
      console.error('UserManagement: Add error', err);
      showNotification('Failed to add user', 'error');
    }
  };

  const handleEditUser = (userId) => {
    const user = users.find((u) => u._id === userId);
    if (user) {
      setCurrentUser(user);
      setEditFormData({ username: user.username, role: user.role, status: user.status });
      setShowEditDialog(true);
      console.log('UserManagement: Editing user', userId);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    try {
      const res = await api.put(`/users/${currentUser._id}`, editFormData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(users.map((user) => (user._id === currentUser._id ? res.data : user)));
      setShowEditDialog(false);
      showNotification('User successfully updated!', 'success');
      console.log('UserManagement: User updated', res.data);
    } catch (err) {
      console.error('UserManagement: Edit error', err);
      showNotification('Failed to update user', 'error');
    }
  };

  const handleDeleteUser = (userId) => {
    const user = users.find((u) => u._id === userId);
    if (user) {
      setCurrentUser(user);
      setShowDeleteDialog(true);
      console.log('UserManagement: Deleting user', userId);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/users/${currentUser._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(users.filter((user) => user._id !== currentUser._id));
      setShowDeleteDialog(false);
      showNotification('User successfully deleted!', 'success');
      console.log('UserManagement: User deleted', currentUser._id);
    } catch (err) {
      console.error('UserManagement: Delete error', err);
      showNotification('Failed to delete user', 'error');
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchText.toLowerCase()) ||
      user._id.toLowerCase().includes(searchText.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col ml-64">
        <TopBar
          title="User Management"
          searchText={searchText}
          setSearchText={setSearchText}
          onProfileClick={() => {}}
        />
        <div className="flex-1 p-4 bg-white flex items-center justify-center">
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col ml-64">
      <TopBar
        title="User Management"
        searchText={searchText}
        setSearchText={setSearchText}
        onProfileClick={() => {}}
      />
      <div className="flex-1 p-4 bg-white flex flex-col items-center">
        <div className="w-full max-w-4xl flex justify-end mb-4">
          <button
            className="bg-green-700 text-white px-4 py-2 rounded flex items-center hover:bg-green-800 transition-colors duration-200"
            onClick={handleAddUser}
          >
            <Plus size={18} className="mr-1" />
            Add User
          </button>
        </div>
        <div className="w-full max-w-4xl border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-green-100">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Last Login</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-3 px-4 text-center text-gray-600">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-green-50' : 'bg-white'}`}
                  >
                    <td className="py-3 px-4 border-t">{user._id}</td>
                    <td className="py-3 px-4 border-t">{user.username}</td>
                    <td className="py-3 px-4 border-t">{user.role}</td>
                    <td className="py-3 px-4 border-t">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-sm ${
                          user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
                        className="text-blue-600 hover:text-blue-500 mr-3"
                        onClick={() => handleEditUser(user._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:text-red-500"
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
      <AddUserModal
        show={showAddDialog}
        onCloseForm={() => setShowAddDialog(false)}
        formData={addFormData}
        onFormChange={handleAddFormChange}
        onSave={handleAddSave}
      />
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