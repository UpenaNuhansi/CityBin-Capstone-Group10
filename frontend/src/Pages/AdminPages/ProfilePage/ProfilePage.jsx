import { useState } from 'react';
import { Check, Clock, Mail, Calendar } from 'lucide-react';
import ProfilePageContent from './ProfilePageContent';

export default function ProfilePage({ handleNavigation }) {
  console.log('ProfilePage component is rendering');
  const [activePage, setActivePage] = useState('ProfilePage');
  const [searchText, setSearchText] = useState('');

  // User data - would come from backend/authentication system
  const userData = {
    name: "John Smith",
    role: "Admin",
    status: "Active",
    lastLogin: "2025-05-15 14:03", // Updated to a recent date
    email: "john.smith@example.com", // Added email
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
    />
  );
}