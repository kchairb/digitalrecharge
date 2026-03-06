export type Category = {
  id: number;
  name: string;
  slug: string;
  image_url?: string | null;
  created_at: string;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  category_id: number;
  price_dt: number;
  short_description: string;
  long_description: string;
  delivery_time: string;
  requirements: string;
  refund_policy: string;
  is_featured: boolean;
  is_pack?: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  categories?: Category | null;
};

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "delivered"
  | "refunded"
  | "cancelled";

export type PaymentMethod = "flouci" | "d17" | "bank_transfer";

export type Order = {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_name: string;
  whatsapp_phone: string;
  email: string | null;
  payment_method: PaymentMethod;
  status: OrderStatus;
  total_dt: number;
  proof_image_url: string | null;
  public_token: string;
  delivery_notes: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
};

export type OrderItem = {
  id: number;
  order_id: string;
  product_id: number;
  product_name: string;
  unit_price_dt: number;
  quantity: number;
  created_at: string;
};

export type CartItem = {
  lineId: string;
  productId: number;
  quantity: number;
  unitPriceDt?: number;
  provider?: string;
  amountUsd?: number;
  planPeriod?: "1_month" | "1_year";
  customRequest?: string;
};

export type Feedback = {
  id: number;
  customer_name: string;
  product_label: string | null;
  comment: string;
  rating: number;
  screenshot_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductPackItem = {
  pack_product_id: number;
  included_product_id: number;
  included_product?: Product | null;
};
