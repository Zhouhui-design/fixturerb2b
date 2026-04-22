-- Create quote_requests table
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name TEXT NOT NULL,
  product_id UUID,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  country TEXT NOT NULL,
  phone TEXT,
  quantity TEXT NOT NULL,
  specifications TEXT,
  target_price TEXT,
  delivery_terms TEXT DEFAULT 'FOB',
  payment_terms TEXT DEFAULT 'T/T',
  message TEXT,
  status TEXT DEFAULT 'pending', -- pending, reviewed, quoted, converted, lost
  admin_notes TEXT,
  quoted_amount DECIMAL(10, 2),
  contract_sent BOOLEAN DEFAULT FALSE,
  contract_signed BOOLEAN DEFAULT FALSE,
  payment_received BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_quote_requests_email ON quote_requests(customer_email);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created ON quote_requests(created_at DESC);

-- Enable Row Level Security
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting quote requests (anyone can submit)
CREATE POLICY "Anyone can submit quote requests"
  ON quote_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Create policy for viewing quote requests (only authenticated admins)
CREATE POLICY "Authenticated users can view quote requests"
  ON quote_requests
  FOR SELECT
  TO authenticated
  USING (true);

-- Create policy for updating quote requests (only authenticated admins)
CREATE POLICY "Authenticated users can update quote requests"
  ON quote_requests
  FOR UPDATE
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

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_quote_requests_updated_at
  BEFORE UPDATE ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE quote_requests IS 'Stores customer quote requests for B2B inquiries';
COMMENT ON COLUMN quote_requests.status IS 'Status: pending, reviewed, quoted, converted, lost';
COMMENT ON COLUMN quote_requests.contract_sent IS 'Whether contract has been sent to customer';
COMMENT ON COLUMN quote_requests.contract_signed IS 'Whether customer has signed the contract';
COMMENT ON COLUMN quote_requests.payment_received IS 'Whether payment has been received';
