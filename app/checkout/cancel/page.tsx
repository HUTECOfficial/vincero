'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, ShoppingCart, Home, MessageCircle } from 'lucide-react'

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-background flex items-center justify-center p-4">
      <Card className="max-w-lg w-full p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-red-600 mb-2">Pago Cancelado</h1>
          <p className="text-muted-foreground">
            Tu pedido no fue procesado. No se realizó ningún cargo.
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 mb-8">
          <p className="text-sm text-muted-foreground">
            Si tuviste algún problema durante el proceso de pago o tienes preguntas, 
            no dudes en contactarnos por WhatsApp.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Ir al inicio
            </Button>
          </Link>
          <Link href="/catalog" className="flex-1">
            <Button className="w-full">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Volver a la tienda
            </Button>
          </Link>
        </div>

        <Button
          variant="ghost"
          className="w-full text-green-600 hover:text-green-700 hover:bg-green-50"
          onClick={() => window.open('https://wa.me/5214772943124', '_blank')}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Contactar por WhatsApp
        </Button>
      </Card>
    </div>
  )
}
