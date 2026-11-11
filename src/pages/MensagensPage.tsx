import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageTitle } from '../components/site/PageTitle'
import { SiteSection } from '../components/site/SiteSection'
import { api, type Sermon } from '../integrations/apiClient'

export function MensagensPage() {
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [params] = useSearchParams()
  const cat = params.get('cat')

  useEffect(() => {
    api.sermonsPublic().then((r) => setSermons(r.sermons)).catch(console.error)
  }, [])

  const filtered = cat ? sermons.filter((s) => s.category.toLowerCase() === cat.toLowerCase()) : sermons

  return (
    <>
      <PageTitle
        title="Mensagens"
        subtitle="Cultos, liderança e séries — Paz Church Ananindeua"
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Mensagens' }]}
      />
      <SiteSection>
        <motionGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <article key={s.id} className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
              <div className="bg-gradient-to-br from-paz-navy to-paz-blue p-5 text-white">
                <p className="text-xs uppercase tracking-wide text-white/70">{s.category}</p>
                <h2 className="mt-1 text-lg font-bold leading-snug">{s.title}</h2>
                {s.speaker && <p className="mt-2 text-sm text-white/80">{s.speaker}</p>}
              </div>
            </article>
          ))}
        </motionGrid>
        {filtered.length === 0 && <p className="text-center text-paz-muted">Nenhuma mensagem publicada ainda.</p>}
      </SiteSection>
    </>
  )
}

function motionGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}
