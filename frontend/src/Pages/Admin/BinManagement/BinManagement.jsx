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
                       {/* Data Table */}
            <div className="border rounded-lg overflow-hidden bg-green-50">
              <table className="w-full">
                <thead>
                  <tr className="bg-green-200 border-b border-green-300">
                    <th className="py-3 px-4 text-left font-semibold text-green-800">Bin</th>
                    <th className="py-3 px-4 text-left font-semibold text-green-800">Location</th>
                    <th className="py-3 px-4 text-left font-semibold text-green-800">Waste Level</th>
                    <th className="py-3 px-4 text-left font-semibold text-green-800">Maintenance</th>
                    <th className="py-3 px-4 text-left font-semibold text-green-800">Device Status</th>
                    <th className="py-3 px-4 text-left font-semibold text-green-800">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBins.map((bin) => (
                    <tr 
                      key={bin.id} 
                      className="hover:bg-green-100 border-b border-green-200"
                    >
                      <td className="py-3 px-4 font-medium text-gray-700">{bin.id}</td>
                      <td className="py-3 px-4 text-gray-700">{bin.location}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className="mr-3 font-medium text-gray-700">{bin.wasteLevel.toFixed(0)}%</span>
                          <div className="w-24 bg-gray-300 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-300" 
                              style={{ 
                                width: `${bin.wasteLevel}%`,
                                backgroundColor: getWasteLevelColor(bin.wasteLevel)
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span 
                          className={`px-2 py-1 rounded text-sm font-medium ${
                            bin.maintenance === 'Required' 
                              ? 'text-red-700 bg-red-100' 
                              : 'text-green-700 bg-green-100'
                          }`}
                        >
                          {bin.maintenance}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          {bin.deviceStatus === 'online' ? (
                            <Wifi size={16} className="text-green-600 mr-2" />
                          ) : (
                            <WifiOff size={16} className="text-red-600 mr-2" />
                          )}
                          <span className={`text-sm ${bin.deviceStatus === 'online' ? 'text-green-600' : 'text-red-600'}`}>
                            {bin.deviceStatus}
                          </span>
                          <div className="text-xs text-gray-500 ml-2">
                            {bin.lastUpdate}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(bin)}
                            className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleAssignMaintenance(bin)}
                            className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded hover:bg-red-100 transition-colors"
                          >
                            Assign Maintenance
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedBin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Edit Bin Information</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Bin ID</label>
              <input 
                type="text"
                className="w-full border rounded px-3 py-2 bg-gray-100 focus:outline-none"
                value={selectedBin.id}
                readOnly
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Location</label>
              <select 
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={selectedBin.location}
                onChange={(e) => setSelectedBin(prev => ({ ...prev, location: e.target.value }))}
              >
                <option value="Main Library">Main Library</option>
                <option value="Student Center">Student Center</option>
                <option value="Engineering Faculty">Engineering Faculty</option>
                <option value="Cafeteria Block A">Cafeteria Block A</option>
                <option value="Sports Complex">Sports Complex</option>
                <option value="Admin Building">Admin Building</option>
                <option value="IT Faculty">IT Faculty</option>
                <option value="Business Faculty">Business Faculty</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Waste Level</label>
              <input 
                type="text"
                className="w-full border rounded px-3 py-2 bg-gray-100 focus:outline-none"
                value={`${selectedBin.wasteLevel.toFixed(0)}%`}
                readOnly
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Maintenance Status</label>
              <select 
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={selectedBin.maintenance}
                onChange={(e) => setSelectedBin(prev => ({ ...prev, maintenance: e.target.value }))}
              >
                <option value="OK">OK</option>
                <option value="Required">Required</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleSave}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
              >
                Save
              </button>
              <button 
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Bin Modal */}
      {showAddBinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New Bin</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Bin ID</label>
              <input 
                type="text"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g., SU06"
                value={newBin.id}
                onChange={(e) => setNewBin(prev => ({ ...prev, id: e.target.value }))}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Location</label>
              <select 
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={newBin.location}
                onChange={(e) => setNewBin(prev => ({ ...prev, location: e.target.value }))}
              >
                <option value="">Select Location</option>
                <option value="Main Library">Main Library</option>
                <option value="Student Center">Student Center</option>
                <option value="Engineering Faculty">Engineering Faculty</option>
                <option value="Cafeteria Block A">Cafeteria Block A</option>
                <option value="Cafeteria Block B">Cafeteria Block B</option>
                <option value="Sports Complex">Sports Complex</option>
                <option value="Admin Building">Admin Building</option>
                <option value="IT Faculty">IT Faculty</option>
                <option value="Business Faculty">Business Faculty</option>
                <option value="Parking Area A">Parking Area A</option>
                <option value="Auditorium">Auditorium</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Initial Waste Level (%)</label>
              <input 
                type="number"
                min="0"
                max="100"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={newBin.wasteLevel}
                onChange={(e) => setNewBin(prev => ({ ...prev, wasteLevel: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Device Status</label>
              <select 
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={newBin.deviceStatus}
                onChange={(e) => setNewBin(prev => ({ ...prev, deviceStatus: e.target.value }))}
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Maintenance Status</label>
              <select 
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={newBin.maintenance}
                onChange={(e) => setNewBin(prev => ({ ...prev, maintenance: e.target.value }))}
              >
                <option value="OK">OK</option>
                <option value="Required">Required</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleSaveNewBin}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors disabled:bg-gray-400"
                disabled={!newBin.id || !newBin.location}
              >
                Add Bin
              </button>
              <button 
                onClick={() => {
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
                }}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Maintenance Modal */}
      {showMaintenanceModal && selectedBin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Assign Maintenance</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Bin ID</label>
              <input 
                type="text"
                className="w-full border rounded px-3 py-2 bg-gray-100 focus:outline-none"
                value={selectedBin.id}
                readOnly
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Location</label>
              <input 
                type="text"
                className="w-full border rounded px-3 py-2 bg-gray-100 focus:outline-none"
                value={selectedBin.location}
                readOnly
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Current Waste Level</label>
              <input 
                type="text"
                className="w-full border rounded px-3 py-2 bg-gray-100 focus:outline-none"
                value={`${selectedBin.wasteLevel.toFixed(0)}%`}
                readOnly
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Maintenance Status</label>
              <select 
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={selectedBin.maintenance}
                onChange={(e) => setSelectedBin(prev => ({ ...prev, maintenance: e.target.value }))}
              >
                <option value="OK">OK</option>
                <option value="Required">Required</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleAssign}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
              >
                Assign
              </button>
              <button 
                onClick={() => setShowMaintenanceModal(false)}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
