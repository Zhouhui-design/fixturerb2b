-- Create chat_messages table for storing chat conversations
-- This enables persistent chat history across sessions

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  content TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'admin')),
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_email ON chat_messages(user_email);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender ON chat_messages(sender);

-- Enable Row Level Security
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous users to insert their own messages
CREATE POLICY "Allow anonymous insert" ON chat_messages
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow authenticated admins to read all messages
CREATE POLICY "Allow admins to read all" ON chat_messages
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Allow admins to update message status
CREATE POLICY "Allow admins to update status" ON chat_messages
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_chat_message_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_chat_message_updated_at
  BEFORE UPDATE ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_message_timestamp();

-- Add comments
COMMENT ON TABLE chat_messages IS 'Stores chat messages between customers and support team';
COMMENT ON COLUMN chat_messages.user_name IS 'Name of the customer';
COMMENT ON COLUMN chat_messages.user_email IS 'Email of the customer for identification';
COMMENT ON COLUMN chat_messages.content IS 'The message content';
COMMENT ON COLUMN chat_messages.sender IS 'Who sent the message: user or admin';
COMMENT ON COLUMN chat_messages.status IS 'Message delivery status';

-- Enable Realtime for this table (for live chat updates)
-- Note: This needs to be enabled in Supabase Dashboard under Database > Replication
-- Or run: ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
