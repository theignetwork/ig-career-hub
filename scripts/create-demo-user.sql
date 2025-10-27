-- Create demo user profile for testing
-- Run this in Supabase SQL Editor

INSERT INTO profiles (id, email, full_name, created_at, updated_at)
VALUES (
  'demo-user-123',
  'demo@example.com',
  'Demo User',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;
