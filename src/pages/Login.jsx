import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) setError('Email o contraseña incorrectos.')
    setLoading(false)
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-header">
          <h1 className="login-title">TecaCemil</h1>
          <p className="login-subtitle">Yamil &amp; Celeste</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <label className="form-label">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com" required autoFocus />
            </div>
            <div className="form-row">
              <label className="form-label">Contraseña</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required />
            </div>
            {error && (
              <p style={{ color: 'var(--red)', fontSize: '0.82rem', marginBottom: '0.75rem', fontWeight: 500 }}>
                {error}
              </p>
            )}
            <button type="submit" className="btn btn-primary w-full"
              style={{ justifyContent: 'center', marginTop: '0.25rem' }} disabled={loading}>
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
