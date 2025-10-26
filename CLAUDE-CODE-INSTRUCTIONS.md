# Instructions for Claude Code

## 📋 Your Mission

Build the IG Career Hub - a unified job search command center that integrates 6 existing tools and adds application tracking capabilities.

---

## 🎯 Critical First Steps (DO THIS FIRST!)

### 1. Read All Documentation (30 minutes)

**Read in this order:**
1. **PROJECT-OVERVIEW.md** (10 min) - Understand the full context, existing tools, business model
2. **DATABASE-SCHEMA.md** (10 min) - Understand the data structure, WordPress auth approach
3. **DESIGN-SYSTEM.md** (5 min) - Visual specifications, colors, typography
4. **COMPONENT-SPECS.md** (5 min) - Individual component requirements

**Why this matters:** These docs contain months of planning and trial-and-error. They'll save you hours of work and prevent mistakes.

---

## 🚀 Step-by-Step Build Plan

### Phase 1: Project Setup (Day 1)

**1. Initialize Next.js Project**
```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
```

**2. Install Dependencies**
```bash
npm install @supabase/supabase-js
npm install -D @types/node
```

**3. Set Up Environment Variables**
- Copy `.env.example` to `.env.local`
- Get Supabase Service Role Key from: https://supabase.com/dashboard/project/snhezroznzsjcqqxpjpp/settings/api
- Fill in all values

**4. Configure Tailwind**
Update `tailwind.config.ts` with design system colors:
```typescript
export default {
  theme: {
    extend: {
      colors: {
        'primary-teal': '#14B8A6',
        'primary-teal-dark': '#0D9488',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
      }
    }
  }
}
```

---

### Phase 2: Database Setup (Day 1)

**1. Run Migration**
- Open Supabase SQL Editor: https://supabase.com/dashboard/project/snhezroznzsjcqqxpjpp/editor
- Copy entire migration SQL from `docs/DATABASE-SCHEMA.md`
- Run it
- Verify all tables created

**2. Create Supabase Client**
Create `/lib/supabase/client.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

**3. Create User ID Helper**
Create `/lib/utils/userId.ts`:
```typescript
export function getUserId(): string {
  // Try WordPress user ID first
  if (typeof window !== 'undefined' && (window as any).wpUserId) {
    return (window as any).wpUserId.toString();
  }
  
  // Fallback to browser UUID
  if (typeof window !== 'undefined') {
    let userId = localStorage.getItem('ig_user_id');
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem('ig_user_id', userId);
    }
    return userId;
  }
  
  return crypto.randomUUID();
}
```

---

### Phase 3: Core UI Components (Days 2-3)

Build base components following `COMPONENT-SPECS.md`:

**Day 2 Morning:**
1. `/components/ui/Button.tsx`
2. `/components/ui/Input.tsx`
3. `/components/ui/Card.tsx`

**Day 2 Afternoon:**
4. `/components/ui/Select.tsx`
5. `/components/ui/Badge.tsx`
6. `/components/ui/Modal.tsx`

**Day 3:**
7. `/components/dashboard/StatsCard.tsx`
8. `/components/dashboard/StatNumber.tsx`
9. `/components/dashboard/DashboardLayout.tsx`

**Important:** Follow DESIGN-SYSTEM.md exactly for styling!

---

### Phase 4: Dashboard Page (Days 3-4)

**1. Create Dashboard Route**
`/app/(dashboard)/page.tsx`

**Components to build:**
- Stats overview (applications, interviews, offers)
- Recent applications list
- Upcoming interviews
- Quick actions

**Reference:** See COMPONENT-SPECS.md for "Main Dashboard Page"

---

### Phase 5: Application Tracker (Days 4-6)

**Day 4: Applications List**
- `/app/(dashboard)/applications/page.tsx`
- Table view of all applications
- Filter by status
- Search functionality

**Day 5: Create/Edit Application**
- `/app/(dashboard)/applications/new/page.tsx`
- `/app/(dashboard)/applications/[id]/page.tsx`
- Form for adding/editing applications

**Day 6: Kanban View**
- `/app/(dashboard)/applications/kanban/page.tsx`
- Drag-and-drop pipeline
- Status columns: Applied → Phone Screen → Interview → Offer

---

### Phase 6: Document Library (Day 7)

**1. Create Documents Page**
`/app/(dashboard)/documents/page.tsx`

**Features:**
- Upload documents (Supabase Storage)
- List all resumes and cover letters
- Track which docs were used where
- Success rate per document

---

### Phase 7: Tool Launcher (Day 8)

**1. Create Tools Page**
`/app/(dashboard)/tools/page.tsx`

**Features:**
- 6 tool tiles (see DESIGN-SYSTEM.md for styling)
- Deep links with context
- Usage tracking

**Reference:** INTEGRATION-PLAN.md for deep linking code

---

## 🎨 Design System Checklist

Follow these religiously:

**Colors:**
- ✅ Pure black background: `#000000`
- ✅ Card background: `rgba(10, 14, 26, 0.6)` with backdrop blur
- ✅ Accent color: `#14B8A6` (teal)
- ✅ Borders: `1px solid rgba(255, 255, 255, 0.06)`

