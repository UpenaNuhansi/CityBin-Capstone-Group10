import BinImage from "../../../assets/BIN.jpg";

function AlertsPage() {
  const notifications = [
    {
      id: 1,
      type: 'bin-status',
      title: 'Bin Status Alert',
      message: 'Your bin is now empty after collection.',
      isRead: false
    },
    {
      id: 2,
      type: 'collection',
      title: 'Collection Reminders',
      message: 'Collection delay due to weather conditions.',
      isRead: true
    },
    {
      id: 3,
      type: 'maintenance',
      title: 'Maintenance Alerts',
      message: 'Bin maintenance is scheduled for today.',
      isRead: false
    },
    {
      id: 4,
      type: 'rewards',
      title: 'Rewards & Achievements',
      message: 'You\'ve earned 50 points for proper waste disposal!',
      isRead: true
    },
    {
      id: 5,
      type: 'system',
      title: 'System Updates/ General Info.',
      message: 'Reminder: Separate waste before disposal for extra points.',
      isRead: false
    }
  ];
  
  const getIconForType = (type) => {
    // In a real app, you'd use proper SVG or icons
    return (
      <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white">
        <span>♻️</span>
      </div>
    );
  };
  
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold">Alerts & Notifications</h1>
        <div className="ml-3 bg-green-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs">
          5
        </div>
        <div className="ml-auto">
          <button className="p-1">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`p-4 rounded-md flex items-start ${notification.isRead ? 'bg-white' : 'bg-citybin-light-green'}`}
          >
            {getIconForType(notification.type)}
            <div className="ml-3">
              <h3 className="font-semibold">{notification.title}</h3>
              <p className="text-sm text-gray-700">{notification.message}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Bin image - hidden on small screens */}
      <div className="hidden md:block fixed right-6 bottom-6 w-1/4 max-w-xs">
        <img 
          src={BinImage}
          alt="Recycle bin" 
          className="w-full"
        />
      </div>
    </div>
  );
}

export default AlertsPage;