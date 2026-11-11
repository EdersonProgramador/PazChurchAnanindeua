import { useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { GestaoTabBar, GestaoTabBody, type GestaoTab } from '../components/gestao/GestaoTabs'
import { PageTitle } from '../components/site/PageTitle'
import { userCanGestao } from '../integrations/apiClient'

export function GestaoPage() {
  const token = localStorage.getItem('paz_token')
  const user = token ? JSON.parse(localStorage.getItem('paz_user') ?? '{}') : null
  const can = userCanGestao(user)
  const perms = useMemo(
    () => ({
      lg: user?.permissions?.includes('lifegroup.manage') ?? false,
      content: user?.permissions?.includes('content.manage') ?? false,
    }),
    [user],
  )
  const defaultTab: GestaoTab = perms.lg ? 'grupos' : 'cultos'
  const [tab, setTab] = useState<GestaoTab>(defaultTab)

  if (!token) return <Navigate to="/login" replace />
  if (!can) return <Navigate to="/admin" replace />

  return (
    <>
      <PageTitle title="Gestão" subtitle="Life Groups, cultos, mensagens e voluntários." />
      <GestaoTabBar tab={tab} setTab={setTab} perms={perms} />
      <GestaoTabBody tab={tab} perms={perms} />
      <p className="py-6 text-center">
        <Link to="/admin" className="text-sm text-paz-accent hover:underline">
          Voltar ao admin
        </Link>
      </p>
    </>
  )
}
