import { listPazBelemInstagramPosts } from '../services/instagramService.mjs'

export async function listPazBelem(req, res) {
  try {
    const posts = await listPazBelemInstagramPosts()
    res.json({ posts, profileUrl: 'https://www.instagram.com/pazbelempa/' })
  } catch (err) {
    console.error(err)
    res.status(502).json({ posts: [], error: 'Não foi possível carregar o Instagram agora.' })
  }
}
