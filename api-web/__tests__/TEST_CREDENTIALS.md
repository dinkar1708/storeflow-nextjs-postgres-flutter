# Test Login Credentials

## Test Users for Login

### Admin User
- **Email**: admin@storeflow.com
- **Password**: Admin@123
- **Role**: ADMIN

### Staff User
- **Email**: staff@storeflow.com
- **Password**: Staff@123
- **Role**: STAFF

### Customer User
- **Email**: customer@storeflow.com
- **Password**: Customer@123
- **Role**: CUSTOMER

## How to Create Test Users

Run this to create test users in database:

```bash
cd api-web
npx prisma db seed
```

## Login URL

http://localhost:3000/login

## API Endpoints

### Register New User
```bash
POST http://localhost:3000/api/auth/register

Body:
{
  "email": "user@example.com",
  "password": "Password@123",
  "name": "Your Name"
}
```

### Login
Use the login form at http://localhost:3000/login
