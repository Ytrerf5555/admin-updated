import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { ServiceRequest } from '@shared/schema';

interface RequestsManagerProps {
  requests: ServiceRequest[];
}

export default function RequestsManager({ requests }: RequestsManagerProps) {
  const { toast } = useToast();

  const dismissRequest = async (requestId: string) => {
    try {
      await updateDoc(doc(db, 'requests', requestId), {
        status: 'dismissed',
        dismissedAt: new Date()
      });
      
      toast({
        title: "Request Dismissed",
        description: "Service request has been marked as completed",
      });
    } catch (error) {
      console.error('Error dismissing request:', error);
      toast({
        title: "Error",
        description: "Failed to dismiss request",
        variant: "destructive",
      });
    }
  };

  const getRequestTypeBadge = (type: string) => {
    const typeConfig = {
      water: { color: 'bg-error/10 text-error', icon: 'fas fa-tint' },
      cleaning: { color: 'bg-warning/10 text-warning', icon: 'fas fa-broom' },
      napkins: { color: 'bg-warning/10 text-warning', icon: 'fas fa-tissue' },
      assistance: { color: 'bg-primary/10 text-primary', icon: 'fas fa-user-tie' },
      other: { color: 'bg-gray-100 text-gray-700', icon: 'fas fa-question' },
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.other;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <i className={`${config.icon} mr-1`}></i>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const getRequestPriorityColor = (type: string) => {
    switch (type) {
      case 'water':
        return 'border-error/20 bg-error/5';
      case 'cleaning':
        return 'border-warning/20 bg-warning/5';
      case 'assistance':
        return 'border-primary/20 bg-primary/5';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="bg-surface rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-secondary flex items-center">
          <i className="fas fa-bell mr-3 text-error"></i>
          Service Requests
        </h3>
      </div>
      <div className="p-6 space-y-4">
        {requests.length === 0 ? (
          <div className="text-center py-8">
            <i className="fas fa-bell text-4xl text-gray-300 mb-4 block"></i>
            <p className="text-lg font-medium text-gray-500">No pending requests</p>
            <p className="text-sm text-gray-400">Service requests will appear here in real-time</p>
          </div>
        ) : (
          requests.map((request) => (
            <div 
              key={request.id} 
              className={`p-4 border rounded-lg ${getRequestPriorityColor(request.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-secondary">Table {request.tableNumber}</span>
                    <span className="text-xs text-gray-500">{formatTimeAgo(request.requestTime)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{request.message}</p>
                  <div className="flex space-x-2">
                    {getRequestTypeBadge(request.type)}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-3 text-success hover:text-success/80"
                  onClick={() => dismissRequest(request.id)}
                  title="Dismiss Request"
                >
                  <i className="fas fa-check-circle"></i>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
