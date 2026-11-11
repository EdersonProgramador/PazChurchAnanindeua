import { Link, useSearchParams } from 'react-router-dom'
import { PageTitle } from '../components/site/PageTitle'
import { SiteSection } from '../components/site/SiteSection'
import { searchSite } from '../data/searchIndex'

export function BuscaPage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const results = searchSite(q, 50)

  return (
    <>
      <PageTitle title="Busca" subtitle={q ? `Resultados para “${q}”` : 'Digite um termo para procurar no site.'} />
      <SiteSection>
        <form
          className="mx-auto mb-8 flex max-w-xl gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget)
            const term = String(fd.get('q') || '')
            setParams(term ? { q: term } : {})
          }}
        >
          <input name="q" defaultValue={q} placeholder="Procurar…" className="field flex-1" />
          <button type="submit" className="btn-primary shrink-0 px-6">
            Buscar
          </button>
        </form>
        <ul className="mx-auto max-w-xl divide-y rounded-xl border bg-white">
          {results.map((r) => (
            <li key={r.to + r.title}>
              {r.external ? (
                <a href={r.to} target="_blank" rel="noreferrer" className="block p-4 font-medium text-paz-navy hover:bg-slate-50">
                  {r.title}
                </a>
              ) : (
                <Link to={r.to} className="block p-4 font-medium text-paz-navy hover:bg-slate-50">
                  {r.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
        {q && results.length === 0 && (
          <p className="text-center text-paz-muted">Tente “agenda”, “life group” ou “localização”.</p>
        )}
      </SiteSection>
    </>
  )
}
