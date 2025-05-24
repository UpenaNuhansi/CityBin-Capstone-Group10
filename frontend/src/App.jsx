import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate, Outlet } from 'react-router-dom';

// Common Pages
import LandingPage from './pages/LandingPage';
import LoginForm from './pages/LoginForm';
import RegisterForm from './pages/RegisterForm';

// Admin Pages
import SideBar from './Components/SideBar/SideBar';
import Dashboard from './Pages/Admin/Dashboard/Dashboard';
import UserManagement from './Pages/Admin/UserManagement/UserManagement';
import BinManagement from './Pages/Admin/BinManagement/BinManagement';
import AlertsNotifications from './Pages/Admin/AlertsNotifications/AlertsNotifications';
import SystemSettings from './Pages/Admin/SystemSettings/SystemSettings';
import DataAnalyticsReports from './Pages/Admin/DataAnalyticsReports/DataAnalyticsReports';
import ProfilePage from './Pages/Admin/ProfilePage/ProfilePage';
import LogoutModal from './Components/LogoutModal/LogoutModal';

// User Pages
import HomePage from './Pages/User/Home/HomePage';
import ReportPage from './Pages/User/Home/ReportPage';
import SettingsPage from './Pages/User/Home/SettingsPage';
import AlertsPage from './Pages/User/Home/AlertsPage';
import Header from './Components/Header/Header';
import Layout from './Components/Layout/Layout';
import Sidebar from './Components/side_bar/Sidebar';



//ADMIN LAYOUT WRAPPER WITH LOGIC AND OUTLET SUPPORT
const AdminLayoutWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutClick = () => setIsLogoutModalOpen(true);
  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    window.location.href = '/login';
  };
  const handleCancelLogout = () => setIsLogoutModalOpen(false);

  const getActivePage = () => {
    const path = location.pathname;
    if (path.includes('/admin/dashboard')) return 'Dashboard';
    if (path.includes('/admin/user-management')) return 'User Management';
    if (path.includes('/admin/bin-management')) return 'Bin Management';
    if (path.includes('/admin/alerts-notifications')) return 'Alerts & Notifications';
    if (path.includes('/admin/data-analytics-reports')) return 'Data Analytics & Reports';
    if (path.includes('/admin/system-settings')) return 'System Settings';
    if (path.includes('/admin/profile')) return 'Profile';
    return 'Dashboard';
  };

  const handleNavigation = (page) => {
    switch (page) {
      case 'Dashboard':
        navigate('/admin/dashboard');
        break;
      case 'User Management':
        navigate('/admin/user-management');
        break;
      case 'Bin Management':
        navigate('/admin/bin-management');
        break;
      case 'Alerts & Notifications':
        navigate('/admin/alerts-notifications');
        break;
      case 'Data Analytics & Reports':
        navigate('/admin/data-analytics-reports');
        break;
      case 'System Settings':
        navigate('/admin/system-settings');
        break;
      case 'Profile':
        navigate('/admin/profile');
        break;
      default:
        navigate('/admin/dashboard');
    }
  };

  return (
    <>
      <div className="flex h-screen bg-white">
        <SideBar
          activePage={getActivePage()}
          handleNavigation={handleNavigation}
          handleLogoutClick={handleLogoutClick}
        />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
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
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/*Admin Pages with Admin Layout and Nested Routing */}
       <Route path="/admin/*" element={<AdminLayoutWrapper />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="user-management" element={<UserManagement />} />
        <Route path="bin-management" element={<BinManagement />} />
        <Route path="alerts-notifications" element={<AlertsNotifications />} />
        <Route path="data-analytics-reports" element={<DataAnalyticsReports />} />
        <Route path="system-settings" element={<SystemSettings />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      
        {/*User Pages*/}
        <Route path="/user/*" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="report" element={<ReportPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="alerts" element={<AlertsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
