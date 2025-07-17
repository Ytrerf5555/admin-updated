interface SidebarProps {
  orderCount: number;
  requestCount: number;
  lastSync: string;
}

export default function Sidebar({ orderCount, requestCount, lastSync }: SidebarProps) {
  return (
    <div className="w-64 bg-surface shadow-lg border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <i className="fas fa-hotel text-white text-lg"></i>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-secondary">Hotel Admin</h1>
            <p className="text-sm text-gray-500">Management Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-primary text-white">
          <i className="fas fa-list-ul w-5"></i>
          <span>Live Orders</span>
          <span className="ml-auto bg-white text-primary text-xs px-2 py-1 rounded-full font-medium">
            {orderCount}
          </span>
        </a>
        <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
          <i className="fas fa-credit-card w-5"></i>
          <span>Billing Manager</span>
        </a>
        <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
          <i className="fas fa-bell w-5"></i>
          <span>Service Requests</span>
          {requestCount > 0 && (
            <span className="ml-auto bg-error text-white text-xs px-2 py-1 rounded-full font-medium">
              {requestCount}
            </span>
          )}
        </a>
        <a href="#" className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
          <i className="fas fa-chart-bar w-5"></i>
          <span>Analytics</span>
        </a>
      </nav>

      {/* Status Indicator */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-gray-600">Real-time Connected</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">Last sync: {lastSync}</p>
      </div>
    </div>
  );
}
