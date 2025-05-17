import { useState } from 'react';
import { Check, Clock, Mail, Calendar } from 'lucide-react';
import ProfilePageContent from './ProfilePageContent';

export default function ProfilePage({ handleNavigation }) {
  // console.log('ProfilePage component is rendering');
  const [activePage, setActivePage] = useState('ProfilePage');
  const [searchText, setSearchText] = useState('');
  const [showEditModal, setShowEditModal] = useState(false); // State for edit modal
  const [editUserData, setEditUserData] = useState({
    name: "John Smith",
    email: "john.smith@example.com",
  });


  // User data - would come from backend/authentication system
  const userData = {
    name: editUserData.name,
    // name: "John Smith",
    role: "Admin",
    status: "Active",
    lastLogin: "2025-05-15 14:03", // Updated to a recent date
    email: editUserData.email,
    // email: "john.smith@example.com", // Added email
    accountCreated: "2024-01-10", // Added account creation date
    profileImage: null // Placeholder for profile image
  };

  const handlePageNavigation = (page) => {
    setActivePage(page);
    handleNavigation(page);
  };

  const handleLogout = () => {
    console.log('User logged out');
    // Implement actual logout functionality here
    // e.g. clearAuthToken(), redirect to login page, etc.
  };


  const handleEditUser = () => {
    //validation of basic info
    if (!editUserData.name.trim() || !editUserData.email.trim()) {
      console.log('Error: Name and email cannot be empty');
      return;
    }
    console.log('User data updated:', editUserData);
    setShowEditModal(false);
  };

  const handleCancelEdit = () => {
    console.log('Edit cancelled, reverting changes');
    // Reset form data to original values
    setEditUserData({
      name: userData.name,
      email: userData.email,
    });
    setShowEditModal(false);
  };


  // Menu items for profile actions
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
    <ProfilePageContent
      activePage={activePage}
      searchText={searchText}
      setSearchText={setSearchText}
      userData={userData}
      menuItems={menuItems}
      handleNavigation={handlePageNavigation}
      handleLogout={handleLogout}
      showEditModal={showEditModal}
      setShowEditModal={setShowEditModal}
      editUserData={editUserData}
      setEditUserData={setEditUserData}
      handleEditUser={handleEditUser}
      handleCancelEdit={handleCancelEdit}
    />
  );
}