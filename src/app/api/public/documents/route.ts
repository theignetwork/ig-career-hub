/**
 * Public API endpoint for fetching user documents
 * Allows external tools (like Resume Analyzer) to fetch user's resumes
 * Uses WordPress JWT for authentication
 */

import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/server'
import { jwtVerify } from 'jose'

async function verifyToken(token: string) {
  try {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      console.error('[Public Documents] JWT_SECRET not configured')
      return null
    }

    const secretKey = new TextEncoder().encode(secret)
    const { payload } = await jwtVerify(token, secretKey)
    return payload
  } catch (error) {
    console.error('[Public Documents] Token verification failed:', error)
    return null
  }
}

export async function GET(request: Request) {
  try {
    // Extract JWT token from Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        {
          status: 401,
          headers: corsHeaders()
        }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const payload = await verifyToken(token)

    if (!payload || !payload.user_id) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        {
          status: 401,
          headers: corsHeaders()
        }
      )
    }

    const userId = payload.user_id as number

    // Get query params
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // Filter by document type (resume, cover_letter)
    const primaryOnly = searchParams.get('primary') === 'true'

    // Build query
    let query = getSupabaseAdmin()
      .from('documents')
      .select('id, title, file_type, file_name, file_size, content, is_primary, created_at')
      .eq('user_id', userId)
      .order('is_primary', { ascending: false }) // Primary first
      .order('created_at', { ascending: false })

    // Filter by type if specified
    if (type) {
      query = query.eq('file_type', type)
    }

    // Filter to primary only if requested
    if (primaryOnly) {
      query = query.eq('is_primary', true)
    }

    const { data: documents, error } = await query

    if (error) {
      console.error('[Public Documents] Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch documents' },
        {
          status: 500,
          headers: corsHeaders()
        }
      )
    }

    return NextResponse.json(
      {
        documents: documents || [],
        total: documents?.length || 0
      },
      { headers: corsHeaders() }
    )
  } catch (error) {
    console.error('[Public Documents] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      {
        status: 500,
        headers: corsHeaders()
      }
    )
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() })
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  }
}
