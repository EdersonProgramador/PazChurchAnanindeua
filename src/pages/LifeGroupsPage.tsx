import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LifeGroupsVideo } from '../components/site/LifeGroupsVideo'
import { PageTitle } from '../components/site/PageTitle'
import { SiteSection } from '../components/site/SiteSection'
import { api, type LifeGroup } from '../integrations/apiClient'

export function LifeGroupsPage() {
  const [groups, setGroups] = useState<LifeGroup[]>([])

  useEffect(() => {
    api.lifeGroupsPublic().then((r) => setGroups(r.groups)).catch(console.error)
  }, [])

  return (
    <>
      <PageTitle
        title="Life Groups"
        subtitle="A igreja no lar — comunhão, Palavra e oração para todas as idades."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Life Groups' }]}
      />
      <SiteSection>
        <div className="mx-auto max-w-4xl">
          <LifeGroupsVideo />
        </div>
      </SiteSection>
      <SiteSection>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-paz-muted">
            Temos Life Groups para adultos, jovens, adolescentes e crianças na região de Ananindeua e entorno.
          </p>
          <Link to="/life-groups/inscricao" className="btn-primary mt-6 inline-block px-8 py-3">
            Quero participar
          </Link>
        </div>
        {groups.length > 0 && (
          <ul className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-2">
            {groups.map((g) => (
              <li key={g.id} className="rounded-xl border bg-white p-5 shadow-sm">
                <p className="font-bold text-paz-navy">{g.name}</p>
                <p className="mt-1 text-sm text-paz-muted">
                  {g.neighborhood} · {g.dayOfWeek} às {g.meetingTime}
                </p>
                <p className="text-xs text-paz-muted">Líder: {g.leaderName}</p>
              </li>
            ))}
          </ul>
        )}
      </SiteSection>
    </>
  )
}
