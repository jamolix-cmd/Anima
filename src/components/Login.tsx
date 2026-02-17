import React, { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useCompanySettings } from '../hooks'
import { LogIn, User, Lock } from 'lucide-react'
import logoGamebox from '../assets/logo-gamebox.png'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const { settings, loading: settingsLoading } = useCompanySettings()

  // Estado para forzar actualización del logo
  const [logoKey, setLogoKey] = useState(Date.now())

  // IMPORTANTE: Solo usar logo de BD cuando esté cargado (evita flash del logo hardcodeado)
  const displayLogo = useMemo(() => {
    // Si está cargando Y no hay settings, mostrar logo temporal
    if (settingsLoading && !settings) {
      return logoGamebox
    }
    // Una vez cargado, usar SOLO el logo de la BD (o hardcodeado si BD no tiene)
    return settings?.logo_url || logoGamebox
  }, [settings?.logo_url, settingsLoading, settings])
  
  const companyName = settings?.company_name || 'GameBox Service'
  
  // Agregar timestamp dinámico para evitar cache del navegador
  const logoWithCacheBust = displayLogo.includes('supabase') 
    ? `${displayLogo.split('?')[0]}?t=${logoKey}` 
    : displayLogo

  // Actualizar logo cuando cambie settings.logo_url
  useEffect(() => {
    if (settings?.logo_url) {
      setLogoKey(Date.now())
      console.log('🔄 Logo de BD cargado en Login:', settings.logo_url)
    }
  }, [settings?.logo_url])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Por favor ingresa email y contraseña')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error } = await signIn(email, password)
      
      if (error) {
        console.error('❌ Error de login:', error)
        setError(`Error: ${error.message || 'Credenciales inválidas'}`)
      }
    } catch (err) {
      console.error('❌ Error inesperado:', err)
      setError('Error de conexión. Verifica tu configuración.')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-lg border-0">
              <div className="card-body p-3 p-sm-4 p-md-5">
                <div className="text-center mb-3 mb-md-4">
                  <div className="d-flex justify-content-center align-items-center mb-3">
                    <img 
                      src={logoWithCacheBust} 
                      alt={companyName} 
                      className="img-fluid"
                      style={{ 
                        width: '200px', 
                        height: '80px', 
                        objectFit: 'contain' 
                      }}
                    />
                  </div>
                  <p className="text-muted mb-0">Sistema de Gestión de Taller</p>
                </div>

                {/* Login form */}
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      <User size={16} className="me-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      <Lock size={16} className="me-2" />
                      Contraseña
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Tu contraseña"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Iniciando sesión...
                      </>
                    ) : (
                      <>
                        <LogIn size={16} className="me-2" />
                        Iniciar Sesión
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login