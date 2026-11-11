import { useEffect, useState } from 'react'
import { ListRow } from '../components/ListRow'
import { ScreenHeader } from '../components/ScreenHeader'
import { api, type MenuLink } from '../integrations/apiClient'
import { iconForMenu } from '../utils/menuIcons'
import { Link } from 'react-router-dom'

export function MorePage() {
  const [links, setLinks] = useState<MenuLink[]>([])

  useEffect(() => {
    api.menu('mais').then((r) => setLinks(r.links)).catch(console.error)
  }, [])

  return (
    <>
      <ScreenHeader title="Mais" />
      <nav className="bg-paz-navy pb-2">
        {links.map((link) => (
          <ListRow
            key={link.id}
            label={link.label}
            to={link.path ?? undefined}
            href={link.external ?? undefined}
            icon={iconForMenu(link.icon)}
          />
        ))}
        <Link
          to="/admin"
          className="paz-screen-enter block border-t border-white/10 px-4 py-3 text-center text-sm text-white/80"
        >
          Área administrativa
        </Link>
      </nav>
    </>
  )
}
