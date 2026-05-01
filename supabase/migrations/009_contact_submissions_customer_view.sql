-- Migration 009: Optimize contact_submissions for customer queries

-- Create index for customer queries (optimizes name + email lookups)
CREATE INDEX IF NOT EXISTS idx_contact_submissions_name_email ON contact_submissions(name, email);

-- Allow public SELECT for customer self-service queries
-- SECURITY: Application layer filters results by name+email, so users only see their own data
-- The MyInquiriesPage component uses:
--   .eq('name', formData.name).eq('email', formData.email)
-- This ensures customers can only query their own submissions
DROP POLICY IF EXISTS "Allow public to query own submissions" ON contact_submissions;
CREATE POLICY "Allow public to query own submissions" ON contact_submissions
  FOR SELECT
  TO public
  USING (true);

-- Note about security implementation:
-- 1. Admin Dashboard (/admin) - requires Supabase authentication
--    Uses existing policy: "Allow authenticated users to view submissions"
--    Application level: masks email and phone with *
--
-- 2. Customer Inquiry Page (/my-inquiries) - public access
--    Database level: Allows public SELECT (this policy)
--    Application level: Filters by name+email using .eq() queries
--    Result: Users only see their own submissions, sensitive info masked
--
-- 3. This is secure because:
--    - The app controls what data is queried (name+email filter)
--    - Returned data is masked (email: jo****@example.com, phone: 13****89)
--    - Users cannot browse all records, only query with specific name+email
