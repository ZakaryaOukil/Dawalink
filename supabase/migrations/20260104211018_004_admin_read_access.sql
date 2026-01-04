/*
  # Admin Dashboard Read Access

  1. Purpose
    - Allow admin dashboard to read all data from tables
    - Admin authenticates separately via admin_users table
    - Admin needs read access to monitor system

  2. Changes
    - Add SELECT policies for anon role on all tables
    - These policies allow reading data without Supabase auth
    - Admin dashboard can now fetch statistics and data

  3. Security
    - Only SELECT (read) access is granted
    - Write operations still require proper authentication
    - Admin authentication is handled separately
*/

-- Suppliers: Allow anonymous read access
CREATE POLICY "Allow anonymous read access to suppliers"
  ON suppliers
  FOR SELECT
  USING (true);

-- Pharmacies: Allow anonymous read access
CREATE POLICY "Allow anonymous read access to pharmacies"
  ON pharmacies
  FOR SELECT
  USING (true);

-- Products: Allow anonymous read access
CREATE POLICY "Allow anonymous read access to products"
  ON products
  FOR SELECT
  USING (true);

-- Commercial Agents: Allow anonymous read access
CREATE POLICY "Allow anonymous read access to commercial_agents"
  ON commercial_agents
  FOR SELECT
  USING (true);

-- Orders: Allow anonymous read access
CREATE POLICY "Allow anonymous read access to orders"
  ON orders
  FOR SELECT
  USING (true);

-- Reviews: Allow anonymous read access
CREATE POLICY "Allow anonymous read access to reviews"
  ON reviews
  FOR SELECT
  USING (true);

-- Documents: Allow anonymous read access
CREATE POLICY "Allow anonymous read access to documents"
  ON documents
  FOR SELECT
  USING (true);
