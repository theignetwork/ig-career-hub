# Job Search Command Center - Integration Plan

**Last Updated:** October 26, 2025  
**Status:** Implementation Ready  
**Purpose:** Technical roadmap for integrating 6 existing tools into unified Command Center

---

## Table of Contents

1. [Integration Philosophy](#integration-philosophy)
2. [Phase 1: Deep Linking (Weeks 1-6)](#phase-1-deep-linking)
3. [Phase 2: API Integration (Weeks 7-14)](#phase-2-api-integration)
4. [Phase 3: Embedded Experience (Weeks 15-24)](#phase-3-embedded-experience)
5. [Authentication Flow](#authentication-flow)
6. [Tool-Specific Integration Specs](#tool-specific-integration-specs)
7. [Data Flow Examples](#data-flow-examples)
8. [Testing Strategy](#testing-strategy)

---

## Integration Philosophy

### Core Principles

1. **Non-Breaking:** Existing tools must continue working standalone
2. **Progressive Enhancement:** Integration adds value without requiring immediate adoption
3. **Unified Auth:** Single sign-on across all tools via Supabase
4. **Membership Required:** All tools including Command Center are behind membership paywall
5. **Context Awareness:** Tools receive application/job context from Command Center
6. **Bidirectional Sync:** Data flows both ways (eventually)

### Membership Architecture

**CRITICAL:** All 6 tools + Command Center are premium features requiring active membership.

```typescript
interface MembershipStatus {
  user_id: string;
  membership_tier: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'expired' | 'cancelled';
  access_level: 'basic' | 'full';
  expires_at: string;
  features_enabled: string[]; // ['command-center', 'career-coach', 'oracle-pro', etc.]
}
```

**Authentication Flow:**
1. User logs into IG Network member site
2. Membership status validated against Supabase
3. Only active members can access Command Center
4. Command Center validates membership before launching any tool
5. Tools validate membership on their end (double-check)

**This simplifies integration:**
- ✅ No need for per-tool payment walls
- ✅ Single membership check unlocks everything
- ✅ Shared user profile across all tools
- ✅ Consistent access control logic

### Integration Maturity Levels

```
Level 1: Link-Based (Weeks 1-6)
â†' Users click "Launch Tool" → Opens in new tab
â†' No data passing (yet)
â†' Minimal dev work

Level 2: Deep Linking (Weeks 3-10)
â†' URL parameters pass job context
â†' Tools pre-fill forms automatically
â†' Moderate dev work

Level 3: API Integration (Weeks 11-18)
â†' Tools expose REST/GraphQL APIs
â†' Command Center calls APIs directly
â†' Results displayed in Command Center
â†' Significant dev work

Level 4: Embedded Experience (Weeks 19-24)
â†' Tools run as widgets inside Command Center
â†' Real-time data sync
â†' Feels like one application
â†' Major dev work
```

**Strategy:** Start Level 1, ship Level 2 in Phase 1, reach Level 3 by Phase 2, achieve Level 4 selectively in Phase 3.

---

## Phase 1: Deep Linking (Weeks 1-6)

### Goal
Launch Command Center with **intelligent deep links** that pass job application context to tools.

### Implementation

#### 1.1 Deep Link URL Format

**Standard Format:**
```
https://tool-url.com?context={base64_encoded_json}&auth={jwt_token}
```

**Context Object Schema:**
```typescript
interface ToolContext {
  source: 'ig-career-hub';
  version: '1.0';
  applicationId?: string;
  companyName?: string;
  positionTitle?: string;
  jobDescription?: string;
  jobUrl?: string;
  userId?: string;
  resumeUrl?: string;
  deadline?: string;
  timestamp: number;
}
```

#### 1.2 Deep Link Helper Library

**File:** `/src/lib/utils/deepLink.ts`

```typescript
import { createClient } from '@/lib/supabase/client';

export function encodeContext(context: Partial<ToolContext>): string {
  const fullContext: ToolContext = {
    source: 'ig-career-hub',
    version: '1.0',
    timestamp: Date.now(),
    ...context
  };
  
  return btoa(JSON.stringify(fullContext));
}

export async function getAuthToken(): Promise<string | null> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
}

export function createDeepLink(
  toolUrl: string,
  context: Partial<ToolContext>
): string {
  const url = new URL(toolUrl);
  url.searchParams.set('context', encodeContext(context));
  
  const token = getAuthToken();
  if (token) {
    url.searchParams.set('auth', token);
  }
  
  return url.toString();
}

// High-level helper for each tool
export const toolLaunchers = {
  resumeAnalyzer: (resumeUrl: string) => 
    createDeepLink(process.env.NEXT_PUBLIC_RESUME_ANALYZER_URL!, {
      resumeUrl
    }),
    
  coverLetter: (app: Application) =>
    createDeepLink(process.env.NEXT_PUBLIC_COVER_LETTER_URL!, {
      applicationId: app.id,
      companyName: app.company_name,
      positionTitle: app.position_title,
      jobDescription: app.job_description
    }),
    
  interviewCoach: (app: Application) =>
    createDeepLink(process.env.NEXT_PUBLIC_INTERVIEW_COACH_URL!, {
      applicationId: app.id,
      companyName: app.company_name,
      positionTitle: app.position_title,
      jobDescription: app.job_description
    }),
    
  oraclePro: (app: Application) =>
    createDeepLink(process.env.NEXT_PUBLIC_ORACLE_PRO_URL!, {
      applicationId: app.id,
      companyName: app.company_name,
      positionTitle: app.position_title
    }),
    
  hiddenBoards: (industry?: string) =>
    createDeepLink(process.env.NEXT_PUBLIC_HIDDEN_BOARDS_URL!, {
      industry
    }),
    
  careerCoach: (topic?: string) =>
    createDeepLink(process.env.NEXT_PUBLIC_CAREER_COACH_URL!, {
      topic
    })
};
```

#### 1.3 Tool Launch Component

**File:** `/src/components/ToolLauncher.tsx`

```typescript
'use client';

import { Button } from '@/components/ui/button';
import { toolLaunchers } from '@/lib/utils/deepLink';
import type { Application } from '@/types';

interface ToolLauncherProps {
  tool: 'resume' | 'cover-letter' | 'interview-coach' | 'oracle' | 'boards' | 'coach';
  application?: Application;
  label?: string;
  variant?: 'default' | 'outline' | 'ghost';
  icon?: React.ReactNode;
}

export function ToolLauncher({ 
  tool, 
  application, 
  label, 
  variant = 'default',
  icon 
}: ToolLauncherProps) {
  const handleLaunch = () => {
    let url: string;
    
    switch(tool) {
      case 'resume':
        url = toolLaunchers.resumeAnalyzer(application?.resume_url || '');
        break;
      case 'cover-letter':
        url = toolLaunchers.coverLetter(application!);
        break;
      case 'interview-coach':
        url = toolLaunchers.interviewCoach(application!);
        break;
      case 'oracle':
        url = toolLaunchers.oraclePro(application!);
        break;
      case 'boards':
        url = toolLaunchers.hiddenBoards();
        break;
      case 'coach':
        url = toolLaunchers.careerCoach();
        break;
    }
    
    // Track launch event
    trackToolLaunch(tool, application?.id);
    
    // Open in new tab
    window.open(url, '_blank');
  };
  
  return (
    <Button 
      onClick={handleLaunch}
      variant={variant}
      className="gap-2"
    >
      {icon}
      {label || getDefaultLabel(tool)}
    </Button>
  );
}

function getDefaultLabel(tool: string): string {
  const labels = {
    'resume': 'Analyze Resume',
    'cover-letter': 'Generate Cover Letter',
    'interview-coach': 'Practice Interview',
    'oracle': 'Generate Questions',
    'boards': 'Find Job Boards',
    'coach': 'Ask Career Coach'
  };
  return labels[tool] || 'Launch Tool';
}
```

#### 1.4 Tool Context Parser (For Each Tool)

**Each existing tool needs to add this code to parse incoming context:**

```typescript
// Add to each tool's root layout or page
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface ToolContext {
  applicationId?: string;
  companyName?: string;
  positionTitle?: string;
  jobDescription?: string;
  // ... other fields
}

export function useToolContext(): ToolContext | null {
  const searchParams = useSearchParams();
  const [context, setContext] = useState<ToolContext | null>(null);
  
  useEffect(() => {
    const contextParam = searchParams.get('context');
    if (!contextParam) return;
    
    try {
      const decoded = atob(contextParam);
      const parsed = JSON.parse(decoded);
      
      // Validate source
      if (parsed.source === 'ig-career-hub') {
        setContext(parsed);
      }
    } catch (error) {
      console.error('Failed to parse tool context:', error);
    }
  }, [searchParams]);
  
  return context;
}

// Usage in tool components
function CoverLetterGenerator() {
  const context = useToolContext();
  
  // Pre-fill form if context exists
  const [company, setCompany] = useState(context?.companyName || '');
  const [position, setPosition] = useState(context?.positionTitle || '');
  const [jobDesc, setJobDesc] = useState(context?.jobDescription || '');
  
  // ... rest of component
}
```

### Phase 1 Deliverables

- ✅ Deep link helper library
- ✅ Tool launcher component
- ✅ Context parser added to all 6 tools
- ✅ Environment variables configured
- ✅ Tracking events for tool launches

---

## Phase 2: API Integration (Weeks 7-14)

### Goal
Tools expose APIs so Command Center can **display results directly** without opening new tabs.

### Implementation

#### 2.1 Shared API Standards

**Authentication Header:**
```
Authorization: Bearer {supabase_jwt_token}
```

**Response Format:**
```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    credits_used?: number;
    rate_limit?: {
      remaining: number;
      reset_at: string;
    };
  };
}
```

#### 2.2 Tool API Endpoints

**Cover Letter Generator API**
```typescript
// Endpoint: POST /api/generate
interface GenerateRequest {
  company_name: string;
  position_title: string;
  job_description: string;
  tone: 'professional' | 'conversational' | 'bold' | 'problem-solution';
  length: 'short' | 'medium' | 'long';
}

interface GenerateResponse {
  cover_letter: string;
  keywords: string[];
  impact_score: number;
  estimated_read_time: string;
}

// Usage from Command Center
const response = await fetch('https://cover-letter-fresh.com/api/generate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(requestData)
});
```

**Interview Oracle PRO API**
```typescript
// Endpoint: POST /api/generate-questions
interface OracleRequest {
  company_name: string;
  position_title: string;
}

interface OracleResponse {
  session_id: string;
  questions: Array<{
    id: string;
    question: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    soar_answer?: {
      situation: string;
      obstacles: string;
      actions: string;
      results: string;
    };
  }>;
}
```

**Interview Coach API**
```typescript
// Endpoint: POST /api/practice-session
interface PracticeRequest {
  job_description: string;
  num_questions?: number;
}

interface PracticeResponse {
  session_id: string;
  questions: string[];
  expires_at: string;
}

// Endpoint: POST /api/evaluate-answer
interface EvaluateRequest {
  session_id: string;
  question_id: string;
  audio_base64: string; // or transcript
}

interface EvaluateResponse {
  transcript: string;
  feedback: {
    strengths: string[];
    improvements: string[];
    score: number;
    clarity: number;
    relevance: number;
  };
}
```

**Resume Analyzer Pro API** (Once Backend Built)
```typescript
// Endpoint: POST /api/analyze
interface AnalyzeRequest {
  resume_text?: string;
  resume_pdf_url?: string;
  target_role?: string;
}

interface AnalyzeResponse {
  ats_score: number;
  strengths: string[];
  weaknesses: string[];
  keywords_found: string[];
  keywords_missing: string[];
  suggestions: Array<{
    section: string;
    current: string;
    improved: string;
    impact: 'high' | 'medium' | 'low';
  }>;
}
```

#### 2.3 Command Center API Client

**File:** `/src/lib/api/toolsClient.ts`

```typescript
import { createClient } from '@/lib/supabase/client';

class ToolsAPIClient {
  private async getAuthToken(): Promise<string> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');
    return session.access_token;
  }
  
  private async request<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const token = await this.getAuthToken();
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    return response.json();
  }
  
  // Cover Letter Generation
  async generateCoverLetter(request: GenerateRequest): Promise<string> {
    const { data } = await this.request<GenerateResponse>(
      `${process.env.NEXT_PUBLIC_COVER_LETTER_URL}/api/generate`,
      {
        method: 'POST',
        body: JSON.stringify(request)
      }
    );
    
    if (!data) throw new Error('Failed to generate cover letter');
    return data.cover_letter;
  }
  
  // Oracle Question Generation
  async generateInterviewQuestions(
    company: string, 
    position: string
  ): Promise<OracleResponse> {
    const { data } = await this.request<OracleResponse>(
      `${process.env.NEXT_PUBLIC_ORACLE_PRO_URL}/api/generate-questions`,
      {
        method: 'POST',
        body: JSON.stringify({ company_name: company, position_title: position })
      }
    );
    
    if (!data) throw new Error('Failed to generate questions');
    return data;
  }
  
  // Resume Analysis
  async analyzeResume(resumeUrl: string): Promise<AnalyzeResponse> {
    const { data } = await this.request<AnalyzeResponse>(
      `${process.env.NEXT_PUBLIC_RESUME_ANALYZER_URL}/api/analyze`,
      {
        method: 'POST',
        body: JSON.stringify({ resume_pdf_url: resumeUrl })
      }
    );
    
    if (!data) throw new Error('Failed to analyze resume');
    return data;
  }
}

export const toolsAPI = new ToolsAPIClient();
```

#### 2.4 Embedded Results Display

**Example: Generate Cover Letter Inside Command Center**

```typescript
'use client';

import { useState } from 'react';
import { toolsAPI } from '@/lib/api/toolsClient';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function CoverLetterWidget({ application }: { application: Application }) {
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await toolsAPI.generateCoverLetter({
        company_name: application.company_name,
        position_title: application.position_title,
        job_description: application.job_description,
        tone: 'professional',
        length: 'medium'
      });
      setCoverLetter(result);
    } catch (error) {
      console.error('Failed to generate:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <Button onClick={handleGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Cover Letter'}
      </Button>
      
      {coverLetter && (
        <Textarea 
          value={coverLetter} 
          rows={20}
          className="font-serif"
        />
      )}
    </div>
  );
}
```

### Phase 2 Deliverables

- ✅ API endpoints built in all 6 tools
- ✅ Unified API client in Command Center
- ✅ Embedded widgets for key features
- ✅ Error handling and rate limiting
- ✅ API documentation

---

## Phase 3: Embedded Experience (Weeks 15-24)

### Goal
Tools feel like **native features** of Command Center, not external services.

### Implementation

#### 3.1 Micro-Frontend Architecture

**Strategy:** Use iframe embedding with postMessage communication

```typescript
// Command Center hosts tool as iframe
<iframe 
  src={`${toolUrl}?embed=true&context=${context}`}
  className="w-full h-screen"
  allow="microphone; camera"
  sandbox="allow-scripts allow-same-origin allow-forms"
/>

// Tool sends events to parent
window.parent.postMessage({
  type: 'TOOL_EVENT',
  event: 'COVER_LETTER_GENERATED',
  data: { letterId: '123', length: 850 }
}, '*');

// Command Center listens for events
window.addEventListener('message', (event) => {
  if (event.data.type === 'TOOL_EVENT') {
    handleToolEvent(event.data);
  }
});
```

#### 3.2 Real-Time Data Sync

**Use Supabase Realtime for live updates:**

```typescript
// When user generates cover letter in tool
// Tool inserts into shared database table
await supabase.from('documents').insert({
  user_id: userId,
  application_id: applicationId,
  type: 'cover_letter',
  content: coverLetterText,
  created_at: new Date()
});

// Command Center subscribes to changes
const subscription = supabase
  .channel('documents')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'documents' },
    (payload) => {
      // Update UI immediately
      setDocuments(prev => [...prev, payload.new]);
    }
  )
  .subscribe();
```

#### 3.3 Unified Navigation

**Command Center wraps all tools with consistent header:**

```typescript
export function ToolWrapper({ 
  toolName, 
  toolUrl, 
  context 
}: ToolWrapperProps) {
  return (
    <div className="h-screen flex flex-col">
      {/* Unified Header */}
      <header className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/dashboard')}>
              ← Back to Dashboard
            </Button>
            <Separator orientation="vertical" />
            <h1 className="font-semibold">{toolName}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline">{context.companyName}</Badge>
            <Badge variant="outline">{context.positionTitle}</Badge>
          </div>
        </div>
      </header>
      
      {/* Tool Content */}
      <div className="flex-1 overflow-hidden">
        <iframe 
          src={`${toolUrl}?embed=true&context=${encodeContext(context)}`}
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}
```

### Phase 3 Deliverables

- ✅ Iframe embedding support in all tools
- ✅ PostMessage event system
- ✅ Real-time database sync
- ✅ Unified navigation wrapper
- ✅ Consistent design tokens across tools

---

## Authentication Flow

### Unified Supabase Auth + Membership Validation

**All tools are behind the IG Network membership paywall. Authentication is simplified:**

```typescript
// 1. User signs in to Command Center (or any tool)
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password
});

// 2. Validate membership status
const { data: membership } = await supabase
  .from('memberships')
  .select('*')
  .eq('user_id', user.id)
  .single();

if (!membership || membership.status !== 'active') {
  // Redirect to membership upgrade page
  router.push('/membership/upgrade');
  return;
}

// 3. Get session token
const { data: { session } } = await supabase.auth.getSession();
const token = session?.access_token;

// 4. Pass token to tools via URL (membership already validated)
window.open(`https://tool.com?auth=${token}`, '_blank');

// 5. Tool validates token AND membership
const supabase = createClient();
const { data: { user }, error } = await supabase.auth.getUser(token);

if (error || !user) {
  // Redirect to Command Center login
  window.location.href = 'https://command-center.com/login';
  return;
}

// Double-check membership (security best practice)
const { data: membership } = await supabase
  .from('memberships')
  .select('status, access_level')
  .eq('user_id', user.id)
  .single();

if (!membership || membership.status !== 'active') {
  // Show "Membership Required" modal
  showMembershipRequiredModal();
  return;
}

// User is authenticated AND has active membership
// Load tool functionality
```

### Shared Membership Utility

**Create a shared helper used by all tools:**

**File:** `/src/lib/auth/membership.ts`

```typescript
import { createClient } from '@/lib/supabase/client';

export interface Membership {
  user_id: string;
  status: 'active' | 'expired' | 'cancelled' | 'trialing';
  tier: 'free' | 'pro' | 'enterprise';
  access_level: 'basic' | 'full';
  expires_at: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
}

export async function checkMembership(): Promise<{
  isValid: boolean;
  membership: Membership | null;
  reason?: string;
}> {
  const supabase = createClient();
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { 
      isValid: false, 
      membership: null,
      reason: 'Not authenticated'
    };
  }
  
  // Check membership status
  const { data: membership, error: membershipError } = await supabase
    .from('memberships')
    .select('*')
    .eq('user_id', user.id)
    .single();
  
  if (membershipError || !membership) {
    return {
      isValid: false,
      membership: null,
      reason: 'No membership found'
    };
  }
  
  // Check if active
  if (membership.status !== 'active' && membership.status !== 'trialing') {
    return {
      isValid: false,
      membership,
      reason: 'Membership expired or cancelled'
    };
  }
  
  // Check if expired
  const expiresAt = new Date(membership.expires_at);
  if (expiresAt < new Date()) {
    return {
      isValid: false,
      membership,
      reason: 'Membership expired'
    };
  }
  
  return {
    isValid: true,
    membership
  };
}

export async function requireMembership(): Promise<Membership> {
  const { isValid, membership, reason } = await checkMembership();
  
  if (!isValid) {
    // Redirect to membership page
    if (typeof window !== 'undefined') {
      window.location.href = `/membership/required?reason=${encodeURIComponent(reason || 'Membership required')}`;
    }
    throw new Error(reason || 'Membership required');
  }
  
  return membership!;
}

// React hook for membership checking
export function useMembership() {
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function loadMembership() {
      try {
        const { isValid, membership, reason } = await checkMembership();
        
        if (!isValid) {
          setError(reason || 'Invalid membership');
          setMembership(null);
        } else {
          setMembership(membership);
          setError(null);
        }
      } catch (err) {
        setError('Failed to check membership');
      } finally {
        setLoading(false);
      }
    }
    
    loadMembership();
  }, []);
  
  return { membership, loading, error, isValid: !!membership };
}
```

### Usage in All Tools

**Every tool should use this pattern:**

```typescript
'use client';

import { useEffect } from 'react';
import { useMembership } from '@/lib/auth/membership';
import { MembershipRequired } from '@/components/MembershipRequired';

export default function ToolPage() {
  const { membership, loading, error, isValid } = useMembership();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!isValid) {
    return <MembershipRequired reason={error} />;
  }
  
  // User has valid membership, show tool
  return <ToolContent membership={membership} />;
}
```

### Session Persistence

**Since all tools are on same domain (*.theinterviewguys.com), we can share auth:**

```typescript
// Command Center sets auth cookie for all subdomains
document.cookie = `auth-token=${token}; domain=.theinterviewguys.com; path=/; secure; samesite=strict`;

// Also set membership flag
document.cookie = `membership-valid=true; domain=.theinterviewguys.com; path=/; secure; samesite=strict`;

// Tools read cookie
const token = document.cookie
  .split('; ')
  .find(row => row.startsWith('auth-token='))
  ?.split('=')[1];

const membershipValid = document.cookie
  .split('; ')
  .find(row => row.startsWith('membership-valid='))
  ?.split('=')[1] === 'true';
```

### Benefits of Membership-Gated Architecture

✅ **Simplified Access Control:** One membership check unlocks all 6 tools + Command Center
✅ **Single Payment Flow:** Users subscribe once, get everything
✅ **Unified User Experience:** Consistent "members only" branding
✅ **Better Analytics:** Track which tools members actually use
✅ **Upsell Opportunities:** "Unlock Command Center + all tools for $29/month"
✅ **Reduced Friction:** No per-tool paywalls or subscriptions
✅ **Shared User Data:** All tools access same user profile, preferences, membership info

---

## Tool-Specific Integration Specs

### 1. IG Career Coach
- **Integration Level:** Level 2 (Deep Linking) by Week 6
- **Context Needed:** Current application ID, user goals
- **API Endpoints:** POST /api/chat (context-aware conversations)
- **Phase 3:** Embed as persistent sidebar in Command Center

### 2. Resume Analyzer Pro
- **Integration Level:** Level 1 (Links) initially, Level 3 (API) once backend built
- **Context Needed:** Resume URL, target job description
- **API Endpoints:** POST /api/analyze, GET /api/suggestions
- **Phase 3:** Display analysis results inline in application cards

### 3. IG Interview Coach
- **Integration Level:** Level 3 (API) by Week 10
- **Context Needed:** Application ID, job description, Oracle session ID
- **API Endpoints:** POST /api/practice-session, POST /api/evaluate-answer
- **Phase 3:** Embed practice widget in interview prep panel

### 4. Cover Letter Generator Fresh
- **Integration Level:** Level 3 (API) by Week 8
- **Context Needed:** Company, position, job description
- **API Endpoints:** POST /api/generate, GET /api/templates
- **Phase 3:** Generate and display cover letters directly in application flow

### 5. Interview Oracle PRO
- **Integration Level:** Level 3 (API) by Week 9
- **Context Needed:** Company name, position title
- **API Endpoints:** POST /api/generate-questions, GET /api/session/:id
- **Phase 3:** Display generated questions in interview prep cards
- **Migration:** Move from LocalStorage to Supabase (store sessions in database)

### 6. Hidden Job Boards Tool
- **Integration Level:** Level 2 (Deep Linking) by Week 6
- **Context Needed:** User's target industry/role
- **API Endpoints:** GET /api/boards?category=:cat
- **Phase 3:** Embed recommended boards widget in job discovery section

---

## Data Flow Examples

### Example 1: Complete Application Flow

```
User: Creates application for "Senior PM at Netflix"
  ↓
Command Center: Creates application record in database
  ↓
User: Clicks "Generate Cover Letter"
  ↓
Command Center: Calls Cover Letter API with Netflix context
  ↓
Cover Letter Tool: Generates letter, returns text
  ↓
Command Center: Displays letter, allows editing
  ↓
User: Saves final version
  ↓
Command Center: Stores in documents table, links to application
  ↓
User: Clicks "Prepare for Interview"
  ↓
Command Center: Calls Oracle API to generate questions
  ↓
Oracle PRO: Returns 12 Netflix-specific questions with SOAR answers
  ↓
Command Center: Displays questions, offers practice mode
  ↓
User: Clicks "Practice Now"
  ↓
Command Center: Opens Interview Coach with Oracle session ID
  ↓
Interview Coach: Loads questions, starts voice recording practice
  ↓
User: Completes practice session
  ↓
Interview Coach: Sends feedback via postMessage to Command Center
  ↓
Command Center: Updates interview prep status to "Completed"
```

### Example 2: Resume Improvement Flow

```
User: Uploads resume PDF
  ↓
Command Center: Stores in Supabase Storage, creates document record
  ↓
User: Clicks "Analyze Resume"
  ↓
Command Center: Calls Resume Analyzer API
  ↓
Resume Analyzer: Extracts text, runs ATS analysis, returns suggestions
  ↓
Command Center: Displays ATS score (72/100) and improvement recommendations
  ↓
User: Clicks "Apply Suggestion: Add Python keyword"
  ↓
Command Center: Updates resume text, re-analyzes
  ↓
Resume Analyzer: New score (78/100)
  ↓
Command Center: Saves improved resume as Version 2
  ↓
User: Uses Version 2 for next application
```

---

## Testing Strategy

### Phase 1 Testing

**Manual Testing:**
- ✅ Deep links open correct tools
- ✅ Context parameters populate forms
- ✅ Auth tokens are passed correctly
- ✅ Tools work standalone (without context)

**Automated Testing:**
```typescript
describe('Deep Linking', () => {
  it('should create valid deep link with context', () => {
    const context = {
      companyName: 'Netflix',
      positionTitle: 'Senior PM'
    };
    
    const link = toolLaunchers.coverLetter({ ...mockApplication, ...context });
    
    expect(link).toContain('context=');
    expect(link).toContain('auth=');
  });
  
  it('should decode context correctly in tool', () => {
    const encoded = encodeContext({ companyName: 'Netflix' });
    const decoded = JSON.parse(atob(encoded));
    
    expect(decoded.companyName).toBe('Netflix');
    expect(decoded.source).toBe('ig-career-hub');
  });
});
```

### Phase 2 Testing

**API Integration Tests:**
```typescript
describe('Tools API Client', () => {
  it('should generate cover letter via API', async () => {
    const result = await toolsAPI.generateCoverLetter({
      company_name: 'Netflix',
      position_title: 'Senior PM',
      job_description: 'Sample job description...',
      tone: 'professional',
      length: 'medium'
    });
    
    expect(result).toContain('Netflix');
    expect(result.length).toBeGreaterThan(500);
  });
  
  it('should handle API errors gracefully', async () => {
    await expect(
      toolsAPI.generateCoverLetter({ /* invalid data */ })
    ).rejects.toThrow();
  });
});
```

### Phase 3 Testing

**Embedded Experience Tests:**
- ✅ Iframe communication works
- ✅ Real-time sync updates UI
- ✅ Navigation wrapper persists across tools
- ✅ Performance: embedded tools load in <2 seconds

---

## Timeline Summary

| Phase | Duration | Key Deliverables |
|-------|----------|-----------------|
| **Phase 1** | Weeks 1-6 | Deep linking, tool launchers, context parsing |
| **Phase 2** | Weeks 7-14 | API endpoints, embedded widgets, API client |
| **Phase 3** | Weeks 15-24 | Iframe embedding, real-time sync, unified nav |

**Total Timeline:** 24 weeks (6 months)

---

## Success Metrics

### Phase 1
- ✅ 80%+ of tool launches use deep links
- ✅ Context data pre-fills forms correctly 90%+ of time
- ✅ Zero authentication errors

### Phase 2
- ✅ 50%+ of actions happen via API (without opening tool)
- ✅ API response times <2 seconds
- ✅ Zero API authentication failures

### Phase 3
- ✅ 70%+ of users prefer embedded experience
- ✅ Real-time sync works 99.9% of time
- ✅ Users describe experience as "seamless"

---

## Next Steps

1. **Get approval** on integration approach
2. **Prioritize tools** for Phase 2 API work (recommend: Cover Letter → Oracle → Interview Coach)
3. **Create tickets** for each integration task
4. **Set up monitoring** for deep link usage
5. **Begin Phase 1** implementation

---

*End of Integration Plan*
