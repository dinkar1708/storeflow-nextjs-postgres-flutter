// Test Utilities for API Testing
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:3001';

// Test user management
export async function createTestUser(overrides = {}) {
  const timestamp = Date.now();
  const email = overrides.email || `test${timestamp}@example.com`;
  const password = overrides.password || 'TestPassword@123';
  const name = overrides.name || 'Test User';
  const role = overrides.role || 'CUSTOMER'; // Default to CUSTOMER if not specified

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role,
    },
  });

  // Return user with plain password for testing
  return {
    ...user,
    plainPassword: password,
  };
}

export async function deleteTestUser(userId) {
  if (!userId) return;

  try {
    await prisma.user.delete({
      where: { id: userId },
    });
  } catch (error) {
    // User might not exist, ignore error
    console.warn(`Could not delete user ${userId}:`, error.message);
  }
}

export async function deleteTestUserByEmail(email) {
  if (!email) return;

  try {
    await prisma.user.delete({
      where: { email },
    });
  } catch (error) {
    // User might not exist, ignore error
  }
}

export async function cleanupAllTestUsers() {
  try {
    // Delete users with test email pattern
    await prisma.user.deleteMany({
      where: {
        OR: [
          { email: { contains: 'test' } },
          { email: { contains: 'example.com' } },
        ],
      },
    });
  } catch (error) {
    console.warn('Error cleaning up test users:', error.message);
  }
}

// HTTP helpers
export async function makeRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  return {
    status: response.status,
    data,
    ok: response.ok,
    headers: response.headers,
  };
}

export async function registerUser(userData) {
  return makeRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function loginUser(email, password) {
  return makeRequest('/api/auth/callback/credentials', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      callbackUrl: '/dashboard',
    }),
  });
}

// Cleanup on exit
export async function closePrisma() {
  await prisma.$disconnect();
}
