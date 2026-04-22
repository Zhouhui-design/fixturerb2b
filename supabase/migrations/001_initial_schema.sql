-- Create translations table for dynamic content
CREATE TABLE IF NOT EXISTS translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  language VARCHAR(10) NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  namespace VARCHAR(50) DEFAULT 'common',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(language, key)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_translations_language ON translations(language);
CREATE INDEX IF NOT EXISTS idx_translations_namespace ON translations(namespace);

-- Enable Row Level Security
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON translations
  FOR SELECT
  TO public
  USING (true);

-- Create policy to allow authenticated users to manage translations
CREATE POLICY "Allow authenticated users to manage translations" ON translations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create contact_submissions table for form data
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  store_area INTEGER,
  requirement_type TEXT,
  need_oem BOOLEAN DEFAULT false,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for contact submissions
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON contact_submissions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to submit contact forms
CREATE POLICY "Allow anyone to submit contact forms" ON contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy to allow authenticated users to view submissions
CREATE POLICY "Allow authenticated users to view submissions" ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for translations table
CREATE TRIGGER update_translations_updated_at
  BEFORE UPDATE ON translations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