**Typography:**
- ✅ Font: Inter
- ✅ Negative letter spacing on headers
- ✅ Large numbers: 56px / 300 weight / -2px tracking

**Interactions:**
- ✅ Transitions: `0.3s cubic-bezier(0.4, 0, 0.2, 1)`
- ✅ Hover: `translateY(-4px)` + glow shadow
- ✅ Status dots: Glowing circles

---

## ⚠️ Critical Reminders

### Authentication
- ❌ DO NOT use Supabase Auth
- ✅ Use `getUserId()` helper
- ✅ User IDs are TEXT, not UUID
- ✅ Use Supabase Service Role Key

### Database
- ✅ All `user_id` fields are TEXT
- ✅ Use `profiles` table (not `auth.users`)
- ✅ RLS is permissive (or disabled)

### Styling
- ✅ Follow DESIGN-SYSTEM.md exactly
- ✅ Dark mode only
- ✅ Premium aesthetic (Linear/Notion style)

### Code Quality
- ✅ TypeScript strict mode
- ✅ Proper error handling
- ✅ Loading states everywhere
- ✅ Responsive design

---

## 📊 Success Criteria

**You'll know it's working when:**
- ✅ Can create applications
- ✅ Applications show in dashboard
- ✅ Stats calculate correctly
- ✅ Kanban drag-and-drop works
- ✅ Documents upload successfully
- ✅ Tool launcher opens external tools
- ✅ Looks exactly like DESIGN-SYSTEM.md

---

## 🐛 Common Pitfalls to Avoid

1. **Don't use Supabase Auth** - Use getUserId() instead
2. **Don't use UUID for user_id** - It's TEXT
3. **Don't skip the docs** - They have all the answers
4. **Don't guess at styling** - Follow DESIGN-SYSTEM.md exactly
5. **Don't use RLS policies with auth.uid()** - Use service role key

---

## 📞 When You Get Stuck

1. Check the relevant doc (PROJECT-OVERVIEW, DATABASE-SCHEMA, etc.)
2. Look at COMPONENT-SPECS.md for component examples
3. Review INTEGRATION-PLAN.md for tool connection code
4. Check DESIGN-SYSTEM.md for styling guidance

---

## 🎯 Priority Order

**Build in this order:**
1. Database setup ✅ (Day 1)
2. Base UI components ✅ (Days 2-3)
3. Dashboard ✅ (Days 3-4)
4. Application tracker ✅ (Days 4-6)
5. Document library ✅ (Day 7)
6. Tool launcher ✅ (Day 8)

**Total time:** ~8 days of focused work

---

## 🚢 Deployment Checklist

**Before deploying:**
- [ ] All environment variables set in Netlify/Vercel
- [ ] Database migration run in production
- [ ] All pages working locally
- [ ] Mobile responsive
- [ ] Loading states working
- [ ] Error handling working

---

## 🎉 You've Got This!

Everything you need is in the docs. Take your time, follow the plan, and build something amazing!

**Remember:** Read the docs FIRST, then start coding. It will save you hours of rework.

---

**Good luck!** 🚀
