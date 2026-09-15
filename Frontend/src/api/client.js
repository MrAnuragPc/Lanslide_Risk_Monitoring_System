// ============================================================================
// API CLIENT
// ----------------------------------------------------------------------------
// One place that knows how to talk to the backend, so every page/data
// function calls apiGet/apiPost/apiUpload instead of scattering raw fetch()
// calls (and their timeout/auth/error-shape handling) across the codebase.
// ============================================================================

import { API_BASE_URL, REQUEST_TIMEOUT_MS } from './config.js'
import { getAuthToken } from './auth.js'

export class ApiError extends Error {
  constructor(message, { status = null, data = null, cause = null } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status // null = network/timeout failure, no HTTP response at all
    this.data = data // parsed error body from the backend, when available
    this.cause = cause
  }
}

function authHeaders() {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function parseBody(res) {
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    try {
      return await res.json()
    } catch {
      return null
    }
  }
  return null
}

/**
 * Core request helper used by apiGet/apiPost/etc. Handles base-URL joining,
 * a request timeout via AbortController, auth headers, and turning non-2xx
 * responses (and network failures) into a single ApiError shape so calling
 * code only ever has to handle one kind of error.
 */
async function request(path, { method = 'GET', body, signal, headers = {} } = {}) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  // Let the caller cancel too (e.g. navigating away mid-request) without
  // losing our own timeout-driven abort.
  const onCallerAbort = () => controller.abort()
  if (signal) signal.addEventListener('abort', onCallerAbort)

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...authHeaders(),
        ...headers,
      },
      body: body == null ? undefined : isFormData ? body : JSON.stringify(body),
    })

    const data = await parseBody(res)

    if (!res.ok) {
      const message = (data && (data.message || data.error)) || `Request failed (${res.status})`
      throw new ApiError(message, { status: res.status, data })
    }

    return data
  } catch (err) {
    if (err instanceof ApiError) throw err
    if (err.name === 'AbortError') {
      throw new ApiError('Request timed out or was cancelled.', { cause: err })
    }
    throw new ApiError('Network error — check your connection and try again.', { cause: err })
  } finally {
    clearTimeout(timeoutId)
    if (signal) signal.removeEventListener('abort', onCallerAbort)
  }
}

export function apiGet(path, options) {
  return request(path, { ...options, method: 'GET' })
}

export function apiPost(path, body, options) {
  return request(path, { ...options, method: 'POST', body })
}

export function apiPatch(path, body, options) {
  return request(path, { ...options, method: 'PATCH', body })
}

export function apiDelete(path, options) {
  return request(path, { ...options, method: 'DELETE' })
}

/**
 * Multipart upload with progress. Plain fetch() has no upload-progress
 * event, so this uses XMLHttpRequest for this one case — everything else
 * in the app goes through the fetch-based helpers above.
 */
export function apiUpload(path, formData, { onProgress, signal } = {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${API_BASE_URL}${path}`)

    const token = getAuthToken()
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.setRequestHeader('Accept', 'application/json')
    xhr.timeout = REQUEST_TIMEOUT_MS * 4 // uploads legitimately take longer

    xhr.upload.onprogress = (e) => {
      if (onProgress && e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      let data = null
      try {
        data = xhr.responseText ? JSON.parse(xhr.responseText) : null
      } catch {
        // non-JSON response body — leave data as null
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data)
      } else {
        const message = (data && (data.message || data.error)) || `Upload failed (${xhr.status})`
        reject(new ApiError(message, { status: xhr.status, data }))
      }
    }

    xhr.onerror = () => reject(new ApiError('Network error during upload.'))
    xhr.ontimeout = () => reject(new ApiError('Upload timed out.'))
    xhr.onabort = () => reject(new ApiError('Upload cancelled.'))

    if (signal) {
      if (signal.aborted) {
        xhr.abort()
      } else {
        signal.addEventListener('abort', () => xhr.abort())
      }
    }

    xhr.send(formData)
  })
}
