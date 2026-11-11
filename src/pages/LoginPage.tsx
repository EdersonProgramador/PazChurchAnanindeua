import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CHURCH } from '../data/churchContent'
import { api } from '../integrations/apiClient'

export function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const fd = new FormData(e.currentTarget)
    try {
      const { token, user } = await api.login(String(fd.get('email')), String(fd.get('password')))
      localStorage.setItem('paz_token', token)
      localStorage.setItem('paz_user', JSON.stringify(user))
      navigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-paz-light">
      <header className="border-b bg-white">
        <div className="site-container flex h-16 items-center justify-between">
          <Link to="/" className="text-sm font-semibold text-paz-navy">
            {CHURCH.name}
          </Link>
        </div>
      </header>
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm">
          <img
            src="/logo-pazchurchananindeua-9dc3104f-74c5-44ba-af12-06a3856a8947.png"
            alt=""
            className="mx-auto mb-6 h-16 object-contain"
          />
          <h1 className="text-center text-xl font-semibold text-paz-navy">Acesso administrativo</h1>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <input name="email" type="email" required placeholder="Email" className="field" />
            <input name="password" type="password" required placeholder="Senha" className="field" />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
