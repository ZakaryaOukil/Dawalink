/*
  # Add Blocked Status for Pharmacies and Suppliers
  
  1. Changes
    - Add `is_blocked` column to `pharmacies` table
    - Add `is_blocked` column to `suppliers` table
    - Allows admins to block/ban accounts
  
  2. Security
    - No RLS changes needed (tables already have RLS enabled)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pharmacies' AND column_name = 'is_blocked'
  ) THEN
    ALTER TABLE pharmacies ADD COLUMN is_blocked boolean DEFAULT false;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'suppliers' AND column_name = 'is_blocked'
  ) THEN
    ALTER TABLE suppliers ADD COLUMN is_blocked boolean DEFAULT false;
  END IF;
END $$;