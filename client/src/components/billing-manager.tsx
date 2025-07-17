import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { Order } from '@shared/schema';

interface BillingManagerProps {
  orders: Order[];
}

export default function BillingManager({ orders }: BillingManagerProps) {
  const { toast } = useToast();

  const markAsPaid = async (orderId: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: 'paid',
        paidAt: new Date()
      });
      
      toast({
        title: "Payment Processed",
        description: "Order has been marked as paid",
      });
    } catch (error) {
      console.error('Error marking order as paid:', error);
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-secondary flex items-center">
          <i className="fas fa-credit-card mr-3 text-primary"></i>
          Billing Manager
        </h3>
      </div>
      <div className="p-6 space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <i className="fas fa-receipt text-4xl text-gray-300 mb-4 block"></i>
            <p className="text-lg font-medium text-gray-500">No pending bills</p>
            <p className="text-sm text-gray-400">Ready orders will appear here for billing</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-secondary">Table {order.tableNumber}</p>
                <p className="text-sm text-gray-500">₹{order.totalAmount}</p>
                <p className="text-xs text-gray-400">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''} • {order.paymentMethod.toUpperCase()}
                </p>
              </div>
              <Button
                className="bg-success text-white hover:bg-success/90"
                onClick={() => markAsPaid(order.id)}
              >
                <i className="fas fa-check mr-1"></i>Mark Paid
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
