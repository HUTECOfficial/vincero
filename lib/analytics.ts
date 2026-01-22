import { supabase } from './supabase'

// Generate or get session ID
const getSessionId = (): string => {
  if (typeof window === 'undefined') return ''
  
  let sessionId = sessionStorage.getItem('analytics_session_id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('analytics_session_id', sessionId)
  }
  return sessionId
}

// Detect device type
const getDeviceType = (): 'mobile' | 'desktop' | 'tablet' => {
  if (typeof window === 'undefined') return 'desktop'
  
  const width = window.innerWidth
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

// Track page view
export const trackPageView = async (pagePath: string, pageTitle?: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    await supabase.from('page_views').insert({
      page_path: pagePath,
      page_title: pageTitle || document.title,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      device_type: getDeviceType(),
      session_id: getSessionId(),
      user_id: user?.id || null
    })
  } catch (error) {
    console.error('Error tracking page view:', error)
  }
}

// Track time spent on page
export const trackPageSession = async (pagePath: string, timeSpent: number) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    await supabase.from('page_sessions').insert({
      page_path: pagePath,
      session_id: getSessionId(),
      time_spent: Math.round(timeSpent),
      user_id: user?.id || null
    })
  } catch (error) {
    console.error('Error tracking page session:', error)
  }
}

// Track custom event
export const trackEvent = async (
  eventName: string,
  eventCategory?: string,
  eventLabel?: string,
  eventValue?: number,
  metadata?: Record<string, any>
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    await supabase.from('analytics_events').insert({
      event_name: eventName,
      event_category: eventCategory || null,
      event_label: eventLabel || null,
      event_value: eventValue || null,
      page_path: window.location.pathname,
      session_id: getSessionId(),
      user_id: user?.id || null,
      metadata: metadata || null
    })
  } catch (error) {
    console.error('Error tracking event:', error)
  }
}

// Track product view
export const trackProductView = async (productId: number, productName: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    await supabase.from('product_views').insert({
      product_id: productId,
      product_name: productName,
      session_id: getSessionId(),
      user_id: user?.id || null
    })
  } catch (error) {
    console.error('Error tracking product view:', error)
  }
}

// Hook to track page session time
export const usePageTracking = (pagePath: string, pageTitle?: string) => {
  if (typeof window === 'undefined') return

  let startTime = Date.now()

  // Track page view on mount
  trackPageView(pagePath, pageTitle)

  // Track time spent on unmount
  const handleBeforeUnload = () => {
    const timeSpent = (Date.now() - startTime) / 1000
    if (timeSpent > 1) { // Only track if spent more than 1 second
      trackPageSession(pagePath, timeSpent)
    }
  }

  window.addEventListener('beforeunload', handleBeforeUnload)

  // Also track on visibility change (when user switches tabs)
  const handleVisibilityChange = () => {
    if (document.hidden) {
      const timeSpent = (Date.now() - startTime) / 1000
      if (timeSpent > 1) {
        trackPageSession(pagePath, timeSpent)
      }
      startTime = Date.now() // Reset timer
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)

  // Cleanup
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }
}

// Helper functions for analytics queries
export const getAnalytics = {
  // Get page views by path
  async getPageViews(startDate?: Date, endDate?: Date) {
    let query = supabase
      .from('page_views')
      .select('*')
      .order('created_at', { ascending: false })

    if (startDate) {
      query = query.gte('created_at', startDate.toISOString())
    }
    if (endDate) {
      query = query.lte('created_at', endDate.toISOString())
    }

    const { data, error } = await query
    return { data, error }
  },

  // Get page views grouped by path
  async getPageViewsByPath(startDate?: Date, endDate?: Date) {
    const { data, error } = await this.getPageViews(startDate, endDate)
    if (error || !data) return { data: [], error }

    const grouped = data.reduce((acc: any, view: any) => {
      if (!acc[view.page_path]) {
        acc[view.page_path] = { page_path: view.page_path, views: 0, sessions: new Set() }
      }
      acc[view.page_path].views++
      if (view.session_id) {
        acc[view.page_path].sessions.add(view.session_id)
      }
      return acc
    }, {})

    return {
      data: Object.values(grouped).map((item: any) => ({
        ...item,
        unique_sessions: item.sessions.size
      })),
      error: null
    }
  },

  // Get average time spent on pages
  async getAverageTimeByPath(startDate?: Date, endDate?: Date) {
    let query = supabase
      .from('page_sessions')
      .select('*')

    if (startDate) {
      query = query.gte('created_at', startDate.toISOString())
    }
    if (endDate) {
      query = query.lte('created_at', endDate.toISOString())
    }

    const { data, error } = await query
    if (error || !data) return { data: [], error }

    const grouped = data.reduce((acc: any, session: any) => {
      if (!acc[session.page_path]) {
        acc[session.page_path] = { page_path: session.page_path, total_time: 0, count: 0 }
      }
      acc[session.page_path].total_time += session.time_spent
      acc[session.page_path].count++
      return acc
    }, {})

    return {
      data: Object.values(grouped).map((item: any) => ({
        page_path: item.page_path,
        avg_time: Math.round(item.total_time / item.count),
        total_sessions: item.count
      })),
      error: null
    }
  },

  // Get device distribution
  async getDeviceStats(startDate?: Date, endDate?: Date) {
    let query = supabase
      .from('page_views')
      .select('device_type')

    if (startDate) {
      query = query.gte('created_at', startDate.toISOString())
    }
    if (endDate) {
      query = query.lte('created_at', endDate.toISOString())
    }

    const { data, error } = await query
    if (error || !data) return { data: { mobile: 0, desktop: 0, tablet: 0 }, error }

    const stats = data.reduce((acc: any, view: any) => {
      acc[view.device_type] = (acc[view.device_type] || 0) + 1
      return acc
    }, { mobile: 0, desktop: 0, tablet: 0 })

    const total = data.length
    return {
      data: {
        mobile: Math.round((stats.mobile / total) * 100),
        desktop: Math.round((stats.desktop / total) * 100),
        tablet: Math.round((stats.tablet / total) * 100)
      },
      error: null
    }
  },

  // Get most viewed products
  async getMostViewedProducts(limit: number = 10) {
    const { data, error } = await supabase
      .from('product_views')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data) return { data: [], error }

    const grouped = data.reduce((acc: any, view: any) => {
      if (!acc[view.product_id]) {
        acc[view.product_id] = {
          product_id: view.product_id,
          product_name: view.product_name,
          views: 0
        }
      }
      acc[view.product_id].views++
      return acc
    }, {})

    const sorted = Object.values(grouped)
      .sort((a: any, b: any) => b.views - a.views)
      .slice(0, limit)

    return { data: sorted, error: null }
  },

  // Get events by category
  async getEventsByCategory(category?: string, startDate?: Date, endDate?: Date) {
    let query = supabase
      .from('analytics_events')
      .select('*')
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('event_category', category)
    }
    if (startDate) {
      query = query.gte('created_at', startDate.toISOString())
    }
    if (endDate) {
      query = query.lte('created_at', endDate.toISOString())
    }

    return await query
  }
}
