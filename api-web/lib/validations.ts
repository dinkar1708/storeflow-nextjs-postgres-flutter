import { z } from 'zod';

/**
 * Validation schemas using Zod
 *
 * Official Docs: https://zod.dev
 *
 * Benefits:
 * - Type-safe validation
 * - Clear error messages
 * - TypeScript type inference
 * - Composable schemas
 */

// Password validation regex patterns
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX = {
  uppercase: /[A-Z]/,
  lowercase: /[a-z]/,
  number: /[0-9]/,
  special: /[@$!%*?&#]/,
};

// Custom password validator
const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
  .refine((password) => PASSWORD_REGEX.uppercase.test(password), {
    message: 'Password must contain at least one uppercase letter',
  })
  .refine((password) => PASSWORD_REGEX.lowercase.test(password), {
    message: 'Password must contain at least one lowercase letter',
  })
  .refine((password) => PASSWORD_REGEX.number.test(password), {
    message: 'Password must contain at least one number',
  })
  .refine((password) => PASSWORD_REGEX.special.test(password), {
    message: 'Password must contain at least one special character (@$!%*?&#)',
  });

// ============================================================================
// Authentication Schemas
// ============================================================================

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: passwordSchema,
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
});

// ============================================================================
// User Management Schemas
// ============================================================================

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  newPassword: passwordSchema.optional(),
  currentPassword: z.string().optional(),
}).refine(
  (data) => {
    // If newPassword is provided, currentPassword must also be provided
    if (data.newPassword && !data.currentPassword) {
      return false;
    }
    return true;
  },
  {
    message: 'Current password is required when changing password',
    path: ['currentPassword'],
  }
);

export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: passwordSchema,
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  role: z.enum(['ADMIN', 'STAFF', 'CUSTOMER'], {
    errorMap: () => ({ message: 'Role must be ADMIN, STAFF, or CUSTOMER' }),
  }),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  role: z.enum(['ADMIN', 'STAFF', 'CUSTOMER']).optional(),
  isActive: z.boolean().optional(),
});

// ============================================================================
// Product Schemas
// ============================================================================

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200, 'Product name must be less than 200 characters'),
  description: z.string().optional(),
  price: z.union([
    z.number().positive('Price must be greater than 0'),
    z.string().transform((val, ctx) => {
      const num = parseFloat(val);
      if (isNaN(num) || num <= 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Price must be a valid positive number' });
        return z.NEVER;
      }
      return num;
    })
  ]),
  costPrice: z.union([
    z.number().positive().nullable(),
    z.string().transform((val, ctx) => {
      if (!val || val === '') return null;
      const num = parseFloat(val);
      if (isNaN(num) || num <= 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Cost price must be a valid positive number' });
        return z.NEVER;
      }
      return num;
    })
  ]).optional().nullable(),
  stock: z.union([
    z.number().int().min(0, 'Stock cannot be negative'),
    z.string().transform((val, ctx) => {
      const num = parseInt(val, 10);
      if (isNaN(num) || num < 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Stock must be a valid non-negative integer' });
        return z.NEVER;
      }
      return num;
    })
  ]).optional(),
  categoryId: z.string().min(1, 'Category is required'),
  sku: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

export const updateProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200, 'Product name must be less than 200 characters').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  price: z.number().positive('Price must be greater than 0').optional(),
  stock: z.number().int('Stock must be a whole number').min(0, 'Stock cannot be negative').optional(),
  categoryId: z.string().uuid('Invalid category ID').optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
  isActive: z.boolean().optional(),
});

// ============================================================================
// Category Schemas
// ============================================================================

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Category name must be less than 100 characters'),
  description: z.string().optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Category name must be less than 100 characters').optional(),
  description: z.string().optional(),
});

// ============================================================================
// Order Schemas
// ============================================================================

export const orderItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: z.number().int('Quantity must be a whole number').positive('Quantity must be greater than 0'),
  price: z.number().positive('Price must be greater than 0'),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
  total: z.number().optional(), // Legacy field - ignored, we calculate from items
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'], {
    errorMap: () => ({ message: 'Status must be PENDING, PROCESSING, COMPLETED, or CANCELLED' }),
  }),
});

// ============================================================================
// Type Inference (automatic TypeScript types from schemas)
// ============================================================================

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
