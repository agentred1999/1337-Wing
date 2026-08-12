export async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  const res = await fetch(path, {
    ...options,
    headers,
    credentials: 'include',
  })
  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const message = data?.error || `Request failed with status ${res.status}`
    throw new Error(message)
  }

  return data
}
