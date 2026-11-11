import { FormEvent, useCallback, useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { api, type AdminEntity, type RbacItem } from '../integrations/apiClient'

const labels: Record<AdminEntity, string> = {
  roles: 'Cargos',
  permissions: 'Permissões',
  functions: 'Funções',
}

type Props = { entity: AdminEntity }

export function RbacCrudPanel({ entity }: Props) {
  const [items, setItems] = useState<RbacItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    setLoading(true)
    api
      .adminList(entity)
      .then((r) => setItems(r.items))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [entity])

  useEffect(() => {
    load()
  }, [load])

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('name'))
    const slug = String(fd.get('slug') || name)
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
    const description = String(fd.get('description') || '')
    const body =
      entity === 'permissions'
        ? { name, code: String(fd.get('code') || slug.replace(/-/g, '.')), description }
        : { name, slug, description }
    try {
      await api.adminCreate(entity, body)
      e.currentTarget.reset()
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar')
    }
  }

  async function remove(id: string) {
    if (!window.confirm('Remover este registro?')) return
    try {
      await api.adminDelete(entity, id)
      load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao remover')
    }
  }

  return (
    <section className="paz-card overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50 px-4 py-2">
        <h3 className="font-semibold text-paz-navy">{labels[entity]}</h3>
      </div>
      <form onSubmit={onCreate} className="space-y-2 border-b border-slate-100 p-3">
        <input
          name="name"
          required
          placeholder="Nome"
          className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
        />
        {entity === 'permissions' && (
          <input
            name="code"
            placeholder="Código (ex: feed.read)"
            className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
          />
        )}
        {(entity === 'roles' || entity === 'functions') && (
          <input name="slug" placeholder="Slug (opcional)" className="w-full rounded border border-slate-200 px-3 py-2 text-sm" />
        )}
        <input name="description" placeholder="Descrição" className="w-full rounded border border-slate-200 px-3 py-2 text-sm" />
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded bg-paz-navy py-2 text-sm font-medium text-white"
        >
          <Plus className="h-4 w-4" />
          Adicionar
        </button>
      </form>
      {error && <p className="px-3 py-2 text-xs text-red-600">{error}</p>}
      {loading ? (
        <p className="p-3 text-sm text-paz-muted">Carregando…</p>
      ) : (
        <ul className="max-h-56 divide-y divide-slate-100 overflow-y-auto">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-2 px-3 py-2 text-sm">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{item.name}</p>
                <p className="truncate text-xs text-paz-muted">{item.code ?? item.slug}</p>
              </div>
              <button type="button" onClick={() => remove(item.id)} className="text-red-500" aria-label="Excluir">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
