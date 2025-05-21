export default function EditUserModal({ show, onClose, formData, onFormChange, onSave }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-6">Edit User Information</h2>

        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={onFormChange}
            className="w-full border rounded p-2"
            placeholder="Enter full name"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onFormChange}
            className="w-full border rounded p-2"
            placeholder="Enter email"
          />
        </div>

        {/* Password (optional) */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={onFormChange}
            className="w-full border rounded p-2"
            placeholder="Enter new password (optional)"
          />
        </div>

        {/* Role */}
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
            <option value="User">User</option>
          </select>
        </div>

        {/* Status */}
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

        {/* Buttons */}
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
