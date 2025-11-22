/**
 * Get the current user's ID
 *
 * Priority order:
 * 1. WordPress user ID from sessionStorage (JWT authenticated)
 * 2. Legacy window.wpUserId (if set by parent window)
 * 3. Fall back to localStorage UUID for anonymous users
 *
 * This allows the app to work both:
 * - Embedded in WordPress with JWT auth (logged-in users)
 * - Standalone (anonymous users with persistent UUID)
 *
 * @returns {string} User ID (WordPress user ID or localStorage UUID)
 */
export function getUserId(): string {
  // Server-side rendering guard
  if (typeof window === 'undefined') {
    return '';
  }

  // PRIORITY 1: Check sessionStorage for WordPress user ID (from JWT)
  const wpUserIdFromSession = sessionStorage.getItem('wp_user_id');
  if (wpUserIdFromSession) {
    console.log('[Auth] Using WordPress user ID from JWT session:', wpUserIdFromSession);
    return wpUserIdFromSession;
  }

  // PRIORITY 2: Check if WordPress user ID exists (legacy - set by parent window)
  const wpUserId = (window as any).wpUserId;
  if (wpUserId) {
    console.log('[Auth] Using legacy WordPress user ID from window:', wpUserId);
    return wpUserId;
  }

  // FALLBACK: Use localStorage UUID for anonymous/standalone mode
  const storageKey = 'ig_user_id';
  let userId = localStorage.getItem(storageKey);

  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(storageKey, userId);
    console.warn('[Auth] ⚠️  NO WordPress ID found! Generated new anonymous UUID:', userId);
    console.warn('[Auth] ⚠️  User data will NOT persist across sessions without WordPress login!');
  } else {
    console.warn('[Auth] ⚠️  Using anonymous UUID from localStorage:', userId);
    console.warn('[Auth] ⚠️  This is NOT a WordPress user - data may not persist!');
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

  // Check both sessionStorage (JWT) and legacy window.wpUserId
  const hasSessionId = !!sessionStorage.getItem('wp_user_id');
  const hasWindowId = !!(window as any).wpUserId;

  return hasSessionId || hasWindowId;
}

/**
 * Get user display name if available from WordPress
 * @returns {string | null} User display name or null
 */
export function getUserDisplayName(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  // Try to get from stored user data first
  const storedUserData = sessionStorage.getItem('user_data');
  if (storedUserData) {
    try {
      const userData = JSON.parse(storedUserData);
      return userData.name || null;
    } catch (err) {
      // Fall through to legacy method
    }
  }

  // Fall back to legacy window.wpUserName
  return (window as any).wpUserName || null;
}

/**
 * Get user email if available from WordPress
 * @returns {string | null} User email or null
 */
export function getUserEmail(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedUserData = sessionStorage.getItem('user_data');
  if (storedUserData) {
    try {
      const userData = JSON.parse(storedUserData);
      return userData.email || null;
    } catch (err) {
      return null;
    }
  }

  return null;
}

/**
 * Get user membership level if available from WordPress
 * @returns {string | null} Membership level or null
 */
export function getMembershipLevel(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedUserData = sessionStorage.getItem('user_data');
  if (storedUserData) {
    try {
      const userData = JSON.parse(storedUserData);
      return userData.membership_level || null;
    } catch (err) {
      return null;
    }
  }

  return null;
}
