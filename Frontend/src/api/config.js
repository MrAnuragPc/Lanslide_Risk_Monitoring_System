// ============================================================================
// LRMS API CONFIGURATION
// ============================================================================
//
// React/Vite frontend → Django backend
//
// Django backend:
//     http://127.0.0.1:8000
//
// API base:
//     http://127.0.0.1:8000/api
//
// Mock data is disabled so TerraGuard uses the real Django API.
// ============================================================================


// ---------------------------------------------------------------------------
// Vite environment variables
// ---------------------------------------------------------------------------

const env =
  (typeof import.meta !== "undefined" && import.meta.env) || {};


// ---------------------------------------------------------------------------
// Django API
// ---------------------------------------------------------------------------
//
// You can override this using VITE_API_BASE_URL in frontend/.env
//

export const API_BASE_URL =
  env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";


// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------
//
// false = use Django backend
// true  = use frontend mock data
//

export const USE_MOCK_DATA =
  env.VITE_USE_MOCK_DATA === "true";


// ---------------------------------------------------------------------------
// Request timeout
// ---------------------------------------------------------------------------
//
// Requests will automatically stop after 15 seconds if the backend
// does not respond.
//

export const REQUEST_TIMEOUT_MS = 15000;
