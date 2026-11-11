import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, ChevronRight, Mic2, Users } from 'lucide-react'
import { HomeFeedSection } from '../components/site/HomeFeedSection'
import { HomeHeroVideo } from '../components/site/HomeHeroVideo'
import { SiteSection } from '../components/site/SiteSection'
import { CHURCH } from '../data/churchContent'
import { api, type InstagramPost, type HomeSummary } from '../integrations/apiClient'

export function HomePage() {
  const [summary, setSummary] = useState<HomeSummary | null>(null)
  const [instagram, setInstagram] = useState<InstagramPost[]>([])
  const [instagramProfile, setInstagramProfile] = useState('https://www.instagram.com/pazbelempa/')

  useEffect(() => {
    api.homeSummary().then(setSummary).catch(console.error)
    api
      .instagramPazBelem()
      .then((r) => {
        setInstagram(r.posts)
        if (r.profileUrl) setInstagramProfile(r.profileUrl)
      })
      .catch(console.error)
  }, [])

  return (
    <>
      <HomeHeroVideo />

      <SiteSection className="bg-white">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
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

      <SiteSection className="bg-slate-50">
        <HomeFeedSection instagramPosts={instagram} profileUrl={instagramProfile} />
      </SiteSection>

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
          {' · '}
          <Link to="/galeria" className="text-sm font-semibold text-paz-accent hover:underline">
            Galeria de fotos
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
      className="paz-screen-enter flex min-h-[7.5rem] flex-col justify-between rounded-xl border border-slate-100 bg-white p-4 shadow-sm active:border-paz-accent/40 active:bg-slate-50/80 sm:min-h-[140px] sm:p-5 sm:hover:border-paz-accent/30 sm:hover:shadow-md"
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
