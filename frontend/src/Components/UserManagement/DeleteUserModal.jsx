import React from 'react';

function DeleteUserModal({ show, onCloseForm, onConfirm, currentUser }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl w-full max-w-md shadow-lg transform transition-transform scale-100 animate-fadeIn">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-red-600 mb-4 flex items-center gap-2">
          Delete User
        </h2>

        {/* Message */}
        <p className="text-gray-700 mb-6">
          Are you sure you want to delete user{' '}
          <span className="font-semibold text-gray-900">{currentUser?.username}</span>{' '}
          (ID: <span className="font-mono">{currentUser?.uniqueId}</span>)? This action cannot be undone.
        </p>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCloseForm}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteUserModal;
