import React, {useState} from 'react';
import SideBar from './Components/SideBar/SideBar';
import Dashboard from './Pages/AdminPages/Dashboard/Dashboard';
import LogoutModal from './Components/LogoutModal/LogoutModal';
import UserManagement from './Pages/AdminPages/UserManagement/UserManagement'; 
import AlertsNotifications from './Pages/AdminPages/AlertsNotifications/AlertsNotifications';
import SystemSettings from './Pages/AdminPages/SystemSettings/SystemSettings';
import DataAnalyticsReports from './Pages/AdminPages/DataAnalyticsReports/DataAnalyticsReports';
import ProfilePage from './Pages/AdminPages/ProfilePage/ProfilePage';

export default function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [isLogoutModalOpen, setIsLogoutModalOpen]= useState(false);    

  const handleNavigation = (page) => {
    setActivePage(page);
    console.log(`Navigating to ${page}`);
  };

    const handleLogoutClick = () => {       
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {      
    setIsLogoutModalOpen(false);
    console.log('User logged out'); // Simulate logout; in a real app, clear auth state and redirect
  };

  const handleCancelLogout = () => {      
    setIsLogoutModalOpen(false);
  };


  return (

    //Sidebar section
    <div className="flex h-screen bg-white">
       
  <SideBar activePage={activePage} 
  handleNavigation={handleNavigation} 
  handleLogoutClick={handleLogoutClick}/> 
  <div className="flex-1 flex-col">
  {activePage==='Dashboard' ? (
    <Dashboard 
    activePage={activePage}
      handleNavigation={handleNavigation}/>

  ): activePage === 'User Management'? (
      <UserManagement 
        handleNavigation={handleNavigation}
    />

  ): activePage === 'Alerts & Notifications' ? (
        <AlertsNotifications 
         handleNavigation={handleNavigation}
        />

  ) : activePage === 'Data Analytics & Reports' ? (
        <DataAnalyticsReports
         handleNavigation={handleNavigation}
        />
  ) : activePage === 'System Settings' ? (   
    <SystemSettings
         handleNavigation={handleNavigation}
        />
        ) : activePage === 'Profile' ? (   
    <ProfilePage
         handleNavigation={handleNavigation}
        />
  ):(
    
    <div className="flex-1 flex flex-col ml-64 p-4 bg-gray-100">
          <h1 className="text-2xl font-bold">{activePage}</h1>
          <p>Content for {activePage} page (to be implemented).</p>
        </div>
  )}
</div>

{/*Logout modal*/}
   {isLogoutModalOpen && (                 
        <LogoutModal
          show={isLogoutModalOpen} 
          onConfirm={handleConfirmLogout} 
          onCancel={handleCancelLogout} 
        />
      )}
  </div>
  );
}

