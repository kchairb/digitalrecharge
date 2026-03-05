import { z } from "zod";

export const paymentMethodSchema = z.enum(["flouci", "d17", "bank_transfer"]);

export const checkoutSchema = z.object({
  customer_name: z.string().min(2, "Name is required"),
  whatsapp_phone: z
    .string()
    .min(8, "Phone is required")
    .regex(/^\+?[0-9\s-]{8,20}$/, "Invalid phone number"),
  email: z
    .string()
    .email("Invalid email")
    .optional()
    .or(z.literal("")),
  payment_method: paymentMethodSchema,
});

export const authSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  full_name: z.string().min(2, "Name is required"),
  whatsapp_phone: z
    .string()
    .min(8, "Phone is required")
    .regex(/^\+?[0-9\s-]{8,20}$/, "Invalid phone number"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  slug: z.string().min(2, "Slug is required"),
  image_url: z.string().url("Image URL must be valid").optional().or(z.literal("")),
});

export const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  slug: z.string().min(2, "Slug is required"),
  category_id: z.coerce.number().int().positive(),
  price_dt: z.coerce.number().int().positive(),
  short_description: z.string().min(10),
  long_description: z.string().min(10),
  delivery_time: z.string().min(2),
  requirements: z.string().min(2),
  refund_policy: z.string().min(2),
  image_url: z.string().url("Image URL must be valid").or(z.literal("")),
  is_featured: z.boolean().default(false),
});

export const orderStatusSchema = z.enum([
  "pending_payment",
  "paid",
  "delivered",
  "refunded",
  "cancelled",
]);

export const feedbackSchema = z.object({
  customer_name: z.string().min(2, "Customer name is required"),
  product_label: z.string().optional().or(z.literal("")),
  comment: z.string().min(8, "Feedback text is required"),
  rating: z.coerce.number().int().min(1).max(5),
  screenshot_url: z.string().url("Screenshot URL must be valid").optional().or(z.literal("")),
  is_published: z.boolean().default(true),
});
