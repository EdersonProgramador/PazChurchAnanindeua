import { getDb } from '../db.mjs'

export async function listLocations(_req, res) {
  const db = getDb()
  const locations = await db.churchLocation.findMany({
    where: { active: true },
    orderBy: { sortOrder: 'asc' },
  })
  res.json({ locations })
}

export async function listLocationsAdmin(_req, res) {
  const db = getDb()
  const locations = await db.churchLocation.findMany({ orderBy: { sortOrder: 'asc' } })
  res.json({ locations })
}

export async function upsertLocation(req, res) {
  const db = getDb()
  const data = req.body ?? {}
  const location = data.id
    ? await db.churchLocation.update({ where: { id: data.id }, data })
    : await db.churchLocation.create({ data })
  res.json({ location })
}

export async function homeSummary(_req, res) {
  const db = getDb()
  const now = new Date()
  const [nextEvent, recentSermon, leadership, locations] = await Promise.all([
    db.churchEvent.findFirst({
      where: { isPast: false, startsAt: { gte: now } },
      orderBy: { startsAt: 'asc' },
    }),
    db.sermon.findFirst({
      where: { active: true, featured: true },
      orderBy: { publishedAt: 'desc' },
    }),
    db.feedPost.findFirst({
      where: { active: true, series: 'Liderança' },
      orderBy: { publishedAt: 'desc' },
    }),
    db.churchLocation.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
  ])
  const fallbackSermon = recentSermon
    ?? (await db.sermon.findFirst({ where: { active: true }, orderBy: { publishedAt: 'desc' } }))
  const fallbackLeadership = leadership
    ?? (await db.feedPost.findFirst({ where: { active: true }, orderBy: { publishedAt: 'desc' } }))
  res.json({
    nextMeeting: nextEvent,
    recentSermon: fallbackSermon,
    leadership: fallbackLeadership,
    locations,
  })
}

export async function listSermons(_req, res) {
  const db = getDb()
  const sermons = await db.sermon.findMany({
    where: { active: true },
    orderBy: { publishedAt: 'desc' },
    take: 30,
  })
  res.json({ sermons })
}
