function EditUserModal({ show, onCloseForm, formData, onFormChange, onSave, currentUser }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md font-roboto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit User</h2>
        <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Unique ID</label>
            <input
              type="text"
              value={currentUser?.uniqueId || ''}
              className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 focus:outline-none"
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              className="w-full p-2 border rounded mt-1"
              value={formData.username}
              onChange={onFormChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Role</label>
            <select
              name="role"
              className="w-full p-2 border rounded mt-1"
              value={formData.role}
              onChange={onFormChange}
            >
              <option value="User">User</option>
              <option value="Operator">Operator</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Status</label>
            <select
              name="status"
              className="w-full p-2 border rounded mt-1"
              value={formData.status}
              onChange={onFormChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onCloseForm} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition">
              Cancel
            </button>
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserModal;