import { createRealtime, rawSql } from '@neon/realtime/server'
import { config } from '../config.mjs'

let realtime

function getRealtime() {
  if (!realtime && config.realtime.secret) {
    realtime = createRealtime({
      secret: config.realtime.secret,
      db: 'neondb',
    })
  }
  return realtime
}

export function realtimeConfigured() {
  return Boolean(config.realtime.secret && config.realtime.url)
}

export async function sealFeedQuery() {
  const rt = getRealtime()
  if (!rt) return null
  const query = rawSql(
    `SELECT id, title, subtitle, "imageUrl", series, speaker, "publishedAt", "sortOrder", active
     FROM "FeedPost" WHERE active = true ORDER BY "sortOrder" ASC, "publishedAt" DESC LIMIT 50`,
    [],
  )
  return rt.seal({ query })
}
