import { Outlet, useLocation } from 'react-router-dom'
import { SiteFooter } from '../components/site/SiteFooter'
import { SiteHeader } from '../components/site/SiteHeader'

export function SiteLayout() {
  const { pathname } = useLocation()
  const minimal = pathname.startsWith('/admin') || pathname.startsWith('/gestao')

  return (
    <div className="flex min-h-dvh flex-col bg-paz-light">
      {!minimal && (
        <a
          href="#conteudo-principal"
          className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-lg bg-white px-4 py-2 text-sm font-semibold text-paz-navy shadow-lg"
        >
          Pular para o conteúdo
        </a>
      )}
      <SiteHeader minimal={minimal} />
      <main id="conteudo-principal" className="flex-1 pb-safe outline-none" tabIndex={-1}>
        <Outlet />
      </main>
      {!minimal && <SiteFooter />}
    </div>
  )
}
