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
            placeholder="e.g., SU06"
            value={newBin.id}
            onChange={e => setNewBin(prev => ({ ...prev, id: e.target.value }))}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Location</label>
          <select
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={newBin.location}
            onChange={e => setNewBin(prev => ({ ...prev, location: e.target.value }))}
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
            onChange={e => setNewBin(prev => ({ ...prev, wasteLevel: parseInt(e.target.value) || 0 }))}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Device Status</label>
          <select
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
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
            disabled={!newBin.id || !newBin.location}
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