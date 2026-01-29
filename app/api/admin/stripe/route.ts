import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'
    const limit = parseInt(searchParams.get('limit') || '100')

    let data: any = {}

    // Fetch payment intents (orders/payments)
    if (type === 'all' || type === 'payments') {
      const paymentIntents = await stripe.paymentIntents.list({
        limit,
        expand: ['data.customer', 'data.charges.data'],
      })
      data.payments = paymentIntents.data.map(pi => ({
        id: pi.id,
        amount: pi.amount,
        currency: pi.currency,
        status: pi.status,
        created: new Date(pi.created * 1000).toISOString(),
        customer_email: pi.receipt_email || (pi.customer as Stripe.Customer)?.email || null,
        customer_name: (pi.customer as Stripe.Customer)?.name || pi.metadata?.customer_name || null,
        metadata: pi.metadata,
        description: pi.description,
        shipping: pi.shipping,
      }))
    }

    // Fetch checkout sessions (only paid/completed orders)
    if (type === 'all' || type === 'sessions') {
      const sessions = await stripe.checkout.sessions.list({
        limit,
        status: 'complete',
        expand: ['data.line_items', 'data.customer', 'data.payment_intent'],
      })
      data.sessions = sessions.data.map(session => ({
        id: session.id,
        amount_total: session.amount_total,
        currency: session.currency,
        status: session.status,
        payment_status: session.payment_status,
        created: new Date(session.created * 1000).toISOString(),
        customer_email: session.customer_email || session.customer_details?.email,
        customer_name: session.customer_details?.name,
        customer_phone: session.customer_details?.phone,
        shipping_address: (session as any).shipping_details?.address || session.shipping_options,
        shipping_name: (session as any).shipping_details?.name || session.customer_details?.name,
        metadata: session.metadata,
        line_items: session.line_items?.data.map(item => ({
          description: item.description,
          quantity: item.quantity,
          amount_total: item.amount_total,
        })),
      }))
    }

    // Fetch products
    if (type === 'all' || type === 'products') {
      const products = await stripe.products.list({
        limit,
        active: true,
        expand: ['data.default_price'],
      })
      data.products = products.data.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        active: product.active,
        images: product.images,
        metadata: product.metadata,
        price: (product.default_price as Stripe.Price)?.unit_amount,
        currency: (product.default_price as Stripe.Price)?.currency,
        created: new Date(product.created * 1000).toISOString(),
      }))
    }

    // Fetch charges (for refunds and disputes info)
    if (type === 'all' || type === 'charges') {
      const charges = await stripe.charges.list({
        limit,
      })
      data.charges = charges.data.map(charge => ({
        id: charge.id,
        amount: charge.amount,
        amount_refunded: charge.amount_refunded,
        currency: charge.currency,
        status: charge.status,
        paid: charge.paid,
        refunded: charge.refunded,
        disputed: charge.disputed,
        created: new Date(charge.created * 1000).toISOString(),
        receipt_email: charge.receipt_email,
        receipt_url: charge.receipt_url,
        billing_details: charge.billing_details,
        shipping: charge.shipping,
      }))
    }

    // Fetch balance
    if (type === 'all' || type === 'balance') {
      const balance = await stripe.balance.retrieve()
      data.balance = {
        available: balance.available.map(b => ({
          amount: b.amount,
          currency: b.currency,
        })),
        pending: balance.pending.map(b => ({
          amount: b.amount,
          currency: b.currency,
        })),
      }
    }

    // Calculate summary stats
    if (type === 'all') {
      const successfulPayments = data.payments?.filter((p: any) => p.status === 'succeeded') || []
      const totalRevenue = successfulPayments.reduce((sum: number, p: any) => sum + p.amount, 0)
      const completedSessions = data.sessions?.filter((s: any) => s.payment_status === 'paid') || []
      
      data.summary = {
        totalRevenue: totalRevenue / 100, // Convert from cents
        totalOrders: completedSessions.length,
        totalProducts: data.products?.length || 0,
        averageOrderValue: completedSessions.length > 0 
          ? (completedSessions.reduce((sum: number, s: any) => sum + (s.amount_total || 0), 0) / completedSessions.length) / 100
          : 0,
        pendingPayments: data.payments?.filter((p: any) => p.status === 'requires_payment_method' || p.status === 'requires_confirmation').length || 0,
        refundedAmount: data.charges?.reduce((sum: number, c: any) => sum + c.amount_refunded, 0) / 100 || 0,
      }
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Stripe API error:', error)
    return NextResponse.json(
      { error: error.message || 'Error fetching Stripe data' },
      { status: 500 }
    )
  }
}
