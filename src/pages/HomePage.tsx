import { useEffect, useState } from 'react'
import { ScreenHeader } from '../components/ScreenHeader'
import { api, type FeedPost } from '../integrations/apiClient'

export function HomePage() {
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [liveOk, setLiveOk] = useState<boolean | null>(null)

  useEffect(() => {
    api.feed().then((r) => setPosts(r.posts)).catch(console.error)
    api
      .feedLive()
      .then(() => setLiveOk(true))
      .catch(() => setLiveOk(false))
  }, [])

  return (
    <>
      <ScreenHeader title="Home" />
      <main className="space-y-3 p-3">
        {liveOk === true && (
          <p className="rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-800">Feed com Neon Realtime ativo</p>
        )}
        {posts.map((post) => (
          <article key={post.id} className="paz-screen-enter paz-card">
            {post.imageUrl && (
              <img src={post.imageUrl} alt="" className="h-40 w-full object-cover" loading="lazy" />
            )}
            <div className="space-y-1 bg-gradient-to-br from-paz-navy to-paz-blue p-4 text-white">
              <p className="text-xs uppercase tracking-widest text-white/70">{post.series}</p>
              <h2 className="text-xl font-bold leading-tight">{post.title}</h2>
              {post.subtitle && <p className="text-sm text-white/85">{post.subtitle}</p>}
              {post.speaker && <p className="text-xs text-white/70">{post.speaker}</p>}
            </div>
          </article>
        ))}
      </main>
    </>
  )
}
