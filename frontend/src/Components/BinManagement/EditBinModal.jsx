import React from 'react';

export default function EditBinModal({ selectedBin, setSelectedBin, onSave, onClose }) {
  if (!selectedBin) return null;

  return (
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
            onChange={e => setSelectedBin(prev => ({ ...prev, location: e.target.value }))}
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
            onChange={e => setSelectedBin(prev => ({ ...prev, maintenance: e.target.value }))}
          >
            <option value="OK">OK</option>
            <option value="Required">Required</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onSave}
            className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}