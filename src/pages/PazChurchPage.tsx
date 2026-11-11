import { useEffect, useState } from 'react'
import { ListRow } from '../components/ListRow'
import { ScreenHeader } from '../components/ScreenHeader'
import { CHURCH } from '../data/churchContent'
import { api, type MenuLink } from '../integrations/apiClient'
import { iconForMenu } from '../utils/menuIcons'

export function PazChurchPage() {
  const [links, setLinks] = useState<MenuLink[]>([])

  useEffect(() => {
    api.menu('paz-church').then((r) => setLinks(r.links)).catch(console.error)
  }, [])

  return (
    <>
      <ScreenHeader title="Paz Church" />
      <div className="paz-screen-enter overflow-hidden">
        <img
          src="/logo-pazchurchananindeua-9dc3104f-74c5-44ba-af12-06a3856a8947.png"
          alt="Paz Church Ananindeua"
          className="w-full bg-paz-navy object-contain p-6"
        />
      </div>
      <p className="px-4 py-3 text-center text-xs text-paz-muted">
        {CHURCH.tagline} · {CHURCH.locale}
      </p>
      <nav>
        {links.map((link) => (
          <ListRow
            key={link.id}
            label={link.label}
            to={link.path ?? undefined}
            href={link.external ?? undefined}
            icon={iconForMenu(link.icon)}
          />
        ))}
      </nav>
    </>
  )
}
