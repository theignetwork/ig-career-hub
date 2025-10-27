-- Drop ALL existing RLS policies that depend on user_id
DROP POLICY IF EXISTS "Users can insert their own documents" ON documents;
DROP POLICY IF EXISTS "Users can read their own documents" ON documents;
DROP POLICY IF EXISTS "Users can view their own documents" ON documents;
DROP POLICY IF EXISTS "Users can update their own documents" ON documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON documents;

-- Drop foreign key constraint
ALTER TABLE documents
DROP CONSTRAINT IF EXISTS documents_user_id_fkey;

-- Fix documents table to use TEXT for user_id (consistent with other tables)
ALTER TABLE documents
ALTER COLUMN user_id TYPE TEXT;

-- Create storage bucket for documents if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  true,
  10485760, -- 10MB in bytes
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
)
ON CONFLICT (id) DO NOTHING;
