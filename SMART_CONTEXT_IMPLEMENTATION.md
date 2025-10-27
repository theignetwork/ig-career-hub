# Smart Context Auto-Population - Implementation Guide

**Status:** Phase 1 Complete (Career Hub) → Phase 2 In Progress (External Tools)

## Overview
Career Hub sends job application context to external tools via JWT tokens. Tools receive the token, decode it, and auto-fill their forms.

---

## Technical Specifications

### 1. JWT Token Structure

**Payload:**
```json
{
  "applicationId": "uuid",
  "companyName": "string",
  "positionTitle": "string",
  "jobDescription": "string | null",
  "location": "string | null",
  "salaryRange": "string | null",
  "remoteType": "remote | hybrid | onsite | null",
  "source": "string | null",
  "dateApplied": "ISO date string | null",
  "exp": 1234567890  // Expires in 1 hour
}
```

**Secret Key:** `your-secret-key-here` (stored in .env as `JWT_SECRET`)

### 2. URL Parameters

Tools are launched with: `https://tool-url.com?context=<JWT_TOKEN>`

**Example:**
```
https://interview-coach.com?context=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Career Hub API Endpoint

**Public endpoint** (no auth required):
```
GET https://career-hub.com/api/context/validate?token=<JWT_TOKEN>
```

**Response:**
```json
{
  "valid": true,
  "data": {
    "applicationId": "...",
    "companyName": "...",
    // ... all payload fields
  }
}
```

---

## Implementation Checklist for Each Tool

### Phase 1: Receive & Decode Token
- [ ] Check URL for `?context=` parameter on page load
- [ ] Extract JWT token from URL
- [ ] Decode JWT using `jsonwebtoken` library
- [ ] Verify token signature with secret key
- [ ] Handle expired tokens gracefully

### Phase 2: Auto-Fill Forms
- [ ] Map JWT payload fields to form inputs
- [ ] Auto-populate all available fields
- [ ] Show visual feedback (e.g., "Pre-loaded from Career Hub")
- [ ] Allow users to edit pre-filled values
- [ ] Clear the token from URL (optional, for security)

### Phase 3: Visual Polish
- [ ] Add banner/toast: "✨ Job details auto-loaded from Career Hub"
- [ ] Highlight pre-filled fields briefly (optional)
- [ ] Add "Smart Context" badge/indicator
- [ ] Ensure smooth UX (no jarring jumps)

---

## Code Pattern (React/Next.js)

```typescript
// 1. Extract token from URL
const searchParams = new URLSearchParams(window.location.search)
const token = searchParams.get('context')

// 2. Decode JWT
import jwt from 'jsonwebtoken'
const decoded = jwt.verify(token, process.env.JWT_SECRET)

// 3. Auto-fill form
setFormData({
  company: decoded.companyName,
  position: decoded.positionTitle,
  jobDescription: decoded.jobDescription,
  // ... etc
})

// 4. Show feedback
setShowAutoFillBanner(true)
```

---

## Tools to Update

1. **Interview Coach** - Auto-fill interview prep form
2. **Resume Analyzer** - Auto-fill company/position context
3. **Cover Letter Generator** - Auto-fill recipient details
4. **Oracle Pro** - Auto-fill interview prediction form

---

## Testing Checklist

- [ ] Token validates correctly
- [ ] Form auto-fills with correct data
- [ ] Expired tokens show friendly error
- [ ] Invalid tokens don't break the app
- [ ] Works with missing/null fields
- [ ] Manual editing still works
- [ ] Visual feedback is clear

---

**Created:** 2025-10-26
**Next Step:** Implement in Interview Coach
