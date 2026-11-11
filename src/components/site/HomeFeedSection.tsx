import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { FeedPost } from '../../integrations/apiClient'
import { CHURCH } from '../../data/churchContent'

type Props = { posts: FeedPost[] }

export function HomeFeedSection({ posts }: Props) {
  const [bgSrc, setBgSrc] = useState(CHURCH.facadeImage)

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-md ring-1 ring-slate-200/60">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <img
          src={bgSrc}
          alt=""
          className="h-full w-full min-h-[280px] scale-105 object-cover object-center"
          onError={() => {
            if (bgSrc !== CHURCH.facadeImageRemote) setBgSrc(CHURCH.facadeImageRemote)
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-paz-navy/55 via-paz-navy/35 to-paz-navy/50" />
      </div>

      <div className="relative grid min-h-[280px] gap-4 p-4 sm:gap-6 sm:p-6 md:grid-cols-2 md:p-8 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.id}
            className="paz-screen-enter flex flex-col justify-between rounded-xl border border-white/20 bg-white/92 p-5 shadow-sm backdrop-blur-sm transition hover:bg-white"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-paz-accent">{post.series}</p>
              <h2 className="mt-2 text-lg font-bold leading-snug text-paz-navy">{post.title}</h2>
              {post.subtitle && <p className="mt-2 text-sm text-paz-muted">{post.subtitle}</p>}
            </div>
          </article>
        ))}
      </div>

      <Link
        to="/paz-church/localizacao"
        className="absolute bottom-3 right-4 z-10 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-paz-navy shadow-sm backdrop-blur hover:bg-white sm:bottom-5 sm:right-6"
      >
        Ver localização
      </Link>
    </div>
  )
}
