export default function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg px-20 py-7 shadow-lg">
        <h2 className="text-lg font-bold text-center mb-4">Are you sure?</h2>
        <div className="flex justify-center gap-15">
          <button
            className="bg-red-600 text-white px-7 py-2 rounded hover:bg-red-700 transition-colors duration-200"
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            className="bg-green-600 text-white px-7 py-2 rounded hover:bg-green-700 transition-colors duration-200"
            onClick={onCancel}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}