# IG Career Hub - Project Overview

## 🎯 Project Mission

Build a unified job search command center that integrates 6 existing IG Network tools into a single, cohesive platform. The hub serves as the central dashboard for managing job applications, tracking progress, and accessing all career tools in one place.

---

## 🏢 Business Context

**Company:** The Interview Guys Network  
**Existing Products:** 6 standalone job search tools  
**Problem:** Fragmented user experience, no application tracking, disconnected data  
**Solution:** Unified Career Hub dashboard with integrated tools  

---

## 📊 Current Tool Ecosystem

### Tools Already Built (5 use Supabase):

1. **IG Career Coach** ✅
   - Tech: React + Netlify Functions + Supabase + Anthropic Claude
   - Purpose: AI chatbot for career guidance
   - Database: Supabase

2. **Resume Analyzer Pro** ✅
   - Tech: Next.js + Supabase + AI Analysis
   - Purpose: ATS scoring and resume optimization
   - Database: Supabase

3. **IG Interview Coach** ✅
   - Tech: Next.js 15 + Supabase + OpenAI
   - Purpose: Live interview practice with voice recording
   - Database: Supabase
   - Integration: Already connected to Oracle PRO via Supabase

4. **Cover Letter Generator** ⚠️
   - Tech: Next.js 14 + OpenAI
   - Purpose: AI-powered cover letter generation
   - Database: localStorage only (NEEDS MIGRATION)

5. **Interview Oracle PRO** ✅
   - Tech: Vanilla JS + Netlify + Claude + Supabase
   - Purpose: Company-specific interview questions with SOAR answers
   - Database: localStorage + Supabase (hybrid)
   - Integration: Already connected to Interview Coach

6. **Hidden Job Boards Tool** ✅
   - Tech: Next.js + Supabase
   - Purpose: Curated niche job board discovery
   - Database: Supabase

**Key Insight:** 5 out of 6 tools already share the same Supabase instance. Only Cover Letter Generator needs database migration.

---

## 🎨 Design System

### Visual Identity
- **Aesthetic:** Ultra-sleek, premium SaaS (Linear, Notion, Vercel style)
- **Theme:** Dark mode with subtle glows
- **Primary Background:** #000000 (pure black)
- **Card Background:** rgba(10, 14, 26, 0.6) with backdrop blur
- **Accent Color:** #14B8A6 (teal)
- **Border Style:** 1px solid rgba(255, 255, 255, 0.06)

### Typography
- **Font Family:** Inter
- **Weights:** 300 (numbers), 400 (body), 500-600 (labels), 700-800 (headers)
- **Letter Spacing:** Negative tracking (-0.2px to -2px) for modern feel
- **Large Numbers:** 56px / 300 weight / -2px tracking

### Interaction Patterns
- **Transitions:** 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- **Hover Effects:** translateY(-4px) + glow shadow
- **Status Dots:** Glowing circles (green/yellow/red)
- **Buttons:** Gradient backgrounds with hover lift

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom components + shadcn/ui where needed

### Backend & Database
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (unified across all tools)
- **Storage:** Supabase Storage (for documents)
- **API:** Next.js API routes + Supabase client

### AI & External Services
- **Career Coach:** Anthropic Claude (via existing tool)
- **Document Generation:** OpenAI GPT-4 (via existing tools)
- **Voice:** OpenAI Whisper (via Interview Coach)

### Deployment
- **Platform:** Netlify or Vercel
- **Repository:** GitHub (public)
- **Environment:** Environment variables for all keys

---

## 📐 Architecture Overview

### Hub Architecture (New)
```
IG Career Hub (Next.js)
├── Dashboard (main view)
├── Application Tracker (Kanban)
├── Document Library
├── Tool Launcher (deep links)
└── AI Assistant (embedded Career Coach)
```

### Integration Strategy
**Phase 1:** Deep linking with URL parameters  
**Phase 2:** Iframe embeds for seamless experience  
**Phase 3:** API integration for data sharing  

### Data Flow
```
User → Career Hub → Application Data (Supabase)
                 ↓
                 → Tool Launch (deep link with context)
                 ↓
                 → Tool completes action
                 ↓
                 → Data syncs back to Hub
```

---

## 🎯 Core Features (Priority Order)

### Phase 1: MVP (4-6 weeks)
1. ✅ Application Tracker (CRUD operations)
2. ✅ Kanban Pipeline View (drag-and-drop)
3. ✅ Stats Dashboard (applications, interviews, offers)
4. ✅ Tool Launcher (6 tool tiles with deep links)
5. ✅ Document Library (basic upload/link)
6. ✅ Supabase Auth Setup

**Goal:** Launch functional hub with core tracking capabilities

### Phase 2: Intelligence (6-8 weeks)
1. ✅ Analytics Dashboard (response rates, trends)
2. ✅ Smart Suggestions (AI-driven next actions)
3. ✅ Migrate Cover Letter Generator to Supabase
4. ✅ Interview Reminders (automated notifications)
5. ✅ Document Effectiveness Tracking
6. ✅ Weekly Progress Reports

**Goal:** Add intelligence and insights

### Phase 3: Deep Integration (8-12 weeks)
1. ✅ API connections to all tools
2. ✅ Seamless data flow between tools
3. ✅ Embedded Career Coach (context-aware)
4. ✅ Unified search across all data
5. ✅ Advanced analytics
6. ✅ Mobile optimization

