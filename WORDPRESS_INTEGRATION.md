# WordPress Integration Guide - Career Hub

**Date:** November 21, 2025
**Status:** Ready for Implementation
**Purpose:** Enable persistent user authentication via WordPress JWT tokens

---

## 🎯 What This Fixes

**Problem:** Users lose all their applications and data when they log out because each session generates a new random user ID.

**Solution:** WordPress passes the user's real WordPress ID via JWT token, so data persists across all sessions, browsers, and devices.

---

## 📋 Step 1: Create WordPress Code Snippet

In WordPress Admin → **Snippets** → **Add New**:

**Title:** `Career Hub - JWT Authentication`

**Code:**

```php
/**
 * Career Hub - JWT Token Generation
 * Adds JWT token to Career Hub page URL for user authentication
 */
function ig_career_hub_add_jwt_token() {
    // Only run on the Career Hub page
    if (is_page('career-hub') && !isset($_GET['context'])) {

        // Allow anonymous access if not logged in
        if (!is_user_logged_in()) {
            return;
        }

        $user = wp_get_current_user();
        $user_id = get_current_user_id();

        // Get MemberPress membership level (safely)
        $membership_level = 'Free';
        if (function_exists('pmpro_getMembershipLevelForUser')) {
            $membership = pmpro_getMembershipLevelForUser($user_id);
            if ($membership && isset($membership->name)) {
                $membership_level = $membership->name;
            }
        }

        // Create JWT payload
        $payload = array(
            'user_id' => $user_id,
            'email' => $user->user_email,
            'name' => $user->display_name,
            'membership_level' => $membership_level,
            'iat' => time(),
            'exp' => time() + 86400  // Expires in 24 hours
        );

        // JWT secret (SAME as Resume Analyzer Pro and other tools!)
        $secret = 'ea028b3abe0fbb157ac3b12e1247666bb46febd1b17dbd5001253d43289bb9db';

        // Generate JWT token
        $header = rtrim(strtr(base64_encode('{"alg":"HS256","typ":"JWT"}'), '+/', '-_'), '=');
        $payload_json = json_encode($payload);
        $payload_encoded = rtrim(strtr(base64_encode($payload_json), '+/', '-_'), '=');

        $signature_raw = hash_hmac('sha256', "$header.$payload_encoded", $secret, true);
        $signature = rtrim(strtr(base64_encode($signature_raw), '+/', '-_'), '=');

        $token = "$header.$payload_encoded.$signature";

        // Redirect to same page with token in URL
        $redirect_url = add_query_arg('context', $token, get_permalink());
        wp_redirect($redirect_url);
        exit;
    }
}
add_action('template_redirect', 'ig_career_hub_add_jwt_token');
```

**Settings:**
- Run snippet: **Everywhere**
- Active: **Yes**

**Click:** Save Changes and Activate

---

## 📋 Step 2: Update WordPress Iframe Code

Find your Career Hub page and update the iframe embed code to:

```html
<iframe
    id="careerHubFrame"
    src="https://ig-career-hub.netlify.app/"
    width="100%"
    height="1200"
    frameborder="0"
    style="border: none; border-radius: 8px;">
</iframe>

<script>
  // Get context token from WordPress page URL
  const contextToken = new URLSearchParams(window.location.search).get('context');

  // Pass it to iframe
  if (contextToken) {
    document.getElementById('careerHubFrame').src =
      'https://ig-career-hub.netlify.app/?context=' + contextToken;
  }
</script>
```

---

## 📋 Step 3: Add JWT_SECRET to Netlify

1. Go to **Netlify Dashboard**
2. Select **ig-career-hub** site
3. **Site Settings** → **Environment Variables**
4. Click **"Add a variable"**
5. Add:
   - **Key:** `JWT_SECRET`
   - **Value:** `ea028b3abe0fbb157ac3b12e1247666bb46febd1b17dbd5001253d43289bb9db`
6. **Save**

---

## 📋 Step 4: Deploy Career Hub

The code changes are ready to commit. Deploy to Netlify:

```bash
cd "C:/Users/13236/Downloads/IG Network/ig-career-hub"
git add .
git commit -m "Add WordPress JWT authentication for persistent user IDs"
git push
```

---

## ✅ Step 5: Test Authentication

### Test 1: Check Authentication Flow

