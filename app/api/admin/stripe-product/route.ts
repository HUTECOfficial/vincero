import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const productId = searchParams.get('id')

  if (!productId) {
    return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
  }

  try {
    const product = await stripe.products.retrieve(productId, {
      expand: ['default_price'],
    })

    const price = product.default_price as Stripe.Price

    // Also get all prices for this product
    const prices = await stripe.prices.list({ product: productId, active: true })

    return NextResponse.json({
      id: product.id,
      name: product.name,
      description: product.description,
      images: product.images,
      active: product.active,
      metadata: product.metadata,
      default_price: price ? {
        id: price.id,
        unit_amount: price.unit_amount,
        currency: price.currency,
      } : null,
      all_prices: prices.data.map(p => ({
        id: p.id,
        unit_amount: p.unit_amount,
        currency: p.currency,
        nickname: p.nickname,
      })),
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Product not found' },
      { status: 404 }
    )
  }
}
