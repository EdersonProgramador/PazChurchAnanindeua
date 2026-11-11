import { Outlet, useLocation } from 'react-router-dom'
import { SiteFooter } from '../components/site/SiteFooter'
import { SiteHeader } from '../components/site/SiteHeader'

export function SiteLayout() {
  const { pathname } = useLocation()
  const minimal = pathname.startsWith('/admin') || pathname.startsWith('/gestao')

  return (
    <div className="flex min-h-dvh flex-col bg-paz-light">
      <SiteHeader minimal={minimal} />
      <main className="flex-1">
        <Outlet />
      </main>
      {!minimal && <SiteFooter />}
    </div>
  )
}
