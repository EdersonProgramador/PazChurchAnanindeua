import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageTitle } from '../components/site/PageTitle'
import { SiteSection } from '../components/site/SiteSection'
import { CHURCH } from '../data/churchContent'
import { api, type MenuLink } from '../integrations/apiClient'

const LINKS = [
  { label: 'Pastores', to: '/paz-church/pastores' },
  { label: 'Nossa visão', to: '/paz-church/visao' },
  { label: 'Localização', to: '/paz-church/localizacao' },
  { label: 'Horários', to: '/paz-church/horarios' },
]

export function PazChurchPage() {
  const [, setLinks] = useState<MenuLink[]>([])
  useEffect(() => {
    api.menu('paz-church').then((r) => setLinks(r.links)).catch(console.error)
  }, [])

  return (
    <>
      <PageTitle
        title="Quem somos"
        subtitle={CHURCH.tagline}
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Sobre', to: '/paz-church' }, { label: 'Quem somos' }]}
      />
      <SiteSection wide>
        <img
          src="/logo-pazchurchananindeua-9dc3104f-74c5-44ba-af12-06a3856a8947.png"
          alt=""
          className="mx-auto max-h-32 object-contain md:max-h-40"
        />
      </SiteSection>
      <SiteSection>
        <div className="prose-paz mx-auto max-w-3xl space-y-4">
          <p>
            A {CHURCH.name} faz parte da rede Paz Church na região de Belém, com sede na{' '}
            <strong>Paz Church Metrópole</strong> — uma comunidade voltada a famílias, discipulado e missão na Grande
            Belém.
          </p>
          <p>
            Cultuamos com excelência, formamos discípulos em Life Groups e servimos nossa cidade com o evangelho da paz
            de Cristo.
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-lg border border-slate-100 bg-white px-4 py-3 text-center text-sm font-semibold text-paz-navy shadow-sm hover:border-paz-accent"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </SiteSection>
    </>
  )
}
