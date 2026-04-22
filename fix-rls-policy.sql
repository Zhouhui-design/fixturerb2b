-- Fix RLS policies to allow public insert for seeding
-- Run this in Supabase SQL Editor

-- Drop existing restrictive policy if it exists
DROP POLICY IF EXISTS "Allow public read access" ON translations;
DROP POLICY IF EXISTS "Allow authenticated users to manage translations" ON translations;

-- Create new policies
-- 1. Allow public read (everyone can read translations)
CREATE POLICY "Enable public read access"
ON translations FOR SELECT
TO public
USING (true);

-- 2. Allow public insert (for adding translations - you can remove this later)
CREATE POLICY "Enable public insert access"
ON translations FOR INSERT
TO public
WITH CHECK (true);

-- 3. Allow authenticated users to update/delete (for admin management)
CREATE POLICY "Enable authenticated users full access"
ON translations FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Verify the policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'translations';
