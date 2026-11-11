const API = '/api/v1'

export type ApiUser = {
  id: string
  email: string
  name: string
  permissions: string[]
  role: { slug: string; name: string }
}

function authHeaders() {
  const token = localStorage.getItem('paz_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(init?.headers ?? {}),
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || res.statusText)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const api = {
  church: () => request<{ church: Record<string, string> }>('/church'),
  feed: () => request<{ posts: FeedPost[] }>('/feed'),
  feedLive: () => request<Record<string, unknown>>('/feed/live'),
  events: (past?: boolean) => request<{ events: ChurchEvent[] }>(`/events?past=${past ? 'true' : 'false'}`),
  menu: (section?: string) =>
    request<{ links: MenuLink[] }>(`/menu${section ? `?section=${encodeURIComponent(section)}` : ''}`),
  login: (email: string, password: string) =>
    request<{ token: string; user: ApiUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  health: () => request<{ ok: boolean; services: Record<string, boolean> }>('/health'),
  adminList: (entity: 'roles' | 'permissions' | 'functions') =>
    request<{ items: unknown[] }>(`/admin/${entity}`),
}

export type FeedPost = {
  id: string
  title: string
  subtitle?: string | null
  imageUrl?: string | null
  series?: string | null
  speaker?: string | null
  publishedAt: string
}

export type ChurchEvent = {
  id: string
  title: string
  description?: string | null
  startsAt: string
  location: string
  recurring?: string | null
}

export type MenuLink = {
  id: string
  label: string
  path?: string | null
  external?: string | null
  icon?: string | null
}
