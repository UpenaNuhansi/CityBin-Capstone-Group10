export default function NavItem({ icon, text, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 p-4 w-full text-left hover:bg-green-800 transition-colors duration-200 ${
        active ? 'bg-green-800' : ''
      }`}
    >
      {icon}
      <span>{text}</span>
      {active && <span className="ml-auto">›</span>}
    </button>
  );
}