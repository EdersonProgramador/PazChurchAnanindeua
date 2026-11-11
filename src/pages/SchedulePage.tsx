import { useEffect, useState } from 'react'
import { PageTitle } from '../components/site/PageTitle'
import { SiteSection } from '../components/site/SiteSection'
import { api, type ChurchEvent } from '../integrations/apiClient'

export function SchedulePage() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
  const [events, setEvents] = useState<ChurchEvent[]>([])

  useEffect(() => {
    api.events(tab === 'past').then((r) => setEvents(r.events)).catch(console.error)
  }, [tab])

  return (
    <>
      <PageTitle title="Agenda" subtitle="Cultos, conferências e eventos da unidade Ananindeua." crumbs={[{ label: 'Home', to: '/' }, { label: 'Agenda' }]} />
      <SiteSection>
        <span className="mb-6 inline-flex rounded-lg border border-slate-200 bg-white p-1">
          {(['upcoming', 'past'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`rounded-md px-4 py-2 text-sm font-semibold ${
                tab === key ? 'bg-paz-navy text-white' : 'text-paz-muted'
              }`}
            >
              {key === 'upcoming' ? 'Próximos' : 'Anteriores'}
            </button>
          ))}
        </span>
        <ul className="divide-y rounded-xl border border-slate-100 bg-white shadow-sm">
          {events.map((ev) => {
            const d = new Date(ev.startsAt)
            return (
              <li key={ev.id} className="flex gap-4 p-4 md:p-6">
                <div className="w-16 shrink-0 text-center">
                  <p className="text-xs uppercase text-paz-muted">{d.toLocaleString('pt-BR', { month: 'short' })}</p>
                  <p className="text-3xl font-bold text-paz-navy">{d.getDate()}</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-paz-navy">{ev.title}</p>
                  {ev.recurring && <p className="text-sm text-paz-muted">{ev.recurring}</p>}
                  <p className="text-sm text-paz-muted">{ev.location}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </SiteSection>
    </>
  )
}
