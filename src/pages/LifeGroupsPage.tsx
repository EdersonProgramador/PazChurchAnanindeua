import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ListRow } from '../components/ListRow'
import { ScreenHeader } from '../components/ScreenHeader'
import { api, type LifeGroup, type MenuLink } from '../integrations/apiClient'
import { iconForMenu } from '../utils/menuIcons'

export function LifeGroupsPage() {
  const [links, setLinks] = useState<MenuLink[]>([])
  const [groups, setGroups] = useState<LifeGroup[]>([])

  useEffect(() => {
    api.menu('life-groups').then((r) => setLinks(r.links)).catch(console.error)
    api.lifeGroupsPublic().then((r) => setGroups(r.groups)).catch(console.error)
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
      <Link
        to="/life-groups/inscricao"
        className="paz-screen-enter m-3 block rounded-lg bg-paz-accent px-4 py-3 text-center text-sm font-semibold text-white"
      >
        Quero participar de um Life Group
      </Link>
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
      {groups.length > 0 && (
        <section className="mx-3 mb-4 rounded-lg border bg-white p-3">
          <h3 className="text-sm font-bold text-paz-navy">Endereços ativos</h3>
          <ul className="mt-2 space-y-2 text-xs text-paz-muted">
            {groups.map((g) => (
              <li key={g.id}>
                <span className="font-semibold text-paz-navy">{g.name}</span> — {g.neighborhood},{' '}
                {g.dayOfWeek} {g.meetingTime}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
