import { config } from '../config.mjs'
import { getDb } from '../db.mjs'
import { sealFeedQuery } from '../services/realtimeService.mjs'

export async function churchInfo(_req, res) {
  res.json({ church: config.church })
}

export async function listFeed(_req, res) {
  const db = getDb()
  const posts = await db.feedPost.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: 'asc' }, { publishedAt: 'desc' }],
  })
  res.json({ posts })
}

export async function feedLiveToken(_req, res) {
  try {
    const sealed = await sealFeedQuery()
    if (!sealed) return res.status(503).json({ error: 'Realtime indisponível' })
    res.json(sealed)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

export async function listEvents(req, res) {
  const past = req.query.past === 'true'
  const db = getDb()
  const events = await db.churchEvent.findMany({
    where: past ? { isPast: true } : { isPast: false, startsAt: { gte: new Date(Date.now() - 86400000) } },
    orderBy: { startsAt: past ? 'desc' : 'asc' },
  })
  res.json({ events })
}

export async function listMenu(req, res) {
  const section = req.query.section
  const db = getDb()
  const links = await db.menuLink.findMany({
    where: { active: true, ...(section ? { section: String(section) } : {}) },
    orderBy: { sortOrder: 'asc' },
  })
  res.json({ links })
}
