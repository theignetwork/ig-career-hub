-- Add outcome column to interviews table
-- This allows tracking interview results (passed, rejected, waiting, cancelled)

ALTER TABLE interviews
ADD COLUMN outcome TEXT CHECK (outcome IN ('passed', 'rejected', 'waiting', 'cancelled'));

-- Add comment for documentation
COMMENT ON COLUMN interviews.outcome IS 'Interview result: passed (moving forward), rejected, waiting (pending response), cancelled';