1. Log into WordPress as a test user
2. Navigate to the Career Hub page
3. URL should redirect to: `/career-hub/?context=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
4. Iframe should load with the token appended
5. Open browser DevTools → Console
6. Look for: `[Auth] ✅ SUCCESS - User authenticated as WordPress user: 123`

### Test 2: Check User ID

1. In Career Hub, open DevTools Console
2. Type: `sessionStorage.getItem('wp_user_id')`
3. Should return: Your WordPress user ID (e.g., "123")
4. Type: `getUserId()` (if debug page available)
5. Should return the same WordPress user ID

### Test 3: Data Persistence

1. Create a test application in Career Hub
2. Note the application details
3. **Log out** of WordPress
4. **Log back in**
5. Navigate back to Career Hub
6. **Application should still be there!** ✅

### Test 4: Cross-Browser/Device

1. Log into WordPress on your phone
2. Open Career Hub
3. Should see the SAME applications as desktop! ✅

---

## 🔍 Debugging

### Problem: No token in URL

**Check:**
- Is the WordPress code snippet active?
- Is the page slug correct? (`is_page('career-hub')`)
- Are you logged into WordPress?

**Debug:**
Add this to snippet temporarily:
```php
error_log('Career Hub auth check - Page: ' . get_the_ID());
error_log('Is career-hub page: ' . (is_page('career-hub') ? 'yes' : 'no'));
error_log('Is logged in: ' . (is_user_logged_in() ? 'yes' : 'no'));
```

Check WordPress debug log.

### Problem: Token verification fails

**Check:**
- Is `JWT_SECRET` set in Netlify?
- Is the secret the SAME in WordPress and Netlify?
- Check Netlify function logs for errors

### Problem: User ID still changing

**Check DevTools Console:**
```javascript
// Should show WordPress ID
sessionStorage.getItem('wp_user_id')

// Should show same ID
getUserId()
```

If showing UUID instead, check:
1. Token is being passed to iframe
2. `/api/auth/verify` is working
3. sessionStorage is being set

---

## 📊 How It Works

### Authentication Flow:

```
1. User visits: /career-hub/
   ↓
2. WordPress checks: Is user logged in?
   ↓
3. YES → Generate JWT with user_id: 123
   ↓
4. WordPress redirects: /career-hub/?context=<JWT_TOKEN>
   ↓
5. Iframe loads: career-hub.netlify.app/?context=<JWT_TOKEN>
   ↓
6. Career Hub extracts token from URL
   ↓
7. Career Hub calls /api/auth/verify with token
   ↓
8. Server verifies JWT signature
   ↓
9. Server returns: { user_id: 123, email: "...", name: "..." }
   ↓
10. Client stores: sessionStorage.setItem('wp_user_id', '123')
    ↓
11. All API calls use: user_id = 123
    ↓
12. Applications saved: WHERE user_id = 123
    ↓
13. Data persists forever! ✅
```

### Next Session:

```
1. User returns next day
   ↓
2. WordPress generates NEW JWT
   ↓
3. But SAME user_id: 123
   ↓
4. Career Hub verifies NEW JWT
   ↓
5. Gets SAME user_id: 123
   ↓
6. Loads applications: WHERE user_id = 123
   ↓
7. User sees all their data! ✅
```

---

## 🎉 Success Criteria

After implementation, users should:

- ✅ See the same applications across all sessions
- ✅ See the same data on mobile and desktop
- ✅ Not lose data when logging out and back in
- ✅ Not lose data when clearing browser cache
- ✅ Have a consistent WordPress user ID

Console should show:
```
[Auth] ✅ SUCCESS - User authenticated as WordPress user: 123
[Auth] Using WordPress user ID from JWT session: 123
```

NOT show:
```
[Auth] ⚠️  NO WordPress ID found! Generated new anonymous UUID: ...
```

---

## 📚 Related Files

### WordPress:
- Code Snippet: `Career Hub - JWT Authentication`
- Page: `/career-hub/` (with iframe embed)

### Career Hub (Netlify):
- `src/app/api/auth/verify/route.ts` - JWT verification endpoint
- `src/contexts/AuthContext.tsx` - Client-side auth handling
- `src/lib/utils/getUserId.ts` - User ID retrieval (updated)
- `src/components/providers/AuthProviderWrapper.tsx` - Auth provider wrapper

### Environment Variables:
- Netlify: `JWT_SECRET`
- WordPress: Hardcoded in snippet (same value)

---

_Created: November 21, 2025_
_Status: READY FOR DEPLOYMENT_

