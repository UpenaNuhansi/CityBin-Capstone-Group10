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
  const [editFormData, setEditFormData] = useState({ username: '', role: 'Operator', status: 'Active' });
  const [addFormData, setAddFormData] = useState({ username: '', role: 'Operator', email:'', password:'',status: 'Active' });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Fetch users from backend on page load
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      showNotification("Failed to fetch users", "error");
    }
  };

  const handleAddUser = () => {
    setAddFormData({ username: '', role: 'Operator', status: 'Active' });
    setShowAddDialog(true);
  };

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddFormData({ ...addFormData, [name]: value });
  };

  const handleAddSave = async () => {
    try {
      const res = await api.post('/users', addFormData);
      setUsers([...users, res.data]);
      setShowAddDialog(false);
      showNotification("User successfully added!", "success");
    } catch (err) {
      console.error(err);
      showNotification("Failed to add user", "error");
    }
  };

  const handleEditUser = (userId) => {
    const user = users.find(u => u._id === userId);
    if (user) {
      setCurrentUser(user);
      setEditFormData({ username: user.username, role: user.role, status: user.status });
      setShowEditDialog(true);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditSave = async () => {
    try {
      const res = await api.put(`/users/${currentUser._id}`, editFormData);
      const updatedUsers = users.map(user =>
        user._id === currentUser._id ? res.data : user
      );
      setUsers(updatedUsers);
      setShowEditDialog(false);
      showNotification("User successfully updated!", "success");
    } catch (err) {
      console.error(err);
      showNotification("Failed to update user", "error");
    }
  };

  const handleDeleteUser = (userId) => {
    const user = users.find(u => u._id === userId);
    if (user) {
      setCurrentUser(user);
      setShowDeleteDialog(true);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/users/${currentUser._id}`);
      setUsers(users.filter(user => user._id !== currentUser._id));
      setShowDeleteDialog(false);
      showNotification("User successfully deleted!", "success");
    } catch (err) {
      console.error(err);
      showNotification("Failed to delete user", "error");
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchText.toLowerCase())
  );

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
                  key={user._id}
                  className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-green-50' : 'bg-white'}`}
                >
                  <td className="py-3 px-4 border-t">{user.username}</td>
                  <td className="py-3 px-4 border-t">{user.role}</td>
                  <td className="py-3 px-4 border-t">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-t">{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</td>
                  <td className="py-3 px-4 border-t text-right">
                    <button
                      className="text-blue-600 hover:text-blue-800 mr-3"
                      onClick={() => handleEditUser(user._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDeleteUser(user._id)}
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

      {/* Modals and Notifications */}
      <AddUserModal
        show={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        formData={addFormData}
        onFormChange={handleAddFormChange}
        onSave={handleAddSave}
      />
      <EditUserModal
        show={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        formData={editFormData}
        onFormChange={handleEditFormChange}
        onSave={handleEditSave}
        currentUser={currentUser}
      />
      <DeleteUserModal
        show={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        currentUser={currentUser}
      />
      <Notification
        show={notification.show}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
}
