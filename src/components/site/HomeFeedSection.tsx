import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { FeedPost } from '../../integrations/apiClient'
import { CHURCH } from '../../data/churchContent'

type Props = { posts: FeedPost[] }

export function HomeFeedSection({ posts }: Props) {
  const [bgSrc, setBgSrc] = useState(CHURCH.facadeImage)

  const onBgError = () => {
    if (bgSrc !== CHURCH.facadeImageRemote) setBgSrc(CHURCH.facadeImageRemote)
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-slate-200/60">
      <div className="border-b border-slate-200/80 bg-slate-100">
        <img
          src={bgSrc}
          alt="Fachada Paz Church Ananindeua"
          width={1360}
          height={640}
          className="block h-auto w-full object-contain object-center sm:aspect-[21/9] sm:max-h-[280px] sm:object-cover sm:object-center"
          onError={onBgError}
          decoding="async"
        />
      </div>

      <div className="grid gap-2 p-2 sm:gap-6 sm:p-6 md:grid-cols-2 md:p-8 lg:grid-cols-3">
        {posts.map((post) => (
          <FeedCard key={post.id} post={post} />
        ))}
      </div>

      <div className="border-t border-slate-100 p-2 sm:flex sm:justify-end sm:p-5">
        <Link
          to="/paz-church/localizacao"
          className="flex min-h-10 w-full items-center justify-center rounded-lg bg-paz-navy px-4 text-sm font-semibold text-white active:opacity-90 sm:min-h-11 sm:w-auto sm:rounded-xl sm:bg-white sm:text-paz-navy sm:shadow-sm sm:ring-1 sm:ring-slate-200/80"
        >
          Ver localização
        </Link>
      </div>
    </div>
  )
}

function FeedCard({ post }: { post: FeedPost }) {
  return (
    <article className="rounded-lg border border-slate-200/90 bg-white p-3 shadow-sm sm:rounded-xl sm:p-5 sm:hover:border-paz-accent/30 sm:hover:shadow-md">
      <p className="text-[11px] font-bold uppercase tracking-wide text-paz-accent sm:text-xs">{post.series}</p>
      <h2 className="mt-1 text-sm font-bold leading-snug text-paz-navy sm:mt-2 sm:text-lg">{post.title}</h2>
      {post.subtitle && (
        <p className="mt-1 line-clamp-2 text-xs text-paz-muted sm:mt-2 sm:text-sm">{post.subtitle}</p>
      )}
    </article>
  )
}
