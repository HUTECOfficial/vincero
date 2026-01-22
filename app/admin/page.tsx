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
  Globe
} from 'lucide-react'
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
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'analytics'>('overview')
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('all')
  const [pageViews, setPageViews] = useState<PageView[]>([])
  const [deviceStats, setDeviceStats] = useState({ mobile: 0, desktop: 0, tablet: 0 })

  // Admin emails allowed
  const adminEmails = ['admin@vincero.com', 'vincero@admin.com', 'hutec.ia@gmail.com']

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }

    if (!adminEmails.includes(user.email || '')) {
      router.push('/')
      return
    }

    fetchDashboardData()
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

  if (!user || !adminEmails.includes(user.email || '')) {
    return (
      <div className="min-h-screen bg-[#E0E5EC] flex items-center justify-center">
        <Card className="p-8 neu-shadow text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Acceso Denegado</h2>
          <p className="text-gray-500 mb-6">No tienes permisos para acceder al panel de administración.</p>
          <Button onClick={() => router.push('/')} className="bg-[#D4AF37] hover:bg-[#B8962E] text-white">
            Volver al Inicio
          </Button>
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
                onClick={() => signOut()}
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
            { id: 'orders', label: 'Órdenes', icon: ShoppingCart },
            { id: 'products', label: 'Productos', icon: Package },
            { id: 'analytics', label: 'Analíticas', icon: TrendingUp },
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-6 neu-shadow border-0 bg-[#E0E5EC]">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="flex items-center text-green-600 text-sm font-medium">
                    <ArrowUpRight className="w-4 h-4" />
                    12%
                  </span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium">Ventas Totales</h3>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalSales)}</p>
              </Card>

              <Card className="p-6 neu-shadow border-0 bg-[#E0E5EC]">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="flex items-center text-blue-600 text-sm font-medium">
                    <ArrowUpRight className="w-4 h-4" />
                    8%
                  </span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium">Total Órdenes</h3>
                <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
              </Card>

              <Card className="p-6 neu-shadow border-0 bg-[#E0E5EC]">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <span className="flex items-center text-purple-600 text-sm font-medium">
                    <ArrowUpRight className="w-4 h-4" />
                    5%
                  </span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium">Clientes</h3>
                <p className="text-2xl font-bold text-gray-800">{stats.totalCustomers}</p>
              </Card>

              <Card className="p-6 neu-shadow border-0 bg-[#E0E5EC]">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <span className="flex items-center text-[#D4AF37] text-sm font-medium">
                    <ArrowUpRight className="w-4 h-4" />
                    3%
                  </span>
                </div>
                <h3 className="text-gray-500 text-sm font-medium">Ticket Promedio</h3>
                <p className="text-2xl font-bold text-gray-800">{formatCurrency(stats.averageOrderValue)}</p>
              </Card>
            </div>

            {/* Orders Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 neu-shadow border-0 bg-[#E0E5EC]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-yellow-100 flex items-center justify-center">
                    <Clock className="w-7 h-7 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">Pendientes</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats.pendingOrders}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 neu-shadow border-0 bg-[#E0E5EC]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Package className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">En Proceso</h3>
                    <p className="text-3xl font-bold text-gray-800">
                      {orders.filter(o => o.status === 'confirmed' || o.status === 'shipped').length}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 neu-shadow border-0 bg-[#E0E5EC]">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                    <TrendingUp className="w-7 h-7 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">Completados</h3>
                    <p className="text-3xl font-bold text-gray-800">{stats.completedOrders}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="p-6 neu-shadow border-0 bg-[#E0E5EC]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Órdenes Recientes</h2>
                <Button 
                  onClick={fetchDashboardData}
                  variant="outline" 
                  size="sm"
                  className="neu-btn border-0"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualizar
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#D4AF37]" />
                  <p className="text-gray-500 mt-4">Cargando datos...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No hay órdenes aún</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-500 text-sm border-b border-gray-200">
                        <th className="pb-4 font-medium">Cliente</th>
                        <th className="pb-4 font-medium">Total</th>
                        <th className="pb-4 font-medium">Estado</th>
                        <th className="pb-4 font-medium">Fecha</th>
                        <th className="pb-4 font-medium">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="border-b border-gray-100">
                          <td className="py-4">
                            <div>
                              <p className="font-medium text-gray-800">{order.customer_name}</p>
                              <p className="text-sm text-gray-500">{order.customer_phone}</p>
                            </div>
                          </td>
                          <td className="py-4 font-semibold text-gray-800">
                            {formatCurrency(order.total)}
                          </td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {getStatusText(order.status)}
                            </span>
                          </td>
                          <td className="py-4 text-gray-500 text-sm">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="py-4">
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white"
                            >
                              <option value="pending">Pendiente</option>
                              <option value="confirmed">Confirmado</option>
                              <option value="shipped">Enviado</option>
                              <option value="delivered">Entregado</option>
                              <option value="cancelled">Cancelado</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <Card className="p-6 neu-shadow border-0 bg-[#E0E5EC]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Todas las Órdenes</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="neu-btn border-0">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrar
                </Button>
                <Button variant="outline" size="sm" className="neu-btn border-0">
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No hay órdenes aún</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 text-sm border-b border-gray-200">
                      <th className="pb-4 font-medium">ID</th>
                      <th className="pb-4 font-medium">Cliente</th>
                      <th className="pb-4 font-medium">Ciudad</th>
                      <th className="pb-4 font-medium">Total</th>
                      <th className="pb-4 font-medium">Estado</th>
                      <th className="pb-4 font-medium">Fecha</th>
                      <th className="pb-4 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-white/30 transition-colors">
                        <td className="py-4 text-sm text-gray-500">
                          #{order.id.slice(0, 8)}
                        </td>
                        <td className="py-4">
                          <div>
                            <p className="font-medium text-gray-800">{order.customer_name}</p>
                            <p className="text-sm text-gray-500">{order.customer_email || order.customer_phone}</p>
                          </div>
                        </td>
                        <td className="py-4 text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {order.shipping_city || 'N/A'}
                          </div>
                        </td>
                        <td className="py-4 font-semibold text-gray-800">
                          {formatCurrency(order.total)}
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td className="py-4 text-gray-500 text-sm">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="py-4">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white"
                          >
                            <option value="pending">Pendiente</option>
                            <option value="confirmed">Confirmado</option>
                            <option value="shipped">Enviado</option>
                            <option value="delivered">Entregado</option>
                            <option value="cancelled">Cancelado</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <Card className="p-6 neu-shadow border-0 bg-[#E0E5EC]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Productos Más Vendidos</h2>
            </div>

            {orderItems.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">No hay productos vendidos aún</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Group items by product name and count */}
                {Object.entries(
                  orderItems.reduce((acc, item) => {
                    const key = `${item.product_name} - ${item.product_color}`
                    if (!acc[key]) {
                      acc[key] = { ...item, totalQuantity: 0, totalRevenue: 0 }
                    }
                    acc[key].totalQuantity += item.quantity
                    acc[key].totalRevenue += item.unit_price * item.quantity
                    return acc
                  }, {} as Record<string, any>)
                )
                  .sort((a, b) => b[1].totalQuantity - a[1].totalQuantity)
                  .slice(0, 10)
                  .map(([key, item]) => (
                    <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-white/30">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center">
                          <Package className="w-6 h-6 text-[#D4AF37]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{item.product_name}</p>
                          <p className="text-sm text-gray-500">{item.product_color}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">{item.totalQuantity} vendidos</p>
                        <p className="text-sm text-[#D4AF37]">{formatCurrency(item.totalRevenue)}</p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </Card>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Page Views */}
            <Card className="p-6 neu-shadow border-0 bg-[#E0E5EC]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Páginas Más Visitadas</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Eye className="w-4 h-4" />
                  Últimos 30 días
                </div>
              </div>

              <div className="space-y-4">
                {pageViews.map((page, index) => (
                  <div key={page.page} className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] font-bold text-sm">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-800">{page.page}</span>
                        <span className="text-gray-600">{page.views.toLocaleString()} visitas</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#D4AF37] rounded-full"
                          style={{ width: `${(page.views / pageViews[0].views) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Clock className="w-4 h-4" />
                      {page.avgTime}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Device Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 neu-shadow border-0 bg-[#E0E5EC]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">Móvil</h3>
                    <p className="text-2xl font-bold text-gray-800">{deviceStats.mobile}%</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${deviceStats.mobile}%` }} />
                </div>
              </Card>

              <Card className="p-6 neu-shadow border-0 bg-[#E0E5EC]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">Desktop</h3>
                    <p className="text-2xl font-bold text-gray-800">{deviceStats.desktop}%</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${deviceStats.desktop}%` }} />
                </div>
              </Card>

              <Card className="p-6 neu-shadow border-0 bg-[#E0E5EC]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">Tablet</h3>
                    <p className="text-2xl font-bold text-gray-800">{deviceStats.tablet}%</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${deviceStats.tablet}%` }} />
                </div>
              </Card>
            </div>

            {/* Info Note */}
            <Card className="p-4 neu-shadow border-0 bg-[#D4AF37]/10">
              <div className="flex items-start gap-3">
                <BarChart3 className="w-5 h-5 text-[#D4AF37] mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800">Nota sobre Analíticas</p>
                  <p className="text-sm text-gray-600">
                    Para obtener datos de analíticas en tiempo real, considera integrar Google Analytics o Vercel Analytics. 
                    Los datos mostrados aquí son de demostración.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
