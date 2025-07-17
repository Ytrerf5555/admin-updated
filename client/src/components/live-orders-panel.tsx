import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Order, OrderStatusType } from '@shared/schema';

interface LiveOrdersPanelProps {
  orders: Order[];
}

export default function LiveOrdersPanel({ orders }: LiveOrdersPanelProps) {
  const { toast } = useToast();

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatusType) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        ...(newStatus === 'paid' && { paidAt: new Date() })
      });
      
      toast({
        title: "Order Updated",
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      waiting: { color: 'bg-error/10 text-error', icon: 'fas fa-hourglass-half', label: 'Waiting' },
      preparing: { color: 'bg-warning/10 text-warning', icon: 'fas fa-clock', label: 'Preparing' },
      ready: { color: 'bg-success/10 text-success', icon: 'fas fa-check-circle', label: 'Ready' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.waiting;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <i className={`${config.icon} mr-2`}></i>
        {config.label}
      </span>
    );
  };

  const getPaymentBadge = (method: string) => {
    if (method === 'upi') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
          <i className="fas fa-credit-card mr-1"></i>UPI
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
        <i className="fas fa-money-bill mr-1"></i>Cash
      </span>
    );
  };

  const renderActionButtons = (order: Order) => {
    switch (order.status) {
      case 'waiting':
        return (
          <Button
            size="sm"
            variant="outline"
            className="text-warning hover:text-warning/80 border-warning/20"
            onClick={() => updateOrderStatus(order.id, 'preparing')}
          >
            <i className="fas fa-play mr-1"></i>Start
          </Button>
        );
      case 'preparing':
        return (
          <Button
            size="sm"
            variant="outline"
            className="text-success hover:text-success/80 border-success/20"
            onClick={() => updateOrderStatus(order.id, 'ready')}
          >
            <i className="fas fa-check mr-1"></i>Ready
          </Button>
        );
      case 'ready':
        return (
          <Button
            size="sm"
            className="bg-success text-white hover:bg-success/90"
            onClick={() => updateOrderStatus(order.id, 'delivered')}
          >
            <i className="fas fa-truck mr-1"></i>Deliver
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-secondary">Live Orders</h3>
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          </div>
          <button className="text-sm text-primary hover:text-primary/80 font-medium">
            <i className="fas fa-sync-alt mr-2"></i>Refresh
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Table</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  <i className="fas fa-inbox text-4xl text-gray-300 mb-4 block"></i>
                  <p className="text-lg font-medium">No active orders</p>
                  <p className="text-sm">New orders will appear here in real-time</p>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-semibold">
                        T{order.tableNumber}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-secondary">Table {order.tableNumber}</p>
                        <p className="text-xs text-gray-500">
                          {order.orderTime.toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            minute: '2-digit', 
                            hour12: true 
                          })}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-secondary">
                      {order.items.map((item, index) => (
                        <p key={index} className={index === 0 ? "font-medium" : "text-gray-500"}>
                          {item.name} × {item.quantity}
                        </p>
                      ))}
                    </div>
                    <div className="flex space-x-2 mt-2">
                      {getPaymentBadge(order.paymentMethod)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-secondary">₹{order.totalAmount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      {renderActionButtons(order)}
                      <button 
                        className="text-primary hover:text-primary/80" 
                        title="View Details"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button 
                        className="text-error hover:text-error/80" 
                        title="Cancel Order"
                        onClick={() => updateOrderStatus(order.id, 'cancelled')}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
