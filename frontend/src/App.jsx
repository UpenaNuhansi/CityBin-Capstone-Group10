import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate, Outlet } from 'react-router-dom';
import ErrorBoundary from './Components/ErrorBoundary';
import api from './api/axios';

// Common Pages
import LandingPage from './Pages/LandingPage';
import LoginForm from './Pages/LoginForm';
import RegisterForm from './Pages/RegisterForm';

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
  const user = JSON.parse(localStorage.getItem('user') || '{}');

useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token){
    navigate('/login', { replace: true });
    return;
  } 

  if (user.role === 'Operator') {
    if (!['/admin/dashboard', '/admin/profile'].includes(location.pathname)) {
      navigate('/admin/dashboard', { replace: true });
    }
  }
}, [location.pathname, navigate, user.role]);


  const handleLogoutClick = () => setIsLogoutModalOpen(true);
  const handleConfirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('');
    setIsLogoutModalOpen(false);
    navigate('/login');
  };
  const handleCancelLogout = () => setIsLogoutModalOpen(false);

  const getActivePage = () => {
    const path = location.pathname;
    const pageMap = {
      '/admin/dashboard': 'Dashboard',
      '/admin/user-management': 'User Management',
      '/admin/bin-management': 'Bin Management',
      '/admin/alerts-notifications': 'Alerts & Notifications',
      '/admin/data-analytics-reports': 'Data Analytics & Reports',
      '/admin/system-settings': 'System Settings',
      '/admin/profile': 'Profile'
    };
    return pageMap[path] || 'Dashboard';
  };

  const handleNavigation = (page) => {
    console.log('SideBar: Navigating to', page);
    const routes = {
      'Dashboard': '/admin/dashboard',
      'User Management': '/admin/user-management',
      'Bin Management': '/admin/bin-management',
      'Alerts & Notifications': '/admin/alerts-notifications',
      'Data Analytics & Reports': '/admin/data-analytics-reports',
      'System Settings': '/admin/system-settings',
      'Profile': '/admin/profile'
    };
    if (user.role === 'Operator' && !['Dashboard', 'Profile'].includes(page)) {
      alert('Access denied. Operators can only access Dashboard and Profile.');
      return;
    }
    const target = routes[page] || '/admin/dashboard';
    if (location.pathname !== target) {
      navigate(target);
    }
  };

  if (!user.role || !['Admin', 'Operator'].includes(user.role)) {
    console.log('AdminLayoutWrapper: Invalid role, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <div className="flex h-screen bg-white">
        <SideBar
          user={user}
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

const UserLayoutWrapper = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || user.role !== 'User') {
      navigate('/login', { replace: true });
    }
  }, [navigate, user.role]);

  const handleLogoutClick = () => setIsLogoutModalOpen(true);
  
  const handleConfirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLogoutModalOpen(false);
    navigate('/login');
  };

  const handleCancelLogout = () => setIsLogoutModalOpen(false);

  if (!user.role || user.role !== 'User') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout handleLogoutClick={handleLogoutClick}>
      <Outlet />
      {isLogoutModalOpen && (
        <LogoutModal
          show={isLogoutModalOpen}
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
        />
      )}
    </Layout>
  );
};

function App() {
  
  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = currentUser?.userId;
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminLayoutWrapper />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
          <Route path="user-management" element={<ErrorBoundary><UserManagement /></ErrorBoundary>} />
          <Route path="bin-management" element={<ErrorBoundary><BinManagement /></ErrorBoundary>} />
          <Route path="alerts-notifications" element={<ErrorBoundary><AlertsNotifications /></ErrorBoundary>} />
          <Route path="data-analytics-reports" element={<ErrorBoundary><DataAnalyticsReports /></ErrorBoundary>} />
          <Route path="system-settings" element={<ErrorBoundary><SystemSettings /></ErrorBoundary>} />
          <Route path="profile" element={<ErrorBoundary><ProfilePage /></ErrorBoundary>} />
        </Route>

      
        {/*User Pages*/}
        <Route path="/user/*" element={<UserLayoutWrapper />}>
          <Route index element={<HomePage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="report" element={<ReportPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="alerts" element={<AlertsPage user={currentUser}/>} />
        </Route>
        
         {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
        {/* <Route path="/" element={<Navigate to={token ? 'dashboard' : '/login'} />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
