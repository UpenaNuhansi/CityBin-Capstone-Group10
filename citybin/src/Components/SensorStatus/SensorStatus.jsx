export default function SensorStatus({ name, active, onToggle }) {
  return (
    <div className="flex justify-between items-center mb-3">
      <div>{name}</div>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors duration-300 ${active ? 'bg-green-500 justify-end' : 'bg-red-500 justify-start'}`}
      >
        <div className="w-4 h-4 bg-white rounded-full transition-transform duration-300"></div>
      </button>
    </div>
  );
}
