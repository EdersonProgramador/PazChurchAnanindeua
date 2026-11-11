import { useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { GestaoTabBar, GestaoTabBody, type GestaoTab } from '../components/gestao/GestaoTabs'
import { ScreenHeader } from '../components/ScreenHeader'
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
      <ScreenHeader title="Gestão · Igreja" showInfo={false} />
      <GestaoTabBar tab={tab} setTab={setTab} perms={perms} />
      <GestaoTabBody tab={tab} perms={perms} />
      <Link to="/admin" className="block py-4 text-center text-sm text-paz-accent">
        Voltar ao admin
      </Link>
    </>
  )
}
