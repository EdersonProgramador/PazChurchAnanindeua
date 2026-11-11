import { CHURCH } from '../../data/churchContent'

type Props = { className?: string }

export function LifeGroupsVideo({ className = '' }: Props) {
  return (
    <figure className={className}>
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-paz-navy shadow-sm ring-1 ring-slate-200/80">
        <iframe
          title="Life Groups — Paz Church"
          src={CHURCH.lifeGroupsVideoEmbed}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <figcaption className="mt-2 text-center text-xs text-paz-muted sm:text-left">
        <a
          href={CHURCH.lifeGroupsVideoWatch}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-paz-accent hover:underline"
        >
          Assistir no YouTube
        </a>
      </figcaption>
    </figure>
  )
}
