import { FormEvent, useEffect, useState } from 'react'
import {
  api,
  type ChurchEvent,
  type FeedPost,
  type LifeGroup,
  type LifeGroupSignup,
  type Sermon,
  type VolunteerSignup,
} from '../../integrations/apiClient'

export type GestaoTab =
  | 'grupos'
  | 'inscricoes'
  | 'relatorios'
  | 'cultos'
  | 'mensagens'
  | 'voluntarios'

type Perms = { lg: boolean; content: boolean }

export function GestaoTabBar({
  tab,
  setTab,
  perms,
}: {
  tab: GestaoTab
  setTab: (t: GestaoTab) => void
  perms: Perms
}) {
  const items: [GestaoTab, string, boolean][] = [
    ['grupos', 'LG', perms.lg],
    ['inscricoes', 'Inscr. LG', perms.lg],
    ['relatorios', 'Relatórios', perms.lg],
    ['cultos', 'Cultos', perms.content],
    ['mensagens', 'Mensagens', perms.content],
    ['voluntarios', 'Voluntários', perms.content],
  ]
  return (
    <div className="flex gap-1 overflow-x-auto bg-white p-2">
      {items
        .filter(([, , show]) => show)
        .map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`shrink-0 rounded px-3 py-2 text-xs font-semibold ${
              tab === key ? 'bg-paz-navy text-white' : 'bg-slate-100 text-paz-muted'
            }`}
          >
            {label}
          </button>
        ))}
    </div>
  )
}

export function GestaoTabBody({ tab, perms }: { tab: GestaoTab; perms: Perms }) {
  const [groups, setGroups] = useState<LifeGroup[]>([])
  const [signups, setSignups] = useState<LifeGroupSignup[]>([])
  const [events, setEvents] = useState<ChurchEvent[]>([])
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [feed, setFeed] = useState<FeedPost[]>([])
  const [volunteers, setVolunteers] = useState<VolunteerSignup[]>([])

  const reloadLg = () => {
    api.gestaoLifeGroups().then((r) => setGroups(r.groups))
    api.gestaoSignups().then((r) => setSignups(r.signups))
  }
  const reloadContent = () => {
    api.gestaoEvents().then((r) => setEvents(r.events))
    api.gestaoSermons().then((r) => setSermons(r.sermons))
    api.gestaoFeed().then((r) => setFeed(r.posts))
    api.gestaoVolunteers().then((r) => setVolunteers(r.signups))
  }

  useEffect(() => {
    if (perms.lg) reloadLg()
    if (perms.content) reloadContent()
  }, [tab, perms.lg, perms.content])

  if (tab === 'grupos' && perms.lg) return <GroupsPanel groups={groups} onReload={reloadLg} />
  if (tab === 'inscricoes' && perms.lg) return <LgSignupsPanel signups={signups} groups={groups} onReload={reloadLg} />
  if (tab === 'relatorios' && perms.lg) return <ReportsPanel groups={groups} />
  if (tab === 'cultos' && perms.content) return <EventsPanel events={events} onReload={reloadContent} />
  if (tab === 'mensagens' && perms.content)
    return <MessagesPanel sermons={sermons} feed={feed} onReload={reloadContent} />
  if (tab === 'voluntarios' && perms.content)
    return <VolunteersPanel volunteers={volunteers} onReload={reloadContent} />
  return <p className="p-4 text-sm text-paz-muted">Sem permissão para esta aba.</p>
}

function GroupsPanel({ groups, onReload }: { groups: LifeGroup[]; onReload: () => void }) {
  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    await api.gestaoCreateGroup({
      name: String(fd.get('name')),
      leaderName: String(fd.get('leaderName')),
      address: String(fd.get('address')),
      neighborhood: String(fd.get('neighborhood')),
      dayOfWeek: String(fd.get('dayOfWeek')),
      meetingTime: String(fd.get('meetingTime')),
      ageGroup: String(fd.get('ageGroup')),
    })
    e.currentTarget.reset()
    onReload()
  }
  return (
    <ModuleLayout title="Life Groups" onSubmit={onCreate} groups={groups} />
  )
}

