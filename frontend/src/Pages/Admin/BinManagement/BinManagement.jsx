import { useState, useEffect } from 'react';
import { Search, MapPin, Wifi, WifiOff, Plus } from 'lucide-react';
import EditBinModal from '../../../Components/BinManagement/EditBinModal';
import AddBinModal from '../../../Components/BinManagement/AddBinModal';
import AssignMaintenanceModal from '../../../Components/BinManagement/AssignMaintenanceModal';
import TopBar from '../../../Components/TopBar/TopBar';
import { getAllBins } from '../../../api/apiServices/binApi'; 
import { createBin, updateBin, assignMaintenance } from '../../../api/apiServices/binApi';

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
  const [activePage, setActivePage] = useState('/admin/bin-management');
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
  const [binData, setBinData] = useState([]);

  // Calculate summary statistics
  const totalBins = binData.length;
  const activeBins = binData.filter(bin => bin.deviceStatus === 'online').length;
  const fullBins = binData.filter(bin => bin.wasteLevel >= 90).length;
  const maintenanceBins = binData.filter(bin => bin.maintenance === 'Required').length;

  // Simulate real-time IoT data updates
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setBinData(prevData => 
  //       prevData.map(bin => ({
  //         ...bin,
  //         wasteLevel: Math.min(100, Math.max(0, bin.wasteLevel + (Math.random() * 10 - 5))),
  //         maintenance: bin.wasteLevel >= 90 ? 'Required' : 'OK',
  //         lastUpdate: Math.random() > 0.7 ? 'Just now' : bin.lastUpdate
  //       }))
  //     );
  //   }, 10000);

  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
  const fetchBins = async () => {
    try {
      const res = await getAllBins();
      const formattedData = res.data.data.map(bin => ({
        id: bin.binId,
        location: bin.location,
        wasteLevel: bin.wasteLevel,
        maintenance: bin.maintenance,
        coordinates: bin.coordinates,
        deviceStatus: bin.deviceStatus,
        lastUpdate: bin.lastUpdate,
      }));
      setBinData(formattedData);
    } catch (err) {
      console.error('Error fetching bins:', err);
    }
  };

  fetchBins();
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

  const handleSave = async () => {
  try {
    const payload = {
      binId: selectedBin.id,
      location: selectedBin.location,
      coordinates: selectedBin.coordinates,
      wasteLevel: selectedBin.wasteLevel,
      maintenance: selectedBin.maintenance,
      deviceStatus: selectedBin.deviceStatus
    };
    const res = await updateBin(selectedBin.id, payload);
    setBinData(prev =>
      prev.map(bin => bin.id === selectedBin.id ? {
        id: res.data.data.binId,
        ...res.data.data
      } : bin)
    );
    setShowEditModal(false);
  } catch (err) {
    console.error('Error updating bin:', err);
  }
};

  const handleAssign = async () => {
  try {
    // This assumes a `userId` exists. Need to replace this with actual logic.
    const dummyUserId = 'YOUR_USER_ID'; //Need to replace this with real user ID
    const res = await assignMaintenance(selectedBin.id, dummyUserId);
    setBinData(prev =>
      prev.map(bin => bin.id === selectedBin.id ? {
        id: res.data.data.binId,
        ...res.data.data
      } : bin)
    );
    setShowMaintenanceModal(false);
  } catch (err) {
    console.error('Failed to assign maintenance:', err);
  }
};

  const handleSaveNewBin = async () => {
  if (newBin.id && newBin.location) {
    try {
      const payload = {
        binId: newBin.id,
        location: newBin.location,
        coordinates: newBin.coordinates,
        wasteLevel: newBin.wasteLevel,
        maintenance: newBin.maintenance,
        deviceStatus: newBin.deviceStatus
      };
      const res = await createBin(payload);
      setBinData(prev => [...prev, {
        id: res.data.data.binId,
        ...res.data.data
      }]);
      setShowAddBinModal(false);
      resetNewBin();
    } catch (err) {
      console.error('Failed to create bin:', err);
    }
  }
};

const resetNewBin = () => {
  setNewBin({
    id: '',
    location: '',
    wasteLevel: 0,
    maintenance: 'OK',
    coordinates: { lat: 6.7553, lng: 80.3392 },
    deviceStatus: 'online',
    lastUpdate: 'Just now'
  });
};

  // Filter bins based on search input
  const filteredBins = binData.filter(bin => 
    bin.id.toLowerCase().includes(searchText.toLowerCase()) ||
    bin.location.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    
           
      <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col ml-64 min-w-0 overflow-hidden">
        {/* Top Bar */}
        <div>
             <TopBar
               title="Bin Management"
               searchText={searchText}
               setSearchText={setSearchText}
               onProfileClick={() => handleNavigation("/admin/profile")}
             />
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
                      key={bin._id} 
                      className="hover:bg-green-100 border-b border-green-200"
                    >
                      <td className="py-3 px-4 font-medium text-gray-700">{bin._id}</td>
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
  <EditBinModal
    selectedBin={selectedBin}
    setSelectedBin={setSelectedBin}
    onSave={handleSave}
    onClose={() => setShowEditModal(false)}
  />
)}

      {/* Add New Bin Modal */}
      {showAddBinModal && (
  <AddBinModal
    newBin={newBin}
    setNewBin={setNewBin}
    onSave={handleSaveNewBin}
    onClose={() => {
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
  />
)}

      {/* Assign Maintenance Modal */}
      {showMaintenanceModal && selectedBin && (
  <AssignMaintenanceModal
    selectedBin={selectedBin}
    setSelectedBin={setSelectedBin}
    onAssign={handleAssign}
    onClose={() => setShowMaintenanceModal(false)}
  />
)}
    </div>
  );
}