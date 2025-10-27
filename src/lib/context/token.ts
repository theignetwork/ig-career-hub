/**
 * JWT Token generation for secure context sharing
 */

import { SignJWT, jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(
  process.env.NEXT_PUBLIC_CONTEXT_SHARING_SECRET || process.env.CONTEXT_SHARING_SECRET || 'your-secret-key-here'
)

export interface TokenPayload {
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
    console.error('Token verification failed:', error)
    return null
  }
}

/**
 * Check if a token is expired
 */
export function isTokenExpired(payload: TokenPayload): boolean {
  return Date.now() / 1000 > payload.exp
}
