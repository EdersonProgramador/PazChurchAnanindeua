import { FormEvent, useEffect, useState } from 'react'
import { ScreenHeader } from '../components/ScreenHeader'
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
      <ScreenHeader title="Voluntários" />
      <div className="space-y-4 bg-white p-4">
        <motionCopy />
        <form onSubmit={onSubmit} className="space-y-3">
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
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-paz-navy py-3 font-semibold text-white disabled:opacity-60"
          >
            {loading ? 'Enviando…' : 'Quero servir'}
          </button>
        </form>
      </div>
    </>
  )
}

function motionCopy() {
  return (
    <div className="paz-screen-enter text-sm leading-relaxed text-paz-navy">
      <h2 className="text-lg font-bold">Seja um voluntário</h2>
      <p className="mt-2 text-paz-muted">
        Servir faz parte da cultura Paz Church — Atmosfera, Paz Kids, Amor em Ação, Recepção, Mídia e mais.
      </p>
    </div>
  )
}

