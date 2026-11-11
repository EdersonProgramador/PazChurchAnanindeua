import { ChevronDown, Menu, Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { MAIN_NAV } from '../../data/navigation'
import { CHURCH } from '../../data/churchContent'
import { SiteSearch } from './SiteSearch'

type Props = { minimal?: boolean }

export function SiteHeader({ minimal }: Props) {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    if (minimal || !mobile) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobile, minimal])

  if (minimal) {
    return (
      <header className="border-b border-white/10 bg-paz-navy text-white">
        <div className="site-container flex h-14 items-center justify-between">
          <Link to="/" className="text-sm font-semibold tracking-wide">
            {CHURCH.name}
          </Link>
          <Link to="/" className="text-xs text-white/80 hover:text-white">
            Voltar ao site
          </Link>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur">
      <motionTopBar />
      <div className="site-container flex h-16 items-center justify-between gap-2 sm:h-[4.25rem] lg:h-24">
        <Link to="/" className="flex shrink-0 items-center gap-3" aria-label={CHURCH.name}>
          <img
            src="/logo-pazchurchananindeua-9dc3104f-74c5-44ba-af12-06a3856a8947.png"
            alt={CHURCH.name}
            className="h-12 w-auto sm:h-16 lg:h-20"
            width={200}
            height={80}
          />
        </Link>

        <div className="hidden flex-1 items-center justify-end gap-4 lg:flex">
          <SiteSearch />
          <nav className="flex items-center gap-1" aria-label="Principal">
            {MAIN_NAV.map((item) => (
              <NavItemDesktop key={item.label} item={item} />
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <Link to="/busca" className="touch-target rounded-xl text-paz-navy active:bg-slate-100" aria-label="Buscar">
            <Search className="h-6 w-6" />
          </Link>

          <button
            type="button"
            className="touch-target rounded-xl text-paz-navy active:bg-slate-100"
            aria-label={mobile ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobile}
            onClick={() => setMobile((v) => !v)}
          >
            {mobile ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobile && (
        <nav
          className="max-h-[min(70dvh,32rem)] overflow-y-auto overscroll-contain border-t bg-white px-2 py-2 pb-safe lg:hidden"
          aria-label="Menu mobile"
        >
          {MAIN_NAV.map((item) => (
            <MobileNavItem key={item.label} item={item} onNavigate={() => setMobile(false)} />
          ))}
        </nav>
      )}

    </header>
  )
}

function NavItemDesktop({ item }: { item: (typeof MAIN_NAV)[number] }) {
  const [hover, setHover] = useState(false)
  if (item.children) {
    return (
      <div
        className="relative"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <button
          type="button"
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-paz-navy hover:bg-slate-50"
        >
          {item.label}
          <ChevronDown className="h-4 w-4 text-paz-muted" />
        </button>
        {hover && (
          <motionDrop className="absolute left-0 top-full z-50 min-w-[200px] rounded-lg border border-slate-100 bg-white py-2 shadow-lg">
            {item.children.map((c) =>
              c.external ? (
                <a
                  key={c.label}
                  href={c.to}
                  target="_blank"
                  rel="noreferrer"
                  className="block px-4 py-2 text-sm text-paz-navy hover:bg-slate-50"
                >
                  {c.label}
                </a>
              ) : (
                <Link key={c.label} to={c.to} className="block px-4 py-2 text-sm text-paz-navy hover:bg-slate-50">
                  {c.label}
                </Link>
              ),
            )}
          </motionDrop>
        )}
      </div>
    )
  }
  const external = (item as { external?: boolean }).to?.startsWith('http')
  if (external && item.to) {
    return (
      <a
        href={item.to}
        target="_blank"
        rel="noreferrer"
        className="rounded-lg px-3 py-2 text-sm font-medium text-paz-navy hover:bg-slate-50"
      >
        {item.label}
      </a>
    )
  }
  return (
    <NavLink
      to={item.to ?? '/'}
      className={({ isActive }) =>
        `rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-50 ${isActive ? 'text-paz-accent' : 'text-paz-navy'}`
      }
    >
      {item.label}
    </NavLink>
  )
}

function MobileNavItem({
  item,
  onNavigate,
}: {
  item: (typeof MAIN_NAV)[number]
  onNavigate: () => void
}) {
  if (item.children) {
    return (
      <div className="border-b border-slate-100 py-2">
        <p className="px-2 text-xs font-bold uppercase text-paz-muted">{item.label}</p>
        {item.children.map((c) =>
          c.external ? (
            <a
              key={c.label}
              href={c.to}
              className="block rounded-lg px-3 py-3 text-base text-paz-navy active:bg-slate-50"
              onClick={onNavigate}
            >
              {c.label}
            </a>
          ) : (
            <Link
              key={c.label}
              to={c.to}
              className="block rounded-lg px-3 py-3 text-base text-paz-navy active:bg-slate-50"
              onClick={onNavigate}
            >
              {c.label}
            </Link>
          ),
        )}
      </div>
    )
  }
  if (item.to?.startsWith('http')) {
    return (
      <a
        href={item.to}
        className="block rounded-lg border-b border-slate-100 px-3 py-3.5 text-base font-medium text-paz-navy active:bg-slate-50"
        onClick={onNavigate}
      >
        {item.label}
      </a>
    )
  }
  return (
    <Link
      to={item.to ?? '/'}
      className="block rounded-lg border-b border-slate-100 px-3 py-3.5 text-base font-medium text-paz-navy active:bg-slate-50"
      onClick={onNavigate}
    >
      {item.label}
    </Link>
  )
}

function motionTopBar() {
  return (
    <motionBar className="bg-paz-navy text-center text-[11px] text-white/90 sm:text-xs">
      <div className="site-container line-clamp-1 py-1.5 sm:line-clamp-none">
        <span className="sm:hidden">{CHURCH.tagline}</span>
        <span className="hidden sm:inline">
          {CHURCH.tagline} — {CHURCH.locale}
        </span>
      </div>
    </motionBar>
  )
}

function motionBar({ children, className }: { children: React.ReactNode; className?: string }) {
  return <motionDiv className={className}>{children}</motionDiv>
}

function motionDrop({ children, className }: { children: React.ReactNode; className?: string }) {
  return <motionDiv className={className}>{children}</motionDiv>
}

function motionDiv({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}
