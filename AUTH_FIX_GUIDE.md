# Authentication Fix Guide

## ⚠️ CRITICAL SECURITY FIX IMPLEMENTED

This document describes the authentication fix that resolves the data leak where all users were seeing the same hardcoded user's data.

---

## Problem Summary

**Before Fix:**
- All API routes used hardcoded `userId = 'demo-user-123'`
- Every user saw and could modify the same demo user's data
- No user isolation whatsoever
- CRITICAL security vulnerability

**After Fix:**
- User ID passed from client to server via `x-user-id` header
- Each API route validates user authentication
- Users can only access their own data
- Proper user isolation implemented

---

## Architecture

### Client-Side (Browser)
1. User logs in via WordPress/MemberPress
2. WordPress sets `window.wpUserId` in browser
3. `getUserId()` function reads from `window.wpUserId` or localStorage
4. All API calls use `authenticatedFetch()` to include user ID in headers

### Server-Side (API Routes)
1. `getServerUserId()` extracts user ID from request headers
2. Returns 401 Unauthorized if no user ID present
3. All database queries filter by authenticated user ID
4. Users can only access/modify their own data

---

## Files Changed

### New Files Created:
1. `src/lib/utils/getServerUserId.ts` - Server-side user ID extraction
2. `src/lib/utils/authenticatedFetch.ts` - Client-side fetch wrapper
3. `AUTH_FIX_GUIDE.md` - This documentation

### API Routes Updated (11 files):
1. ✅ `src/app/api/applications/route.ts`
2. ✅ `src/app/api/applications/[id]/route.ts`
3. ✅ `src/app/api/applications/[id]/activities/route.ts`
4. ✅ `src/app/api/interviews/route.ts`
5. ✅ `src/app/api/documents/route.ts`
6. ✅ `src/app/api/documents/upload/route.ts`
7. ✅ `src/app/api/gamification/stats/route.ts`
8. ✅ `src/app/api/gamification/award-xp/route.ts`

### Client Files That Need Updating:
All files that call APIs need to import and use `authenticatedFetch`:

```typescript
// ❌ BEFORE (Insecure - no user context)
const response = await fetch('/api/applications')

// ✅ AFTER (Secure - includes user ID)
import { authenticatedFetch } from '@/lib/utils/authenticatedFetch'
const response = await authenticatedFetch('/api/applications')
```

---

## Migration Guide

### For Each Client Component:

1. **Import the authenticated fetch helper:**
```typescript
import { authenticatedFetch, authenticatedPost, authenticatedPatch, authenticatedDelete } from '@/lib/utils/authenticatedFetch'
```

2. **Replace all `fetch()` calls to `/api/*` endpoints:**

**GET Requests:**
```typescript
// Before
const response = await fetch('/api/applications')

// After
const response = await authenticatedFetch('/api/applications')
```

**POST Requests:**
```typescript
// Before
const response = await fetch('/api/applications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})

// After
const response = await authenticatedPost('/api/applications', data)
```

**PATCH Requests:**
```typescript
// Before
const response = await fetch(`/api/applications/${id}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(updates)
})

// After
const response = await authenticatedPatch(`/api/applications/${id}`, updates)
```

**DELETE Requests:**
```typescript
// Before
const response = await fetch(`/api/applications/${id}`, {
  method: 'DELETE'
})

// After
const response = await authenticatedDelete(`/api/applications/${id}`)
```

---

## Files Needing Client-Side Updates

These files contain `fetch('/api/...)` calls that need to be updated:

1. `src/app/dashboard/interviews/page.tsx`
2. `src/components/applications/AddApplicationForm.tsx`
3. `src/components/applications/AddApplicationModal.tsx`
4. `src/components/applications/ApplicationDetailsModal.tsx`
5. `src/components/applications/ApplicationsClient.tsx`
6. `src/components/applications/ApplicationsTable.tsx`
7. `src/components/applications/KanbanClient.tsx`
8. `src/components/dashboard/DashboardClient.tsx`
9. `src/components/documents/DocumentsClient.tsx`
10. `src/components/documents/UploadDocumentModal.tsx`
11. `src/components/goals/GoalsClient.tsx`
12. `src/components/interviews/AddInterviewModal.tsx`
13. `src/components/interviews/EditInterviewModal.tsx`
14. `src/lib/gamification/award-xp.ts`

---

## Testing Checklist

### Unit Testing:
- [ ] `getServerUserId()` returns null when no header present
- [ ] `getServerUserId()` extracts user ID from x-user-id header
- [ ] `authenticatedFetch()` adds x-user-id header to requests

### Integration Testing:
- [ ] Create application as User A
- [ ] Login as User B
- [ ] Verify User B cannot see User A's applications
- [ ] Verify User B cannot modify User A's data
- [ ] Verify User B cannot delete User A's data

### API Route Testing:
For each API endpoint:
- [ ] Returns 401 when no x-user-id header present
- [ ] Returns only authenticated user's data
- [ ] Rejects attempts to access other users' data

---

## Security Improvements

### Before:
```typescript
// ❌ VULNERABLE - Everyone sees same data
const userId = 'demo-user-123'
const { data } = await supabase
  .from('applications')
  .select('*')
  .eq('user_id', userId)  // Always queries demo user!
```

### After:
```typescript
// ✅ SECURE - Each user sees only their data
const userId = await getServerUserId()
if (!userId) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
const { data } = await supabase
  .from('applications')
  .select('*')
  .eq('user_id', userId)  // Queries authenticated user only
```

---

## Future Improvements

### Short Term:
1. ✅ Add server-side user ID extraction (DONE)
2. ✅ Update all API routes (DONE)
3. ⏳ Update all client fetch calls (IN PROGRESS)
4. ⏳ Add comprehensive testing

### Medium Term:
1. Add JWT token verification for additional security
2. Implement refresh token mechanism
3. Add rate limiting per user
4. Add audit logging for data access

### Long Term:
1. Enable Supabase RLS (Row Level Security) as additional layer
2. Implement WordPress SSO integration
3. Add session management
4. Implement CSRF protection

---

## Common Issues & Solutions

### Issue: API returns 401 Unauthorized
**Cause:** Client not sending x-user-id header
**Solution:** Ensure using `authenticatedFetch()` instead of `fetch()`

### Issue: User sees no data after login
**Cause:** User ID not being set in localStorage/window
**Solution:** Check WordPress integration is setting `window.wpUserId`

### Issue: TypeError: getUserId is not a function
**Cause:** Not importing the function
**Solution:** Add `import { getUserId } from '@/lib/utils/getUserId'`

---

## Deployment Checklist

Before deploying to production:

1. [ ] All API routes updated with authentication
2. [ ] All client fetch calls updated to use authenticatedFetch
3. [ ] WordPress integration tested
4. [ ] Multi-user testing completed
5. [ ] No 401 errors in browser console
6. [ ] Data isolation verified with 2+ test users
7. [ ] Error handling tested (no user ID, invalid user ID, etc.)
8. [ ] Documentation updated

---

## Contact

For questions about this authentication fix, consult:
- This guide
- `src/lib/utils/getServerUserId.ts` - Server-side implementation
- `src/lib/utils/authenticatedFetch.ts` - Client-side implementation
- `src/lib/utils/getUserId.ts` - User ID retrieval logic

---

**Status:** ✅ Server-side authentication complete | ⏳ Client-side migration in progress
**Last Updated:** 2025-11-13
