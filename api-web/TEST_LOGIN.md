# Test Login Credentials

Use these credentials to test the application after running the seed script.

## Demo Users

### Admin User
- Email: `admin@storeflow.com`
- Password: `Admin@123`
- Role: ADMIN
- Access: Full system access

### Staff User
- Email: `staff@storeflow.com`
- Password: `Staff@123`
- Role: STAFF
- Access: Inventory and order management

### Customer User
- Email: `customer@storeflow.com`
- Password: `Customer@123`
- Role: CUSTOMER
- Access: View products and place orders

## Login URL

http://localhost:3000/login

## Seeding Database

Run this command to create demo users:

```bash
npm run db:seed
```
