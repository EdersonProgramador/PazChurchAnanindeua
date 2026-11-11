import { FormEvent, useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ScreenHeader } from '../components/ScreenHeader'
import { api, type LifeGroup, type LifeGroupSignup } from '../integrations/apiClient'

export function GestaoPage() {
  const token = localStorage.getItem('paz_token')
  const user = token ? JSON.parse(localStorage.getItem('paz_user') ?? '{}') : null
  const can = user?.permissions?.includes('lifegroup.manage')

  const [tab, setTab] = useState<'grupos' | 'inscricoes' | 'relatorios'>('grupos')
  const [groups, setGroups] = useState<LifeGroup[]>([])
  const [signups, setSignups] = useState<LifeGroupSignup[]>([])

  useEffect(() => {
    if (!can) return
    api.gestaoLifeGroups().then((r) => setGroups(r.groups)).catch(console.error)
    api.gestaoSignups().then((r) => setSignups(r.signups)).catch(console.error)
  }, [can, tab])

  if (!token) return <Navigate to="/login" replace />
  if (!can) return <Navigate to="/admin" replace />

  return (
    <>
      <ScreenHeader title="Gestão · Igreja / LG" showInfo={false} />
      <motionTabs tab={tab} setTab={setTab} />
      <motionBody tab={tab} groups={groups} signups={signups} onReload={() => {
        api.gestaoLifeGroups().then((r) => setGroups(r.groups))
        api.gestaoSignups().then((r) => setSignups(r.signups))
      }} />
      <Link to="/admin" className="block py-4 text-center text-sm text-paz-accent">
        Voltar ao admin
      </Link>
    </>
  )
}

function motionTabs({
  tab,
  setTab,
}: {
  tab: string
  setTab: (t: 'grupos' | 'inscricoes' | 'relatorios') => void
}) {
  const items = [
    ['grupos', 'Life Groups'],
    ['inscricoes', 'Inscrições'],
    ['relatorios', 'Relatórios'],
  ] as const
  return (
    <div className="flex gap-1 bg-white p-2">
      {items.map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => setTab(key)}
          className={`flex-1 rounded py-2 text-xs font-semibold ${
            tab === key ? 'bg-paz-navy text-white' : 'bg-slate-100 text-paz-muted'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function motionBody({
  tab,
  groups,
  signups,
  onReload,
}: {
  tab: string
  groups: LifeGroup[]
  signups: LifeGroupSignup[]
  onReload: () => void
}) {
  if (tab === 'grupos') return <GroupsTab groups={groups} onReload={onReload} />
  if (tab === 'inscricoes') return <SignupsTab signups={signups} groups={groups} onReload={onReload} />
  return <ReportsTab groups={groups} />
}

function GroupsTab({ groups, onReload }: { groups: LifeGroup[]; onReload: () => void }) {
  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    await api.gestaoCreateGroup({
      name: String(fd.get('name')),
      leaderName: String(fd.get('leaderName')),
      address: String(fd.get('address')),
      neighborhood: String(fd.get('neighborhood')),
      city: String(fd.get('city') || 'Ananindeua'),
      dayOfWeek: String(fd.get('dayOfWeek')),
      meetingTime: String(fd.get('meetingTime')),
      ageGroup: String(fd.get('ageGroup')),
    })
    e.currentTarget.reset()
    onReload()
  }
  return (
    <div className="space-y-3 p-3">
      <form onSubmit={onCreate} className="paz-card space-y-2 p-3">
        <p className="text-sm font-semibold">Novo Life Group</p>
        <input name="name" required placeholder="Nome" className="field" />
        <input name="leaderName" required placeholder="Líder" className="field" />
        <input name="neighborhood" required placeholder="Bairro" className="field" />
        <input name="address" required placeholder="Endereço" className="field" />
        <input name="dayOfWeek" required placeholder="Dia (ex: quarta)" className="field" />
        <input name="meetingTime" required placeholder="Horário (ex: 19:30)" className="field" />
        <select name="ageGroup" className="field" defaultValue="adultos">
          <option value="adultos">Adultos</option>
          <option value="jovens">Jovens</option>
          <option value="criancas">Crianças</option>
        </select>
        <button type="submit" className="w-full rounded bg-paz-navy py-2 text-sm text-white">
          Salvar
        </button>
      </form>
      <ul className="divide-y rounded-lg border bg-white">
        {groups.map((g) => (
          <li key={g.id} className="p-3 text-sm">
            <p className="font-semibold">{g.name}</p>
            <p className="text-paz-muted">
              {g.neighborhood} · {g.dayOfWeek} {g.meetingTime} · {g.leaderName}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

function SignupsTab({
  signups,
  groups,
  onReload,
}: {
  signups: LifeGroupSignup[]
  groups: LifeGroup[]
  onReload: () => void
}) {
  async function match(signupId: string, lifeGroupId: string) {
    await api.gestaoPatchSignup(signupId, { status: 'matched', lifeGroupId })
    onReload()
  }
  return (
    <ul className="divide-y bg-white">
      {signups.map((s) => (
        <li key={s.id} className="space-y-2 p-3 text-sm">
          <p className="font-semibold">{s.fullName}</p>
          <p className="text-paz-muted">
            {s.city} · {s.ageGroup} · {s.status}
          </p>
          <select
            className="field"
            defaultValue=""
            onChange={(e) => e.target.value && match(s.id, e.target.value)}
          >
            <option value="">Vincular a um Life Group…</option>
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

function ReportsTab({ groups }: { groups: LifeGroup[] }) {
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
      <input name="attendance" type="number" min={0} defaultValue={0} className="field" />
      <input name="visitors" type="number" min={0} defaultValue={0} className="field" />
      <textarea name="notes" placeholder="Notas da reunião" className="field min-h-20" />
      <button type="submit" className="w-full rounded bg-paz-navy py-2 text-sm text-white">
        Enviar relatório
      </button>
    </form>
  )
}