**Goal:** Full ecosystem integration

---

## 💰 Business Model

### Free Tier
- Track up to 10 active applications
- 1 resume, 1 cover letter storage
- Limited tool launches (3 per tool per month)
- Basic analytics

### PRO Tier ($29/month or $199/year)
- Unlimited applications
- Unlimited documents with version history
- Unlimited access to all 6 tools
- Advanced analytics and insights
- Priority AI responses
- Interview reminders
- Export capabilities

**Value Proposition:** "One subscription, entire job search toolkit"

---

## 📏 Success Metrics

### Phase 1 Success Criteria
- ✅ 100+ users sign up in first week
- ✅ 50%+ track at least 5 applications
- ✅ 40%+ launch tools from hub
- ✅ Users report "feeling more organized"

### Phase 2 Success Criteria
- ✅ 30%+ increase in tool usage
- ✅ 70%+ applications linked to documents
- ✅ Users see which resumes perform best

### Phase 3 Success Criteria
- ✅ 70%+ users use at least 3 integrated tools
- ✅ 80% reduction in data re-entry
- ✅ Users say "feels like one system"

---

## 🗂️ Project File Structure

```
ig-career-hub/
├── docs/                          # All planning documents
│   ├── PROJECT-OVERVIEW.md       # This file
│   ├── DATABASE-SCHEMA.md        # Supabase tables
│   ├── PHASE-1-MVP.md            # First build scope
│   ├── DESIGN-SYSTEM.md          # Visual specs
│   ├── COMPONENT-SPECS.md        # Component details
│   └── INTEGRATION-PLAN.md       # Tool connection strategy
├── src/
│   ├── app/                      # Next.js app router
│   │   ├── (dashboard)/          # Main dashboard routes
│   │   ├── api/                  # API routes
│   │   └── layout.tsx            # Root layout
│   ├── components/               # React components
│   │   ├── ui/                   # Base UI components
│   │   ├── dashboard/            # Dashboard-specific
│   │   └── shared/               # Shared components
│   ├── lib/                      # Utilities
│   │   ├── supabase/             # Supabase client
│   │   ├── utils/                # Helper functions
│   │   └── types/                # TypeScript types
│   └── styles/                   # Global styles
├── public/                        # Static assets
├── .env.local                     # Environment variables (gitignored)
├── .gitignore
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 🔐 Security & Environment Variables

### Required Environment Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# External Tool URLs (for deep linking)
NEXT_PUBLIC_RESUME_ANALYZER_URL=https://resume-analyzer.com
NEXT_PUBLIC_COVER_LETTER_URL=https://cover-letter-generator.com
NEXT_PUBLIC_INTERVIEW_COACH_URL=https://interview-coach.com
NEXT_PUBLIC_ORACLE_PRO_URL=https://oracle-pro.com
NEXT_PUBLIC_HIDDEN_BOARDS_URL=https://hidden-job-boards.com
NEXT_PUBLIC_CAREER_COACH_URL=https://career-coach.com

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

**CRITICAL:** Never commit `.env.local` to the repository!

---

## 🚀 Getting Started (For Claude Code)

### Initial Setup Commands
```bash
# 1. Clone the repository
git clone https://github.com/yourusername/ig-career-hub.git
cd ig-career-hub

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Then edit .env.local with actual keys

# 4. Run Supabase migrations
# (See DATABASE-SCHEMA.md)

# 5. Start development server
npm run dev
```

### Development Workflow
1. Read all documentation in `/docs`
2. Understand the phase scope (start with PHASE-1-MVP.md)
3. Build components following COMPONENT-SPECS.md
4. Use DESIGN-SYSTEM.md for all styling
5. Commit frequently with descriptive messages
6. Test locally before pushing

---

## 📚 Key Documentation References

- **DATABASE-SCHEMA.md** - Complete database structure
- **PHASE-1-MVP.md** - Detailed Phase 1 requirements
- **DESIGN-SYSTEM.md** - Visual design specifications
- **COMPONENT-SPECS.md** - Individual component requirements
- **INTEGRATION-PLAN.md** - How to connect existing tools

---

## 🎓 Important Principles

### Code Quality
- ✅ TypeScript for all files (strict mode)
- ✅ Component-driven architecture
- ✅ Reusable, composable components
- ✅ Proper error handling
- ✅ Loading states for all async operations

### User Experience
- ✅ Fast, responsive interface
- ✅ Optimistic UI updates
- ✅ Clear feedback for all actions
- ✅ Accessible (keyboard navigation, screen readers)
- ✅ Mobile-friendly (responsive design)

### Data Management
- ✅ Single source of truth (Supabase)
- ✅ Real-time updates where beneficial
- ✅ Proper data validation
- ✅ Graceful error handling
- ✅ Offline-friendly where possible

---

## 🤝 Collaboration Notes

This is a **public repository**. Code is open, but:
- Environment variables stay private
- API keys never committed
- User data protected
- Security best practices followed

---

## 📞 Questions or Issues?

When building, refer back to:
1. This overview for context
2. Phase-specific docs for requirements
3. Design system for styling
4. Component specs for implementation details

---

**Last Updated:** October 26, 2025  
**Version:** 1.0  
**Status:** Ready for Phase 1 Development