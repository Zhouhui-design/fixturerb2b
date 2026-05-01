-- Add policy to allow customers to view their own submissions
-- Customers can view submissions matching their name AND email
CREATE POLICY "Allow customers to view own submissions" ON contact_submissions
  FOR SELECT
  TO public
  USING (
    name = current_setting('app.current_name', true) 
    AND email = current_setting('app.current_email', true)
  );

-- Add admin policy to view all submissions with masking
-- This will be handled at application level for security
CREATE POLICY "Allow admins to view all submissions" ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Create index for customer queries
CREATE INDEX IF NOT EXISTS idx_contact_submissions_name_email ON contact_submissions(name, email);
