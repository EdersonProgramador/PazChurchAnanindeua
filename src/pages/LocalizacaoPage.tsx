import { ExternalLink, MapPin, Navigation } from 'lucide-react'
import { PageTitle } from '../components/site/PageTitle'
import { SiteSection } from '../components/site/SiteSection'
import { CHURCH } from '../data/churchContent'

const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(CHURCH.mapsQuery)}&output=embed`
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CHURCH.mapsQuery)}`
const osmLink = `https://www.openstreetmap.org/?mlat=${CHURCH.mapLat}&mlon=${CHURCH.mapLng}#map=17/${CHURCH.mapLat}/${CHURCH.mapLng}`

export function LocalizacaoPage() {
  return (
    <>
      <PageTitle
        title="Localização"
        subtitle="Paz Church Metrópole — Ananindeua/PA"
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Sobre', to: '/paz-church' },
          { label: 'Localização' },
        ]}
      />
      <SiteSection wide className="pb-0">
        <div className="relative aspect-[21/9] min-h-[280px] w-full overflow-hidden bg-slate-200 md:min-h-[360px]">
          <iframe
            title="Mapa — Paz Church Ananindeua"
            src={embedSrc}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </SiteSection>
      <SiteSection>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4 text-sm text-paz-navy">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-paz-accent" />
              <span>
                <strong>{CHURCH.locale}</strong>
                <br />
                {CHURCH.address}
                <br />
                {CHURCH.city} — {CHURCH.state}
                <br />
                CEP {CHURCH.cep}
              </span>
            </p>
            <ul className="list-inside list-disc text-paz-muted">
              {CHURCH.hours.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-center gap-3">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary flex items-center justify-center gap-2 py-3"
            >
              <Navigation className="h-4 w-4" />
              Como chegar (Google Maps)
            </a>
            <a
              href={osmLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-3 text-sm font-semibold text-paz-navy hover:bg-slate-50"
            >
              <ExternalLink className="h-4 w-4" />
              Abrir no OpenStreetMap
            </a>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-paz-muted">
          Referência oficial:{' '}
          <a href={CHURCH.site} className="text-paz-accent hover:underline" target="_blank" rel="noreferrer">
            paz.church — Metrópole Ananindeua
          </a>
        </p>
      </SiteSection>
    </>
  )
}
