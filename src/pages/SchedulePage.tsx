import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { ScreenHeader } from '../components/ScreenHeader'
import { api, type ChurchEvent } from '../integrations/apiClient'

export function SchedulePage() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
  const [events, setEvents] = useState<ChurchEvent[]>([])

  useEffect(() => {
    api.events(tab === 'past').then((r) => setEvents(r.events)).catch(console.error)
  }, [tab])

  return (
    <>
      <ScreenHeader title="Agenda" />
      <div className="flex gap-2 bg-white px-3 py-2">
        {(['upcoming', 'past'] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`flex-1 rounded-md py-2 text-sm font-semibold ${
              tab === key ? 'bg-paz-navy text-white' : 'bg-slate-100 text-paz-muted'
            }`}
          >
            {key === 'upcoming' ? 'Upcoming' : 'Past'}
          </button>
        ))}
      </div>
      <ul className="divide-y divide-slate-100 bg-white">
        {events.map((ev) => {
          const d = new Date(ev.startsAt)
          const month = d.toLocaleString('pt-BR', { month: 'short' }).replace('.', '')
          return (
            <li key={ev.id} className="paz-screen-enter flex items-center gap-3 px-4 py-3">
              <div className="w-12 text-center">
                <div className="text-xs uppercase text-paz-muted">{month}</div>
                <div className="text-2xl font-bold text-paz-navy">{d.getDate()}</div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-paz-navy">{ev.title}</p>
                {ev.recurring && <p className="text-xs text-paz-muted">{ev.recurring}</p>}
              </div>
              <ChevronRight className="h-5 w-5 text-paz-muted" />
            </li>
          )
        })}
      </ul>
    </>
  )
}
