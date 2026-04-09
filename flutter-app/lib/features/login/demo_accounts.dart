/// Demo users from `api-web/TEST_LOGIN.md` (created by `npm run db:seed`).
/// Keep in sync with `api-web/__tests__/auth/demo-seed-credentials.js`.
class DemoAccount {
  const DemoAccount({
    required this.group,
    required this.label,
    required this.email,
    required this.password,
    required this.role,
  });

  final String group;
  final String label;
  final String email;
  final String password;
  final String role;
}

const List<DemoAccount> kDemoAccounts = [
  DemoAccount(
    group: 'Admin',
    label: 'System Admin',
    email: 'admin@storeflow.com',
    password: 'Admin@123',
    role: 'ADMIN',
  ),
  DemoAccount(
    group: 'Admin',
    label: 'John Anderson',
    email: 'john.admin@storeflow.com',
    password: 'JohnAdmin@456',
    role: 'ADMIN',
  ),
  DemoAccount(
    group: 'Admin',
    label: 'Sarah Wilson',
    email: 'sarah.admin@storeflow.com',
    password: 'SarahAdmin@789',
    role: 'ADMIN',
  ),
  DemoAccount(
    group: 'Staff',
    label: 'Staff User',
    email: 'staff@storeflow.com',
    password: 'Staff@123',
    role: 'STAFF',
  ),
  DemoAccount(
    group: 'Staff',
    label: 'Mike Johnson',
    email: 'mike.staff@storeflow.com',
    password: 'MikeStaff@456',
    role: 'STAFF',
  ),
  DemoAccount(
    group: 'Customer',
    label: 'Customer User',
    email: 'customer@storeflow.com',
    password: 'Customer@123',
    role: 'CUSTOMER',
  ),
  DemoAccount(
    group: 'Customer',
    label: 'Emma Davis',
    email: 'emma.customer@storeflow.com',
    password: 'EmmaCustomer@456',
    role: 'CUSTOMER',
  ),
];
