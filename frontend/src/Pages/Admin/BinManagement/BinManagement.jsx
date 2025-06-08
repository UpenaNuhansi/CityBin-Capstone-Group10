import { useState, useEffect } from 'react';
import { Search, Wifi, WifiOff, Plus } from 'lucide-react';
import EditBinModal from '../../../Components/BinManagement/EditBinModal';
import AddBinModal from '../../../Components/BinManagement/AddBinModal';
import AssignMaintenanceModal from '../../../Components/BinManagement/AssignMaintenanceModal';
import TopBar from '../../../Components/TopBar/TopBar';
import { getAllBins, createBin, updateBin, assignMaintenance } from '../../../api/apiServices/binApi';
import BinMap from '../../../Components/BinManagement/BinMap';
import { toast } from 'react-toastify';
import api from '../../../api/axios';



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
  const [binData, setBinData] = useState([]);
  const [showOperatorPopup, setShowOperatorPopup] = useState(false);
  const [selectedOperatorInfo, setSelectedOperatorInfo] = useState(null);

  const totalBins = binData.length;
  const activeBins = binData.filter(bin => bin.deviceStatus === 'online').length;
  const fullBins = binData.filter(bin => bin.wasteLevel >= 90).length;
  const maintenanceBins = binData.filter(bin => bin.maintenance === 'Required').length;

  useEffect(() => {
    const fetchBins = async () => {
      try {
        const res = await getAllBins();
       const formattedData = res.data.data
  .filter((bin) => bin.coordinates && typeof bin.coordinates.lat === 'number')
  .map((bin) => ({
    _id: bin._id,                     
    binId: bin.binId,                
    id: bin.binId,                   
    location: bin.location,
    wasteLevel: bin.wasteLevel,
    maintenance: bin.maintenance,
    coordinates: bin.coordinates,
    deviceStatus: bin.deviceStatus,
    lastUpdate: bin.lastUpdate,
    assignedOperator: bin.assignedOperator || null
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
  };

  const getWasteLevelColor = (level) => {
    if (level >= 90) return '#ff4d4d';
    if (level >= 70) return '#ffcc00';
    if (level >= 50) return '#ff9800';
    return '#4cd964';
  };

  const handleEdit = (bin) => {
    setSelectedBin({ ...bin });
    setShowEditModal(true);
  };

  const handleAssignMaintenance = (bin) => {
    setSelectedBin({ ...bin });
    setShowMaintenanceModal(true);
  };

  const handleAddBin = () => {
    setShowAddBinModal(true);
  };

const handleBinUpdate = async () => {
  try {
    const binId = selectedBin?.binId;
    if (!binId) {
      toast.error('No bin selected');
      return;
    }

    if (selectedBin.maintenance === 'OK') {
      await api.put(`/bins/${binId}/status`, {
        status: 'OK',
        operatorId: selectedBin.assignedOperator?._id || selectedBin.assignedOperator || null,
      });

      setBinData(prev =>
        prev.map(bin =>
          bin.binId === binId
            ? { ...bin, maintenance: 'OK', assignedOperator: null }
            : bin
        )
      );

      toast.success('Bin marked as OK and operator unassigned');
    } else {
      const payload = {
        binId: selectedBin.binId,
        location: selectedBin.location,
        coordinates: selectedBin.coordinates,
        wasteLevel: selectedBin.wasteLevel,
        maintenance: selectedBin.maintenance,
        deviceStatus: selectedBin.deviceStatus,
      };

      await api.put(`/bins/${binId}`, payload);

      setBinData(prev =>
        prev.map(bin =>
          bin.binId === binId ? { ...bin, ...payload } : bin
        )
      );

      toast.success('Bin updated successfully');
    }

    setShowEditModal(false);
  } catch (err) {
    console.error('Bin update error:', err);
    toast.error('Failed to update bin');
  }
};


const handleAssign = async (operatorId) => {
  try {
    const res = await assignMaintenance(selectedBin.id, operatorId);

setBinData(prev =>
  prev.map(bin =>
    bin.id === selectedBin.id
      ? { ...bin, assignedOperator: res.data.data.assignedOperator }
      : bin
  )
);


    setShowMaintenanceModal(false);
    toast.success('Operator assigned successfully');
  } catch (err) {
    console.error('Failed to assign maintenance:', err);
    toast.error('Failed to assign operator');
  }
};



  const handleSaveNewBin = async () => {
    if (newBin.id && newBin.location) {
      try {
        const payload = {
          binId: `CB${String(Date.now()).slice(-4)}`,
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

  const openOperatorPopup = (operator, bin) => {
  if (operator) {
    setSelectedOperatorInfo({
      name: operator.username,
      email: operator.email,
      binId: bin.id,
      binLocation: bin.location,
      notification: `Assigned on ${bin.lastUpdate || 'N/A'}`,
    });
    setShowOperatorPopup(true);
  }
};


  const filteredBins = binData.filter(bin =>
    bin.binId.toLowerCase().includes(searchText.toLowerCase()) ||
    bin.location.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col ml-64 min-w-0 overflow-hidden">
        <TopBar
          title="Bin Management"
          searchText={searchText}
          setSearchText={setSearchText}
          onProfileClick={() => handleNavigation("/admin/profile")}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
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

                {/*BinMap component */}
                <div className="relative z-0">
              <BinMap bins={filteredBins} onAssignClick={handleAssignMaintenance} />
                </div>

              </div>
            </div>

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
                    <th className="py-3 px-4 text-left font-semibold text-green-800">Assigned To</th>
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
                      <td className="py-3 px-4 text-green-700 cursor-pointer underline"
                        onClick={() => openOperatorPopup(bin.assignedOperator, bin)}>
                          {bin.assignedOperator?.uniqueId || '—'}
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
  onSave={handleBinUpdate}
  onClose={() => setSelectedBin(null)}
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
  isOpen={showMaintenanceModal}
  onClose={() => setShowMaintenanceModal(false)}
  onAssign={handleAssign} // ← used when the assign button is clicked
  selectedBin={selectedBin}
/>
)}




{showOperatorPopup && selectedOperatorInfo && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
    <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Operator Assignment Info</h2>
      <p><strong>Name:</strong> {selectedOperatorInfo.name}</p>
      <p><strong>Email:</strong> {selectedOperatorInfo.email}</p>
      <p><strong>Bin ID:</strong> {selectedOperatorInfo.binId}</p>
      <p><strong>Location:</strong> {selectedOperatorInfo.binLocation}</p>
      <p><strong>Notification:</strong> {selectedOperatorInfo.notification}</p>
      <button
        onClick={() => setShowOperatorPopup(false)}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Close
      </button>
    </div>
  </div>
)}

    </div>
    
  );
  
}