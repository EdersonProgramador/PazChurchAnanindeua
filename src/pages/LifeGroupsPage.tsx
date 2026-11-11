import { useEffect, useState } from 'react'
import { ListRow } from '../components/ListRow'
import { ScreenHeader } from '../components/ScreenHeader'
import { api, type MenuLink } from '../integrations/apiClient'
import { iconForMenu } from '../utils/menuIcons'

export function LifeGroupsPage() {
  const [links, setLinks] = useState<MenuLink[]>([])

  useEffect(() => {
    api.menu('life-groups').then((r) => setLinks(r.links)).catch(console.error)
  }, [])

  return (
    <>
      <ScreenHeader title="Life Groups" />
      <img
        src="/image-2b9723df-aaeb-45e1-a0c0-433ae9995a66.png"
        alt=""
        className="paz-screen-enter h-36 w-full object-cover"
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
      />
      <nav>
        {links.map((link) => (
          <ListRow
            key={link.id}
            label={link.label}
            to={link.path ?? undefined}
            icon={iconForMenu(link.icon)}
          />
        ))}
      </nav>
    </>
  )
}
