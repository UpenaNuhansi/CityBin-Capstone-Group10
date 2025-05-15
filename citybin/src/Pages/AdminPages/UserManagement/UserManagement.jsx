import { useState } from 'react';
import UserManagementContent from './UserManagementContent';
import AddUserModal from '../../../Components/UserManagement/AddUserModal';
import EditUserModal from '../../../Components/UserManagement/EditUserModal';
import DeleteUserModal from '../../../Components/UserManagement/DeleteUserModal';
import Notification from '../../../Components/UserManagement/Notification';

// Sample user data
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

  const handleDeleteUser = (userId) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setShowDeleteDialog(true);
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditSave = () => {
    if (currentUser) {
      const updatedUsers = users.map(user => {
        if (user.id === currentUser.id) {
          return { ...user, name: editFormData.name, role: editFormData.role, status: editFormData.status };
        }
        return user;
      });
      setUsers(updatedUsers);
      setShowEditDialog(false);
      showNotification("User information successfully updated!", "success");
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

  return (
    <div>
   
      <div className="flex-1 flex flex-col ml-64">
        <UserManagementContent 
          users={users} 
          searchText={searchText} 
          setSearchText={setSearchText} 
          handleAddUser={handleAddUser} 
          handleEditUser={handleEditUser} 
          handleDeleteUser={handleDeleteUser} 
          handleNavigation={handleNavigation}
        />
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
    </div>
  );
}