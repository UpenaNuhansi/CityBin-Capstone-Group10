export default function CreateAlertModal({ show, onClose, formData, onFormChange, onSave }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-6">Create New Alert</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Alert Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onFormChange}
            className="w-full border rounded p-2"
            placeholder="e.g., Notify when bin is full"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Condition *</label>
          <input
            type="text"
            name="condition"
            value={formData.condition}
            onChange={onFormChange}
            className="w-full border rounded p-2"
            placeholder="e.g., Bin A02 is full"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onFormChange}
            className="w-full border rounded p-2"
            placeholder="Optional description"
            rows="3"
          />
        </div>
        
        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            name="enabled"
            checked={formData.enabled}
            onChange={onFormChange}
            className="mr-2"
          />
          <label className="text-sm font-medium">Enabled</label>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={onSave}
            className="flex-1 bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded transition-colors duration-200"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}