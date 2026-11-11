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
  instagramPazBelem: () =>
    request<{ posts: InstagramPost[]; profileUrl: string }>('/instagram/pazbelempa'),
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
  adminList: (entity: AdminEntity) => request<{ items: RbacItem[] }>(`/admin/${entity}`),
  adminCreate: (entity: AdminEntity, body: Record<string, unknown>) =>
    request<{ item: RbacItem }>(`/admin/${entity}`, { method: 'POST', body: JSON.stringify(body) }),
  adminUpdate: (entity: AdminEntity, id: string, body: Record<string, unknown>) =>
    request<{ item: RbacItem }>(`/admin/${entity}/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  adminDelete: (entity: AdminEntity, id: string) =>
    request<void>(`/admin/${entity}/${id}`, { method: 'DELETE' }),
  homeSummary: () => request<HomeSummary>('/home/summary'),
  sermonsPublic: () => request<{ sermons: Sermon[] }>('/sermons'),
  lifeGroupsPublic: () => request<{ groups: LifeGroup[] }>('/life-groups/public'),
  lifeGroupSignup: (body: LifeGroupSignupInput) =>
    request<{ message: string }>('/life-groups/signup', { method: 'POST', body: JSON.stringify(body) }),
  gestaoLifeGroups: () => request<{ groups: LifeGroup[] }>('/gestao/life-groups'),
  gestaoCreateGroup: (body: Partial<LifeGroup>) =>
    request('/gestao/life-groups', { method: 'POST', body: JSON.stringify(body) }),
  gestaoSignups: () => request<{ signups: LifeGroupSignup[] }>('/gestao/signups'),
  gestaoPatchSignup: (id: string, body: Record<string, unknown>) =>
    request(`/gestao/signups/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  gestaoReports: () => request<{ reports: LifeGroupReport[] }>('/gestao/reports'),
  gestaoCreateReport: (body: Record<string, unknown>) =>
    request('/gestao/reports', { method: 'POST', body: JSON.stringify(body) }),
  gestaoLocations: () => request<{ locations: ChurchLocation[] }>('/gestao/locations'),
  ministries: () => request<{ ministries: Ministry[] }>('/volunteers/ministries'),
  volunteerSignup: (body: VolunteerSignupInput) =>
    request<{ message: string }>('/volunteers/signup', { method: 'POST', body: JSON.stringify(body) }),
  gestaoEvents: () => request<{ events: ChurchEvent[] }>('/gestao/events'),
  gestaoCreateEvent: (body: Record<string, unknown>) =>
    request('/gestao/events', { method: 'POST', body: JSON.stringify(body) }),
  gestaoSermons: () => request<{ sermons: Sermon[] }>('/gestao/sermons'),
  gestaoCreateSermon: (body: Record<string, unknown>) =>
    request('/gestao/sermons', { method: 'POST', body: JSON.stringify(body) }),
  gestaoFeed: () => request<{ posts: FeedPost[] }>('/gestao/feed'),
  gestaoCreateFeed: (body: Record<string, unknown>) =>
    request('/gestao/feed', { method: 'POST', body: JSON.stringify(body) }),
  gestaoVolunteers: () => request<{ signups: VolunteerSignup[] }>('/gestao/volunteers'),
  gestaoPatchVolunteer: (id: string, body: Record<string, unknown>) =>
    request(`/gestao/volunteers/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
}

export function userCanGestao(user: ApiUser | null) {
  if (!user?.permissions) return false
  return user.permissions.includes('lifegroup.manage') || user.permissions.includes('content.manage')
}

export type Ministry = { id: string; name: string; slug: string; description?: string | null }

export type Sermon = {
  id: string
  title: string
  category: string
  speaker?: string | null
  featured?: boolean
  publishedAt: string
}

export type VolunteerSignupInput = {
  fullName: string
  email: string
  phone: string
  ministryId?: string
  ministryLabel?: string
  message?: string
}

export type VolunteerSignup = VolunteerSignupInput & {
  id: string
  status: string
  createdAt: string
  ministry?: Ministry | null
}

export type AdminEntity = 'roles' | 'permissions' | 'functions'

export type RbacItem = {
  id: string
  name: string
  slug?: string
  code?: string
  description?: string | null
}

export type InstagramPost = {
  id: string
  permalink: string
  imageUrl: string
  caption: string
  handle?: string
  profileUrl?: string
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
  isPast?: boolean
}

export type MenuLink = {
  id: string
  label: string
  path?: string | null
  external?: string | null
  icon?: string | null
}

export type ChurchLocation = {
  id: string
  name: string
  address: string
  city: string
  schedule?: string | null
}

export type HomeSummary = {
  nextMeeting: ChurchEvent | null
  recentSermon: { title: string; category: string; publishedAt: string } | null
  leadership: FeedPost | null
  locations: ChurchLocation[]
}

export type LifeGroup = {
  id: string
  name: string
  leaderName: string
  neighborhood: string
  city: string
  dayOfWeek: string
  meetingTime: string
  ageGroup: string
  active?: boolean
}

export type LifeGroupSignupInput = {
  fullName: string
  email: string
  phone: string
  city: string
  neighborhood?: string
  ageGroup: string
  message?: string
}

export type LifeGroupSignup = LifeGroupSignupInput & {
  id: string
  status: string
  lifeGroupId?: string | null
  createdAt: string
}

export type LifeGroupReport = {
  id: string
  lifeGroupId: string
  weekDate: string
  attendance: number
  visitors: number
  notes?: string | null
}
