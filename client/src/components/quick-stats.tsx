import type { Stats } from '@shared/schema';

interface QuickStatsProps {
  stats: Stats;
}

export default function QuickStats({ stats }: QuickStatsProps) {
  const capacityPercentage = Math.round((stats.occupiedTables / stats.totalTables) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-surface rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Orders</p>
            <p className="text-3xl font-bold text-secondary">{stats.activeOrders}</p>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <i className="fas fa-shopping-cart text-primary text-xl"></i>
          </div>
        </div>
        <div className="flex items-center mt-4 text-sm">
          <i className="fas fa-clock text-gray-400 mr-1"></i>
          <span className="text-gray-500">Real-time tracking</span>
        </div>
      </div>

      <div className="bg-surface rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-3xl font-bold text-secondary">₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
            <i className="fas fa-rupee-sign text-success text-xl"></i>
          </div>
        </div>
        <div className="flex items-center mt-4 text-sm">
          <i className="fas fa-arrow-up text-success mr-1"></i>
          <span className="text-success font-medium">Active orders</span>
        </div>
      </div>

      <div className="bg-surface rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Occupied Tables</p>
            <p className="text-3xl font-bold text-secondary">{stats.occupiedTables}/{stats.totalTables}</p>
          </div>
          <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
            <i className="fas fa-chair text-warning text-xl"></i>
          </div>
        </div>
        <div className="flex items-center mt-4 text-sm">
          <span className="text-gray-500">{capacityPercentage}% capacity</span>
        </div>
      </div>

      <div className="bg-surface rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pending Requests</p>
            <p className="text-3xl font-bold text-secondary">{stats.pendingRequests}</p>
          </div>
          <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
            <i className="fas fa-exclamation-triangle text-error text-xl"></i>
          </div>
        </div>
        <div className="flex items-center mt-4 text-sm">
          {stats.pendingRequests > 0 ? (
            <span className="text-error font-medium">Needs attention</span>
          ) : (
            <span className="text-success font-medium">All clear</span>
          )}
        </div>
      </div>
    </div>
  );
}