function ModuleLayout({
  title,
  onSubmit,
  groups,
}: {
  title: string
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  groups: LifeGroup[]
}) {
  return (
    <div className="space-y-3 p-3">
      <form onSubmit={onSubmit} className="paz-card space-y-2 p-3">
        <p className="text-sm font-semibold">{title} — novo</p>
        <input name="name" required placeholder="Nome" className="field" />
        <input name="leaderName" required placeholder="Líder" className="field" />
        <input name="neighborhood" required placeholder="Bairro" className="field" />
        <input name="address" required placeholder="Endereço" className="field" />
        <input name="dayOfWeek" required placeholder="Dia" className="field" />
        <input name="meetingTime" required placeholder="Horário" className="field" />
        <select name="ageGroup" className="field" defaultValue="adultos">
          <option value="adultos">Adultos</option>
          <option value="jovens">Jovens</option>
        </select>
        <button type="submit" className="btn-primary">
          Salvar
        </button>
      </form>
      <ListCard items={groups.map((g) => `${g.name} · ${g.neighborhood}`)} />
    </div>
  )
}

function LgSignupsPanel({
  signups,
  groups,
  onReload,
}: {
  signups: LifeGroupSignup[]
  groups: LifeGroup[]
  onReload: () => void
}) {
  return (
    <ul className="divide-y bg-white">
      {signups.map((s) => (
        <li key={s.id} className="space-y-2 p-3 text-sm">
          <p className="font-semibold">{s.fullName}</p>
          <p className="text-paz-muted">
            {s.city} · {s.status}
          </p>
          <select
            className="field"
            defaultValue=""
            onChange={(e) => e.target.value && api.gestaoPatchSignup(s.id, { status: 'matched', lifeGroupId: e.target.value }).then(onReload)}
          >
            <option value="">Vincular LG…</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </li>
      ))}
    </ul>
  )
}

function ReportsPanel({ groups }: { groups: LifeGroup[] }) {
  async function onReport(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    await api.gestaoCreateReport({
      lifeGroupId: String(fd.get('lifeGroupId')),
      weekDate: String(fd.get('weekDate')),
      attendance: Number(fd.get('attendance')),
      visitors: Number(fd.get('visitors')),
      notes: String(fd.get('notes') || ''),
    })
    e.currentTarget.reset()
  }
  return (
    <form onSubmit={onReport} className="space-y-2 p-3">
      <select name="lifeGroupId" required className="field">
        {groups.map((g) => (
          <option key={g.id} value={g.id}>
            {g.name}
          </option>
        ))}
      </select>
      <input name="weekDate" type="date" required className="field" />
      <input name="attendance" type="number" defaultValue={0} className="field" />
      <input name="visitors" type="number" defaultValue={0} className="field" />
      <textarea name="notes" className="field min-h-20" placeholder="Notas" />
      <button type="submit" className="btn-primary w-full">
        Enviar relatório
      </button>
    </form>
  )
}

function EventsPanel({ events, onReload }: { events: ChurchEvent[]; onReload: () => void }) {
  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    await api.gestaoCreateEvent({
      title: String(fd.get('title')),
      startsAt: new Date(String(fd.get('startsAt'))).toISOString(),
      location: String(fd.get('location')),
      recurring: String(fd.get('recurring') || ''),
      description: String(fd.get('description') || ''),
    })
    e.currentTarget.reset()
    onReload()
  }
  return (
    <div className="space-y-3 p-3">
      <form onSubmit={onCreate} className="paz-card space-y-2 p-3">
        <p className="text-sm font-semibold">Novo culto / evento</p>
        <input name="title" required placeholder="Título" className="field" />
        <input name="startsAt" type="datetime-local" required className="field" />
        <input name="location" placeholder="Local" className="field" defaultValue="Paz Church Metrópole" />
        <input name="recurring" placeholder="Recorrência (ex: Semanal dom 8h)" className="field" />
        <textarea name="description" placeholder="Descrição" className="field" />
        <button type="submit" className="btn-primary w-full">
          Publicar na agenda
        </button>
      </form>
      <ListCard items={events.map((ev) => `${ev.title} — ${new Date(ev.startsAt).toLocaleString('pt-BR')}`)} />
    </div>
  )
}

