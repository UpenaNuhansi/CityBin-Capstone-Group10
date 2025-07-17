import { CheckCircle, XCircle } from 'lucide-react';

export default function Notification({ show, message, type }) {
  if (!show) return null;

  const isSuccess = type === 'success';

  return (
    <div
      className={`fixed top-6 right-6 z-50 max-w-sm w-full flex items-start gap-3 px-4 py-3 rounded-md border shadow-lg animate-fade-in-down transition-all duration-300 ${
        isSuccess
          ? 'bg-green-50 border-green-300 text-green-800'
          : 'bg-red-50 border-red-300 text-red-800'
      }`}
    >
      <div className="mt-1">
        {isSuccess ? (
          <CheckCircle className="w-6 h-6 text-green-600" />
        ) : (
          <XCircle className="w-6 h-6 text-red-600" />
        )}
      </div>

      <div className="text-sm font-medium leading-5">{message}</div>
    </div>
  );
}