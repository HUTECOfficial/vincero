import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID required' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === 'paid') {
      return NextResponse.json({
        success: true,
        order: {
          customerEmail: session.customer_details?.email,
          customerName: session.customer_details?.name,
          amountTotal: session.amount_total,
          currency: session.currency,
        },
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Payment not completed',
    })
  } catch (error: any) {
    console.error('Verify session error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
