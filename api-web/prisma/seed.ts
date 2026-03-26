import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo users
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const staffPassword = await bcrypt.hash('Staff@123', 12);
  const customerPassword = await bcrypt.hash('Customer@123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@storeflow.com' },
    update: {},
    create: {
      email: 'admin@storeflow.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: 'staff@storeflow.com' },
    update: {},
    create: {
      email: 'staff@storeflow.com',
      password: staffPassword,
      name: 'Staff User',
      role: 'STAFF',
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: 'customer@storeflow.com' },
    update: {},
    create: {
      email: 'customer@storeflow.com',
      password: customerPassword,
      name: 'Customer User',
      role: 'CUSTOMER',
    },
  });

  console.log('Created users:', { admin, staff, customer });

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
