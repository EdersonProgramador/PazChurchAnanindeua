import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { InstagramPost } from '../../integrations/apiClient'
import { CHURCH } from '../../data/churchContent'

type Props = {
  instagramPosts: InstagramPost[]
  profileUrl?: string
}

export function HomeFeedSection({ instagramPosts, profileUrl }: Props) {
  const [bgSrc, setBgSrc] = useState(CHURCH.facadeImage)

  const onBgError = () => {
    if (bgSrc !== CHURCH.facadeImageRemote) setBgSrc(CHURCH.facadeImageRemote)
  }

  const posts = instagramPosts.slice(0, 6)
  const igProfile = profileUrl ?? 'https://www.instagram.com/pazbelempa/'

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

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 p-2 sm:grid-cols-2 sm:gap-6 sm:p-6 lg:grid-cols-3 lg:p-8">
          {posts.map((post) => (
            <InstagramCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="p-4 text-center text-sm text-paz-muted">
          Publicações do Instagram em breve. Siga{' '}
          <a href={igProfile} target="_blank" rel="noreferrer" className="font-semibold text-paz-accent hover:underline">
            @pazbelempa
          </a>
          .
        </p>
      )}

      <div className="flex flex-col gap-2 border-t border-slate-100 p-2 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <a
          href={igProfile}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-10 items-center justify-center gap-2 text-sm font-semibold text-paz-accent hover:underline"
        >
          @pazbelempa no Instagram
          <ExternalLink className="h-4 w-4" />
        </a>
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

function InstagramCard({ post }: { post: InstagramPost }) {
  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noreferrer"
      className="group flex flex-col overflow-hidden rounded-lg border border-slate-200/90 bg-white shadow-sm sm:rounded-xl sm:hover:border-paz-accent/30 sm:hover:shadow-md"
    >
      {post.imageUrl ? (
        <img
          src={post.imageUrl}
          alt=""
          loading="lazy"
          decoding="async"
          className="aspect-square w-full object-cover sm:transition sm:group-hover:scale-[1.02]"
        />
      ) : null}
      <div className="p-3 sm:p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-paz-accent sm:text-xs">Instagram</p>
        <p className="mt-1 line-clamp-3 text-sm leading-snug text-paz-navy">{post.caption}</p>
      </div>
    </a>
  )
}
