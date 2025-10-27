-- IG Career Hub - Initial Database Schema
-- Migration: 20250126_initial_schema
-- Description: Creates all tables, indexes, triggers, functions, and views for IG Career Hub MVP

-- ============================================================
-- TABLES
-- ============================================================

-- User Profiles (WordPress-integrated authentication)
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  wp_user_id INTEGER UNIQUE,
  memberpress_level TEXT,
  weekly_goal INTEGER DEFAULT 10,
  timezone TEXT DEFAULT 'UTC',
  email_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job Applications
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  position_title TEXT NOT NULL,
  job_url TEXT,
  job_description TEXT,
  location TEXT,
  salary_range TEXT,
  remote_type TEXT CHECK (remote_type IN ('remote', 'hybrid', 'onsite', 'flexible')),
  status TEXT NOT NULL DEFAULT 'applied'
    CHECK (status IN ('applied', 'phone_screen', 'interview', 'offer', 'rejected', 'withdrawn', 'archived')),
  date_applied DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT,
  resume_id UUID,
  cover_letter_id UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Application Activity Timeline
CREATE TABLE application_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL
    CHECK (activity_type IN (
      'applied', 'viewed', 'email_received', 'email_sent',
      'phone_screen_scheduled', 'phone_screen_completed',
      'interview_scheduled', 'interview_completed',
      'follow_up_sent', 'offer_received', 'offer_accepted',
      'offer_declined', 'rejected', 'withdrawn', 'note_added'
    )),
  activity_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  notes TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interview Tracking
CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  interview_date TIMESTAMP WITH TIME ZONE NOT NULL,
  interview_type TEXT CHECK (interview_type IN ('phone', 'video', 'onsite', 'technical', 'behavioral', 'panel', 'other')),
  duration_minutes INTEGER,
  interviewer_names TEXT[],
  oracle_session_id TEXT,
  coach_session_id UUID,
  prepared BOOLEAN DEFAULT false,
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  self_rating INTEGER CHECK (self_rating >= 1 AND self_rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents (Resumes, Cover Letters, etc.)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('resume', 'cover_letter', 'portfolio', 'reference', 'other')),
  title TEXT NOT NULL,
  file_name TEXT,
  file_size INTEGER,
  storage_path TEXT,
  file_url TEXT,
  version INTEGER DEFAULT 1,
  parent_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  is_primary BOOLEAN DEFAULT false,
  times_used INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  interviews_received INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document Performance Analytics
