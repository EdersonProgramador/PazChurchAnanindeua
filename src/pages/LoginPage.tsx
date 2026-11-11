import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center bg-paz-navy p-6 text-white">
      <img
        src="/logo-pazchurchananindeua-9dc3104f-74c5-44ba-af12-06a3856a8947.png"
        alt=""
        className="mx-auto mb-6 h-20 object-contain"
      />
      <h1 className="mb-6 text-center text-xl font-semibold">Acesso administrativo</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full rounded-lg border-0 px-4 py-3 text-paz-navy"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Senha"
          className="w-full rounded-lg border-0 px-4 py-3 text-paz-navy"
        />
        {error && <p className="text-sm text-red-200">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-white py-3 font-semibold text-paz-navy disabled:opacity-60"
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
