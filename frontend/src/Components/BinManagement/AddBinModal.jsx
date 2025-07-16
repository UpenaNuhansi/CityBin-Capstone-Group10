import React from 'react';

export default function AddBinModal({ newBin, setNewBin, onSave, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl px-8 py-6 w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Add New Bin
        </h2>

        {/* Bin ID */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Bin ID</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="e.g., CB001"
            value={newBin.binId}
            onChange={e => setNewBin(prev => ({ ...prev, binId: e.target.value }))}
          />
        </div>

        {/* Location Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            value={newBin.location}
            onChange={(e) => {
              const value = e.target.value;
              const selectedText = e.target.options[e.target.selectedIndex].text;

              if (value) {
                const [lat, lng] = value.split(',').map(Number);
                setNewBin(prev => ({
                  ...prev,
                  location: selectedText,
                  coordinates: { lat, lng },
                }));
              } else {
                setNewBin(prev => ({
                  ...prev,
                  location: '',
                  coordinates: { lat: 0, lng: 0 },
                }));
              }
            }}
          >
            <option value="">Select Location</option>
            <option value="6.7151,80.7870">Main Entrance Gate</option>
            <option value="6.7148,80.7874">Faculty of Applied Sciences (FAS)</option>
            <option value="6.7145,80.7880">Faculty of Geomatics</option>
            <option value="6.7143,80.7865">Faculty of Agricultural Sciences</option>
            <option value="6.7146,80.7868">Faculty of Management Studies</option>
            <option value="6.7147,80.7871">Faculty of Social Sciences & Languages</option>
            <option value="6.7150,80.7872">Administration Building</option>
            <option value="6.7149,80.7876">Library</option>
            <option value="6.7152,80.7878">Hostels (Male)</option>
            <option value="6.7140,80.7873">Hostels (Female)</option>
            <option value="6.7153,80.7869">University Canteen</option>
            <option value="6.7142,80.7867">Playground / Gymnasium</option>
            <option value="6.7144,80.7877">Health Center</option>
            <option value="6.7141,80.7870">Open Theater</option>
            <option value="6.7154,80.7875">Vehicle Parking Area</option>
          </select>
        </div>

        {/* Latitude */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
          <input
            type="number"
            step="0.000001"
            min="-90"
            max="90"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            value={newBin.coordinates.lat}
            onChange={e => setNewBin(prev => ({
              ...prev,
              coordinates: { ...prev.coordinates, lat: parseFloat(e.target.value) }
            }))}
          />
        </div>

        {/* Longitude */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
          <input
            type="number"
            step="0.000001"
            min="-180"
            max="180"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            value={newBin.coordinates.lng}
            onChange={e => setNewBin(prev => ({
              ...prev,
              coordinates: { ...prev.coordinates, lng: parseFloat(e.target.value) }
            }))}
          />
        </div>

        {/* Initial Waste Level */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Initial Waste Level (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            value={newBin.wasteLevel}
            onChange={e => setNewBin(prev => ({
              ...prev,
              wasteLevel: parseInt(e.target.value) || 0
            }))}
          />
        </div>

        {/* Device Status */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Device Status</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            value={newBin.deviceStatus}
            onChange={e => setNewBin(prev => ({ ...prev, deviceStatus: e.target.value }))}
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {/* Maintenance Status */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Status</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            value={newBin.maintenance}
            onChange={e => setNewBin(prev => ({ ...prev, maintenance: e.target.value }))}
          >
            <option value="OK">OK</option>
            <option value="Required">Required</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onSave}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition"
            disabled={
              !newBin.binId ||
              !newBin.location ||
              !newBin.coordinates?.lat ||
              !newBin.coordinates?.lng
            }
          >
            Add Bin
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}