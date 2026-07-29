/**
 * Demo login accounts for DEVELOPMENT ONLY.
 *
 * Security Notes:
 * - These accounts are only loaded in NODE_ENV=development
 * - Production builds exclude this file via tree-shaking
 * - Database seed script validates NODE_ENV before creating accounts
 * - Never deploy these accounts to production databases
 *
 * Usage: Run `npm run db:seed` in development
 */

// Runtime check to prevent accidental usage in production
if (process.env.NODE_ENV === 'production') {
  throw new Error(
    'SECURITY: demo-login-accounts.ts should never be imported in production. ' +
      'Check your build configuration and imports.'
  );
}

export type DemoLoginAccount = {
  group: 'Admin' | 'Staff' | 'Customer';
  label: string;
  email: string;
  password: string;
  role: string;
};

export const DEMO_LOGIN_ACCOUNTS: DemoLoginAccount[] = [
  {
    group: 'Admin',
    label: 'System Admin',
    email: 'admin@storeflow.com',
    password: 'Admin@123',
    role: 'ADMIN',
  },
  {
    group: 'Admin',
    label: 'John Anderson',
    email: 'john.admin@storeflow.com',
    password: 'JohnAdmin@456',
    role: 'ADMIN',
  },
  {
    group: 'Admin',
    label: 'Sarah Wilson',
    email: 'sarah.admin@storeflow.com',
    password: 'SarahAdmin@789',
    role: 'ADMIN',
  },
  {
    group: 'Staff',
    label: 'Staff User',
    email: 'staff@storeflow.com',
    password: 'Staff@123',
    role: 'STAFF',
  },
  {
    group: 'Staff',
    label: 'Mike Johnson',
    email: 'mike.staff@storeflow.com',
    password: 'MikeStaff@456',
    role: 'STAFF',
  },
  {
    group: 'Customer',
    label: 'Customer User',
    email: 'customer@storeflow.com',
    password: 'Customer@123',
    role: 'CUSTOMER',
  },
  {
    group: 'Customer',
    label: 'Emma Davis',
    email: 'emma.customer@storeflow.com',
    password: 'EmmaCustomer@456',
    role: 'CUSTOMER',
  },
];
