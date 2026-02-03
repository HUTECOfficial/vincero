import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')

  if (error) {
    console.error('Auth callback error:', error, error_description)
    return NextResponse.redirect(
      `${requestUrl.origin}/?error=${encodeURIComponent(error_description || error)}`
    )
  }

  if (token_hash && type) {
    const redirectTo = requestUrl.searchParams.get('next') ?? '/auth/confirmed'
    return NextResponse.redirect(`${requestUrl.origin}${redirectTo}`)
  }

  return NextResponse.redirect(requestUrl.origin)
}
