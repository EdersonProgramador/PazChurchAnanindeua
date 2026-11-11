import { Link } from 'react-router-dom'

type Props = {
  title: string
  subtitle?: string
  crumbs?: { label: string; to?: string }[]
}

export function PageTitle({ title, subtitle, crumbs }: Props) {
  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="paz-screen-enter site-container py-6 sm:py-8 md:py-12">
        {crumbs && crumbs.length > 0 && (
          <nav className="mb-2 flex flex-wrap gap-1 text-xs text-paz-muted">
            {crumbs.map((c, i) => (
              <span key={c.label} className="flex items-center gap-1">
                {i > 0 && <span>/</span>}
                {c.to ? (
                  <Link to={c.to} className="hover:text-paz-accent">
                    {c.label}
                  </Link>
                ) : (
                  <span>{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-[1.625rem] font-bold leading-tight tracking-tight text-paz-navy sm:text-2xl md:text-4xl">
          {title}
        </h1>
        {subtitle && <p className="mt-2 max-w-2xl text-base leading-relaxed text-paz-muted">{subtitle}</p>}
      </div>
    </div>
  )
}
