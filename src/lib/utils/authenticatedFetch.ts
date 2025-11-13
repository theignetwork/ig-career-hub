/**
 * Authenticated fetch wrapper
 *
 * Automatically adds the x-user-id header to all API requests
 * This enables server-side authentication by passing the user ID from client to server
 */

import { getUserId } from './getUserId'

export interface AuthenticatedRequestInit extends RequestInit {
  // Allow all standard RequestInit options
}

/**
 * Fetch wrapper that automatically includes authentication header
 * @param url - The URL to fetch
 * @param options - Standard fetch options
 * @returns Fetch response
 */
export async function authenticatedFetch(
  url: string,
  options?: AuthenticatedRequestInit
): Promise<Response> {
  const userId = getUserId()

  if (!userId) {
    console.warn('[authenticatedFetch] No user ID available - request may fail')
  }

  // Merge headers with authentication header
  const headers = new Headers(options?.headers)
  if (userId) {
    headers.set('x-user-id', userId)
  }

  // Make the request with auth header
  return fetch(url, {
    ...options,
    headers,
  })
}

/**
 * Convenience method for GET requests
 */
export async function authenticatedGet(url: string): Promise<Response> {
  return authenticatedFetch(url, { method: 'GET' })
}

/**
 * Convenience method for POST requests
 */
export async function authenticatedPost(
  url: string,
  body: any
): Promise<Response> {
  return authenticatedFetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

/**
 * Convenience method for PATCH requests
 */
export async function authenticatedPatch(
  url: string,
  body: any
): Promise<Response> {
  return authenticatedFetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

/**
 * Convenience method for PUT requests
 */
export async function authenticatedPut(
  url: string,
  body: any
): Promise<Response> {
  return authenticatedFetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

/**
 * Convenience method for DELETE requests
 */
export async function authenticatedDelete(url: string): Promise<Response> {
  return authenticatedFetch(url, { method: 'DELETE' })
}
