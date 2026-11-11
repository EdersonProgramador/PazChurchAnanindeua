import { FormEvent, useEffect, useState } from 'react'
import { PageTitle } from '../components/site/PageTitle'
import { SiteSection } from '../components/site/SiteSection'
import { api, type Ministry } from '../integrations/apiClient'

export function VolunteerSignupPage() {
  const [ministries, setMinistries] = useState<Ministry[]>([])
  const [ok, setOk] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.ministries().then((r) => setMinistries(r.ministries)).catch(console.error)
  }, [])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOk('')
    const fd = new FormData(e.currentTarget)
    try {
      const res = await api.volunteerSignup({
        fullName: String(fd.get('fullName')),
        email: String(fd.get('email')),
        phone: String(fd.get('phone')),
        ministryId: String(fd.get('ministryId') || '') || undefined,
        message: String(fd.get('message') || ''),
      })
      setOk(res.message)
      e.currentTarget.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageTitle
        title="Seja um voluntário"
        subtitle="Atmosfera, Paz Kids, Amor em Ação, Mídia, Recepção e mais."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Voluntários' }]}
      />
      <SiteSection>
        <form onSubmit={onSubmit} className="mx-auto max-w-lg space-y-3">
          <input name="fullName" required placeholder="Nome completo" className="field" />
          <input name="email" type="email" required placeholder="Email" className="field" />
          <input name="phone" required placeholder="WhatsApp" className="field" />
          <select name="ministryId" className="field" defaultValue="">
            <option value="">Escolha um ministério</option>
            {ministries.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <textarea name="message" placeholder="Por que quer servir?" className="field min-h-24" />
          {ok && <p className="text-sm text-emerald-700">{ok}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Enviando…' : 'Quero servir'}
          </button>
        </form>
      </SiteSection>
    </>
  )
}
