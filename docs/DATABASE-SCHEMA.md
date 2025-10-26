# IG Career Hub - Database Schema (WordPress Integration)

## 🗄️ Database Overview

**Database:** Supabase (PostgreSQL)  
**Shared Instance:** Uses same Supabase project as 5 existing tools  
**Connection:** `https://snhezroznzsjcqqxpjpp.supabase.co`  
**Auth Method:** WordPress/MemberPress (NOT Supabase Auth)  
**User Identification:** WordPress User ID or browser-generated UUID

---

## 🔐 Authentication Strategy

**IMPORTANT:** This system does NOT use Supabase Auth for login. Instead:

1. **Users log in via WordPress/MemberPress** (your existing paywall)
2. **User ID comes from WordPress** (`window.wpUserId`) or browser UUID
3. **Supabase is ONLY for data storage**, not authentication
4. **No separate login required** - seamless from WordPress

This matches your Interview Coach's current implementation:
```typescript
// How Interview Coach does it (we copy this pattern)
export function getUserId(): string | null {
  // Try to get WordPress user ID
  if (window.wpUserId) {
    return window.wpUserId.toString();
  }
  
  // Fallback: Generate browser UUID
  let userId = localStorage.getItem('ig_user_id');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('ig_user_id', userId);
  }
  return userId;
}
```

---

## 📋 Table of Contents

