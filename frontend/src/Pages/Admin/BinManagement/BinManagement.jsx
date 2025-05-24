// Navigation Item Component
function NavItem({ active, icon, text, onClick }) {
  return (
    <div 
      className={`flex items-center p-4 cursor-pointer transition-colors duration-200 ${
        active ? 'bg-green-800 border-r-4 border-white' : 'hover:bg-green-800'
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="ml-3">{text}</span>
    </div>
  );
}

export default function BinManagement() {
  const [activePage, setActivePage] = useState('Bin Management');
  const [searchText, setSearchText] = useState('');
  const [selectedBin, setSelectedBin] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showAddBinModal, setShowAddBinModal] = useState(false);
  const [mapSearchText, setMapSearchText] = useState('');
  const [newBin, setNewBin] = useState({
    id: '',
    location: '',
    wasteLevel: 0,
    maintenance: 'OK',
    coordinates: { lat: 6.7553, lng: 80.3392 },
    deviceStatus: 'online',
    lastUpdate: 'Just now'
  });

  // IoT device simulation data - Sabaragamuwa University locations
  const [binData, setBinData] = useState([
    { 
      id: 'SU01', 
      location: 'Main Library', 
      wasteLevel: 76, 
      maintenance: 'OK', 
      coordinates: { lat: 6.7553, lng: 80.3392 },
      deviceStatus: 'online',
      lastUpdate: '2 min ago'
    },
    { 
      id: 'SU02', 
      location: 'Student Center', 
      wasteLevel: 95, 
      maintenance: 'Required', 
      coordinates: { lat: 6.7560, lng: 80.3385 },
      deviceStatus: 'online',
      lastUpdate: '1 min ago'
    },
    { 
      id: 'SU03', 
      location: 'Engineering Faculty', 
      wasteLevel: 52, 
      maintenance: 'OK', 
      coordinates: { lat: 6.7545, lng: 80.3400 },
      deviceStatus: 'offline',
      lastUpdate: '15 min ago'
    },
    { 
      id: 'SU04', 
      location: 'Cafeteria Block A', 
      wasteLevel: 100, 
      maintenance: 'Required', 
      coordinates: { lat: 6.7558, lng: 80.3388 },
      deviceStatus: 'online',
      lastUpdate: '30 sec ago'
    },
    { 
      id: 'SU05', 
      location: 'Sports Complex', 
      wasteLevel: 28, 
      maintenance: 'OK', 
      coordinates: { lat: 6.7550, lng: 80.3395 },
      deviceStatus: 'online',
      lastUpdate: '5 min ago'
    }
  ]);

  // Calculate summary statistics
  const totalBins = binData.length;
  const activeBins = binData.filter(bin => bin.deviceStatus === 'online').length;
  const fullBins = binData.filter(bin => bin.wasteLevel >= 90).length;
  const maintenanceBins = binData.filter(bin => bin.maintenance === 'Required').length;

  // Simulate real-time IoT data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBinData(prevData => 
        prevData.map(bin => ({
          ...bin,
          wasteLevel: Math.min(100, Math.max(0, bin.wasteLevel + (Math.random() * 10 - 5))),
          maintenance: bin.wasteLevel >= 90 ? 'Required' : 'OK',
          lastUpdate: Math.random() > 0.7 ? 'Just now' : bin.lastUpdate
        }))
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleNavigation = (page) => {
    setActivePage(page);
    console.log(`Navigating to ${page}`);
  };

  const getWasteLevelColor = (level) => {
    if (level >= 90) return '#ff4d4d';
    if (level >= 70) return '#ffcc00';
    if (level >= 50) return '#ff9800';
    return '#4cd964';
  };

  const handleEdit = (bin) => {
    setSelectedBin({...bin});
    setShowEditModal(true);
  };

  const handleAssignMaintenance = (bin) => {
    setSelectedBin({...bin});
    setShowMaintenanceModal(true);
  };

  const handleAddBin = () => {
    setShowAddBinModal(true);
  };

  const handleSave = () => {
    setBinData(prevData => 
      prevData.map(bin => 
        bin.id === selectedBin.id ? selectedBin : bin
      )
    );
    setShowEditModal(false);
  };

  const handleAssign = () => {
    setBinData(prevData => 
      prevData.map(bin => 
        bin.id === selectedBin.id 
          ? { ...bin, maintenance: selectedBin.maintenance }
          : bin
      )
    );
    setShowMaintenanceModal(false);
  };

  const handleSaveNewBin = () => {
    if (newBin.id && newBin.location) {
      setBinData(prevData => [...prevData, {...newBin}]);
      setShowAddBinModal(false);
      setNewBin({
        id: '',
        location: '',
        wasteLevel: 0,
        maintenance: 'OK',
        coordinates: { lat: 6.7553, lng: 80.3392 },
        deviceStatus: 'online',
        lastUpdate: 'Just now'
      });
    }
  };

  // Filter bins based on search
  const filteredBins = binData.filter(bin => 
    bin.id.toLowerCase().includes(searchText.toLowerCase()) ||
    bin.location.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-64 bg-green-700 text-white flex flex-col h-full fixed left-0 top-0 z-20">
        <div className="p-4 text-2xl font-bold border-b border-green-600 text-center">CityBin</div>
        
        <nav className="flex-1">
          <NavItem 
            active={activePage === 'Dashboard'} 
            icon={<BarChart2 size={20} />} 
            text="Dashboard" 
            onClick={() => handleNavigation('Dashboard')}
          />
          <NavItem 
            active={activePage === 'User Management'} 
            icon={<Users size={20} />} 
            text="User Management" 
            onClick={() => handleNavigation('User Management')}
          />
          <NavItem 
            active={activePage === 'Bin Management'} 
            icon={<Trash2 size={20} />} 
            text="Bin Management" 
            onClick={() => handleNavigation('Bin Management')}
          />
          <NavItem 
            active={activePage === 'Data Analytics & Reports'} 
            icon={<BarChart2 size={20} />} 
            text="Data Analytics & Reports" 
            onClick={() => handleNavigation('Data Analytics & Reports')}
          />
          <NavItem 
            active={activePage === 'Alerts & Notifications'} 
            icon={<Bell size={20} />} 
            text="Alerts & Notifications" 
            onClick={() => handleNavigation('Alerts & Notifications')}
          />
          <NavItem 
            active={activePage === 'System Settings'} 
            icon={<Settings size={20} />} 
            text="System Settings" 
            onClick={() => handleNavigation('System Settings')}
          />
        </nav>
        
        <div className="p-4 border-t border-green-600 flex justify-center">
          <button className="flex items-center justify-center text-white hover:bg-green-800 p-2 rounded transition-colors duration-200 w-full">
            <LogOut size={20} className="mr-2" />
            Log Out
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64 min-w-0 overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white p-4 border-b flex justify-between items-center sticky top-0 z-10 flex-shrink-0">
          <div className="text-xl font-bold">Bin Management</div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search something"
                className="bg-gray-200 rounded-full pl-8 pr-4 py-1 w-64 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <span className="absolute left-2 top-2 text-gray-500">🔍</span>
            </div>
            <div 
              className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-green-800 transition-colors duration-200"
              onClick={() => handleNavigation('Profile')}
            >
              <User size={18} />
            </div>
          </div>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-lg font-semibold text-green-800">Total Bins</div>
                <div className="text-2xl font-bold text-green-700">{totalBins}</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-lg font-semibold text-blue-800">Active Bins</div>
                <div className="text-2xl font-bold text-blue-700">{activeBins}</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <div className="text-lg font-semibold text-red-800">Full Bins</div>
                <div className="text-2xl font-bold text-red-700">{fullBins}</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <div className="text-lg font-semibold text-orange-800">Maintenance Issues</div>
                <div className="text-2xl font-bold text-orange-700">{maintenanceBins}</div>
              </div>
            </div>

            {/* Map Section */}
            <div className="mb-6">
              <div className="bg-gray-50 border rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg">Bin Map - Sabaragamuwa University</h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search areas..."
                      className="bg-white border rounded-full pl-8 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-green-500"
                      value={mapSearchText}
                      onChange={(e) => setMapSearchText(e.target.value)}
                    />
                    <Search size={16} className="absolute left-2 top-3 text-gray-500" />
                  </div>
                </div>
                
                <div className="relative h-64 rounded-lg overflow-hidden border-2 border-green-200 bg-green-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-green-700 text-lg">Interactive Map View</div>
                  </div>
                  
                  {/* Simulated map markers */}
                  {filteredBins.map((bin, index) => (
                    <div
                      key={bin.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                      style={{
                        left: `${20 + (index * 15)}%`,
                        top: `${20 + (index * 12)}%`
                      }}
                      title={`${bin.id} - ${bin.location}: ${bin.wasteLevel}%`}
                    >
                      <div className="relative bg-white rounded-full p-2 shadow-lg">
                        <MapPin 
                          size={20} 
                          className={`${bin.wasteLevel >= 90 ? 'text-red-600' : bin.wasteLevel >= 70 ? 'text-yellow-600' : 'text-green-600'}`}
                          fill="currentColor"
                        />
                        {bin.deviceStatus === 'offline' && (
                          <WifiOff size={12} className="absolute -top-1 -right-1 text-red-600" />
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Map legend */}
                  <div className="absolute bottom-4 left-4 bg-white bg-opacity-95 px-3 py-2 rounded text-sm shadow-lg">
                    <div className="font-medium mb-2">Bin Status</div>
                    <div className="flex items-center mb-1">
                      <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                      <span className="text-xs">Normal (&lt;70%)</span>
                    </div>
                    <div className="flex items-center mb-1">
                      <div className="w-3 h-3 bg-yellow-600 rounded-full mr-2"></div>
                      <span className="text-xs">Medium (70-89%)</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
                      <span className="text-xs">Full (≥90%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Header with Add Button */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Bin Management</h3>
              <button 
                onClick={handleAddBin}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-200 flex items-center"
              >
                <Plus size={16} className="mr-2" />
                Add New Bin
              </button>
            </div>
