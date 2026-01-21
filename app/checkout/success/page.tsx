'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Package, Truck, Home, ShoppingBag } from 'lucide-react'

interface OrderDetails {
  customerEmail: string
  customerName: string
  amountTotal: number
  currency: string
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/checkout/verify?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrderDetails(data.order)
          }
          setLoading(false)
        })
        .catch(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [sessionId])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-background flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">¡Pago Exitoso!</h1>
          <p className="text-muted-foreground">
            Gracias por tu compra en VINCERO
          </p>
        </div>

        {loading ? (
          <div className="py-8">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-sm text-muted-foreground mt-4">Verificando tu pedido...</p>
          </div>
        ) : orderDetails ? (
          <div className="space-y-4 mb-8">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Confirmación enviada a:</p>
              <p className="font-medium">{orderDetails.customerEmail}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Total pagado:</p>
              <p className="text-2xl font-bold text-primary">
                ${(orderDetails.amountTotal / 100).toFixed(2)} {orderDetails.currency?.toUpperCase()}
              </p>
            </div>
          </div>
        ) : (
          <div className="py-4 mb-8">
            <p className="text-muted-foreground">Tu pedido ha sido procesado correctamente.</p>
          </div>
        )}

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 text-left p-3 bg-blue-50 rounded-lg">
            <Package className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Preparando tu pedido</p>
              <p className="text-xs text-muted-foreground">Recibirás un email cuando esté listo</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-left p-3 bg-amber-50 rounded-lg">
            <Truck className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Envío en 3-5 días hábiles</p>
              <p className="text-xs text-muted-foreground">Te notificaremos cuando se envíe</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Ir al inicio
            </Button>
          </Link>
          <Link href="/catalog" className="flex-1">
            <Button className="w-full">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Seguir comprando
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-background flex items-center justify-center p-4">
        <Card className="max-w-lg w-full p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-sm text-muted-foreground mt-4">Cargando...</p>
        </Card>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
