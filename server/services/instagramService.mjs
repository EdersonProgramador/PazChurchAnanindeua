import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const UA = 'Mozilla/5.0 (compatible; PazChurchAnanindeua/1.0)'
const CACHE_MS = 60 * 60 * 1000

let cache = { at: 0, posts: null }

function loadConfig() {
  const path = resolve(process.cwd(), 'server/data/instagram-pazbelempa.json')
  return JSON.parse(readFileSync(path, 'utf8'))
}

function ogMeta(html, property) {
  const re = new RegExp(`<meta\\s+property="${property}"\\s+content="([^"]*)"`, 'i')
  const m = html.match(re)
  return m?.[1] ?? ''
}

function decodeBasicEntities(text) {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number(num)))
}

function captionFromDescription(desc) {
  if (!desc) return 'Publicação no Instagram'
  const cut = desc.indexOf(' - pazbelempa on ')
  const raw = cut > 0 ? desc.slice(cut + ' - pazbelempa on '.length) : desc
  const quoted = raw.match(/:\s*"(.*)"\s*$/s)
  const body = quoted?.[1] ?? raw
  return decodeBasicEntities(body).replace(/\s+/g, ' ').trim().slice(0, 220)
}

async function fetchPostMeta(postUrl) {
  const res = await fetch(postUrl, {
    headers: { 'User-Agent': UA, Accept: 'text/html' },
    redirect: 'follow',
  })
  if (!res.ok) throw new Error(`Instagram ${res.status}`)
  const html = await res.text()
  const imageUrl = decodeBasicEntities(ogMeta(html, 'og:image'))
  const permalink = decodeBasicEntities(ogMeta(html, 'og:url') || postUrl)
  const caption = captionFromDescription(decodeBasicEntities(ogMeta(html, 'og:description')))
  return {
    id: postUrl.replace(/\/$/, '').split('/').pop(),
    permalink: permalink || postUrl,
    imageUrl,
    caption,
  }
}

export async function listPazBelemInstagramPosts() {
  const now = Date.now()
  if (cache.posts && now - cache.at < CACHE_MS) return cache.posts

  const { profileUrl, handle, postUrls } = loadConfig()
  const settled = await Promise.allSettled(postUrls.slice(0, 6).map((url) => fetchPostMeta(url)))
  const posts = settled
    .filter((r) => r.status === 'fulfilled' && r.value.imageUrl)
    .map((r) => ({ ...r.value, handle, profileUrl }))

  cache = { at: now, posts }
  return posts
}
