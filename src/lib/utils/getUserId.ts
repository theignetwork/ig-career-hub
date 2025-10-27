/**
 * Get the current user's ID
 *
 * This function implements the WordPress authentication approach:
 * 1. Check if window.wpUserId exists (set by WordPress/MemberPress)
 * 2. Fall back to localStorage UUID for anonymous users
 *
 * This allows the app to work both:
 * - Embedded in WordPress (logged-in users)
 * - Standalone (anonymous users with persistent UUID)
 *
 * @returns {string} User ID (either WordPress user ID or localStorage UUID)
 */
export function getUserId(): string {
  // Server-side rendering guard
  if (typeof window === 'undefined') {
    return '';
  }

  // Check if WordPress user ID exists (set by parent window)
  const wpUserId = (window as any).wpUserId;
  if (wpUserId) {
    console.log('[Auth] Using WordPress user ID:', wpUserId);
    return wpUserId;
  }

  // Fall back to localStorage UUID
  const storageKey = 'ig_user_id';
  let userId = localStorage.getItem(storageKey);

  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(storageKey, userId);
    console.log('[Auth] Generated new anonymous user ID:', userId);
  } else {
    console.log('[Auth] Using existing anonymous user ID:', userId);
  }

  return userId;
}

/**
 * Check if the current user is authenticated via WordPress
 * @returns {boolean} True if WordPress user ID exists
 */
export function isWordPressUser(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return !!(window as any).wpUserId;
}

/**
 * Get user display name if available from WordPress
 * @returns {string | null} User display name or null
 */
export function getUserDisplayName(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return (window as any).wpUserName || null;
}
