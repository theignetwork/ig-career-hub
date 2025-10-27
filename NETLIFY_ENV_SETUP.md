# Netlify Environment Variables Setup

## IG Career Hub Production Environment Variables

Follow these steps to configure the production tool URLs in Netlify:

### 1. Go to Netlify Dashboard
1. Navigate to: https://app.netlify.com/
2. Select your **ig-career-hub** site
3. Go to **Site configuration** → **Environment variables**

### 2. Add/Update These Environment Variables

Click **Add a variable** for each of the following:

#### External Tool URLs
```
NEXT_PUBLIC_INTERVIEW_COACH_URL
https://members.theinterviewguys.com/hq/the-ig-interview-coach/
```

```
NEXT_PUBLIC_ORACLE_PRO_URL
https://members.theinterviewguys.com/hq/interview-oracle-pro/
```

```
NEXT_PUBLIC_COVER_LETTER_URL
https://members.theinterviewguys.com/hq/cover-letter-generator-pro/
```

```
NEXT_PUBLIC_RESUME_ANALYZER_URL
https://members.theinterviewguys.com/hq/resume-analyzer-pro/
```

```
NEXT_PUBLIC_HIDDEN_BOARDS_URL
https://members.theinterviewguys.com/hq/hidden-job-boards-tool/
```

```
NEXT_PUBLIC_INTERVIEW_MASTER_GUIDE_URL
https://members.theinterviewguys.com/wp-content/uploads/2025/06/Master-Guide-2025.pdf
```

#### Context Sharing Secret
```
CONTEXT_SHARING_SECRET
your-secret-key-here
```

```
NEXT_PUBLIC_CONTEXT_SHARING_SECRET
your-secret-key-here
```

**IMPORTANT:** Replace `your-secret-key-here` with a secure random string. This must match the secret used in your tools (Interview Coach, Oracle Pro, Cover Letter Generator).

#### Career Hub URL
```
NEXT_PUBLIC_CAREER_HUB_URL
https://ig-career-hub.netlify.app
```

```
NEXT_PUBLIC_TOOLS_DOMAIN
https://members.theinterviewguys.com
```

#### Supabase Configuration
These should already be set, but verify:

```
NEXT_PUBLIC_SUPABASE_URL
https://snhezroznzsjcqqxpjpp.supabase.co
```

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuaGV6cm96bnpzamNxcXhwanBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2OTM0NDcsImV4cCI6MjA2MTI2OTQ0N30.KyySx7uxtC_GRB_NF9DYCA9N350ajZ1uQ6hvYDkHiLY
```

```
SUPABASE_SERVICE_ROLE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNuaGV6cm96bnpzamNxcXhwanBwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTY5MzQ0NywiZXhwIjoyMDYxMjY5NDQ3fQ.tvaQ6LkeBS3X0lRvL7cTX0_0cMQRCCuunO3tMPSMT7s
```

#### Anthropic Claude API
```
ANTHROPIC_API_KEY
your-anthropic-api-key-here
```

**Note:** Use your actual Anthropic API key from https://console.anthropic.com/

### 3. Deploy
After adding all environment variables, trigger a new deployment:
- Go to **Deploys** tab
- Click **Trigger deploy** → **Deploy site**

### 4. Test
Once deployed, test the Smart Context auto-populate feature:
1. Go to https://ig-career-hub.netlify.app
2. Create or select an application
3. Click "Launch with Smart Context" for any tool
4. Verify the tool opens with job details auto-filled

---

## Notes

- Environment variables are encrypted at rest in Netlify
- Changes to environment variables require a new deployment to take effect
- Never commit .env files to git - they should remain gitignored
- This setup enables Smart Context auto-population across all tools
