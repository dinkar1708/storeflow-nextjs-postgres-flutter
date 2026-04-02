// User Roles
export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  CUSTOMER = 'CUSTOMER',
}

// Order Status
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  PACKED = 'PACKED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

// Payment Methods
export enum PaymentMethod {
  CASH = 'cash',
  CARD = 'card',
  UPI = 'upi',
  NET_BANKING = 'netbanking',
}
