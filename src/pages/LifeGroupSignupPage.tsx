import { FormEvent, useState } from 'react'
import { PageTitle } from '../components/site/PageTitle'
import { SiteSection } from '../components/site/SiteSection'
import { api } from '../integrations/apiClient'

const AGE_OPTIONS = [
  { value: 'adultos', label: 'Adultos' },
  { value: 'jovens', label: 'Jovens' },
  { value: 'adolescentes', label: 'Adolescentes' },
  { value: 'criancas', label: 'Crianças' },
]

export function LifeGroupSignupPage() {
  const [ok, setOk] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOk('')
    const fd = new FormData(e.currentTarget)
    try {
      const res = await api.lifeGroupSignup({
        fullName: String(fd.get('fullName')),
        email: String(fd.get('email')),
        phone: String(fd.get('phone')),
        city: String(fd.get('city')),
        neighborhood: String(fd.get('neighborhood') || ''),
        ageGroup: String(fd.get('ageGroup')),
        message: String(fd.get('message') || ''),
      })
      setOk(res.message)
      e.currentTarget.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível enviar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageTitle
        title="Inscrição Life Group"
        subtitle="Preencha os campos e recomendaremos um grupo na região de Ananindeua."
        crumbs={[
          { label: 'Home', to: '/' },
          { label: 'Life Groups', to: '/life-groups' },
          { label: 'Inscrição' },
        ]}
      />
      <SiteSection>
        <form onSubmit={onSubmit} className="mx-auto max-w-lg space-y-3">
          <input name="fullName" required placeholder="Nome completo" className="field" />
          <input name="email" type="email" required placeholder="Email" className="field" />
          <input name="phone" required placeholder="Telefone / WhatsApp" className="field" />
          <input name="city" required placeholder="Cidade" className="field" defaultValue="Ananindeua" />
          <input name="neighborhood" placeholder="Bairro" className="field" />
          <select name="ageGroup" required className="field" defaultValue="adultos">
            {AGE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <textarea name="message" placeholder="Mensagem (opcional)" className="field min-h-24" />
          {ok && <p className="text-sm text-emerald-700">{ok}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Enviando…' : 'Enviar inscrição'}
          </button>
        </form>
      </SiteSection>
    </>
  )
}
