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

export async function listEventsAdmin(_req, res) {
  const db = getDb()
  const events = await db.churchEvent.findMany({ orderBy: { startsAt: 'desc' }, take: 100 })
  res.json({ events })
}

export async function createEvent(req, res) {
  const db = getDb()
  const body = req.body ?? {}
  const event = await db.churchEvent.create({
    data: { ...body, startsAt: new Date(body.startsAt), endsAt: body.endsAt ? new Date(body.endsAt) : null },
  })
  res.status(201).json({ event })
}

export async function updateEvent(req, res) {
  const db = getDb()
  const body = { ...req.body }
  if (body.startsAt) body.startsAt = new Date(body.startsAt)
  if (body.endsAt) body.endsAt = new Date(body.endsAt)
  const event = await db.churchEvent.update({ where: { id: req.params.id }, data: body })
  res.json({ event })
}

export async function deleteEvent(req, res) {
  const db = getDb()
  await db.churchEvent.delete({ where: { id: req.params.id } })
  res.status(204).end()
}

export async function listSermonsAdmin(_req, res) {
  const db = getDb()
  const sermons = await db.sermon.findMany({ orderBy: { publishedAt: 'desc' }, take: 100 })
  res.json({ sermons })
}

export async function createSermon(req, res) {
  const db = getDb()
  const body = req.body ?? {}
  const sermon = await db.sermon.create({
    data: {
      ...body,
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
    },
  })
  res.status(201).json({ sermon })
}

export async function updateSermon(req, res) {
  const db = getDb()
  const body = { ...req.body }
  if (body.publishedAt) body.publishedAt = new Date(body.publishedAt)
  const sermon = await db.sermon.update({ where: { id: req.params.id }, data: body })
  res.json({ sermon })
}

export async function deleteSermon(req, res) {
  const db = getDb()
  await db.sermon.delete({ where: { id: req.params.id } })
  res.status(204).end()
}

export async function listFeedAdmin(_req, res) {
  const db = getDb()
  const posts = await db.feedPost.findMany({ orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }] })
  res.json({ posts })
}

export async function createFeed(req, res) {
  const db = getDb()
  const post = await db.feedPost.create({ data: req.body ?? {} })
  res.status(201).json({ post })
}

export async function updateFeed(req, res) {
  const db = getDb()
  const post = await db.feedPost.update({ where: { id: req.params.id }, data: req.body ?? {} })
  res.json({ post })
}

export async function deleteFeed(req, res) {
  const db = getDb()
  await db.feedPost.delete({ where: { id: req.params.id } })
  res.status(204).end()
}
