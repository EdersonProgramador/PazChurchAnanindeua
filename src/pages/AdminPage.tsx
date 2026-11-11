import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ScreenHeader } from '../components/ScreenHeader'
import { api } from '../integrations/apiClient'

export function AdminPage() {
  const token = localStorage.getItem('paz_token')
  const [health, setHealth] = useState<Record<string, boolean> | null>(null)
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    if (!token) return
    api.health().then((h) => setHealth(h.services)).catch(console.error)
    Promise.all([
      api.adminList('roles'),
      api.adminList('permissions'),
      api.adminList('functions'),
    ]).then(([r, p, f]) => {
      setCounts({
        roles: r.items.length,
        permissions: p.items.length,
        functions: f.items.length,
      })
    })
  }, [token])

  if (!token) return <Navigate to="/login" replace />

  return (
    <>
      <ScreenHeader title="Admin · RBAC" showInfo={false} />
      <motion />
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
        <section className="paz-card p-4">
          <h2 className="mb-2 font-semibold">CRUD · Cargos, permissões e funções</h2>
          <dl className="grid grid-cols-3 gap-2 text-center text-sm">
            <div>
              <dt className="text-paz-muted">Cargos</dt>
              <dd className="text-2xl font-bold">{counts.roles ?? '…'}</dd>
            </div>
            <div>
              <dt className="text-paz-muted">Permissões</dt>
              <dd className="text-2xl font-bold">{counts.permissions ?? '…'}</dd>
            </div>
            <div>
              <dt className="text-paz-muted">Funções</dt>
              <dd className="text-2xl font-bold">{counts.functions ?? '…'}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-paz-muted">
            API REST em <code className="rounded bg-slate-100 px-1">/api/v1/admin/*</code> — use o token JWT após login.
          </p>
        </section>
        <Link to="/" className="block text-center text-sm text-paz-accent">
          Voltar ao app
        </Link>
      </div>
    </>
  )
}

function motion() {
  return null
}
