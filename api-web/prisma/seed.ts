import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo users with hashed passwords
  console.log('Creating admin accounts...');

  // Admin accounts (CANNOT be created via public signup)
  const admin1 = await prisma.user.upsert({
    where: { email: 'admin@storeflow.com' },
    update: {},
    create: {
      email: 'admin@storeflow.com',
      password: await bcrypt.hash('Admin@123', 12),
      name: 'System Admin',
      role: 'ADMIN',
    },
  });

  const admin2 = await prisma.user.upsert({
    where: { email: 'john.admin@storeflow.com' },
    update: {},
    create: {
      email: 'john.admin@storeflow.com',
      password: await bcrypt.hash('JohnAdmin@456', 12),
      name: 'John Anderson',
      role: 'ADMIN',
    },
  });

  const admin3 = await prisma.user.upsert({
    where: { email: 'sarah.admin@storeflow.com' },
    update: {},
    create: {
      email: 'sarah.admin@storeflow.com',
      password: await bcrypt.hash('SarahAdmin@789', 12),
      name: 'Sarah Wilson',
      role: 'ADMIN',
    },
  });

  console.log('Created admin accounts:', { admin1, admin2, admin3 });

  // Staff accounts
  console.log('Creating staff accounts...');

  const staff1 = await prisma.user.upsert({
    where: { email: 'staff@storeflow.com' },
    update: {},
    create: {
      email: 'staff@storeflow.com',
      password: await bcrypt.hash('Staff@123', 12),
      name: 'Staff User',
      role: 'STAFF',
    },
  });

  const staff2 = await prisma.user.upsert({
    where: { email: 'mike.staff@storeflow.com' },
    update: {},
    create: {
      email: 'mike.staff@storeflow.com',
      password: await bcrypt.hash('MikeStaff@456', 12),
      name: 'Mike Johnson',
      role: 'STAFF',
    },
  });

  console.log('Created staff accounts:', { staff1, staff2 });

  // Customer accounts
  console.log('Creating customer accounts...');

  const customer1 = await prisma.user.upsert({
    where: { email: 'customer@storeflow.com' },
    update: {},
    create: {
      email: 'customer@storeflow.com',
      password: await bcrypt.hash('Customer@123', 12),
      name: 'Customer User',
      role: 'CUSTOMER',
    },
  });

  const customer2 = await prisma.user.upsert({
    where: { email: 'emma.customer@storeflow.com' },
    update: {},
    create: {
      email: 'emma.customer@storeflow.com',
      password: await bcrypt.hash('EmmaCustomer@456', 12),
      name: 'Emma Davis',
      role: 'CUSTOMER',
    },
  });

  console.log('Created customer accounts:', { customer1, customer2 });

  // Create demo categories
  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic devices and gadgets',
    },
  });

  const clothing = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: {},
    create: {
      name: 'Clothing',
      slug: 'clothing',
      description: 'Apparel and fashion',
    },
  });

  console.log('Created categories:', { electronics, clothing });

  // Create demo products
  const product1 = await prisma.product.create({
    data: {
      name: 'Laptop',
      description: 'High-performance laptop',
      price: 999.99,
      stock: 10,
      sku: 'LAPTOP-001',
      categoryId: electronics.id,
      images: ['/images/laptop.jpg'],
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'T-Shirt',
      description: 'Cotton t-shirt',
      price: 19.99,
      stock: 50,
      sku: 'TSHIRT-001',
      categoryId: clothing.id,
      images: ['/images/tshirt.jpg'],
    },
  });

  console.log('Created products:', { product1, product2 });

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
