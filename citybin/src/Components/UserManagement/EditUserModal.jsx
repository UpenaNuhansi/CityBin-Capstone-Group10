export default function EditUserModal({ show, onClose, formData, onFormChange, onSave, currentUser }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-6">Edit User Information</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onFormChange}
            className="w-full border rounded p-2"
            placeholder="Value"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={onFormChange}
            className="w-full border rounded p-2 bg-white pr-8"
          >
            <option value="Admin">Admin</option>
            <option value="Operator">Operator</option>
            <option value="Manager">Manager</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={onFormChange}
            className="w-full border rounded p-2 bg-white pr-8"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
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