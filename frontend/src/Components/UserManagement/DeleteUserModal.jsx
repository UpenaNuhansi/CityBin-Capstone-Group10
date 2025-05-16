export default function DeleteUserModal({ show, onClose, onConfirm, currentUser }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-6">Delete User</h2>
        
        <div className="mb-6 text-center">
          <p className="text-lg mb-2">Are you sure you want to delete this user?</p>
          <p className="font-medium text-gray-600">{currentUser?.name} ({currentUser?.role})</p>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded transition-colors duration-200"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors duration-200"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}