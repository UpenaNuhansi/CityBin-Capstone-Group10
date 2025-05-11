import React, {useState} from 'react';
import Sidebar from './Components/SideBar/SideBar'
import Dashboard from './Components/Dashboard/Dashboard'

export default function App() {
  const [activePage, setActivePage] = useState('Dashboard');

  const handleNavigation = (page) => {
    setActivePage(page);
    console.log(`Navigating to ${page}`);
  };

  return (
    <div>
  <Sidebar activePage={activePage} handleNavigation={handleNavigation}/>
  {activePage==='Dashboard' ? (
    <Dashboard 
    activePage={activePage}
    setActivePage={setActivePage}
    handleNavigation={handleNavigation}/>
  ):(
    <div className="flex-1 flex flex-col ml-64 p-4 bg-gray-100">
          <h1 className="text-2xl font-bold">{activePage}</h1>
          <p>Content for {activePage} page (to be implemented).</p>
        </div>
  )}
  </div>
  );
}

