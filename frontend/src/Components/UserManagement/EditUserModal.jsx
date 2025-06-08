// import { Dialog, Transition } from '@headlessui/react';
// import { Fragment } from 'react';

// export default function EditUserModal({ show, onCloseForm, formData, onFormChange, onSave, currentUser }) {
//   return (
//     <Transition appear show={show} as={Fragment}>
//       <Dialog as="div" className="relative z-10" onClose={onCloseForm}>
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black bg-opacity-50" />
//         </Transition.Child>

//         <div className="fixed inset-0 overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4 text-center">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 scale-95"
//               enterTo="opacity-100 scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-95"
//             >
//               <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
//                 <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
//                   Edit User
//                 </Dialog.Title>
//                 <div className="mt-2">
//                   <form className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Username</label>
//                       <input
//                         type="text"
//                         name="username"
//                         value={formData.username}
//                         onChange={onFormChange}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
//                         placeholder="Enter username"
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Role</label>
//                       <select
//                         name="role"
//                         value={formData.role}
//                         onChange={onFormChange}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
//                       >
//                         <option value="Admin">Admin</option>
//                         <option value="Operator">Operator</option>
//                         <option value="User">User</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700">Status</label>
//                       <select
//                         name="status"
//                         value={formData.status}
//                         onChange={onFormChange}
//                         className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
//                       >
//                         <option value="Active">Active</option>
//                         <option value="Inactive">Inactive</option>
//                       </select>
//                     </div>
//                   </form>
//                 </div>
//                 <div className="mt-4 flex justify-end">
//                   <button
//                     type="button"
//                     className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
//                     onClick={onCloseForm}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="button"
//                     className="ml-2 inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus:bg-green-500 focus-visible:ring-offset-2"
//                     onClick={onSave}
//                   >
//                     Save
//                   </button>
//                 </div>
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// }


function EditUserModal({ show, onCloseForm, formData, onFormChange, onSave, currentUser }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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