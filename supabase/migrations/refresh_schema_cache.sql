-- Force Supabase to refresh its schema cache
-- This is needed after altering column types

NOTIFY pgrst, 'reload schema';

-- Alternatively, you can also just verify the documents table structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'documents'
ORDER BY ordinal_position;
