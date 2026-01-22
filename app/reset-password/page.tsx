'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if we have a valid session from the reset link
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setError('Enlace de recuperación inválido o expirado')
      }
    })
  }, [])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setSuccess(true)
      
      // Redirect to home after 3 seconds
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } catch (error: any) {
      setError(error.message || 'Error al actualizar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E0E5EC] to-[#F5F5F5] flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">¡Contraseña Actualizada!</h2>
          <p className="text-muted-foreground mb-4">
            Tu contraseña ha sido actualizada exitosamente.
          </p>
          <p className="text-sm text-muted-foreground">
            Redirigiendo a la página principal...
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E0E5EC] to-[#F5F5F5] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#D4AF37' }}>
            VINCERO
          </h1>
          <h2 className="text-xl font-semibold mb-2">Nueva Contraseña</h2>
          <p className="text-sm text-muted-foreground">
            Ingresa tu nueva contraseña para tu cuenta
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Nueva Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border-2 border-border rounded-lg focus:border-primary outline-none transition-colors"
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirmar Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-border rounded-lg focus:border-primary outline-none transition-colors"
                placeholder="Confirma tu contraseña"
                required
                minLength={6}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full py-5 text-base" 
            size="lg"
            disabled={loading}
            style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #F4E4B0 100%)' }}
          >
            {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
          </Button>

          <button
            type="button"
            onClick={() => router.push('/')}
            className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Volver al inicio
          </button>
        </form>
      </Card>
    </div>
  )
}
