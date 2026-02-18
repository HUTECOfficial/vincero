import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getStripePriceId } from '@/lib/stripe-products'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, customerInfo } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      )
    }

    // Build line items for Stripe Checkout
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    for (const item of items) {
      // Use stripe_price_id from CMS product if available, otherwise fall back to static mapping
      const priceId = item.stripe_price_id || getStripePriceId(item.id)
      
      if (!priceId) {
        return NextResponse.json(
          { error: `Product ${item.id} not found in Stripe. Please add a Stripe Price ID in the CMS.` },
          { status: 400 }
        )
      }

      lineItems.push({
        price: priceId,
        quantity: item.quantity,
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
          maximum: 10,
        },
      })
    }

    // Create metadata with order details
    const orderDetails = items.map((item: any) => ({
      id: item.id,
      name: item.name,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
    }))

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
      locale: 'es',
      shipping_address_collection: {
        allowed_countries: ['MX'],
      },
      phone_number_collection: {
        enabled: true,
      },
      billing_address_collection: 'required',
      metadata: {
        order_items: JSON.stringify(orderDetails),
        customer_name: customerInfo?.name || '',
        customer_phone: customerInfo?.phone || '',
        customer_email: customerInfo?.email || '',
      },
      custom_text: {
        shipping_address: {
          message: 'Por favor ingresa tu dirección de envío completa para recibir tus tenis VINCERO.',
        },
        submit: {
          message: 'Tu pedido será procesado y enviado en 3-5 días hábiles.',
        },
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Error creating checkout session' },
      { status: 500 }
    )
  }
}
