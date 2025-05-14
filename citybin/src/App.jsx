import React, {useState} from 'react';
import SideBar from './Components/SideBar/SideBar'
import Dashboard from './Components/Dashboard/Dashboard'
import LogoutModal from './Components/LogoutModal/LogoutModal';
import UserManagement from './Components/UserManagement/UserManagement';   
import AlertsNotifications from './Components/AlertsNotifications/AlertsNotifications';

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
    <div>
       
  <SideBar activePage={activePage} 
  handleNavigation={handleNavigation} 
  handleLogoutClick={handleLogoutClick}/> 
  {activePage==='Dashboard' ? (
    <Dashboard 
    activePage={activePage}
    setActivePage={setActivePage}
    handleNavigation={handleNavigation}/>
  ): activePage === 'User Management'? (
      <UserManagement/>
  ):activePage === 'Alerts & Notifications' ? (
        <AlertsNotifications />
  ): (
    <div className="flex-1 flex flex-col ml-64 p-4 bg-gray-100">
          <h1 className="text-2xl font-bold">{activePage}</h1>
          <p>Content for {activePage} page (to be implemented).</p>
        </div>
  )}

   {isLogoutModalOpen && (                 
        <LogoutModal 
          onConfirm={handleConfirmLogout} 
          onCancel={handleCancelLogout} 
        />
      )}

  </div>
  );
}

