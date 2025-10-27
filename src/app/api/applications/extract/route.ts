import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  try {
    // Debug: Check if API key is loaded
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('[POST /api/applications/extract] ANTHROPIC_API_KEY is not set!')
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }
    console.log('[POST /api/applications/extract] API key loaded:', process.env.ANTHROPIC_API_KEY.substring(0, 15) + '...')

    const { input } = await request.json()

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

    // Use Claude to extract structured data
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
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

    // Extract JSON from Claude's response
    const responseText = message.content[0].type === 'text'
      ? message.content[0].text
      : ''

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
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText)
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

    return NextResponse.json(cleanedData)
  } catch (error) {
    console.error('[POST /api/applications/extract] Error:', error)
    return NextResponse.json(
      { error: 'Failed to extract job details' },
      { status: 500 }
    )
  }
}
