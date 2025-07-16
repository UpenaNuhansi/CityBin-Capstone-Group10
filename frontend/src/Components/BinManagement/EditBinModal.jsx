import React from 'react';

export default function EditBinModal({ selectedBin, setSelectedBin, onSave, onClose }) {
  if (!selectedBin) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Edit Bin Details
        </h2>

        <div className="space-y-4">
          {/* Bin ID (Read-Only) */}
          <div>
            <label className="block text-sm text-gray-600 font-medium mb-1">Bin ID</label>
            <input
              type="text"
              className="w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
              value={selectedBin.id}
              readOnly
            />
          </div>

          {/* Location Dropdown */}
          <div>
            <label className="block text-sm text-gray-600 font-medium mb-1">Location</label>
            <select
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
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

          {/* Waste Level (Read-Only) */}
          <div>
            <label className="block text-sm text-gray-600 font-medium mb-1">Waste Level</label>
            <input
              type="text"
              className="w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
              value={`${selectedBin.wasteLevel.toFixed(0)}%`}
              readOnly
            />
          </div>

          {/* Maintenance Status */}
          <div>
            <label className="block text-sm text-gray-600 font-medium mb-1">Maintenance Status</label>
            <select
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={selectedBin.maintenance}
              onChange={e => setSelectedBin(prev => ({ ...prev, maintenance: e.target.value }))}
            >
              <option value="OK">OK</option>
              <option value="Required">Required</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={onSave}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}