/*
  # Fix Admin Users RLS Policy

  Allow unauthenticated access to check admin credentials during login
*/

CREATE POLICY "Allow unauthenticated access for login"
  ON admin_users
  FOR SELECT
  USING (true);
