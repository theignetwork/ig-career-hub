/**
 * Server-side user ID extraction
 *
 * Gets the user ID from request headers (passed from client)
 * This is necessary because WordPress/MemberPress user info is only
 * available client-side via window.wpUserId
 *
 * @returns User ID from request headers or null if not authenticated
 */

import { headers } from 'next/headers'

export async function getServerUserId(): Promise<string | null> {
  try {
    const headersList = await headers()
    const userId = headersList.get('x-user-id')

    if (!userId || userId.trim() === '') {
      console.warn('[Auth] No user ID provided in request headers')
      return null
    }

    // Basic validation - user ID should be non-empty string
    if (typeof userId !== 'string' || userId.length < 1) {
      console.warn('[Auth] Invalid user ID format:', userId)
      return null
    }

    return userId
  } catch (error) {
    console.error('[Auth] Error extracting user ID from headers:', error)
    return null
  }
}

/**
 * Require authentication - throws if no user ID
 * Use this in API routes that require authentication
 */
export async function requireAuth(): Promise<string> {
  const userId = await getServerUserId()

  if (!userId) {
    throw new Error('Authentication required')
  }

  return userId
}
