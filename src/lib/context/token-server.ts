/**
 * JWT Token generation for secure context sharing
 * SERVER-SIDE ONLY - Never import this in client components!
 */

import { SignJWT, jwtVerify, type JWTPayload } from 'jose'

// Server-side secret - NEVER exposed to client
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET
)

if (!SECRET || !process.env.JWT_SECRET) {
  console.error('[token-server] JWT_SECRET not configured!')
  throw new Error('JWT_SECRET environment variable is required')
}

export interface TokenPayload extends JWTPayload {
  userId: string
  applicationId: string
  scope: 'read' | 'read-write'
  iat: number
  exp: number
  // Application data for auto-fill
  companyName: string
  positionTitle: string
  jobDescription?: string | null
  location?: string | null
  salaryRange?: string | null
  remoteType?: string | null
  source?: string | null
  dateApplied?: string | null
}

/**
 * Generate a JWT token for context sharing
 * SERVER-SIDE ONLY
 * @param userId - WordPress user ID
 * @param applicationId - Application UUID
 * @param applicationData - Full application data for auto-fill
 * @param expiresInMinutes - Token expiration (default 15 minutes)
 */
export async function generateContextToken(
  userId: string,
  applicationId: string,
  applicationData: {
    companyName: string
    positionTitle: string
    jobDescription?: string | null
    location?: string | null
    salaryRange?: string | null
    remoteType?: string | null
    source?: string | null
    dateApplied?: string | null
  },
  expiresInMinutes: number = 15
): Promise<string> {
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + (expiresInMinutes * 60)

  const token = await new SignJWT({
    userId,
    applicationId,
    scope: 'read',
    iat,
    exp,
    ...applicationData,
  } as TokenPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(SECRET)

  return token
}

/**
 * Verify and decode a context token
 * SERVER-SIDE ONLY
 * @param token - JWT token to verify
 * @returns Decoded payload or null if invalid
 */
export async function verifyContextToken(
  token: string
): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as unknown as TokenPayload
  } catch (error) {
    console.error('[token-server] Token verification failed:', error)
    return null
  }
}

/**
 * Check if a token is expired
 */
export function isTokenExpired(payload: TokenPayload): boolean {
  return Date.now() / 1000 > payload.exp
}
