-- Fix the status change activity trigger to use valid activity types
-- The current trigger uses status names directly, but they don't match allowed activity types

DROP TRIGGER IF EXISTS trigger_status_change_activity ON applications;
DROP FUNCTION IF EXISTS create_status_change_activity();

CREATE OR REPLACE FUNCTION create_status_change_activity()
RETURNS TRIGGER AS $$
DECLARE
  activity_type_value TEXT;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    -- Map status changes to valid activity types
    activity_type_value := CASE NEW.status
      WHEN 'applied' THEN 'applied'
      WHEN 'phone_screen' THEN 'phone_screen_scheduled'
      WHEN 'interview' THEN 'interview_scheduled'
      WHEN 'offer' THEN 'offer_received'
      WHEN 'rejected' THEN 'rejected'
      WHEN 'withdrawn' THEN 'withdrawn'
      ELSE 'note_added'
    END;

    INSERT INTO application_activities (application_id, activity_type, activity_date, notes)
    VALUES (NEW.id, activity_type_value, NOW(), 'Status changed from ' || OLD.status || ' to ' || NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_status_change_activity
  AFTER UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION create_status_change_activity();
