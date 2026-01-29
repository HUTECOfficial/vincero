'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  Clock, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  LogOut,
  Home,
  Settings,
  Bell,
  Search,
  ChevronRight,
  MapPin,
  Smartphone,
  Monitor,
  Globe,
  Palette,
  Lock,
  Mail,
  EyeOff
} from 'lucide-react'
import CMSEditor from '@/components/admin/CMSEditor'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/AuthContext'
import { useRouter } from 'next/navigation'
import { getAnalytics } from '@/lib/analytics'

interface Order {
  id: string
  customer_name: string
  customer_phone: string
  customer_email: string
  total: number
  status: string
  created_at: string
  shipping_city: string
}

interface OrderItem {
  id: string
  order_id: string
  product_name: string
  product_color: string
  size: string
  quantity: number
  unit_price: number
}

interface DashboardStats {
  totalSales: number
  totalOrders: number
  totalCustomers: number
  averageOrderValue: number
  pendingOrders: number
  completedOrders: number
}

interface PageView {
  page: string
  views: number
  avgTime: string
}

export default function AdminDashboard() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    pendingOrders: 0,
    completedOrders: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'stripe' | 'cms'>('overview')
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('all')
  const [pageViews, setPageViews] = useState<PageView[]>([])
  const [deviceStats, setDeviceStats] = useState({ mobile: 0, desktop: 0, tablet: 0 })
  
  // Stripe data
  const [stripeData, setStripeData] = useState<any>(null)
  const [stripeLoading, setStripeLoading] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  // Admin emails allowed
  const adminEmails = ['vinceroadmin@vincero.com.mx', 'admin@vincero.com', 'vincero@admin.com']

  useEffect(() => {
    if (user && adminEmails.includes(user.email || '')) {
      fetchDashboardData()
      fetchStripeData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (ordersError) throw ordersError

      // Fetch order items
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')

      if (itemsError) throw itemsError

      setOrders(ordersData || [])
      setOrderItems(itemsData || [])

      // Calculate stats
      const totalSales = ordersData?.reduce((sum, order) => sum + order.total, 0) || 0
      const totalOrders = ordersData?.length || 0
      const uniqueCustomers = new Set(ordersData?.map(o => o.customer_phone)).size
      const pendingOrders = ordersData?.filter(o => o.status === 'pending').length || 0
      const completedOrders = ordersData?.filter(o => o.status === 'delivered').length || 0

      setStats({
        totalSales,
        totalOrders,
        totalCustomers: uniqueCustomers,
        averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
        pendingOrders,
        completedOrders
      })

      // Fetch analytics data
      const { data: pageViewsData } = await getAnalytics.getPageViewsByPath()
      const { data: avgTimeData } = await getAnalytics.getAverageTimeByPath()
      const { data: deviceData } = await getAnalytics.getDeviceStats()

      // Process page views with average time
      if (pageViewsData && avgTimeData) {
        const pageViewsWithTime = pageViewsData.map((pv: any) => {
          const timeData = avgTimeData.find((t: any) => t.page_path === pv.page_path)
          const avgSeconds = timeData?.avg_time || 0
          const minutes = Math.floor(avgSeconds / 60)
          const seconds = avgSeconds % 60
          
          return {
            page: pv.page_path === '/' ? 'Inicio (Hero)' : 
                  pv.page_path === '/shop' ? 'Catálogo' : 
                  pv.page_path.includes('product') ? 'Producto Detail' : 
                  pv.page_path,
            views: pv.views,
            avgTime: `${minutes}:${seconds.toString().padStart(2, '0')}`
          }
        }).slice(0, 5)
        
        setPageViews(pageViewsWithTime)
      }

      // Set device stats
      if (deviceData) {
        setDeviceStats(deviceData)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0
    }).format(amount / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente'
      case 'confirmed': return 'Confirmado'
      case 'shipped': return 'Enviado'
      case 'delivered': return 'Entregado'
      case 'cancelled': return 'Cancelado'
      default: return status
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error
      fetchDashboardData()
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const handleSignOut = async () => {
    if (isSigningOut) return
    
    setIsSigningOut(true)
    try {
      await signOut()
      // Force full page reload to clear all state
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
      alert('Error al cerrar sesión. Por favor intenta de nuevo.')
      setIsSigningOut(false)
    }
  }

  const fetchStripeData = async () => {
    setStripeLoading(true)
    try {
      const response = await fetch('/api/admin/stripe')
      if (!response.ok) throw new Error('Error fetching Stripe data')
      const data = await response.json()
      setStripeData(data)
    } catch (error) {
      console.error('Error fetching Stripe data:', error)
    } finally {
      setStripeLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'stripe' && !stripeData) {
      fetchStripeData()
    }
  }, [activeTab])

  // Login states
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword
      })
      
      if (error) throw error
      
      // Check if user is admin after login
      const { data: { user: loggedUser } } = await supabase.auth.getUser()
      if (loggedUser && !adminEmails.includes(loggedUser.email || '')) {
        await supabase.auth.signOut()
        setLoginError('Este correo no tiene permisos de administrador')
      }
    } catch (error: any) {
      setLoginError(error.message || 'Error al iniciar sesión')
    } finally {
      setLoginLoading(false)
    }
  }

  if (!user || !adminEmails.includes(user.email || '')) {
    return (
      <div className="min-h-screen bg-[#E0E5EC] flex items-center justify-center p-4">
        <Card className="p-8 neu-shadow border-0 bg-[#E0E5EC] w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#D4AF37] tracking-wider mb-2">VINCERO</h1>
            <p className="text-gray-500">Panel de Administración</p>
          </div>
          
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                  placeholder="vinceroadmin@vincero.com.mx"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                {loginError}
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loginLoading}
              className="w-full bg-[#D4AF37] hover:bg-[#B8962E] text-white py-3 rounded-xl font-medium"
            >
              {loginLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin mx-auto" />
              ) : (
                'Iniciar Sesión'
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-400 text-center">
              Acceso exclusivo para administradores
            </p>
          </div>
          
          <div className="mt-4 text-center">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/')} 
              className="text-gray-500 hover:text-[#D4AF37]"
            >
              <Home className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#E0E5EC]">
      {/* Header */}
      <header className="bg-[#E0E5EC] border-b border-white/30 sticky top-0 z-50" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-[#D4AF37] tracking-wider">VINCERO</h1>
              <span className="text-gray-500 text-sm">| Panel de Administración</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-xl neu-btn text-gray-600 hover:text-[#D4AF37] transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-xl neu-btn text-gray-600 hover:text-[#D4AF37] transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={() => router.push('/')}
                className="p-2 rounded-xl neu-btn text-gray-600 hover:text-[#D4AF37] transition-colors"
              >
                <Home className="w-5 h-5" />
              </button>
              <button 
                onClick={handleSignOut}
                className="p-2 rounded-xl neu-btn text-gray-600 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Resumen', icon: BarChart3 },
            { id: 'stripe', label: 'Stripe', icon: DollarSign },
            { id: 'cms', label: 'CMS', icon: Palette },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#D4AF37] text-white shadow-lg'
                  : 'neu-btn text-gray-600 hover:text-[#D4AF37]'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab - Connected to Stripe */}
        {activeTab === 'overview' && (
          <>
            {stripeLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#D4AF37]" />
                <p className="text-gray-500 mt-4">Cargando datos de Stripe...</p>
              </div>
            ) : (
              <>
                {/* Stats Cards from Stripe */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card className="p-6 neu-shadow border-0 bg-[#E0E5EC]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Ventas Totales</h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {formatCurrency((stripeData?.summary?.totalRevenue || 0) * 100)}
                    </p>
                  </Card>

                  <Card className="p-6 neu-shadow border-0 bg-[#E0E5EC]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                        <ShoppingCart className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Pedidos Pagados</h3>
                    <p className="text-2xl font-bold text-gray-800">{stripeData?.summary?.totalOrders || 0}</p>
                  </Card>

                  <Card className="p-6 neu-shadow border-0 bg-[#E0E5EC]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                        <Package className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Productos</h3>
                    <p className="text-2xl font-bold text-gray-800">{stripeData?.summary?.totalProducts || 0}</p>
                  </Card>

                  <Card className="p-6 neu-shadow border-0 bg-[#E0E5EC]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Ticket Promedio</h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {formatCurrency((stripeData?.summary?.averageOrderValue || 0) * 100)}
                    </p>
                  </Card>
                </div>

                {/* Balance from Stripe */}
                {stripeData?.balance && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <Card className="p-6 neu-shadow border-0 bg-[#E0E5EC]">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                          <DollarSign className="w-7 h-7 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-gray-500 text-sm">Balance Disponible</h3>
                          <p className="text-3xl font-bold text-green-600">
                            {stripeData.balance.available?.map((b: any) => 
                              formatCurrency(b.amount)
                            ).join(', ') || '$0.00'}
                          </p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 neu-shadow border-0 bg-[#E0E5EC]">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-yellow-100 flex items-center justify-center">
                          <Clock className="w-7 h-7 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="text-gray-500 text-sm">Balance Pendiente</h3>
                          <p className="text-3xl font-bold text-yellow-600">
                            {stripeData.balance.pending?.map((b: any) => 
                              formatCurrency(b.amount)
                            ).join(', ') || '$0.00'}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Recent Paid Orders from Stripe */}
                <Card className="p-6 neu-shadow border-0 bg-[#E0E5EC]">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Pedidos Pagados Recientes</h2>
                    <Button 
                      onClick={fetchStripeData}
                      variant="outline" 
                      size="sm"
                      className="neu-btn border-0"
                      disabled={stripeLoading}
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${stripeLoading ? 'animate-spin' : ''}`} />
                      Actualizar
                    </Button>
                  </div>

                  {stripeData?.sessions && stripeData.sessions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-gray-500 text-sm border-b border-gray-200">
                            <th className="pb-4 font-medium">Cliente</th>
                            <th className="pb-4 font-medium">Total</th>
                            <th className="pb-4 font-medium">Estado</th>
                            <th className="pb-4 font-medium">Fecha</th>
                            <th className="pb-4 font-medium">Productos</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stripeData.sessions.slice(0, 5).map((session: any) => (
                            <tr key={session.id} className="border-b border-gray-100">
                              <td className="py-4">
                                <div>
                                  <p className="font-medium text-gray-800">{session.customer_name || 'N/A'}</p>
                                  <p className="text-sm text-gray-500">{session.customer_email || 'N/A'}</p>
                                </div>
                              </td>
                              <td className="py-4 font-semibold text-gray-800">
                                {formatCurrency(session.amount_total || 0)}
                              </td>
                              <td className="py-4">
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Pagado
                                </span>
                              </td>
                              <td className="py-4 text-gray-500 text-sm">
                                {formatDate(session.created)}
                              </td>
                              <td className="py-4 text-sm text-gray-600">
                                {session.line_items?.map((item: any) => item.description).join(', ') || 'N/A'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">No hay pedidos pagados aún</p>
                    </div>
                  )}
                </Card>
              </>
            )}
          </>
        )}

        {/* Stripe Tab */}
        {activeTab === 'stripe' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Datos de Stripe</h2>
              <Button 
                onClick={fetchStripeData}
                variant="outline" 
                size="sm"
                className="neu-btn border-0"
                disabled={stripeLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${stripeLoading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
            </div>

            {stripeLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#D4AF37]" />
                <p className="text-gray-500 mt-4">Cargando datos de Stripe...</p>
              </div>
            ) : stripeData ? (
              <>
                {/* Stripe Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="p-6 neu-shadow border-0 bg-[#E0E5EC]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Ingresos Totales</h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {formatCurrency((stripeData.summary?.totalRevenue || 0) * 100)}
                    </p>
                  </Card>

                  <Card className="p-6 neu-shadow border-0 bg-[#E0E5EC]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                        <ShoppingCart className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Pedidos Completados</h3>
                    <p className="text-2xl font-bold text-gray-800">{stripeData.summary?.totalOrders || 0}</p>
                  </Card>

                  <Card className="p-6 neu-shadow border-0 bg-[#E0E5EC]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                        <Package className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Productos en Stripe</h3>
                    <p className="text-2xl font-bold text-gray-800">{stripeData.summary?.totalProducts || 0}</p>
                  </Card>

                  <Card className="p-6 neu-shadow border-0 bg-[#E0E5EC]">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium">Ticket Promedio</h3>
                    <p className="text-2xl font-bold text-gray-800">
                      {formatCurrency((stripeData.summary?.averageOrderValue || 0) * 100)}
                    </p>
                  </Card>
                </div>

                {/* Balance */}
                {stripeData.balance && (
                  <Card className="p-6 neu-shadow border-0 bg-[#E0E5EC]">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Balance de Stripe</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-green-50">
                        <p className="text-sm text-gray-500">Disponible</p>
                        <p className="text-2xl font-bold text-green-600">
                          {stripeData.balance.available?.map((b: any) => 
                            `${formatCurrency(b.amount)} ${b.currency.toUpperCase()}`
                          ).join(', ') || '$0.00'}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-yellow-50">
                        <p className="text-sm text-gray-500">Pendiente</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {stripeData.balance.pending?.map((b: any) => 
                            `${formatCurrency(b.amount)} ${b.currency.toUpperCase()}`
                          ).join(', ') || '$0.00'}
                        </p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Recent Sessions/Orders */}
                {stripeData.sessions && stripeData.sessions.length > 0 && (
                  <Card className="p-6 neu-shadow border-0 bg-[#E0E5EC]">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Pedidos Recientes (Stripe)</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-gray-500 text-sm border-b border-gray-200">
                            <th className="pb-4 font-medium">Cliente</th>
                            <th className="pb-4 font-medium">Total</th>
                            <th className="pb-4 font-medium">Estado</th>
                            <th className="pb-4 font-medium">Fecha</th>
                            <th className="pb-4 font-medium">Productos</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stripeData.sessions.slice(0, 10).map((session: any) => (
                            <tr key={session.id} className="border-b border-gray-100">
                              <td className="py-4">
                                <div>
                                  <p className="font-medium text-gray-800">{session.customer_name || 'N/A'}</p>
                                  <p className="text-sm text-gray-500">{session.customer_email || session.customer_phone || 'N/A'}</p>
                                </div>
                              </td>
                              <td className="py-4 font-semibold text-gray-800">
                                {formatCurrency(session.amount_total || 0)}
                              </td>
                              <td className="py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  session.payment_status === 'paid' 
                                    ? 'bg-green-100 text-green-800' 
                                    : session.payment_status === 'unpaid'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {session.payment_status === 'paid' ? 'Pagado' : 
                                   session.payment_status === 'unpaid' ? 'Pendiente' : session.payment_status}
                                </span>
                              </td>
                              <td className="py-4 text-gray-500 text-sm">
                                {formatDate(session.created)}
                              </td>
                              <td className="py-4 text-sm text-gray-600">
                                {session.line_items?.map((item: any) => item.description).join(', ') || 'N/A'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                )}

                {/* Stripe Products */}
                {stripeData.products && stripeData.products.length > 0 && (
                  <Card className="p-6 neu-shadow border-0 bg-[#E0E5EC]">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Productos en Stripe</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {stripeData.products.map((product: any) => (
                        <div key={product.id} className="p-4 rounded-xl bg-white/30 flex items-center gap-4">
                          {product.images?.[0] && (
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{product.name}</p>
                            <p className="text-sm text-[#D4AF37] font-bold">
                              {product.price ? formatCurrency(product.price) : 'Sin precio'}
                            </p>
                            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${
                              product.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {product.active ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </>
            ) : (
              <Card className="p-8 text-center neu-shadow border-0 bg-[#E0E5EC]">
                <DollarSign className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No se pudieron cargar los datos de Stripe</p>
                <p className="text-sm text-gray-400 mt-2">Verifica que la API key de Stripe esté configurada correctamente</p>
                <Button 
                  onClick={fetchStripeData}
                  className="mt-4 bg-[#D4AF37] hover:bg-[#B8962E] text-white"
                >
                  Reintentar
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* CMS Tab */}
        {activeTab === 'cms' && (
          <CMSEditor />
        )}
      </div>
    </div>
  )
}
