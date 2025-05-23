import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Common Pages
import LandingPage from './pages/LandingPage'
import LoginForm from './pages/LoginForm'
import RegisterForm from './pages/RegisterForm'

// Admin Pages
import SideBar from './Components/SideBar/SideBar';
import Dashboard from './Pages/Admin/Dashboard/Dashboard';
import UserManagement from './Pages/Admin/UserManagement/UserManagement';
import AlertsNotifications from './Pages/Admin/AlertsNotifications/AlertsNotifications';
import SystemSettings from './Pages/Admin/SystemSettings/SystemSettings';
import DataAnalyticsReports from './Pages/Admin/DataAnalyticsReports/DataAnalyticsReports';
import ProfilePage from './Pages/Admin/ProfilePage/ProfilePage';
import LogoutModal from './Components/LogoutModal/LogoutModal';


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

// Layout for User Section with proper routing
const UserLayoutWrapper = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const location = useLocation();
  
  const handleLogoutClick = () => setIsLogoutModalOpen(true);
  
  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    console.log('Logged out');
    // Navigate to sign-in page (optional)
  };
  
  const handleCancelLogout = () => setIsLogoutModalOpen(false);

  // Determine active page based on current route
  const getActivePage = () => {
    const path = location.pathname;
    if (path.includes('/user/home')) return 'Home';
    if (path.includes('/user/report')) return 'Report';
    if (path.includes('/user/settings')) return 'Settings';
    if (path.includes('/user/alerts')) return 'Alerts';
    return 'Home';
  };

  return (
    <>
      <div className="flex h-screen bg-white">
        <Sidebar 
          activePage={getActivePage()} 
          handleLogoutClick={handleLogoutClick} 
        />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1">
            <Routes>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<HomePage />} />
              <Route path="report" element={<ReportPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="alerts" element={<AlertsPage />} />
            </Routes>
          </div>
        </div>
      </div>
      {isLogoutModalOpen && (
        <LogoutModal
          show={isLogoutModalOpen}
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
        />
      )}
    </>
  );
};

export default function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleNavigation = (page) => setActivePage(page);
  const handleLogoutClick = () => setIsLogoutModalOpen(true);
  
  const handleConfirmLogout = () => {    setIsLogoutModalOpen(false);
    console.log('Logged out');
    // Navigate to sign-in page (optional)
  };
  
  const handleCancelLogout = () => setIsLogoutModalOpen(false);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
         <Route path="/login" element={<LoginForm />} />
        
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/" element={<LandingPage />} />

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

user_pages_development
        {/* User Routes - Now properly connected */}
        <Route path="/user/*" element={<UserLayoutWrapper />} />

        {/* User Route */}
      
      <Route path="/user/*" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="report" element={<ReportPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="alerts" element={<AlertsPage />} />
        </Route>
    
 dev
      </Routes>
    </Router>
  );
}