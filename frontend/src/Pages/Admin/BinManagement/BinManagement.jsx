import { useState, useEffect, useContext } from 'react';
import { Search, Wifi, WifiOff, Plus } from 'lucide-react';
import EditBinModal from '../../../Components/BinManagement/EditBinModal';
import AddBinModal from '../../../Components/BinManagement/AddBinModal';
import AssignMaintenanceModal from '../../../Components/BinManagement/AssignMaintenanceModal';
import TopBar from '../../../Components/TopBar/TopBar';
import { createBin, updateBin, assignMaintenance } from '../../../api/apiServices/binApi';
import BinMap from '../../../Components/BinManagement/BinMap';
import { toast } from 'react-toastify';
import api from '../../../api/axios';
import { BinContext } from '../../../Components/BinManagement/BinContext';


export default function BinManagement() {
  const { binData, setBinData, fetchBins } = useContext(BinContext);

  const [activePage, setActivePage] = useState('/admin/bin-management');
  const [searchText, setSearchText] = useState('');
  const [selectedBin, setSelectedBin] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showAddBinModal, setShowAddBinModal] = useState(false);
  const [mapSearchText, setMapSearchText] = useState('');
  const [newBin, setNewBin] = useState({
    binId: '',
    location: '',
    wasteLevel: 0,
    maintenance: 'OK',
    coordinates: { lat: 6.7553, lng: 80.3392 },
    deviceStatus: 'online',
    lastUpdate: 'Just now',
  });

  const [showOperatorPopup, setShowOperatorPopup] = useState(false);
  const [selectedOperatorInfo, setSelectedOperatorInfo] = useState(null);

  const totalBins = binData.length;
  const activeBins = binData.filter(bin => bin.deviceStatus === 'online').length;
  const fullBins = binData.filter(bin => bin.wasteLevel >= 90).length;
  const maintenanceBins = binData.filter(bin => bin.maintenance === 'Required').length;

  

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

        // await api.put(`/api/bins/${binId}`, payload);
        await updateBin(binId, payload);

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
      const res = await assignMaintenance(selectedBin.binId, operatorId);
      //const res = await assignMaintenance(selectedBin._id || selectedBin.binId, operatorId);


      setBinData(prev =>
        prev.map(bin =>
          bin.binId === selectedBin.binId
            ? { ...bin, assignedOperator: res.data.assignedOperator }
            : bin
        )
      );

      toast.success('Operator assigned successfully');
    } catch (err) {
      console.error('Failed to assign maintenance:', err);
      toast.error('Failed to assign operator');
    }
    setShowMaintenanceModal(false);
  };

  const handleSaveNewBin = async () => {
    // if (newBin.id && newBin.location && newBin.coordinates?.lat && newBin.coordinates?.lng) 
    if (newBin.location && newBin.coordinates?.lat && newBin.coordinates?.lng) {
      try {
        const payload = {
          //binId: `CB${String(Date.now()).slice(-4)}`,
          binId: newBin.binId, 
          location: newBin.location,
          // coordinates: newBin.coordinates,
          coordinates: {
            lat: Number(newBin.coordinates.lat),
            lng: Number(newBin.coordinates.lng),
          },
          // wasteLevel: newBin.wasteLevel,
          wasteLevel: Number(newBin.wasteLevel),
          maintenance: newBin.maintenance,
          deviceStatus: newBin.deviceStatus,
        };
      //   const res = await createBin(payload);
      //   setBinData(prev => [...prev, {
      //     id: res.data.data.binId,
      //     ...res.data.data,
      //   }]);
      //   setShowAddBinModal(false);
      //   resetNewBin();
      //   toast.success('Bin added successfully');
      // } catch (err) {
      //   console.error('Failed to create bin:', err);
      //   toast.error('Failed to create bin');
      // }

      const bin = await createBin(payload);
      const newBinData = {
        _id: bin._id,
        binId: bin.binId,
        id: bin.binId, // For BinMap
        location: bin.location,
        wasteLevel: Number(bin.wasteLevel),
        maintenance: bin.maintenance,
        coordinates: {
          lat: Number(bin.coordinates.lat),
          lng: Number(bin.coordinates.lng),
        },
        deviceStatus: bin.deviceStatus,
        lastUpdate: bin.lastUpdate || 'Just now',
        assignedOperator: bin.assignedOperator || null,
      };
      
      

setBinData(prev => [...prev, newBinData]);
await fetchBins();

      // const res = await createBin(payload);
      //   const newBinData = {
      //     _id: res.data.data._id,
      //     binId: res.data.data.binId,
      //     id: res.data.data.binId, // For BinMap
      //     location: res.data.data.location,
      //     wasteLevel: Number(res.data.data.wasteLevel),
      //     maintenance: res.data.data.maintenance,
      //     coordinates: {
      //       lat: Number(res.data.data.coordinates.lat),
      //       lng: Number(res.data.data.coordinates.lng),
      //     },
      //     deviceStatus: res.data.data.deviceStatus,
      //     lastUpdate: res.data.data.lastUpdate || 'Just now',
      //     assignedOperator: res.data.data.assignedOperator || null,
      //   };
      //   setBinData(prev => [...prev, newBinData]);
      //   await fetchBins(); // Sync with backend
      //   setShowAddBinModal(false);
      //   setSearchText(''); // Clear search to show all bins
      //   resetNewBin();
        toast.success('Bin added successfully');
      } catch (err) {
        console.error('Failed to create bin:', err.message, err.response?.data);
        toast.error('Failed to create bin');
      }
    } else {
      toast.error('Please provide Bin ID, Location, and valid coordinates');
    }

    // }
  };

  const resetNewBin = () => {
    setNewBin({
      binId: '',
      location: '',
      wasteLevel: 0,
      maintenance: 'OK',
      coordinates: { lat: 6.7553, lng: 80.3392 },
      deviceStatus: 'online',
      lastUpdate: 'Just now',
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

  const filteredBins = binData
  .map(bin => ({
    ...bin,
    id: bin.id || bin.binId, // normalize ID for consistency
  }))
  .filter(bin =>
    bin.binId?.toLowerCase().includes(searchText.toLowerCase()) ||
    bin.location?.toLowerCase().includes(searchText.toLowerCase())
  );


 console.log('Filtered bins for BinMap:', filteredBins); // Debug log

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


                <div className="relative z-0">
                  {/* <BinMap bins={filteredBins} onAssignClick={handleAssignMaintenance} /> */}
                  <BinMap key={binData.length} bins={filteredBins} onAssignClick={handleAssignMaintenance} role="Admin" />
                </div>

              </div>
            </div>

            <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-green-900">Bin Management</h3>
            <button
              onClick={handleAddBin}
              className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 flex items-center shadow-md transition"
            >
              <Plus size={18} className="mr-2" />
              Add New Bin
            </button>
          </div>



          <div className="rounded-xl overflow-hidden shadow-md bg-white">
          <table className="w-full text-sm text-left">
            <thead className="bg-green-100 border-b border-green-300">
              <tr>
                {['Bin', 'Location', 'Waste Level', 'Maintenance', 'Device Status', 'Assigned To', 'Actions'].map(header => (
                  <th key={header} className="px-6 py-3 text-green-900 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBins.map((bin) => (
                <tr key={bin.binId} className="hover:bg-green-50 transition border-b border-green-100">
                  <td className="px-6 py-4 font-medium text-gray-800">{bin.binId}</td>
                  <td className="px-6 py-4 text-gray-600">{bin.location}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-800 font-semibold">{bin.wasteLevel.toFixed(0)}%</span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${bin.wasteLevel}%`,
                            backgroundColor: getWasteLevelColor(bin.wasteLevel),
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      bin.maintenance === 'Required'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {bin.maintenance}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {bin.deviceStatus === 'online' ? (
                        <Wifi size={16} className="text-green-600" />
                      ) : (
                        <WifiOff size={16} className="text-red-600" />
                      )}
                      <span className={`text-sm font-medium ${bin.deviceStatus === 'online' ? 'text-green-700' : 'text-red-700'}`}>
                        {bin.deviceStatus}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">{bin.lastUpdate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-green-700 underline cursor-pointer" onClick={() => openOperatorPopup(bin.assignedOperator, bin)}>
                    {bin.assignedOperator?.uniqueId || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(bin)}
                        className="text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-100 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleAssignMaintenance(bin)}
                        className="text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-100 transition"
                      >
                        Assign
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
      {showEditModal && selectedBin && (
        <EditBinModal
          selectedBin={selectedBin}
          setSelectedBin={setSelectedBin}
          onSave={handleBinUpdate}
          onClose={() => setSelectedBin(null)}
        />
      )}
      {showAddBinModal && (
        <AddBinModal
          newBin={newBin}
          setNewBin={setNewBin}
          onSave={handleSaveNewBin}
          onClose={() => {
            setShowAddBinModal(false);
            resetNewBin();
          }}
        />
      )}
      {showMaintenanceModal && selectedBin && (
        <AssignMaintenanceModal
          isOpen={showMaintenanceModal}
          onClose={() => setShowMaintenanceModal(false)}
          onAssign={handleAssign}
          selectedBin={selectedBin}
        />
      )}
      {showOperatorPopup && selectedOperatorInfo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-[90%] max-w-md">
            <h2 className="text-xl font-semibold text-green-800 mb-4 text-center">Operator Assignment Info</h2>
            <div className="space-y-2 text-gray-700 text-sm">
              <p><strong>Name:</strong> {selectedOperatorInfo.name}</p>
              <p><strong>Email:</strong> {selectedOperatorInfo.email}</p>
              <p><strong>Bin ID:</strong> {selectedOperatorInfo.binId}</p>
              <p><strong>Location:</strong> {selectedOperatorInfo.binLocation}</p>
              <p><strong>Notification:</strong> {selectedOperatorInfo.notification}</p>
            </div>
            <button
              onClick={() => setShowOperatorPopup(false)}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}