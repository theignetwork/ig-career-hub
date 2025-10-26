# IG Career Hub - Job Search Command Center

> Unified job search dashboard integrating 6 IG Network tools into one cohesive platform

---

## 🎯 Project Overview

**Mission:** Build a centralized command center that helps job seekers track applications, manage documents, and access all career tools in one place.

**Status:** Phase 1 Development - MVP  
**Tech Stack:** Next.js 15 + TypeScript + Tailwind + Supabase  
**Integration:** Connects to 6 existing IG Network tools

---

## 📚 Documentation

All project documentation is in the `/docs` folder:

- **[PROJECT-OVERVIEW.md](./docs/PROJECT-OVERVIEW.md)** - Start here! Full project context
- **[DATABASE-SCHEMA.md](./docs/DATABASE-SCHEMA.md)** - Complete Supabase schema
- **[DESIGN-SYSTEM.md](./docs/DESIGN-SYSTEM.md)** - Visual design specifications  
- **[COMPONENT-SPECS.md](./docs/COMPONENT-SPECS.md)** - React component requirements
- **[INTEGRATION-PLAN.md](./docs/INTEGRATION-PLAN.md)** - How to connect existing tools

**⚠️ IMPORTANT:** Read PROJECT-OVERVIEW.md first for full context!

---

## 🔧 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** WordPress/MemberPress (NOT Supabase Auth)
- **Deployment:** Netlify or Vercel

---

## 🏗️ Project Structure

```
ig-career-hub/
├── docs/                      # 📖 All documentation
│   ├── PROJECT-OVERVIEW.md
│   ├── DATABASE-SCHEMA.md
│   ├── DESIGN-SYSTEM.md
│   ├── COMPONENT-SPECS.md
│   └── INTEGRATION-PLAN.md
├── src/
│   ├── app/                   # Next.js app router
│   │   ├── (dashboard)/       # Main dashboard routes
│   │   ├── api/               # API routes
│   │   └── layout.tsx
│   ├── components/            # React components
│   │   ├── ui/                # Base UI components
│   │   ├── dashboard/         # Dashboard-specific
│   │   └── shared/
│   ├── lib/                   # Utilities
│   │   ├── supabase/          # Supabase client
│   │   ├── utils/             # Helper functions
│   │   └── types/             # TypeScript types
│   └── styles/                # Global styles
├── public/                    # Static assets
├── .env.local                 # Environment variables (gitignored)
├── .gitignore
├── package.json
├── tailwind.config.ts
└── README.md
```

---

## 🚀 Quick Start for Claude Code

### 1. Clone and Install
```bash
git clone https://github.com/yourusername/ig-career-hub.git
cd ig-career-hub
npm install
```

### 2. Read Documentation (CRITICAL!)
Before writing any code:
1. Read `docs/PROJECT-OVERVIEW.md` - Full context
2. Read `docs/DATABASE-SCHEMA.md` - Database structure
3. Read `docs/DESIGN-SYSTEM.md` - Visual specs
4. Read `docs/COMPONENT-SPECS.md` - Component requirements

### 3. Set Up Environment Variables
Create `.env.local`:
```bash
# Supabase (Service Role Key - No RLS)
NEXT_PUBLIC_SUPABASE_URL=https://snhezroznzsjcqqxpjpp.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# External Tool URLs (for deep linking)
NEXT_PUBLIC_RESUME_ANALYZER_URL=https://resume-analyzer.com
NEXT_PUBLIC_COVER_LETTER_URL=https://cover-letter-generator.com
NEXT_PUBLIC_INTERVIEW_COACH_URL=https://interview-coach.com
NEXT_PUBLIC_ORACLE_PRO_URL=https://oracle-pro.com
NEXT_PUBLIC_HIDDEN_BOARDS_URL=https://hidden-job-boards.com
NEXT_PUBLIC_CAREER_COACH_URL=https://career-coach.com
```

### 4. Run Database Migration
Open Supabase SQL Editor and run the migration from `docs/DATABASE-SCHEMA.md`

### 5. Start Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🎨 Design Principles

### Visual Style
- **Dark Mode:** Pure black (#000000) background
- **Premium Feel:** Linear/Notion/Vercel aesthetic  
- **Accent Color:** Teal (#14B8A6)
- **Typography:** Inter font, negative letter spacing

### Code Quality
- ✅ TypeScript for everything (strict mode)
- ✅ Component-driven architecture
- ✅ Proper error handling
- ✅ Loading states for all async operations

See `docs/DESIGN-SYSTEM.md` for complete specifications.

---

## 📦 Phase 1 Features (MVP)

Building now:
1. ✅ Application Tracker (CRUD operations)
2. ✅ Kanban Pipeline View
3. ✅ Stats Dashboard
4. ✅ Tool Launcher (6 tool tiles)
5. ✅ Document Library
6. ✅ Basic Analytics

See `docs/PROJECT-OVERVIEW.md` for full roadmap.

---

## 🔐 Authentication Notes

**CRITICAL:** This project does NOT use Supabase Auth!

- Users log in via **WordPress/MemberPress** (existing paywall)
- User ID comes from WordPress (`window.wpUserId`) or browser UUID
- Supabase is for **data storage only**, not authentication
- No separate login required

See `docs/DATABASE-SCHEMA.md` for implementation details.

---

## 🔗 Integration with Existing Tools

This hub connects to 6 existing IG Network tools:
1. IG Career Coach
2. Resume Analyzer Pro  
3. IG Interview Coach
4. Cover Letter Generator
5. Interview Oracle PRO
6. Hidden Job Boards Tool

**Integration Strategy:** Deep linking with URL parameters (Phase 1)

See `docs/INTEGRATION-PLAN.md` for complete integration guide.

---

## 📊 Database

**Provider:** Supabase  
**Connection:** `https://snhezroznzsjcqqxpjpp.supabase.co`  
**Shared:** Same database as 5 existing tools

**Key Tables:**
- `profiles` - User profiles (WordPress integrated)
- `applications` - Job applications
- `interviews` - Scheduled interviews
- `documents` - Resumes and cover letters
- `goals` - User goals

See `docs/DATABASE-SCHEMA.md` for complete schema.

---

## 🚢 Deployment

**Recommended:** Netlify or Vercel

**Build Command:** `npm run build`  
**Output Directory:** `.next`

**Environment Variables Required:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- All tool URLs

---

## 📝 Development Workflow

1. **Read docs** before starting any feature
2. **Follow DESIGN-SYSTEM.md** for all styling
3. **Use COMPONENT-SPECS.md** for component implementation
4. **Test locally** before committing
5. **Commit frequently** with descriptive messages

---

## 🤝 Contributing

This is a public repository, but:
- Never commit `.env.local`
- Never commit API keys
- Follow TypeScript strict mode
- Follow the design system

---

## 📞 Support

Questions? Check the documentation:
1. `docs/PROJECT-OVERVIEW.md` - General context
2. `docs/DATABASE-SCHEMA.md` - Database questions
3. `docs/DESIGN-SYSTEM.md` - Design questions
4. `docs/COMPONENT-SPECS.md` - Component questions

---

## ⚖️ License

MIT License - See LICENSE file

---

**Last Updated:** October 26, 2025  
**Version:** 1.0.0  
**Status:** Phase 1 Development
