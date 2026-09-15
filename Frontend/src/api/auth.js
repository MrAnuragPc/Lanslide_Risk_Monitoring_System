// ============================================================================
// AUTH TOKEN STORAGE
// ----------------------------------------------------------------------------
// This app has no login screen yet (the reference design never specified
// one — Profile is a single account), so this intentionally isn't a full
// auth system. It's the plumbing a real login flow would plug into: a place
// to store the token once a backend issues one, a way for the API client to
// attach it to every request, and a working "log out".
//
// sessionStorage (not localStorage) so a token doesn't silently outlive the
// browser tab — reasonable default for a safety-alerting app; swap for a
// refresh-token flow if you need longer-lived sessions.
// ============================================================================

const TOKEN_KEY = 'terraguard_auth_token'

export function getAuthToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY)
  } catch {
    // sessionStorage can throw in some privacy/incognito configurations
    return null
  }
}

export function setAuthToken(token) {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token)
    else sessionStorage.removeItem(TOKEN_KEY)
  } catch {
    // ignore — worst case the session doesn't persist a reload
  }
}

export function isAuthenticated() {
  return Boolean(getAuthToken())
}

// Clears the local session. Doesn't navigate — callers (e.g. the Profile
// page's Log Out button) decide where to send the user afterwards.
export function logout() {
  setAuthToken(null)
}
