import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';



// Common Pages
import SignUp from './Pages/Auth/SignUp';
import SignIn from './Pages/Auth/SignIn';

// Admin Pages
import SideBar from './Components/SideBar/SideBar';
import Dashboard from './Pages/Admin/Dashboard/Dashboard';
import UserManagement from './Pages/Admin/UserManagement/UserManagement';
import AlertsNotifications from './Pages/Admin/AlertsNotifications/AlertsNotifications';
import SystemSettings from './Pages/Admin/SystemSettings/SystemSettings';
import DataAnalyticsReports from './Pages/Admin/DataAnalyticsReports/DataAnalyticsReports';
import ProfilePage from './Pages/Admin/ProfilePage/ProfilePage';
import LogoutModal from './Components/LogoutModal/LogoutModal';

//User Pages

import HomePage from './Pages/User/Home/HomePage';
import ReportPage from './Pages/User/Home/ReportPage';
import SettingsPage from './Pages/User/Home/SettingsPage';
import AlertsPage from './Pages/User/Home/AlertsPage';
import Header from './Components/Header/Header';
import Layout from './Components/Layout/Layout';
import Sidebar from './Components/side_bar/Sidebar';



// Layout for Admin Section
const AdminLayout = ({ activePage, handleNavigation, handleLogoutClick }) => (
  <div className="flex h-screen bg-white">
    <SideBar activePage={activePage} handleNavigation={handleNavigation} handleLogoutClick={handleLogoutClick} />
    <div className="flex-1 flex-col">
      {activePage === 'Dashboard' && <Dashboard handleNavigation={handleNavigation} />}
      {activePage === 'User Management' && <UserManagement handleNavigation={handleNavigation} />}
      {activePage === 'Alerts & Notifications' && <AlertsNotifications handleNavigation={handleNavigation} />}
      {activePage === 'Data Analytics & Reports' && <DataAnalyticsReports handleNavigation={handleNavigation} />}
      {activePage === 'System Settings' && <SystemSettings handleNavigation={handleNavigation} />}
      {activePage === 'Profile' && <ProfilePage handleNavigation={handleNavigation} />}
    </div>
  </div>
);

export default function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleNavigation = (page) => setActivePage(page);
  const handleLogoutClick = () => setIsLogoutModalOpen(true);
  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    console.log('Logged out');
    // Navigate to sign-in page (optional)
  };
  const handleCancelLogout = () => setIsLogoutModalOpen(false);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Admin Route */}
        <Route
          path="/admin/*"
          element={
            <>
              <AdminLayout
                activePage={activePage}
                handleNavigation={handleNavigation}
                handleLogoutClick={handleLogoutClick}
              />
              {isLogoutModalOpen && (
                <LogoutModal
                  show={isLogoutModalOpen}
                  onConfirm={handleConfirmLogout}
                  onCancel={handleCancelLogout}
                />
              )}
            </>
          }
        />

        {/* User Route */}
      
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="report" element={<ReportPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="alerts" element={<AlertsPage />} />
      </Route>
    
   
      </Routes>
    </Router>
  );
}
