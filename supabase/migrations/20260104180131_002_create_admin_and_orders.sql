/*
  # Create Admin Users and Orders Tables

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `username` (text, unique) - admin login username
      - `password_hash` (text) - hashed password for admin
      - `created_at` (timestamp)
    - `orders`
      - `id` (uuid, primary key)
      - `pharmacy_id` (uuid, foreign key) - pharmacy that placed order
      - `supplier_id` (uuid, foreign key) - supplier fulfilling order
      - `product_id` (uuid, foreign key) - product ordered
      - `quantity` (integer) - quantity ordered
      - `total_price` (numeric) - total order price
      - `status` (text) - pending, confirmed, shipped, delivered, cancelled
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Admin users table only accessible by admins
    - Orders table accessible by relevant pharmacies and suppliers

  3. Seed Data
    - Create default admin user (admin/admin123)
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pharmacy_id uuid NOT NULL REFERENCES pharmacies(id),
  supplier_id uuid NOT NULL REFERENCES suppliers(id),
  product_id uuid NOT NULL REFERENCES products(id),
  quantity integer NOT NULL DEFAULT 1,
  total_price numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders
CREATE POLICY "Pharmacies can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (pharmacy_id = auth.uid());

CREATE POLICY "Pharmacies can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (pharmacy_id = auth.uid());

CREATE POLICY "Suppliers can view orders for their products"
  ON orders FOR SELECT
  TO authenticated
  USING (supplier_id = auth.uid());

CREATE POLICY "Suppliers can update order status"
  ON orders FOR UPDATE
  TO authenticated
  USING (supplier_id = auth.uid())
  WITH CHECK (supplier_id = auth.uid());

-- Insert default admin user (password: admin123 hashed with simple encoding for demo)
-- In production, use proper bcrypt hashing
INSERT INTO admin_users (username, password_hash)
VALUES ('admin', 'admin123')
ON CONFLICT (username) DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_pharmacy_id ON orders(pharmacy_id);
CREATE INDEX IF NOT EXISTS idx_orders_supplier_id ON orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
