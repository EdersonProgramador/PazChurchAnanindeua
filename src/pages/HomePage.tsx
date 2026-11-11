import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, ChevronRight, Mic2, Users } from 'lucide-react'
import { SiteSection } from '../components/site/SiteSection'
import { CHURCH } from '../data/churchContent'
import { api, type FeedPost, type HomeSummary } from '../integrations/apiClient'

export function HomePage() {
  const [summary, setSummary] = useState<HomeSummary | null>(null)
  const [banners, setBanners] = useState<FeedPost[]>([])

  useEffect(() => {
    api.homeSummary().then(setSummary).catch(console.error)
    api.feed().then((r) => setBanners(r.posts)).catch(console.error)
  }, [])

  return (
    <>
      <section className="relative overflow-hidden bg-paz-navy text-white">
        <img
          src="/image-12a4bb2c-a74f-4587-aacb-ba96ca812599.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
        <div className="relative site-container flex min-h-[280px] flex-col justify-center py-16 md:min-h-[360px] md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">{CHURCH.tagline}</p>
          <h1 className="mt-2 max-w-2xl text-3xl font-bold leading-tight md:text-5xl">{CHURCH.name}</h1>
          <p className="mt-4 max-w-xl text-sm text-white/85 md:text-base">{CHURCH.locale} — convidamos você e sua família.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/agenda" className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-paz-navy">
              Agenda completa
            </Link>
            <Link to="/life-groups/inscricao" className="rounded-lg border border-white/40 px-5 py-2.5 text-sm font-semibold text-white">
              Life Groups
            </Link>
          </div>
        </div>
      </section>

      <SiteSection className="bg-white">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <HomeCard
            label="Próxima reunião"
            icon={Calendar}
            to="/agenda"
            main={summary?.nextMeeting?.title ?? 'Sem eventos'}
            sub={
              summary?.nextMeeting
                ? new Date(summary.nextMeeting.startsAt).toLocaleString('pt-BR')
                : 'Confira a programação'
            }
          />
          <HomeCard
            label="Palavra recente"
            icon={Mic2}
            to="/mensagens"
            main={summary?.recentSermon?.title ?? 'Em breve'}
            sub={summary?.recentSermon?.category ?? 'Cultos'}
            accent
          />
          <HomeCard
            label="Próximo evento"
            icon={Calendar}
            to="/agenda"
            main={summary?.nextMeeting?.title ?? 'Sem eventos'}
            sub={summary?.nextMeeting?.recurring ?? ''}
          />
          <HomeCard
            label="Liderança"
            icon={Users}
            to="/mensagens?cat=Liderança"
            main={summary?.leadership?.title ?? 'Mensagem de liderança'}
            sub={
              summary?.leadership?.publishedAt
                ? new Date(summary.leadership.publishedAt).toLocaleDateString('pt-BR')
                : ''
            }
          />
        </div>
      </SiteSection>

      {banners.length > 0 && (
        <SiteSection className="bg-slate-50">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {banners.map((post) => (
              <article key={post.id} className="paz-screen-enter group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200/80">
                {post.imageUrl && (
                  <img src={post.imageUrl} alt="" className="h-40 w-full object-cover transition group-hover:scale-[1.02]" />
                )}
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-paz-accent">{post.series}</p>
                  <h2 className="mt-1 text-lg font-bold text-paz-navy">{post.title}</h2>
                  {post.subtitle && <p className="mt-1 text-sm text-paz-muted">{post.subtitle}</p>}
                </div>
              </article>
            ))}
          </div>
        </SiteSection>
      )}

      <SiteSection className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-paz-navy md:text-3xl">Nossos horários</h2>
          <p className="mt-2 text-paz-muted">Você e sua família são nossos convidados especiais!</p>
        </div>
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
          {(summary?.locations ?? []).map((loc) => (
            <div key={loc.id} className="rounded-xl border border-slate-100 bg-paz-light p-6 text-left">
              <h3 className="font-bold text-paz-navy">{loc.name}</h3>
              <p className="mt-2 text-sm text-paz-muted">
                {loc.address} — {loc.city}
              </p>
              {loc.schedule && <p className="mt-3 text-sm font-medium text-paz-accent">{loc.schedule}</p>}
            </div>
          ))}
          {(!summary?.locations || summary.locations.length === 0) && (
            <motionHours />
          )}
        </div>
        <p className="mt-8 text-center">
          <Link to="/paz-church/localizacao" className="text-sm font-semibold text-paz-accent hover:underline">
            Ver localização e mapa
          </Link>
        </p>
      </SiteSection>
    </>
  )
}

function HomeCard({
  label,
  icon: Icon,
  to,
  main,
  sub,
  accent,
}: {
  label: string
  icon: typeof Calendar
  to: string
  main: string
  sub?: string
  accent?: boolean
}) {
  return (
    <Link
      to={to}
      className="paz-screen-enter flex min-h-[140px] flex-col justify-between rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-paz-accent/30 hover:shadow-md"
    >
      <div>
        <div className="flex items-center justify-between gap-2">
          <p className={`text-xs font-bold uppercase tracking-wide ${accent ? 'text-paz-accent' : 'text-paz-muted'}`}>{label}</p>
          <Icon className="h-4 w-4 text-paz-muted" />
        </div>
        <p className="mt-3 line-clamp-2 text-base font-semibold text-paz-navy">{main}</p>
        {sub && <p className="mt-1 line-clamp-2 text-xs text-paz-muted">{sub}</p>}
      </div>
      <ChevronRight className="mt-3 h-4 w-4 self-end text-paz-muted" />
    </Link>
  )
}

function motionHours() {
  return (
    <div className="rounded-xl border border-slate-100 bg-paz-light p-6 md:col-span-2">
      <h3 className="font-bold text-paz-navy">Paz Church Metrópole — Ananindeua</h3>
      <ul className="mt-2 list-inside list-disc text-sm text-paz-muted">
        {CHURCH.hours.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
      <p className="mt-2 text-sm text-paz-muted">
        {CHURCH.address}, {CHURCH.city} — {CHURCH.state}
      </p>
    </div>
  )
}
