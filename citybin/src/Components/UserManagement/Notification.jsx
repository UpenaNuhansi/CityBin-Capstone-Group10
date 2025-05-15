export default function Notification({ show, message, type }) {
  if (!show) return null;

  return (
    <div className={`p-4 mb-4 rounded ${type === 'success' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
      {message}
    </div>
  );
}