import { z } from "zod";

// Order status enum
export const OrderStatus = {
  WAITING: 'waiting',
  PREPARING: 'preparing',
  READY: 'ready',
  DELIVERED: 'delivered',
  PAID: 'paid',
  CANCELLED: 'cancelled'
} as const;

export type OrderStatusType = typeof OrderStatus[keyof typeof OrderStatus];

// Payment method enum
export const PaymentMethod = {
  CASH: 'cash',
  UPI: 'upi',
  CARD: 'card'
} as const;

export type PaymentMethodType = typeof PaymentMethod[keyof typeof PaymentMethod];

// Order item schema
export const orderItemSchema = z.object({
  name: z.string(),
  quantity: z.number().min(1),
  price: z.number().min(0),
});

export type OrderItem = z.infer<typeof orderItemSchema>;

// Order schema
export const orderSchema = z.object({
  id: z.string(),
  tableNumber: z.number().min(1),
  items: z.array(orderItemSchema),
  totalAmount: z.number().min(0),
  status: z.enum([OrderStatus.WAITING, OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.DELIVERED, OrderStatus.PAID, OrderStatus.CANCELLED]),
  paymentMethod: z.enum([PaymentMethod.CASH, PaymentMethod.UPI, PaymentMethod.CARD]),
  orderTime: z.date(),
  paidAt: z.date().optional(),
  notes: z.string().optional(),
});

export type Order = z.infer<typeof orderSchema>;

// Service request schema
export const serviceRequestSchema = z.object({
  id: z.string(),
  tableNumber: z.number().min(1),
  type: z.enum(['water', 'cleaning', 'napkins', 'assistance', 'other']),
  message: z.string(),
  status: z.enum(['pending', 'dismissed']),
  requestTime: z.date(),
  dismissedAt: z.date().optional(),
});

export type ServiceRequest = z.infer<typeof serviceRequestSchema>;

// Table schema
export const tableSchema = z.object({
  id: z.string(),
  number: z.number().min(1),
  status: z.enum(['available', 'occupied', 'reserved', 'cleaning']),
  capacity: z.number().min(1),
  currentOrderId: z.string().optional(),
});

export type Table = z.infer<typeof tableSchema>;

// Statistics schema
export const statsSchema = z.object({
  activeOrders: z.number().min(0),
  totalRevenue: z.number().min(0),
  occupiedTables: z.number().min(0),
  totalTables: z.number().min(0),
  pendingRequests: z.number().min(0),
});

export type Stats = z.infer<typeof statsSchema>;
