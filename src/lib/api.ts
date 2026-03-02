const BASE_URL = import.meta.env.VITE_API_URL as string

// Fail fast at module load — a missing URL means every request would silently
// hit an undefined base, making debugging extremely hard.
if (!BASE_URL) {
  throw new Error('VITE_API_URL environment variable is not set.')
}

// In production builds, reject plain HTTP to prevent sending credentials
// (httpOnly cookies, Authorization headers) over an unencrypted connection.
if (import.meta.env.PROD && !BASE_URL.startsWith('https://')) {
  throw new Error('VITE_API_URL must use HTTPS in production.')
}

const TIMEOUT_MS = 10_000 // 10 seconds — prevents requests hanging indefinitely

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Never surface raw 5xx server messages to the UI — they may contain stack
 * traces, file paths, or DB structure hints. Return a generic string instead.
 */
function safeMessage(status: number, raw?: string): string {
  if (status >= 500) return 'Something went wrong on our end. Please try again.'
  if (status === 408) return 'Request timed out. Please check your connection.'
  return raw ?? 'Request failed.'
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  let res: Response
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
      credentials: 'include', // sends httpOnly refresh-token cookie
      signal: controller.signal,
    })
  } catch (err) {
    if ((err as Error).name === 'AbortError') {
      throw new ApiError(408, safeMessage(408))
    }
    throw err
  } finally {
    clearTimeout(timer)
  }

  let json: { success?: boolean; data?: T; message?: string }
  try {
    json = await res.json()
  } catch {
    throw new ApiError(res.status, safeMessage(res.status))
  }

  if (!res.ok) {
    throw new ApiError(res.status, safeMessage(res.status, json.message))
  }

  return (json.data ?? json) as T
}
