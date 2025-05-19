import { useState } from 'react';
import { User, Plus, Search } from 'lucide-react';
import TopBar from '../../../Components/TopBar/TopBar';
import AddUserModal from '../../../Components/UserManagement/AddUserModal';
import EditUserModal from '../../../Components/UserManagement/EditUserModal';
import DeleteUserModal from '../../../Components/UserManagement/DeleteUserModal';
import Notification from '../../../Components/UserManagement/Notification';

const initialUsers = [
  { id: 1, name: 'John Smith', role: 'Admin', status: 'Active', lastLogin: '2024-04-17 10:03' },
  { id: 2, name: 'Jessica Lee', role: 'Operator', status: 'Inactive', lastLogin: '2024-04-12 15:42' },
  { id: 3, name: 'Mohammed Ali', role: 'Manager', status: 'Active', lastLogin: '2024-04-16 19:01' },
  { id: 4, name: 'Anna Chan', role: 'Operator', status: 'Active', lastLogin: '2024-04-18 07:44' },
  { id: 5, name: 'Pavel Ivanov', role: 'Admin', status: 'Active', lastLogin: '2024-04-15 18:37' },
];

export default function UserManagement() {
  const [users, setUsers] = useState(initialUsers);
  const [searchText, setSearchText] = useState('');
  const [activePage, setActivePage] = useState('User Management');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', role: 'Operator', status: 'Active' });
  const [addFormData, setAddFormData] = useState({ name: '', role: 'Operator', status: 'Active' });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const handleNavigation = (page) => {
    setActivePage(page);
    console.log(`Navigating to ${page}`);
  };

  const handleAddUser = () => {
    setAddFormData({ name: '', role: 'Operator', status: 'Active' });
    setShowAddDialog(true);
  };

  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddFormData({ ...addFormData, [name]: value });
  };

  const handleAddSave = () => {
    if (addFormData.name.trim()) {
      const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        name: addFormData.name,
        role: addFormData.role,
        status: addFormData.status,
        lastLogin: 'Never'
      };
      setUsers([...users, newUser]);
      setShowAddDialog(false);
      showNotification("User successfully added!", "success");
    }
  };

  const handleEditUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setEditFormData({ name: user.name, role: user.role, status: user.status });
      setShowEditDialog(true);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditSave = () => {
    if (currentUser) {
      const updatedUsers = users.map(user =>
        user.id === currentUser.id
          ? { ...user, name: editFormData.name, role: editFormData.role, status: editFormData.status }
          : user
      );
      setUsers(updatedUsers);
      setShowEditDialog(false);
      showNotification("User information successfully updated!", "success");
    }
  };

  const handleDeleteUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setShowDeleteDialog(true);
    }
  };

  const handleConfirmDelete = () => {
    if (currentUser) {
      setUsers(users.filter(user => user.id !== currentUser.id));
      setShowDeleteDialog(false);
      showNotification("User successfully deleted!", "success");
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col ml-64">
      {/* Top Bar */}
      <TopBar
        title="User Management"
        searchText={searchText}
        setSearchText={setSearchText}
        onProfileClick={() => handleNavigation("Profile")}
      />

      {/* User Management Content */}
      <div className="flex-1 p-4 bg-white flex flex-col items-center">
        {/* Add User Button */}
        <div className="w-full max-w-4xl flex justify-end mb-4">
          <button
            className="bg-green-700 text-white px-4 py-2 rounded flex items-center hover:bg-green-800 transition-colors duration-200"
            onClick={handleAddUser}
          >
            <Plus size={18} className="mr-1" />
            Add User
          </button>
        </div>

        {/* User Table */}
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
