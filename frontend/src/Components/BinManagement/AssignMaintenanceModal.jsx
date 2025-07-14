import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AssignMaintenanceModal({ selectedBin, setSelectedBin, onAssign, onClose }) {
  const [operators, setOperators] = useState([]);
  const [selectedOperatorId, setSelectedOperatorId] = useState('');

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const res = await api.get('/users/operators');
        setOperators(res.data.data);
      } catch (err) {
        console.error('Failed to load operators:', err);
      }
    };
    fetchOperators();
  }, []);

  if (!selectedBin) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Assign Maintenance</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Bin ID</label>
          <input className="w-full border rounded px-3 py-2 bg-gray-100" value={selectedBin.id} readOnly />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Location</label>
          <input className="w-full border rounded px-3 py-2 bg-gray-100" value={selectedBin.location} readOnly />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Assign to Operator</label>
          <select
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={selectedOperatorId}
            onChange={(e) => setSelectedOperatorId(e.target.value)}
          >
            <option value="">Select operator</option>
            {operators.map((op) => (
              <option key={op._id} value={op._id}>
                {op.username} ({op.uniqueId})
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 mt-6">
          <button
  onClick={() => onAssign(selectedOperatorId)}
  disabled={!selectedOperatorId}
  className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
>
  Assign
</button>

          <button
            onClick={onClose}
            className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
