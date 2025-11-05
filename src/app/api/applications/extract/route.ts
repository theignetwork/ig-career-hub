import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  try {
    console.log('[POST /api/applications/extract] Starting extraction...')

    // Debug: Check if API key is loaded
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('[POST /api/applications/extract] ANTHROPIC_API_KEY is not set!')
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }
    console.log('[POST /api/applications/extract] API key loaded:', process.env.ANTHROPIC_API_KEY.substring(0, 15) + '...')

    const body = await request.json()
    console.log('[POST /api/applications/extract] Request body:', body)

    const { input } = body

    if (!input || !input.trim()) {
      return NextResponse.json(
        { error: 'No input provided' },
        { status: 400 }
      )
    }

    // Check if input looks like a URL
    const isURL = input.trim().startsWith('http')

    let jobText = input

    // If it's a URL, fetch the content
    if (isURL) {
      try {
        const response = await fetch(input)
        const html = await response.text()

        // Simple HTML to text conversion (in production, you might want a better parser)
        jobText = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 10000) // Limit to first 10k chars
      } catch (error) {
        console.error('Failed to fetch URL:', error)
        return NextResponse.json(
          { error: 'Failed to fetch job posting from URL' },
          { status: 400 }
        )
      }
    }

    console.log('[POST /api/applications/extract] Calling Claude API...')

    // Use Claude to extract structured data
    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Extract job application details from the following job posting. Return ONLY a JSON object with these exact fields (use empty string if information is not found):

{
  "company_name": "string",
  "position_title": "string",
  "location": "string (city, state/country)",
  "salary_range": "string (e.g., $120k - $150k)",
  "remote_type": "string (must be one of: remote, hybrid, onsite, flexible, or empty string)"
}

Job Posting:
${jobText}

Return only the JSON object, no additional text.`,
        },
      ],
    })

    console.log('[POST /api/applications/extract] Claude API response received')

    // Extract JSON from Claude's response
    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : ''

    console.log('[POST /api/applications/extract] Claude response text:', responseText)

    // Parse the JSON response
    let extracted
    try {
      // Try to find JSON in the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        extracted = JSON.parse(jsonMatch[0])
      } else {
        extracted = JSON.parse(responseText)
      }
      console.log('[POST /api/applications/extract] Successfully parsed response:', extracted)
    } catch (parseError) {
      console.error('[POST /api/applications/extract] Failed to parse Claude response:', responseText)
      console.error('[POST /api/applications/extract] Parse error:', parseError)
      throw new Error('Failed to parse AI response')
    }

    // Validate and clean the response
    const cleanedData = {
      company_name: extracted.company_name || '',
      position_title: extracted.position_title || '',
      location: extracted.location || '',
      salary_range: extracted.salary_range || '',
      remote_type: ['remote', 'hybrid', 'onsite', 'flexible'].includes(extracted.remote_type?.toLowerCase())
        ? extracted.remote_type.toLowerCase()
        : '',
    }

    console.log('[POST /api/applications/extract] Returning cleaned data:', cleanedData)
    return NextResponse.json(cleanedData)
  } catch (error) {
    console.error('[POST /api/applications/extract] Error:', error)
    console.error('[POST /api/applications/extract] Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('[POST /api/applications/extract] Error message:', error instanceof Error ? error.message : String(error))
    return NextResponse.json(
      {
        error: 'Failed to extract job details',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
