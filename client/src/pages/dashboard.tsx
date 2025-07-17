import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Sidebar from '@/components/sidebar';
import QuickStats from '@/components/quick-stats';
import LiveOrdersPanel from '@/components/live-orders-panel';
import BillingManager from '@/components/billing-manager';
import RequestsManager from '@/components/requests-manager';
import type { Order, ServiceRequest, Stats } from '@shared/schema';

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [stats, setStats] = useState<Stats>({
    activeOrders: 0,
    totalRevenue: 0,
    occupiedTables: 0,
    totalTables: 20,
    pendingRequests: 0,
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastSync, setLastSync] = useState(new Date());

  // Real-time listener for orders
  useEffect(() => {
    const ordersQuery = query(
      collection(db, 'orders'),
      where('status', 'in', ['waiting', 'preparing', 'ready']),
      orderBy('orderTime', 'desc')
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersList: Order[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        ordersList.push({
          id: doc.id,
          tableNumber: data.tableNumber,
          items: data.items,
          totalAmount: data.totalAmount,
          status: data.status,
          paymentMethod: data.paymentMethod,
          orderTime: data.orderTime?.toDate() || new Date(),
          paidAt: data.paidAt?.toDate(),
          notes: data.notes,
        });
      });
      setOrders(ordersList);
      setLastSync(new Date());
    });

    return () => unsubscribe();
  }, []);

  // Real-time listener for service requests
  useEffect(() => {
    const requestsQuery = query(
      collection(db, 'requests'),
      where('status', '==', 'pending'),
      orderBy('requestTime', 'desc')
    );

    const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
      const requestsList: ServiceRequest[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        requestsList.push({
          id: doc.id,
          tableNumber: data.tableNumber,
          type: data.type,
          message: data.message,
          status: data.status,
          requestTime: data.requestTime?.toDate() || new Date(),
          dismissedAt: data.dismissedAt?.toDate(),
        });
      });
      setServiceRequests(requestsList);
      setLastSync(new Date());
    });

    return () => unsubscribe();
  }, []);

  // Calculate stats from orders and requests
  useEffect(() => {
    const activeOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const occupiedTables = new Set(orders.map(order => order.tableNumber)).size;
    const pendingRequests = serviceRequests.length;

    setStats({
      activeOrders,
      totalRevenue,
      occupiedTables,
      totalTables: 20,
      pendingRequests,
    });
  }, [orders, serviceRequests]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatLastSync = () => {
    const seconds = Math.floor((new Date().getTime() - lastSync.getTime()) / 1000);
    if (seconds < 60) {
      return `${seconds} seconds ago`;
    }
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        orderCount={stats.activeOrders} 
        requestCount={stats.pendingRequests} 
        lastSync={formatLastSync()}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-surface shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-secondary">Live Orders Dashboard</h2>
              <p className="text-gray-500">Monitor and manage hotel orders in real-time</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-secondary">
                  {currentTime.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit', 
                    hour12: true 
                  })}
                </p>
                <p className="text-xs text-gray-500">
                  {currentTime.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <i className="fas fa-cog text-lg"></i>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          <QuickStats stats={stats} />
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2">
              <LiveOrdersPanel orders={orders} />
            </div>
            
            <div className="space-y-6">
              <BillingManager orders={orders.filter(order => order.status === 'ready')} />
              <RequestsManager requests={serviceRequests} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