1. [Core Tables](#core-tables)
2. [Support Tables](#support-tables)
3. [Relationships](#relationships)
4. [RLS Policies](#rls-policies)
5. [Indexes](#indexes)
6. [Migration SQL](#migration-sql)

---

## 🔑 Core Tables

### 1. `profiles`
User profile information (NOT linked to Supabase Auth)

```sql
CREATE TABLE profiles (
  id TEXT PRIMARY KEY, -- WordPress user ID or browser UUID
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  
  -- WordPress Integration
  wp_user_id INTEGER UNIQUE, -- WordPress user ID if available
  memberpress_level TEXT, -- 'free', 'pro', 'enterprise'
  
  -- Preferences
  weekly_goal INTEGER DEFAULT 10,
  timezone TEXT DEFAULT 'UTC',
  email_notifications BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**
```sql
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_wp_user_id ON profiles(wp_user_id);
```

**Key Change:** `id` is TEXT (not UUID referencing auth.users)

---

### 2. `applications`
Core application tracking

```sql
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Job Details
  company_name TEXT NOT NULL,
  position_title TEXT NOT NULL,
  job_url TEXT,
  job_description TEXT,
  location TEXT,
  salary_range TEXT,
  remote_type TEXT CHECK (remote_type IN ('remote', 'hybrid', 'onsite', 'flexible')),
  
  -- Application Status
  status TEXT NOT NULL DEFAULT 'applied' 
    CHECK (status IN ('applied', 'phone_screen', 'interview', 'offer', 'rejected', 'withdrawn', 'archived')),
  date_applied DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Source
  source TEXT, -- 'LinkedIn', 'Indeed', 'Company Website', 'Referral', etc.
  
  -- Linked Documents
  resume_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  cover_letter_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  
  -- Notes
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**
```sql
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_date_applied ON applications(date_applied DESC);
CREATE INDEX idx_applications_user_status ON applications(user_id, status);
```

**Key Change:** `user_id` is TEXT (not UUID)

---

### 3. `application_activities`
Timeline tracking for each application

```sql
CREATE TABLE application_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  
  -- Activity Details
  activity_type TEXT NOT NULL 
    CHECK (activity_type IN (
      'applied', 'viewed', 'email_received', 'email_sent', 
      'phone_screen_scheduled', 'phone_screen_completed',
      'interview_scheduled', 'interview_completed',
      'follow_up_sent', 'offer_received', 'offer_accepted', 
      'offer_declined', 'rejected', 'withdrawn', 'note_added'
    )),
  activity_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  -- Optional Details
  notes TEXT,
  metadata JSONB, -- Store additional context (email subject, interviewer name, etc.)
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**
```sql
CREATE INDEX idx_activities_application ON application_activities(application_id);
CREATE INDEX idx_activities_date ON application_activities(activity_date DESC);
CREATE INDEX idx_activities_type ON application_activities(activity_type);
```

---

### 4. `interviews`
Scheduled and completed interviews

```sql
CREATE TABLE interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Interview Details
  interview_date TIMESTAMP WITH TIME ZONE NOT NULL,
  interview_type TEXT CHECK (interview_type IN ('phone', 'video', 'onsite', 'technical', 'behavioral', 'panel', 'other')),
  duration_minutes INTEGER,
  
  -- People
  interviewer_names TEXT[], -- Array of interviewer names
  
  -- Preparation
  oracle_session_id TEXT, -- Link to Oracle PRO prep session
  coach_session_id UUID, -- Link to Interview Coach session (existing table)
  prepared BOOLEAN DEFAULT false,
  
  -- Post-Interview
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  self_rating INTEGER CHECK (self_rating >= 1 AND self_rating <= 5),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**
```sql
CREATE INDEX idx_interviews_application ON interviews(application_id);
CREATE INDEX idx_interviews_user ON interviews(user_id);
CREATE INDEX idx_interviews_date ON interviews(interview_date);
CREATE INDEX idx_interviews_upcoming ON interviews(interview_date) WHERE completed = false;
```

**Key Change:** `user_id` is TEXT (not UUID)

---

### 5. `documents`
Resumes, cover letters, and other files

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Document Details
  document_type TEXT NOT NULL CHECK (document_type IN ('resume', 'cover_letter', 'portfolio', 'reference', 'other')),
  title TEXT NOT NULL,
  file_name TEXT,
  file_size INTEGER, -- bytes
  
  -- Storage
  storage_path TEXT, -- Supabase Storage path
  file_url TEXT, -- Public URL if needed
  
  -- Versioning
  version INTEGER DEFAULT 1,
  parent_id UUID REFERENCES documents(id) ON DELETE SET NULL, -- For version history
  is_primary BOOLEAN DEFAULT false, -- Mark primary resume/cover letter
  
  -- Usage Tracking
  times_used INTEGER DEFAULT 0,
  applications_count INTEGER DEFAULT 0,
  interviews_received INTEGER DEFAULT 0,
  
  -- Calculated Fields
  success_rate DECIMAL(5,2), -- interviews_received / applications_count * 100
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**
```sql
CREATE INDEX idx_documents_user ON documents(user_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_primary ON documents(user_id, is_primary) WHERE is_primary = true;
```

**Key Change:** `user_id` is TEXT (not UUID)

---

## 📊 Support Tables

### 6. `document_analytics`
Track which documents perform best

```sql
CREATE TABLE document_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  
  -- Outcome Tracking
  led_to_interview BOOLEAN DEFAULT false,
  led_to_offer BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**
```sql
CREATE INDEX idx_doc_analytics_document ON document_analytics(document_id);
CREATE INDEX idx_doc_analytics_application ON document_analytics(application_id);
```

---

### 7. `goals`
User-defined goals (applications per week, etc.)

```sql
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Goal Details
  goal_type TEXT CHECK (goal_type IN ('applications', 'interviews', 'networking', 'skills', 'custom')),
  target_value INTEGER NOT NULL,
  current_value INTEGER DEFAULT 0,
  period TEXT CHECK (period IN ('daily', 'weekly', 'monthly', 'quarterly')),
  
  -- Status
  active BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**
```sql
CREATE INDEX idx_goals_user ON goals(user_id);
CREATE INDEX idx_goals_active ON goals(user_id, active) WHERE active = true;
```

**Key Change:** `user_id` is TEXT (not UUID)

---

### 8. `tags`
User-defined tags for organizing applications

```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT, -- Hex color code
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, name) -- Each user can only have one tag with a given name
);
```

**Indexes:**
```sql
CREATE INDEX idx_tags_user ON tags(user_id);
```

**Key Change:** `user_id` is TEXT (not UUID)

---

### 9. `application_tags`
Many-to-many relationship between applications and tags

```sql
CREATE TABLE application_tags (
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  PRIMARY KEY (application_id, tag_id)
);
```

**Indexes:**
```sql
CREATE INDEX idx_app_tags_application ON application_tags(application_id);
CREATE INDEX idx_app_tags_tag ON application_tags(tag_id);
```

---

### 10. `reminders`
Automated reminders for follow-ups

```sql
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  
  -- Reminder Details
  reminder_type TEXT CHECK (reminder_type IN ('follow_up', 'interview_prep', 'application_deadline', 'custom')),
  reminder_date TIMESTAMP WITH TIME ZONE NOT NULL,
  message TEXT,
  
  -- Status
  sent BOOLEAN DEFAULT false,
  dismissed BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**
```sql
CREATE INDEX idx_reminders_user ON reminders(user_id);
CREATE INDEX idx_reminders_application ON reminders(application_id);
CREATE INDEX idx_reminders_date ON reminders(reminder_date) WHERE sent = false AND dismissed = false;
```

**Key Change:** `user_id` is TEXT (not UUID)

---

## 🔐 RLS Policies (Simplified - No Supabase Auth)

**CRITICAL:** Since we're NOT using Supabase Auth, RLS policies need to be permissive or use service role key.

### Option A: Disable RLS (Simplest - Recommended for MVP)
```sql
-- Don't enable RLS at all
-- App handles auth via WordPress
-- Use Supabase service role key for all queries
```

### Option B: Custom RLS with WordPress User ID
```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
-- ... etc for all tables

-- Create permissive policies (since we can't use auth.uid())
CREATE POLICY "Users can view own profile" ON profiles 
  FOR SELECT USING (true); -- Permissive for now

CREATE POLICY "Users can update own profile" ON profiles 
  FOR UPDATE USING (true);

CREATE POLICY "Users can insert own profile" ON profiles 
  FOR INSERT WITH CHECK (true);

-- Same pattern for all tables
CREATE POLICY "Users can manage own applications" ON applications 
  FOR ALL USING (true);

-- etc...
```

**Recommendation:** Start with Option A (no RLS), add Option B later if needed.

---

## 🔄 Database Functions & Triggers

### Auto-update timestamps
```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON interviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### Create activity on status change
```sql
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

CREATE TRIGGER trigger_status_change_activity AFTER UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION create_status_change_activity();
```

### Update document success rate
```sql
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

CREATE TRIGGER trigger_update_document_success_rate AFTER INSERT OR UPDATE ON document_analytics FOR EACH ROW EXECUTE FUNCTION update_document_success_rate();
```

---

## 📊 Views

### Application Stats
```sql
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
```

### Upcoming Interviews
```sql
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
```

---

## 🚀 Complete Migration SQL

```sql
-- ========================================
-- IG Career Hub - Database Migration
-- WordPress Integration (NO Supabase Auth)
-- ========================================

-- Create tables
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

CREATE TABLE document_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  led_to_interview BOOLEAN DEFAULT false,
  led_to_offer BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

CREATE TABLE application_tags (
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (application_id, tag_id)
);

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

-- ========================================
-- Create Indexes
-- ========================================

CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_wp_user_id ON profiles(wp_user_id);

CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_date_applied ON applications(date_applied DESC);
CREATE INDEX idx_applications_user_status ON applications(user_id, status);

CREATE INDEX idx_activities_application ON application_activities(application_id);
CREATE INDEX idx_activities_date ON application_activities(activity_date DESC);
CREATE INDEX idx_activities_type ON application_activities(activity_type);

CREATE INDEX idx_interviews_application ON interviews(application_id);
CREATE INDEX idx_interviews_user ON interviews(user_id);
CREATE INDEX idx_interviews_date ON interviews(interview_date);
CREATE INDEX idx_interviews_upcoming ON interviews(interview_date) WHERE completed = false;

CREATE INDEX idx_documents_user ON documents(user_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_primary ON documents(user_id, is_primary) WHERE is_primary = true;

CREATE INDEX idx_doc_analytics_document ON document_analytics(document_id);
CREATE INDEX idx_doc_analytics_application ON document_analytics(application_id);

CREATE INDEX idx_goals_user ON goals(user_id);
CREATE INDEX idx_goals_active ON goals(user_id, active) WHERE active = true;

CREATE INDEX idx_tags_user ON tags(user_id);

CREATE INDEX idx_app_tags_application ON application_tags(application_id);
CREATE INDEX idx_app_tags_tag ON application_tags(tag_id);

CREATE INDEX idx_reminders_user ON reminders(user_id);
CREATE INDEX idx_reminders_application ON reminders(application_id);
CREATE INDEX idx_reminders_date ON reminders(reminder_date) WHERE sent = false AND dismissed = false;

-- ========================================
-- Database Functions & Triggers
-- ========================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON interviews FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals FOR EACH ROW EXECUTE FUNCTION update_updated_at();

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

CREATE TRIGGER trigger_status_change_activity AFTER UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION create_status_change_activity();

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

CREATE TRIGGER trigger_update_document_success_rate AFTER INSERT OR UPDATE ON document_analytics FOR EACH ROW EXECUTE FUNCTION update_document_success_rate();

-- ========================================
-- Views
-- ========================================

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

-- ========================================
-- Migration Complete
-- ========================================
```

---

## ✅ Verification Queries

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'profiles', 'applications', 'application_activities', 
    'interviews', 'documents', 'document_analytics', 
    'goals', 'tags', 'application_tags', 'reminders'
  );

-- Check indexes
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public';

-- Check triggers
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

---

## 🔧 TypeScript Integration

### User ID Helper
```typescript
// src/lib/utils/userId.ts
export function getUserId(): string {
  // Try WordPress user ID first
  if (typeof window !== 'undefined' && window.wpUserId) {
    return window.wpUserId.toString();
  }
  
  // Fallback to browser UUID (same as Interview Coach)
  if (typeof window !== 'undefined') {
    let userId = localStorage.getItem('ig_user_id');
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem('ig_user_id', userId);
    }
    return userId;
  }
  
  // Server-side: return null or generate one
  return crypto.randomUUID();
}
```

### Supabase Client Setup
```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use service role (no RLS)

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### Usage Example
```typescript
import { supabase } from '@/lib/supabase';
import { getUserId } from '@/lib/utils/userId';

// Create application
async function createApplication(data) {
  const userId = getUserId();
  
  const { data: application, error } = await supabase
    .from('applications')
    .insert({
      user_id: userId,
      company_name: data.company,
      position_title: data.position,
      // ... other fields
    })
    .select()
    .single();
    
  if (error) throw error;
  return application;
}
```

---

## 📝 Key Differences from Original

**Changed:**
- ❌ Removed `auth.users` references
- ❌ Removed all `auth.uid()` from RLS policies
- ✅ Changed `user_id` from UUID to TEXT
- ✅ Added `wp_user_id` field to profiles
- ✅ Simplified RLS (made permissive or disabled)
- ✅ Added WordPress integration notes

**Kept:**
- ✅ All table relationships
- ✅ All indexes
- ✅ All triggers
- ✅ All views
- ✅ All constraints

---

**Last Updated:** October 26, 2025  
**Schema Version:** 2.0 (WordPress Integration)  
**Status:** Ready for Implementation
