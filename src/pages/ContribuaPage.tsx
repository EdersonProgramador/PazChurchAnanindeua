import { PageTitle } from '../components/site/PageTitle'
import { SiteSection } from '../components/site/SiteSection'
import { CHURCH } from '../data/churchContent'

export function ContribuaPage() {
  return (
    <>
      <PageTitle
        title="Contribua"
        subtitle="Sua generosidade sustenta a missão em Ananindeua e na região metropolitana de Belém."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Contribua' }]}
      />
      <SiteSection>
        <div className="prose-paz mx-auto max-w-2xl space-y-6">
          <p>
            Como em toda a família Paz Church, convidamos você a contribuir com fidelidade e alegria. Entre em contato
            com a secretaria da {CHURCH.name} para informações de Pix, transferência e doação online.
          </p>
          <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-paz-navy">Unidade Ananindeua</h2>
            <p className="mt-2 text-sm text-paz-muted">
              {CHURCH.address}
              <br />
              {CHURCH.city} — {CHURCH.state} · CEP {CHURCH.cep}
            </p>
          </div>
          <p className="text-sm italic text-paz-muted">
            “Deus ama quem dá com alegria.” — 2 Coríntios 9:7
          </p>
        </div>
      </SiteSection>
    </>
  )
}
