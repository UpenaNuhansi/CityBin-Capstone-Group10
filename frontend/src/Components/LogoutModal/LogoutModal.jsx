export default function LogoutModal({ onConfirm, onCancel }) {
  if (!onConfirm || !onCancel) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl px-10 py-8 shadow-2xl max-w-sm w-full transform transition-all duration-300 scale-100">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">
          Logout Confirmation
        </h2>

        <p className="text-center text-gray-600 mb-6 text-base">
          Are you sure you want to logout?
        </p>

        <div className="flex space-x-4">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg border border-green-700 text-green-700 hover:bg-green-100 transition duration-200"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 rounded-lg bg-red-700 hover:bg-red-600 text-white transition duration-200"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}