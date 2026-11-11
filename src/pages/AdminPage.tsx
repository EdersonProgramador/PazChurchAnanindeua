import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { RbacCrudPanel } from '../components/RbacCrudPanel'
import { ScreenHeader } from '../components/ScreenHeader'
import { api } from '../integrations/apiClient'

export function AdminPage() {
  const token = localStorage.getItem('paz_token')
  const [health, setHealth] = useState<Record<string, boolean> | null>(null)

  useEffect(() => {
    if (!token) return
    api.health().then((h) => setHealth(h.services)).catch(console.error)
  }, [token])

  if (!token) return <Navigate to="/login" replace />

  return (
    <>
      <ScreenHeader title="Admin · RBAC" showInfo={false} />
      <div className="space-y-4 p-4">
        <section className="paz-card p-4">
          <h2 className="mb-2 font-semibold">Serviços Neon</h2>
          <ul className="space-y-1 text-sm">
            {health &&
              Object.entries(health).map(([k, v]) => (
                <li key={k} className="flex justify-between">
                  <span className="capitalize">{k}</span>
                  <span className={v ? 'text-emerald-600' : 'text-red-500'}>{v ? 'OK' : '—'}</span>
                </li>
              ))}
          </ul>
        </section>
        <RbacCrudPanel entity="roles" />
        <RbacCrudPanel entity="permissions" />
        <RbacCrudPanel entity="functions" />
        <Link to="/gestao" className="block rounded-lg bg-paz-navy py-3 text-center text-sm font-medium text-white">
          Gestão Igreja / Life Groups
        </Link>
        <Link to="/" className="block text-center text-sm text-paz-accent">
          Voltar ao app
        </Link>
      </div>
    </>
  )
}