function MessagesPanel({
  sermons,
  feed,
  onReload,
}: {
  sermons: Sermon[]
  feed: FeedPost[]
  onReload: () => void
}) {
  async function onSermon(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    await api.gestaoCreateSermon({
      title: String(fd.get('title')),
      category: String(fd.get('category')),
      speaker: String(fd.get('speaker') || ''),
      featured: fd.get('featured') === 'on',
      summary: String(fd.get('summary') || ''),
    })
    e.currentTarget.reset()
    onReload()
  }
  async function onFeed(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    await api.gestaoCreateFeed({
      title: String(fd.get('title')),
      subtitle: String(fd.get('subtitle') || ''),
      series: String(fd.get('series') || ''),
      speaker: String(fd.get('speaker') || ''),
      sortOrder: Number(fd.get('sortOrder') || 0),
    })
    e.currentTarget.reset()
    onReload()
  }
  return (
    <div className="space-y-4 p-3">
      <form onSubmit={onSermon} className="paz-card space-y-2 p-3">
        <p className="text-sm font-semibold">Nova mensagem (pregação)</p>
        <input name="title" required placeholder="Título" className="field" />
        <select name="category" className="field" defaultValue="Cultos">
          <option>Cultos</option>
          <option>Liderança</option>
          <option>Especiais</option>
        </select>
        <input name="speaker" placeholder="Pregador" className="field" />
        <textarea name="summary" placeholder="Resumo" className="field" />
        <label className="flex items-center gap-2 text-sm">
          <input name="featured" type="checkbox" /> Destaque na home (palavra recente)
        </label>
        <button type="submit" className="btn-primary w-full">
          Salvar mensagem
        </button>
      </form>
      <form onSubmit={onFeed} className="paz-card space-y-2 p-3">
        <p className="text-sm font-semibold">Banner / série (feed)</p>
        <input name="title" required className="field" placeholder="Título" />
        <input name="series" className="field" placeholder="Série" />
        <input name="subtitle" className="field" placeholder="Subtítulo" />
        <button type="submit" className="btn-primary w-full">
          Salvar banner
        </button>
      </form>
      <ListCard items={sermons.map((s) => `📖 ${s.title} (${s.category})`)} />
      <ListCard items={feed.map((p) => `🎯 ${p.title}`)} />
    </div>
  )
}

function VolunteersPanel({ volunteers, onReload }: { volunteers: VolunteerSignup[]; onReload: () => void }) {
  return (
    <ul className="divide-y bg-white">
      {volunteers.map((v) => (
        <li key={v.id} className="space-y-2 p-3 text-sm">
          <p className="font-semibold">{v.fullName}</p>
          <p className="text-paz-muted">
            {v.ministry?.name ?? v.ministryLabel ?? 'Ministério'} · {v.status}
          </p>
          <div className="flex gap-2">
            {(['approved', 'pending', 'archived'] as const).map((st) => (
              <button
                key={st}
                type="button"
                className="rounded border px-2 py-1 text-xs capitalize"
                onClick={() => api.gestaoPatchVolunteer(v.id, { status: st }).then(onReload)}
              >
                {st}
              </button>
            ))}
          </div>
        </li>
      ))}
    </ul>
  )
}

function ListCard({ items }: { items: string[] }) {
  return (
    <ul className="divide-y rounded-lg border bg-white text-sm">
      {items.map((line) => (
        <li key={line} className="p-3 text-paz-navy">
          {line}
        </li>
      ))}
    </ul>
  )
}
