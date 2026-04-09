/**
 * Demo users from TEST_LOGIN.md — created by `npm run db:seed`.
 * Keep in sync with api-web/TEST_LOGIN.md when credentials change.
 */
export const DEMO_SEED_ACCOUNTS = [
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
