# JWT Secret Security Fix - Quick Summary

## What Changed

### ✅ Files Created
1. `src/lib/context/token-server.ts` - Server-only token generation
2. `src/app/api/context/generate/route.ts` - API endpoint for tokens

### ✅ Files Modified
1. `src/lib/context/builder.ts` - Calls server API now
2. `src/app/api/public/context/[id]/route.ts` - Uses token-server.ts
3. `.env.example` - Removed public secret

### ✅ Environment Variables
- **Removed:** `NEXT_PUBLIC_CONTEXT_SHARING_SECRET` (was exposing secret)
- **Kept:** `CONTEXT_SHARING_SECRET` (server-only)

---

## The Key Change

**BEFORE:**
```typescript
// Client code (browser) - SECRET EXPOSED!
import { generateContextToken } from './token'
const token = await generateContextToken(...)
```

**AFTER:**
```typescript
// Client code (browser) - NO SECRET!
const response = await authenticatedPost('/api/context/generate', { applicationId })
const { token } = await response.json()
```

**Secret now stays on server!**

---

## To Deploy

1. **Update Netlify Environment Variables:**
   - Remove: `NEXT_PUBLIC_CONTEXT_SHARING_SECRET`
   - Keep: `CONTEXT_SHARING_SECRET`

2. **Generate New Secret (Recommended):**
   ```bash
   openssl rand -hex 32
   ```
   Update in Netlify and all tools

3. **Deploy:**
   ```bash
   git add .
   git commit -m "Fix: Move JWT secret to server-side only"
   git push
   ```

---

## Test Before Deploying

```bash
npm run build  # Should succeed
npm run dev    # Test locally
```

Then:
- Open an application
- Click "Open in Interview Coach"
- Verify context loads correctly

---

See `JWT_SECRET_SECURITY_FIX.md` for complete details.
