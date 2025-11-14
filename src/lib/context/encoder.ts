/**
 * Context encoding utilities for URL parameters
 */

import type { ToolContext } from './types'

/**
 * Encode context data to base64url for URL transmission
 * Uses base64url encoding (URL-safe, no padding)
 */
export function encodeContext(context: ToolContext): string {
  try {
    const json = JSON.stringify(context)
    const base64 = Buffer.from(json).toString('base64url')
    return base64
  } catch (error) {
    console.error('Failed to encode context:', error)
    throw new Error('Context encoding failed')
  }
}

/**
 * Decode context data from base64url
 * Used by tools to read context from URL
 */
export function decodeContext(encoded: string): ToolContext | null {
  try {
    const json = Buffer.from(encoded, 'base64url').toString('utf-8')
    const context = JSON.parse(json) as ToolContext

    // Validate required fields
    if (!context.source || !context.applicationId || !context.token) {
      console.error('Invalid context: missing required fields')
      return null
    }

    // Check expiration
    if (Date.now() > context.expiresAt) {
      console.error('Context expired')
      return null
    }

    return context
  } catch (error) {
    console.error('Failed to decode context:', error)
    return null
  }
}

/**
 * Build tool URL with context parameter
 * Sends the JWT token directly in the 'context' parameter using hash fragment
 * Hash fragments support much larger data (32KB) vs query params (2KB)
 */
export function buildToolUrl(baseUrl: string, context: ToolContext): string {
  // Send JWT token in hash fragment to support long job descriptions
  return `${baseUrl}#context=${context.token}`
}
