import React from 'react';

export default function AddBinModal({ newBin, setNewBin, onSave, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add New Bin</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Bin ID</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="e.g., CB001"
            value={newBin.id}
            onChange={e => setNewBin(prev => ({ ...prev, id: e.target.value }))}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Location</label>
         <select
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={newBin.location}
              onChange={(e) => {
                const [lat, lng] = e.target.value.split(',');
                setNewBin(prev => ({
                  ...prev,
                  location: e.target.options[e.target.selectedIndex].text, // store location name
                  latitude: lat,
                  longitude: lng
                }));
              }}
            >
              <option value="">Select Location</option>
              <option value="6.7571,80.3368">Main Entrance Gate</option>
              <option value="6.7553,80.3392">Faculty of Applied Sciences (FAS)</option>
              <option value="6.7557,80.3407">Faculty of Geomatics</option>
              <option value="6.7566,80.3400">Faculty of Agricultural Sciences</option>
              <option value="6.7549,80.3379">Faculty of Management Studies</option>
              <option value="6.7544,80.3385">Faculty of Social Sciences & Languages</option>
              <option value="6.7550,80.3388">Administration Building</option>
              <option value="6.7552,80.3390">Library</option>
              <option value="6.7562,80.3366">Hostels (Male)</option>
              <option value="6.7542,80.3398">Hostels (Female)</option>
              <option value="6.7551,80.3382">University Canteen</option>
              <option value="6.7567,80.3355">Playground / Gymnasium</option>
              <option value="6.7556,80.3370">Health Center</option>
              <option value="6.7546,80.3389">Open Theater</option>
              <option value="6.7560,80.3376">Vehicle Parking Area</option>
            </select>

        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Latitude</label>
          <input
            type="number"
            step="0.000001"
            min="-90"
            max="90"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={newBin.coordinates?.lat || ''}
            onChange={e => setNewBin(prev => ({
              ...prev,
              coordinates: { ...prev.coordinates, lat: parseFloat(e.target.value) || 0 }
            }))}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Longitude</label>
          <input
            type="number"
            step="0.000001"
            min="-180"
            max="180"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={newBin.coordinates?.lng || ''}
            onChange={e => setNewBin(prev => ({
              ...prev,
              coordinates: { ...prev.coordinates, lng: parseFloat(e.target.value) || 0 }
            }))}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Initial Waste Level (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={newBin.wasteLevel}
            onChange={e => setNewBin(prev => ({ ...prev, wasteLevel: parseInt(e.target.value) || 0 }))}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Device Status</label>
          <select
            className="-sql w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={newBin.deviceStatus}
            onChange={e => setNewBin(prev => ({ ...prev, deviceStatus: e.target.value }))}
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
            onChange={e => setNewBin(prev => ({ ...prev, maintenance: e.target.value }))}
          >
            <option value="OK">OK</option>
            <option value="Required">Required</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onSave}
            className="flex-1 bg-green-900 text-white py-2 rounded hover:bg-green-700 transition-colors disabled:bg-green-700"
            disabled={!newBin.id || !newBin.location || !newBin.coordinates?.lat || !newBin.coordinates?.lng}
          >
            Add Bin
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}