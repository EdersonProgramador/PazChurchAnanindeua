import { PageTitle } from '../components/site/PageTitle'
import { SiteSection } from '../components/site/SiteSection'
import { CHURCH } from '../data/churchContent'

export function ContatoPage() {
  return (
    <>
      <PageTitle
        title="Contato"
        subtitle="Estamos na Rodovia BR-316 — venha nos visitar ou fale conosco pelas redes."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Contato' }]}
      />
      <SiteSection>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4 text-sm text-paz-navy">
            <p>
              <strong>{CHURCH.name}</strong>
              <br />
              {CHURCH.address}
              <br />
              {CHURCH.city} — {CHURCH.state}
              <br />
              CEP {CHURCH.cep}
            </p>
            <p>
              <a href={CHURCH.facebook} className="font-semibold text-paz-accent hover:underline" target="_blank" rel="noreferrer">
                Facebook — Paz Church Ananindeua
              </a>
            </p>
            <p>
              <a href={CHURCH.site} className="text-paz-accent hover:underline" target="_blank" rel="noreferrer">
                Página oficial na rede Paz Church Belém
              </a>
            </p>
          </div>
          <form className="space-y-3 rounded-xl border bg-white p-6 shadow-sm" onSubmit={(e) => e.preventDefault()}>
            <p className="text-sm font-semibold text-paz-navy">Precisa de oração ou tem uma dúvida?</p>
            <input className="field" placeholder="Seu nome" />
            <input type="email" className="field" placeholder="Email" />
            <textarea className="field min-h-28" placeholder="Mensagem" />
            <button type="submit" className="btn-primary w-full py-3">
              Enviar (em breve integração)
            </button>
          </form>
        </div>
      </SiteSection>
    </>
  )
}