CREATE TABLE document_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  led_to_interview BOOLEAN DEFAULT false,
  led_to_offer BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Goals
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  goal_type TEXT CHECK (goal_type IN ('applications', 'interviews', 'networking', 'skills', 'custom')),
  target_value INTEGER NOT NULL,
  current_value INTEGER DEFAULT 0,
  period TEXT CHECK (period IN ('daily', 'weekly', 'monthly', 'quarterly')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags for Categorization
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Application-Tag Junction Table
CREATE TABLE application_tags (
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (application_id, tag_id)
);

-- Reminders
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  reminder_type TEXT CHECK (reminder_type IN ('follow_up', 'interview_prep', 'application_deadline', 'custom')),
  reminder_date TIMESTAMP WITH TIME ZONE NOT NULL,
  message TEXT,
  sent BOOLEAN DEFAULT false,
  dismissed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Profiles
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_wp_user_id ON profiles(wp_user_id);

-- Applications
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_date_applied ON applications(date_applied DESC);
CREATE INDEX idx_applications_user_status ON applications(user_id, status);

-- Application Activities
CREATE INDEX idx_activities_application ON application_activities(application_id);
CREATE INDEX idx_activities_date ON application_activities(activity_date DESC);
CREATE INDEX idx_activities_type ON application_activities(activity_type);

-- Interviews
CREATE INDEX idx_interviews_application ON interviews(application_id);
CREATE INDEX idx_interviews_user ON interviews(user_id);
CREATE INDEX idx_interviews_date ON interviews(interview_date);
CREATE INDEX idx_interviews_upcoming ON interviews(interview_date) WHERE completed = false;

-- Documents
CREATE INDEX idx_documents_user ON documents(user_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_primary ON documents(user_id, is_primary) WHERE is_primary = true;

-- Document Analytics
CREATE INDEX idx_doc_analytics_document ON document_analytics(document_id);
CREATE INDEX idx_doc_analytics_application ON document_analytics(application_id);

-- Goals
CREATE INDEX idx_goals_user ON goals(user_id);
CREATE INDEX idx_goals_active ON goals(user_id, active) WHERE active = true;

-- Tags
CREATE INDEX idx_tags_user ON tags(user_id);

-- Application Tags
CREATE INDEX idx_app_tags_application ON application_tags(application_id);
CREATE INDEX idx_app_tags_tag ON application_tags(tag_id);

-- Reminders
CREATE INDEX idx_reminders_user ON reminders(user_id);
CREATE INDEX idx_reminders_application ON reminders(application_id);
CREATE INDEX idx_reminders_date ON reminders(reminder_date) WHERE sent = false AND dismissed = false;

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create activity log on status change
CREATE OR REPLACE FUNCTION create_status_change_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO application_activities (application_id, activity_type, activity_date, notes)
    VALUES (NEW.id, NEW.status, NOW(), 'Status changed from ' || OLD.status || ' to ' || NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Calculate document success rate
CREATE OR REPLACE FUNCTION update_document_success_rate()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE documents
  SET success_rate = CASE
    WHEN applications_count > 0
    THEN (interviews_received::DECIMAL / applications_count * 100)
    ELSE 0
  END
  WHERE id = NEW.document_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TRIGGERS
-- ============================================================

-- Auto-update updated_at timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_interviews_updated_at
  BEFORE UPDATE ON interviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-log status changes
CREATE TRIGGER trigger_status_change_activity
  AFTER UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION create_status_change_activity();

-- Auto-calculate document success rates
CREATE TRIGGER trigger_update_document_success_rate
  AFTER INSERT OR UPDATE ON document_analytics
  FOR EACH ROW EXECUTE FUNCTION update_document_success_rate();

-- ============================================================
-- VIEWS
-- ============================================================

-- Application Statistics per User
CREATE OR REPLACE VIEW application_stats AS
SELECT
  user_id,
  COUNT(*) as total_applications,
  COUNT(*) FILTER (WHERE status = 'applied') as applied,
  COUNT(*) FILTER (WHERE status = 'phone_screen') as phone_screens,
  COUNT(*) FILTER (WHERE status = 'interview') as interviews,
  COUNT(*) FILTER (WHERE status = 'offer') as offers,
  COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
  ROUND(COUNT(*) FILTER (WHERE status IN ('phone_screen', 'interview', 'offer'))::DECIMAL / NULLIF(COUNT(*), 0) * 100, 2) as response_rate,
  ROUND(COUNT(*) FILTER (WHERE status = 'offer')::DECIMAL / NULLIF(COUNT(*) FILTER (WHERE status = 'interview'), 0) * 100, 2) as interview_to_offer_rate
FROM applications
GROUP BY user_id;

-- Upcoming Interviews
CREATE OR REPLACE VIEW upcoming_interviews AS
SELECT
  i.*,
  a.company_name,
  a.position_title,
  a.status as application_status
FROM interviews i
JOIN applications a ON i.application_id = a.id
WHERE i.completed = false AND i.interview_date >= NOW()
ORDER BY i.interview_date ASC;

-- ============================================================
-- COMMENTS
-- ============================================================

COMMENT ON TABLE profiles IS 'User profiles - WordPress/MemberPress integrated authentication';
COMMENT ON TABLE applications IS 'Job application tracking with status workflow';
COMMENT ON TABLE application_activities IS 'Timeline of events for each application';
COMMENT ON TABLE interviews IS 'Interview scheduling and tracking with Oracle PRO/Coach integration';
COMMENT ON TABLE documents IS 'Resume and cover letter management with versioning';
COMMENT ON TABLE document_analytics IS 'Track document performance (interviews/offers)';
COMMENT ON TABLE goals IS 'User-defined goals with progress tracking';
COMMENT ON TABLE tags IS 'User-created tags for categorization';
COMMENT ON TABLE application_tags IS 'Many-to-many relationship between applications and tags';
COMMENT ON TABLE reminders IS 'Follow-up reminders and notifications';
