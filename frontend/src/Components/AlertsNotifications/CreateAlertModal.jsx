import { X } from 'lucide-react';

export default function CreateAlertModal({ show, onClose, formData, onFormChange, onSave }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Send Notification</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSave(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Target</label>
            <select
              name="target"
              value={formData.target}
              onChange={onFormChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            >
              <option value="AllUsers">All Users</option>
              <option value="AllOperators">All Operators</option>
              <option value="SpecificUsers">Specific Users</option>
              <option value="SpecificOperators">Specific Operators</option>
            </select>
          </div>
          {(formData.target === 'SpecificUsers' || formData.target === 'SpecificOperators') && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Specific IDs (comma-separated, e.g., CBU001, CBU002)
              </label>
              <input
                type="text"
                name="specificIds"
                value={formData.specificIds}
                onChange={onFormChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="CBU001, CBU002"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={onFormChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              rows="4"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}