'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

export default function ConfirmedPage() {
  const router = useRouter()
  const [isVerifying, setIsVerifying] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          throw sessionError
        }

        if (!session) {
          setError('No se pudo verificar la sesión')
          setIsVerifying(false)
          return
        }

        setIsVerifying(false)
        
        setTimeout(() => {
          router.push('/')
        }, 3000)
      } catch (err: any) {
        console.error('Error verifying email:', err)
        setError(err.message || 'Error al verificar el email')
        setIsVerifying(false)
      }
    }

    verifyEmail()
  }, [router])

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <Loader2 className="w-16 h-16 mx-auto mb-4 text-amber-600 animate-spin" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verificando tu cuenta...
          </h1>
          <p className="text-gray-600">
            Por favor espera un momento
          </p>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Error al verificar
          </h1>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <Button 
            onClick={() => router.push('/')}
            className="w-full bg-amber-600 hover:bg-amber-700"
          >
            Volver al inicio
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-amber-50 p-4">
      <Card className="w-full max-w-md p-8 text-center">
        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          ¡Cuenta verificada! 🎉
        </h1>
        <p className="text-gray-600 mb-6">
          Tu correo electrónico ha sido confirmado exitosamente. Ya puedes iniciar sesión y disfrutar de todos los beneficios de tu cuenta Vincero.
        </p>
        <div className="space-y-3">
          <Button 
            onClick={() => router.push('/')}
            className="w-full bg-amber-600 hover:bg-amber-700"
          >
            Ir a la tienda
          </Button>
          <p className="text-sm text-gray-500">
            Serás redirigido automáticamente en unos segundos...
          </p>
        </div>
      </Card>
    </div>
  )
}
