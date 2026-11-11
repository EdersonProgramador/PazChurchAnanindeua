import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, MapPin } from 'lucide-react'
import { ScreenHeader } from '../components/ScreenHeader'
import { api, type FeedPost, type HomeSummary } from '../integrations/apiClient'

export function HomePage() {
  const [summary, setSummary] = useState<HomeSummary | null>(null)
  const [banners, setBanners] = useState<FeedPost[]>([])

  useEffect(() => {
    api.homeSummary().then(setSummary).catch(console.error)
    api.feed().then((r) => setBanners(r.posts.slice(0, 2))).catch(console.error)
  }, [])

  return (
    <>
      <ScreenHeader title="Paz Church Belém" />
      <div className="paz-screen-enter bg-gradient-to-b from-paz-navy to-paz-blue px-4 py-6 text-center text-white">
        <img
          src="/image-12a4bb2c-a74f-4587-aacb-ba96ca812599.jpg"
          alt=""
          className="mx-auto mb-3 h-24 w-full max-w-sm rounded-lg object-cover opacity-90"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
        <p className="text-xs uppercase tracking-widest text-white/70">Da Amazônia para o mundo</p>
        <h2 className="text-lg font-bold">Metrópole Ananindeua · Região Belém</h2>
      </div>

      <section className="border-b bg-white p-4">
        <h3 className="text-xs font-bold uppercase text-paz-muted">Próxima reunião</h3>
        {summary?.nextMeeting ? (
          <Link to="/programacao" className="mt-1 flex items-center justify-between">
            <div>
              <p className="font-semibold text-paz-navy">{summary.nextMeeting.title}</p>
              <p className="text-xs text-paz-muted">
                {new Date(summary.nextMeeting.startsAt).toLocaleString('pt-BR')}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-paz-muted" />
          </Link>
        ) : (
          <p className="mt-1 text-sm text-paz-muted">Sem eventos no momento</p>
        )}
      </section>

      <section className="border-b bg-white p-4">
        <p className="text-xs font-bold uppercase text-paz-accent">Palavra recente</p>
        <p className="text-lg font-bold text-paz-navy">{summary?.recentSermon?.title ?? '—'}</p>
        <p className="text-xs text-paz-muted">{summary?.recentSermon?.category ?? 'Cultos'}</p>
      </section>

      <section className="border-b bg-white p-4">
        <h3 className="text-xs font-bold uppercase text-paz-muted">Próximo evento</h3>
        <p className="text-sm text-paz-navy">{summary?.nextMeeting?.title ?? 'Sem eventos'}</p>
      </section>

      <section className="border-b bg-slate-50 p-4">
        <h3 className="text-xs font-bold uppercase text-paz-muted">Liderança</h3>
        <p className="font-semibold text-paz-navy">{summary?.leadership?.title ?? 'Mensagem de liderança em breve'}</p>
        {summary?.leadership?.publishedAt && (
          <p className="text-xs text-paz-muted">
            {new Date(summary.leadership.publishedAt).toLocaleDateString('pt-BR')}
          </p>
        )}
      </section>

      <section className="space-y-3 bg-white p-4">
        <h3 className="text-sm font-bold text-paz-navy">Nossos horários</h3>
        <p className="text-sm text-paz-muted">Você e sua família são nossos convidados especiais!</p>
        {summary?.locations.map((loc) => (
          <motionBlock key={loc.id} loc={loc} />
        ))}
      </section>

      <section className="space-y-3 p-3">
        {banners.map((post) => (
          <article key={post.id} className="paz-card overflow-hidden">
            <div className="bg-paz-navy p-3 text-white">
              <p className="text-xs uppercase opacity-70">{post.series}</p>
              <h2 className="font-bold">{post.title}</h2>
            </div>
          </article>
        ))}
      </section>
    </>
  )
}

function motionBlock({ loc }: { loc: { name: string; address: string; city: string; schedule?: string | null } }) {
  return (
    <div className="rounded-lg border border-slate-100 p-3 text-sm">
      <p className="font-semibold text-paz-navy">{loc.name}</p>
      <p className="mt-1 flex items-start gap-1 text-paz-muted">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
        {loc.address} — {loc.city}
      </p>
      {loc.schedule && <p className="mt-1 text-paz-accent">{loc.schedule}</p>}
    </div>
  )
}
