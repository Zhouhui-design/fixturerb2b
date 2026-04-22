-- Quick fix: Temporarily disable RLS for testing
-- You can re-enable it later with: ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

ALTER TABLE translations DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions DISABLE ROW LEVEL SECURITY;

-- Verify
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('translations', 'contact_submissions');
