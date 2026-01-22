'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageView, trackPageSession } from '@/lib/analytics'

export function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Don't track admin pages
    if (pathname?.startsWith('/admin')) return

    let startTime = Date.now()

    // Track page view
    trackPageView(pathname || '/', document.title)

    // Track time spent when leaving page
    const handleBeforeUnload = () => {
      const timeSpent = (Date.now() - startTime) / 1000
      if (timeSpent > 1) {
        trackPageSession(pathname || '/', timeSpent)
      }
    }

    // Track on visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const timeSpent = (Date.now() - startTime) / 1000
        if (timeSpent > 1) {
          trackPageSession(pathname || '/', timeSpent)
        }
        startTime = Date.now()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [pathname])

  return null
}
