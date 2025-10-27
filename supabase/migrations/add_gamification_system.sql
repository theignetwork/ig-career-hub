-- Gamification System Migration
-- Adds XP, levels, achievements, and streaks

-- Add XP and level tracking to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS total_xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS level_progress DECIMAL(5,2) DEFAULT 0;

-- Achievements/Badges table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  badge_type TEXT NOT NULL CHECK (badge_type IN (
    'hot_streak', 'sharpshooter', 'century_club', 'interview_master',
    'prepared_pro', 'speed_demon', 'offer_champion', 'first_application',
    'first_interview', 'goal_crusher', 'consistency_king', 'document_master'
  )),
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  xp_awarded INTEGER DEFAULT 0,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_type)
);

-- Streaks tracking
CREATE TABLE IF NOT EXISTS streaks (
  user_id TEXT PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  application_streak INTEGER DEFAULT 0,
  last_application_date DATE,
  longest_application_streak INTEGER DEFAULT 0,
  goal_completion_streak INTEGER DEFAULT 0,
  last_goal_completion_date DATE,
  longest_goal_streak INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- XP Activity Log (optional - for debugging/analytics)
CREATE TABLE IF NOT EXISTS xp_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL,
  xp_earned INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_achievements_earned_at ON achievements(earned_at DESC);
CREATE INDEX IF NOT EXISTS idx_xp_activities_user ON xp_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_activities_created_at ON xp_activities(created_at DESC);

-- Function to calculate level from XP
CREATE OR REPLACE FUNCTION calculate_level(xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Level formula: Level = floor(sqrt(xp / 50)) + 1
  -- Level 1: 0-99 XP
  -- Level 2: 100-299 XP
  -- Level 3: 300-599 XP
  -- Level 4: 600-999 XP
  -- Level 5: 1000-1499 XP
  -- Level 6: 1500+ XP
  IF xp < 100 THEN RETURN 1;
  ELSIF xp < 300 THEN RETURN 2;
  ELSIF xp < 600 THEN RETURN 3;
  ELSIF xp < 1000 THEN RETURN 4;
  ELSIF xp < 1500 THEN RETURN 5;
  ELSIF xp < 2100 THEN RETURN 6;
  ELSIF xp < 2800 THEN RETURN 7;
  ELSIF xp < 3600 THEN RETURN 8;
  ELSIF xp < 4500 THEN RETURN 9;
  ELSE RETURN 10;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get XP needed for next level
CREATE OR REPLACE FUNCTION xp_for_next_level(current_level INTEGER)
RETURNS INTEGER AS $$
BEGIN
  CASE current_level
    WHEN 1 THEN RETURN 100;
    WHEN 2 THEN RETURN 300;
    WHEN 3 THEN RETURN 600;
    WHEN 4 THEN RETURN 1000;
    WHEN 5 THEN RETURN 1500;
    WHEN 6 THEN RETURN 2100;
    WHEN 7 THEN RETURN 2800;
    WHEN 8 THEN RETURN 3600;
    WHEN 9 THEN RETURN 4500;
    ELSE RETURN 5500;
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to auto-update level when XP changes
CREATE OR REPLACE FUNCTION update_level_on_xp_change()
RETURNS TRIGGER AS $$
BEGIN
  NEW.current_level := calculate_level(NEW.total_xp);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_level ON profiles;
CREATE TRIGGER trigger_update_level
  BEFORE UPDATE OF total_xp ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_level_on_xp_change();

-- Initialize streaks for existing users
INSERT INTO streaks (user_id)
SELECT id FROM profiles
ON CONFLICT (user_id) DO NOTHING;

-- Comments
COMMENT ON TABLE achievements IS 'User achievements and badges earned';
COMMENT ON TABLE streaks IS 'User activity streaks (applications, goals, etc.)';
COMMENT ON TABLE xp_activities IS 'Log of all XP-earning activities';
