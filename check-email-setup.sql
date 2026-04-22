-- Check if email notification trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'trigger_quote_email_notification';

-- Check pg_net extension
SELECT extname FROM pg_extension WHERE extname = 'pg_net';
