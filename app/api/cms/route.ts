import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Server-side client: uses service role key to bypass RLS completely
const getAdminClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qhyuoiyamcxxjsznbiyt.supabase.co'
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function GET(request: NextRequest) {
  const supabase = getAdminClient()
  try {
    const [heroRes, sectionsRes, productsRes, testimonialsRes] = await Promise.all([
      supabase.from('hero_images').select('*').order('position', { ascending: true }),
      supabase.from('cms_sections').select('*'),
      supabase.from('cms_products').select('*').order('position', { ascending: true }),
      supabase.from('cms_testimonials').select('*').order('position', { ascending: true }),
    ])

    return NextResponse.json({
      heroImages: heroRes.data || [],
      sections: sectionsRes.data || [],
      products: productsRes.data || [],
      testimonials: testimonialsRes.data || [],
      errors: {
        hero: heroRes.error?.message,
        sections: sectionsRes.error?.message,
        products: productsRes.error?.message,
        testimonials: testimonialsRes.error?.message,
      }
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = getAdminClient()
  try {
    const body = await request.json()
    const { action, table, id, data } = body

    if (action === 'insert') {
      const { data: result, error } = await supabase.from(table).insert(data).select().single()
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json({ data: result })
    }

    if (action === 'update') {
      const { error } = await supabase.from(table).update(data).eq('id', id)
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json({ success: true })
    }

    if (action === 'delete') {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) return NextResponse.json({ error: error.message }, { status: 400 })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
