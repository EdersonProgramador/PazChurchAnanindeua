import type { LucideIcon } from 'lucide-react'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

type Props = {
  label: string
  to?: string
  href?: string
  icon?: LucideIcon
}

export function ListRow({ label, to, href, icon: Icon }: Props) {
  const inner = (
    <>
      {Icon && <Icon className="h-6 w-6 shrink-0 text-paz-accent" strokeWidth={1.5} />}
      <span className="flex-1 text-sm font-semibold text-paz-navy">{label}</span>
      <ChevronRight className="h-5 w-5 text-paz-muted" />
    </>
  )
  const className =
    'paz-screen-enter flex items-center gap-3 border-b border-slate-100 bg-white px-4 py-3.5 active:bg-slate-50'

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {inner}
      </a>
    )
  }
  return (
    <Link to={to ?? '#'} className={className}>
      {inner}
    </Link>
  )
}
