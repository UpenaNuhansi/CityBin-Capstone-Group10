import React from 'react';

export default function AssignMaintenanceModal({ selectedBin, setSelectedBin, onAssign, onClose }) {
  if (!selectedBin) return null;

  return (
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
            onChange={e => setSelectedBin(prev => ({ ...prev, maintenance: e.target.value }))}
          >
            <option value="OK">OK</option>
            <option value="Required">Required</option>
          </select>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onAssign}
            className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
          >
            Assign
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