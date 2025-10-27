-- Add missing stats columns to documents table
ALTER TABLE documents
ADD COLUMN IF NOT EXISTS times_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS applications_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS interviews_received INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS success_rate NUMERIC(5,2);

-- Update any existing documents to have default values
UPDATE documents
SET
  times_used = COALESCE(times_used, 0),
  applications_count = COALESCE(applications_count, 0),
  interviews_received = COALESCE(interviews_received, 0)
WHERE times_used IS NULL
   OR applications_count IS NULL
   OR interviews_received IS NULL;
