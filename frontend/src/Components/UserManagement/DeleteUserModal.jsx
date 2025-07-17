function DeleteUserModal({ show, onCloseForm, onConfirm, currentUser }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Delete User</h2>
        <p className="mb-4">
          Are you sure you want to delete user <strong>{currentUser?.username}</strong> (ID: {currentUser?.uniqueId})?
        </p>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCloseForm} className="bg-gray-500 text-white p-2 rounded">
            Cancel
          </button>
          <button onClick={onConfirm} className="bg-red-600 text-white p-2 rounded">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteUserModal;