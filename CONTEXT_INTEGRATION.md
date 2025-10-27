# Smart Context Auto-Population - Integration Guide

This guide explains how to integrate external tools with Career Hub's Smart Context Auto-Population system.

## Overview

When users launch a tool from Career Hub with an application selected, the tool receives context about that application automatically. This enables pre-filling forms, showing relevant data, and providing a seamless experience.

## How It Works

```
1. User clicks "Practice Interview" on Google application in Career Hub
2. Career Hub generates JWT token + context data
3. Tool opens with context in URL: ?ctx=base64-encoded-data
4. Tool reads context, shows banner: "Practicing for: Google - Software Engineer"
5. Tool fetches full data from Career Hub API using token
6. Tool pre-fills job description and other fields
```

## Phase 1: Receiving Context (Tool Side)

### Step 1: Read Context from URL

When your tool loads, check for the `ctx` URL parameter:

```javascript
// On tool load (vanilla JS)
const urlParams = new URLSearchParams(window.location.search)
const ctxParam = urlParams.get('ctx')

if (ctxParam) {
  try {
    // Decode base64url context
    const contextJson = atob(ctxParam.replace(/-/g, '+').replace(/_/g, '/'))
    const context = JSON.parse(contextJson)

    // Context structure:
    // {
    //   source: 'career-hub',
    //   version: '1.0',
    //   timestamp: 1234567890,
    //   userId: 'wordpress-user-123',
    //   applicationId: 'uuid',
    //   companyName: 'Google',
    //   positionTitle: 'Software Engineer',
    //   token: 'jwt-token',
    //   expiresAt: 1234567890,
    //   careerHubUrl: 'https://hub.theinterviewguys.com'
    // }

    // Validate context
    if (Date.now() > context.expiresAt) {
      console.error('Context expired')
      return
    }

    // Show banner
    showBanner({
      company: context.companyName,
      position: context.positionTitle
    })

    // Fetch full data (Step 2)
    fetchFullApplicationData(context)

  } catch (error) {
    console.error('Failed to parse context:', error)
  }
}
```

### Step 2: Fetch Full Application Data

Use the JWT token to fetch complete application data from Career Hub:

```javascript
async function fetchFullApplicationData(context) {
  try {
    const response = await fetch(
      `${context.careerHubUrl}/api/public/context/${context.applicationId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${context.token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      if (response.status === 401) {
        console.error('Token expired or invalid')
        showMessage('Session expired. Please launch the tool again.')
        return
      }
      throw new Error('Failed to fetch application data')
    }

    const data = await response.json()

    // Data structure:
    // {
    //   id: 'uuid',
    //   company_name: 'Google',
    //   position_title: 'Software Engineer',
    //   status: 'phone_screen',
    //   date_applied: '2025-10-20',
    //   job_url: 'https://...',
    //   job_description: 'Full text of job description...',
    //   location: 'Mountain View, CA',
    //   salary_range: '$120k-$180k',
    //   remote_type: 'hybrid',
    //   notes: 'User notes...',
    //   source: 'LinkedIn',
    //   documents: [{id, title, document_type, file_url, created_at}, ...],
    //   activities: [{id, activity_type, activity_date, notes}, ...]
    // }

    // Pre-fill your tool
    prefillForm(data)

  } catch (error) {
    console.error('Failed to fetch application data:', error)
    showMessage('Failed to load application data')
  }
}
```

### Step 3: Pre-fill Your Tool

Based on the tool type, pre-fill relevant fields:

```javascript
// Interview Coach example
function prefillForm(data) {
  // Set job description
  if (data.job_description) {
    document.getElementById('job-description').value = data.job_description
  }

  // Set company/position in UI
  document.getElementById('company-name').textContent = data.company_name
  document.getElementById('position-title').textContent = data.position_title

  // Show preparation tips based on status
  if (data.status === 'phone_screen') {
    showPhoneScreenTips()
  } else if (data.status === 'interview') {
    showInterviewTips()
  }

  // Load related documents (resumes)
  const resumes = data.documents.filter(doc => doc.document_type === 'resume')
  populateResumeSelector(resumes)
}
```

## Phase 2: PostMessage Communication (Optional)

For advanced use cases, tools can communicate with Career Hub via postMessage:

```javascript
// Listen for messages from Career Hub
window.addEventListener('message', (event) => {
  // Validate origin
  if (event.origin !== 'https://members.theinterviewguys.com') return

  const message = event.data

  switch (message.type) {
    case 'CONTEXT_READY':
      // Career Hub is ready
      break

    case 'DOCUMENTS_UPDATED':
      // User uploaded new document
      refreshDocuments()
      break
  }
})

// Send message to Career Hub
window.parent.postMessage({
  type: 'SAVE_NOTES',
  data: {
    notes: 'User practiced behavioral questions for 30 minutes'
  }
}, 'https://members.theinterviewguys.com')
```

## Tool-Specific Examples

### Interview Coach

Pre-fill:
- Job description
- Company name and position (for banner)
- Interview type based on status (phone_screen, interview, etc.)
- Related documents (resumes)

### Resume Analyzer PRO

Pre-fill:
- Target job description (for optimization)
- Company name and position
- Show "Optimizing for: Google - SWE"

### Cover Letter Generator PRO

Pre-fill:
- Company name
- Position title
- Job description
- User's notes about the company

### Interview Oracle PRO

Pre-fill:
- Company name
- Position title
- Interview date (from activities)
- Job description for question generation

## Error Handling

### Expired Token

```javascript
if (response.status === 401) {
  showBanner({
    type: 'error',
    message: 'Session expired. Please launch the tool again from Career Hub.'
  })
}
```

### Application Not Found

```javascript
if (response.status === 404) {
  showBanner({
    type: 'error',
    message: 'Application not found. It may have been deleted.'
  })
}
```

### No Context (Tool opened directly)

```javascript
if (!ctxParam) {
  // Tool opened without context - show normal empty form
  showEmptyForm()
}
```

## Testing

### Test URL Format

Generate a test URL manually:

```bash
# Context object
{
  "source": "career-hub",
  "version": "1.0",
  "timestamp": 1234567890000,
  "userId": "test-user",
  "applicationId": "test-app-id",
  "companyName": "Google",
  "positionTitle": "Software Engineer",
  "token": "test-token",
  "expiresAt": 9999999999999,
  "careerHubUrl": "http://localhost:3000"
}

# Base64 encode and add to URL:
https://your-tool.com/?ctx=eyJzb3VyY2UiOi...
```

### Test API Endpoint

```bash
# Test the public API
curl -X GET \
  http://localhost:3000/api/public/context/APPLICATION_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security Notes

1. **Always validate token expiration** - Check `context.expiresAt` before using
2. **Verify origin** - In postMessage handlers, validate `event.origin`
3. **Don't store tokens** - They expire in 15 minutes
4. **HTTPS only in production** - Never send tokens over HTTP

## Support

For questions or issues:
1. Check Career Hub logs: `npm run dev` output
2. Check browser console for context parsing errors
3. Verify token is valid at `/api/public/context/[id]`
4. Contact platform team for assistance

## Changelog

- **v1.0 (2025-10-26)**: Initial context auto-population system
  - URL parameter context passing
  - Public API for data fetching
  - JWT token authentication
  - PostMessage support (optional)
