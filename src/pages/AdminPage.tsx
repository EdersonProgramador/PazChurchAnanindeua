import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { RbacCrudPanel } from '../components/RbacCrudPanel'
import { PageTitle } from '../components/site/PageTitle'
import { SiteSection } from '../components/site/SiteSection'
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
      <PageTitle title="Administração · RBAC" subtitle="Cargos, permissões e funções do sistema." />
      <SiteSection>
        <section className="paz-card mb-6 p-4">
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
        <div className="h-4" />
        <RbacCrudPanel entity="permissions" />
        <div className="h-4" />
        <RbacCrudPanel entity="functions" />
        <Link to="/gestao" className="btn-primary mt-8 block py-3 text-center">
          Gestão Igreja / Life Groups
        </Link>
      </SiteSection>
    </>
  )
}
