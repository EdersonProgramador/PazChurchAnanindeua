import { FormEvent, useState } from 'react'
import { ScreenHeader } from '../components/ScreenHeader'
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
      <ScreenHeader title="Life Groups" />
      <motionImg />
      <div className="space-y-4 bg-white p-4">
        <div className="paz-screen-enter text-sm leading-relaxed text-paz-navy">
          <h2 className="text-lg font-bold">Life Groups</h2>
          <p className="mt-2 text-paz-muted">
            O Life Group é a Igreja no Lar: amizades, estudo da Palavra e oração. Temos grupos para todas as idades.
          </p>
          <p className="mt-2">
            Se você mora em <strong>Ananindeua, Belém ou região</strong>, preencha o formulário e recomendaremos um
            grupo para o seu perfil.
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
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
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-paz-navy py-3 font-semibold text-white disabled:opacity-60"
          >
            {loading ? 'Enviando…' : 'Quero participar'}
          </button>
        </form>
      </div>
    </>
  )
}

function motionImg() {
  return (
    <img
      src="/image-bd41641a-23fd-4733-b099-8d9de240aa9b.png"
      alt=""
      className="paz-screen-enter h-36 w-full object-cover"
      onError={(e) => {
        e.currentTarget.style.display = 'none'
      }}
    />
  )
}
