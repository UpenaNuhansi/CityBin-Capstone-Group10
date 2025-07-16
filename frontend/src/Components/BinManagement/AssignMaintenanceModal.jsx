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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Assign Maintenance</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bin ID</label>
            <input
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-800"
              value={selectedBin.id}
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-800"
              value={selectedBin.location}
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Operator</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
              value={selectedOperatorId}
              onChange={(e) => setSelectedOperatorId(e.target.value)}
            >
              <option value="">Select an operator</option>
              {operators.map((op) => (
                <option key={op._id} value={op._id}>
                  {op.username} ({op.uniqueId})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between mt-8 space-x-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onAssign(selectedOperatorId)}
            disabled={!selectedOperatorId}
            className={`flex-1 py-2 rounded-lg text-white transition ${
              selectedOperatorId
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-green-400 cursor-not-allowed'
            }`}
          >
            Assign
          </button>
        </div>

        {/* Close button in corner */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          title="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}