import { Search, X } from 'lucide-react'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { searchSite, type SearchEntry } from '../../data/searchIndex'

export function SiteSearch() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [results, setResults] = useState<SearchEntry[]>([])
  const wrapRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    setResults(searchSite(q))
  }, [q])

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!q.trim()) return
    navigate(`/busca?q=${encodeURIComponent(q.trim())}`)
    setOpen(false)
  }

  return (
    <div ref={wrapRef} className="relative hidden md:block">
      <form onSubmit={onSubmit} className="flex items-center">
        <label className="sr-only" htmlFor="site-search">
          Procurar
        </label>
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-paz-muted" aria-hidden />
        <input
          id="site-search"
          type="search"
          placeholder="Procurar…"
          value={q}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQ(e.target.value)
            setOpen(true)
          }}
          className="w-40 rounded-full border border-slate-200 py-2 pl-9 pr-8 text-sm text-paz-navy transition focus:w-52 focus:border-paz-accent focus:outline-none lg:w-48 lg:focus:w-64"
        />
        {q && (
          <button
            type="button"
            className="absolute right-2 rounded p-0.5 text-paz-muted hover:text-paz-navy"
            onClick={() => setQ('')}
            aria-label="Limpar"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>
      {open && q.trim() && (
        <div className="absolute right-0 top-full z-50 mt-2 max-h-80 w-72 overflow-y-auto rounded-xl border border-slate-100 bg-white py-2 shadow-xl">
          {results.length === 0 ? (
            <p className="px-4 py-2 text-sm text-paz-muted">Nenhum resultado.</p>
          ) : (
            results.map((r) =>
              r.external ? (
                <a
                  key={r.to}
                  href={r.to}
                  target="_blank"
                  rel="noreferrer"
                  className="block px-4 py-2 text-sm text-paz-navy hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                >
                  {r.title}
                </a>
              ) : (
                <Link
                  key={r.to}
                  to={r.to}
                  className="block px-4 py-2 text-sm text-paz-navy hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                >
                  {r.title}
                </Link>
              ),
            )
          )}
          <Link
            to={`/busca?q=${encodeURIComponent(q.trim())}`}
            className="block border-t px-4 py-2 text-xs font-semibold text-paz-accent"
            onClick={() => setOpen(false)}
          >
            Ver todos os resultados
          </Link>
        </div>
      )}
    </div>
  )
}

