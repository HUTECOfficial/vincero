'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronRight, Star, Heart, ShoppingCart, X, Plus, Minus, Ruler } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useAuth } from '@/lib/AuthContext'
import { createOrder, getUserOrders } from '@/lib/supabase'
import { DynamicIsland } from '@/components/DynamicIsland'
import { ChristmasEffects } from '@/components/ChristmasEffects'
import Link from 'next/link'

interface Product {
  id: number
  nameKey: 'productName1' | 'productName2' | 'productName3' | 'productName4' | 'productName5' | 'productName6' | 'productName7' | 'productName8' | 'productName9' | 'productName10' | 'productName11' | 'productName12' | 'productName13' | 'productName14' | 'productName15' | 'productName16' | 'productName17' | 'productName18'
  price: number
  image: string
  images?: string[]
  badgeKey?: 'mostPopular' | 'favorite' | 'limitedEdition' | 'classic' | 'newProduct' | 'trending' | 'popular' | 'exclusive' | 'winterCollection' | 'ballerina' | 'lightyear'
  descriptionType: 'normal' | 'high' | 'winter' | 'ballerina' | 'lightyear'
  rating: number
  color: string
}

interface CartItem extends Product {
  quantity: number
  size: string
}

function ShopContent() {
  const { t } = useLanguage()
  const { user, profile, signOut, loading: authLoading } = useAuth()
  const searchParams = useSearchParams()
  const seasonFilter = searchParams.get('season')
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [isCheckoutFormOpen, setIsCheckoutFormOpen] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [productDetailView, setProductDetailView] = useState<Product | null>(null)
  const [collectionFilter, setCollectionFilter] = useState<string | null>(null)
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)
  const [isStripeLoading, setIsStripeLoading] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const products: Product[] = [
    {
      id: 1,
      nameKey: 'productName1',
      price: 32500,
      image: '/1.png',
      images: [
        '/1.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tenniscaramel.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tenniscaramel2.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tenniscaramel3.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tenniscaramel4.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tenniscaramel5.png',
      ],
      badgeKey: 'mostPopular',
      descriptionType: 'normal',
      rating: 4.9,
      color: 'ITALIA/CARAMEL',
    },
    {
      id: 2,
      nameKey: 'productName2',
      price: 32500,
      image: '/2.png',
      images: [
        '/2.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tenisrosa.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tenisrosa1.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tenisrosa2.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tenisrosa3.png',
      ],
      badgeKey: 'favorite',
      descriptionType: 'normal',
      rating: 5.0,
      color: 'ROSA B./ BLANCO',
    },
    {
      id: 3,
      nameKey: 'productName3',
      price: 32500,
      image: '/3.png',
      images: [
        '/3.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tennisgris.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tennisgris2.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tennisgris3.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tennisgris4.png',
      ],
      badgeKey: 'limitedEdition',
      descriptionType: 'normal',
      rating: 4.8,
      color: 'OXFORD /PLATA',
    },
    {
      id: 4,
      nameKey: 'productName4',
      price: 32500,
      image: '/4.png',
      images: [
        '/4.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tenisblanco.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tenisblanco2.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tenisblanco3.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tenisblanco4.png',
      ],
      badgeKey: 'classic',
      descriptionType: 'normal',
      rating: 4.9,
      color: 'BLANCO/ NEGRO',
    },
    {
      id: 5,
      nameKey: 'productName5',
      price: 32500,
      image: '/6.png?v=2',
      images: [
        '/6.png?v=2',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highblanco.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highblanco1.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highblanco2.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highblanco3.png',
      ],
      badgeKey: 'newProduct',
      descriptionType: 'high',
      rating: 5.0,
      color: 'BLANCO',
    },
    {
      id: 6,
      nameKey: 'productName6',
      price: 32500,
      image: '/7.png?v=2',
      images: [
        '/7.png?v=2',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highcafe.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highcafe2.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highcafe3.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highcafe4.png',
      ],
      badgeKey: 'trending',
      descriptionType: 'high',
      rating: 4.8,
      color: 'CARAMEL',
    },
    {
      id: 7,
      nameKey: 'productName7',
      price: 32500,
      image: '/8.png?v=2',
      images: [
        '/8.png?v=2',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highazul.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highazul2.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highazul3.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highazul4.png',
      ],
      badgeKey: 'popular',
      descriptionType: 'high',
      rating: 4.9,
      color: 'MARINO',
    },
    {
      id: 8,
      nameKey: 'productName8',
      price: 32500,
      image: '/9.png?v=2',
      images: [
        '/9.png?v=2',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highnegro.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highnegro2.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highnegro3.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highnegro4.png',
      ],
      badgeKey: 'exclusive',
      descriptionType: 'high',
      rating: 4.9,
      color: 'NEGRO',
    },
    {
      id: 14,
      nameKey: 'productName14',
      price: 32500,
      image: '/22.png',
      images: [
        '/22.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highgris.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highgris2.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highgris3.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highgris3.png',
      ],
      badgeKey: 'newProduct',
      descriptionType: 'high',
      rating: 4.9,
      color: 'OXFORD',
    },
    {
      id: 9,
      nameKey: 'productName9',
      price: 32500,
      image: '/13.png',
      badgeKey: 'winterCollection',
      descriptionType: 'winter',
      rating: 4.9,
      color: 'MULTICOLOR',
    },
    {
      id: 10,
      nameKey: 'productName10',
      price: 32500,
      image: '/19.png',
      images: [
        '/19.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/Balerina%20rosa.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/Balerina%20rosa%202.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/Balerina%20rosa%203.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/Balerina%20rosa%204.png',
      ],
      badgeKey: 'ballerina',
      descriptionType: 'ballerina',
      rating: 4.9,
      color: 'ROSA',
    },
    {
      id: 11,
      nameKey: 'productName11',
      price: 32500,
      image: '/18.png',
      images: [
        '/18.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/balerinagrisblanco.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/balerinagris2.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/balerinagris3.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/balerinagris4.png',
      ],
      badgeKey: 'ballerina',
      descriptionType: 'ballerina',
      rating: 4.9,
      color: 'NEGRO/BLANCO',
    },
    {
      id: 12,
      nameKey: 'productName12',
      price: 32500,
      image: '/20.png',
      images: [
        '/20.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/balerinarojo1.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/balerinarojo2.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/balerinarojo3.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/balerinarojo4.png',
      ],
      badgeKey: 'ballerina',
      descriptionType: 'ballerina',
      rating: 4.9,
      color: 'ROJO',
    },
    {
      id: 13,
      nameKey: 'productName13',
      price: 32500,
      image: '/21.png',
      images: [
        '/21.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/balerinanegro.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/balerinanegro1.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/balerinanegro2.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/balerinanegro3.png',
      ],
      badgeKey: 'ballerina',
      descriptionType: 'ballerina',
      rating: 4.9,
      color: 'NEGRO',
    },
    {
      id: 15,
      nameKey: 'productName15',
      price: 32500,
      image: '/23.png',
      images: [
        '/23.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearnegro.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearnegro2.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearnegro3.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearnegro4.png',
      ],
      badgeKey: 'lightyear',
      descriptionType: 'lightyear',
      rating: 5.0,
      color: 'NEGRO/BLANCO',
    },
    {
      id: 16,
      nameKey: 'productName16',
      price: 32500,
      image: '/24.png',
      images: [
        '/24.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearverdes.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearverdes1.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearverdes3.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearverdes2.png',
      ],
      badgeKey: 'lightyear',
      descriptionType: 'lightyear',
      rating: 4.9,
      color: 'V. BANDERA/BLANCO',
    },
    {
      id: 17,
      nameKey: 'productName17',
      price: 32500,
      image: '/25.png',
      images: [
        '/25.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearazul.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearazul2.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearazul3.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearazul4.png',
      ],
      badgeKey: 'lightyear',
      descriptionType: 'lightyear',
      rating: 4.9,
      color: 'AZUL/BLANCO',
    },
    {
      id: 18,
      nameKey: 'productName18',
      price: 32500,
      image: '/26.png',
      images: [
        '/26.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearrosa.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearrosa2.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearrosa3.png',
        'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearrosa4.png',
      ],
      badgeKey: 'lightyear',
      descriptionType: 'lightyear',
      rating: 4.9,
      color: 'ROSA/BLANCO',
    },
  ]

  const getProductName = (product: Product) => t[product.nameKey]
  const getProductBadge = (product: Product) => product.badgeKey ? t[product.badgeKey] : undefined
  const getProductDescription = (product: Product) => {
    if (product.descriptionType === 'winter') return t.productDescWinter
    if (product.descriptionType === 'ballerina') return t.productDescBallerina
    if (product.descriptionType === 'lightyear') return t.productDescLightyear
    return product.descriptionType === 'high' ? t.productDescHigh : t.productDesc
  }

  const availableSizesNormal = ['13mx', '14mx', '15mx', '16mx', '17mx']
  const availableSizesHigh = ['17mx', '18mx', '19mx', '20mx', '21mx']
  const availableSizesWinter = ['13mx', '14mx', '15mx', '16mx', '17mx']
  const availableSizesBallerina = ['13mx', '14mx', '15mx', '16mx', '17mx']
  const availableSizesLightyear = ['13mx', '14mx', '15mx', '16mx', '17mx']
  const getAvailableSizes = (product: Product) => {
    if (product.descriptionType === 'winter') return availableSizesWinter
    if (product.descriptionType === 'ballerina') return availableSizesBallerina
    if (product.descriptionType === 'lightyear') return availableSizesLightyear
    return product.descriptionType === 'high' ? availableSizesHigh : availableSizesNormal
  }

  // Filtrar productos según la temporada
  const filteredProducts = seasonFilter 
    ? products.filter(p => {
        if (seasonFilter === 'normal') return p.descriptionType === 'normal'
        if (seasonFilter === 'high') return p.descriptionType === 'high' || p.id === 14
        if (seasonFilter === 'ballerina') return p.descriptionType === 'ballerina'
        if (seasonFilter === 'multicolor') return p.id === 9
        if (seasonFilter === 'lightyear') return p.descriptionType === 'lightyear'
        return false
      })
    : products

  // Título dinámico según el filtro
  const getPageTitle = () => {
    if (seasonFilter === 'normal') return t.seasonNormal
    if (seasonFilter === 'high') return t.seasonHigh
    if (seasonFilter === 'ballerina') return t.seasonBallerina
    if (seasonFilter === 'multicolor') return t.seasonMulticolor
    if (seasonFilter === 'lightyear') return t.seasonLightyear
    return t.bestSellers
  }

  useEffect(() => {
    if (profile) {
      setCustomerName(profile.full_name || '')
      setCustomerPhone(profile.phone || '')
    }
  }, [profile])

  const addToCart = (product: Product, size: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id && item.size === size)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id && item.size === size ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevCart, { ...product, quantity: 1, size }]
    })
  }

  const openSizeSelector = (product: Product) => {
    setSelectedProduct(product)
    setSelectedSize('')
  }

  const openProductDetail = (product: Product) => {
    setProductDetailView(product)
    setSelectedImageIndex(0)
  }

  const confirmAddToCart = () => {
    if (selectedProduct && selectedSize) {
      addToCart(selectedProduct, selectedSize)
      setSelectedProduct(null)
      setSelectedSize('')
      setIsCartOpen(true)
    }
  }

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = Math.max(0, item.quantity + delta)
          return newQuantity === 0 ? null : { ...item, quantity: newQuantity }
        }
        return item
      }).filter(Boolean) as CartItem[]
    )
  }

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id)
      if (exists) {
        return prev.filter(item => item.id !== product.id)
      }
      return [...prev, product]
    })
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal

  const handleStripeCheckout = async () => {
    setIsStripeLoading(true)
    
    try {
      const items = cart.map(item => ({
        id: item.id,
        name: getProductName(item),
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      }))

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customerInfo: {
            name: customerName,
            phone: customerPhone,
            email: user?.email || '',
          },
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Error al crear la sesión de pago')
      }
    } catch (error: any) {
      console.error('Stripe checkout error:', error)
      alert('Error al procesar el pago. Por favor intenta de nuevo.')
    } finally {
      setIsStripeLoading(false)
    }
  }

  const handleWhatsAppCheckout = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Por favor completa tu nombre y teléfono')
      return
    }

    try {
      const orderItems = cart.map(item => ({
        product_id: item.id,
        product_name: getProductName(item),
        product_color: item.color,
        size: item.size,
        quantity: item.quantity,
        unit_price: item.price,
      }))

      await createOrder(
        user?.id || null,
        orderItems,
        {
          name: customerName,
          phone: customerPhone,
          email: user?.email,
        },
        {
          subtotal: subtotal,
          shipping: 0,
          total: total,
        }
      )
    } catch (error) {
      console.error('Error saving order:', error)
    }

    const phoneNumber = '5214772432492'
    let message = '*PEDIDO VINCERO - TENIS INFANTILES*\n\n'
    
    message += `*DATOS DEL CLIENTE:*\n`
    message += `Nombre: ${customerName}\n`
    message += `Teléfono: ${customerPhone}\n`
    if (user?.email) {
      message += `Email: ${user.email}\n`
    }
    message += `\n*PRODUCTOS:*\n`
    
    cart.forEach((item, index) => {
      message += `${index + 1}. ${getProductName(item)}\n`
      message += `   Color: ${item.color}\n`
      message += `   Talla: ${item.size}\n`
      message += `   Cantidad: ${item.quantity}\n`
      message += `   Precio unitario: $${(item.price / 100).toFixed(2)} MXN\n`
      message += `   Subtotal: $${((item.price * item.quantity) / 100).toFixed(2)} MXN\n\n`
    })
    
    message += `*SUBTOTAL: $${(subtotal / 100).toFixed(2)} MXN*\n`
    message += `*TOTAL: $${(total / 100).toFixed(2)} MXN*\n\n`
    message += `¡Gracias por tu compra! 👟✨`
    
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
    
    setIsCheckoutFormOpen(false)
    setCustomerName('')
    setCustomerPhone('')
    setCart([])
    setIsCartOpen(false)
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false)
        setSelectedProduct(null)
        setIsCheckoutFormOpen(false)
        setProductDetailView(null)
        setIsSizeGuideOpen(false)
        document.body.style.overflow = 'unset'
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  useEffect(() => {
    const hasOpenModal = selectedProduct || productDetailView || isCheckoutFormOpen || isSizeGuideOpen
    
    if (hasOpenModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedProduct, productDetailView, isCheckoutFormOpen, isSizeGuideOpen])

  return (
    <div className="min-h-screen bg-background relative">
      {/* Christmas Effects */}
      <ChristmasEffects />

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background/95 via-background/80 to-transparent backdrop-blur-sm">
        <nav className="container mx-auto px-4 md:px-6 py-4 md:py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <LanguageSwitcher />
            </Link>
            
            <div className="text-center flex items-center justify-center">
              <Link href="/" className="bg-white/90 px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all">
                <img src="/vincero LOGO.png" alt="Vincero Logo" className="h-12 md:h-16 w-auto" />
              </Link>
            </div>

            <button onClick={() => setIsCartOpen(true)} className="relative hover:scale-110 transition-transform">
              <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 md:w-5 md:h-5 bg-primary text-primary-foreground text-[10px] md:text-xs rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      <section className="pt-32 pb-24 lg:pb-32 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              {seasonFilter ? getPageTitle() : t.selectSeason}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {seasonFilter ? t.bestSellersDesc : 'Explora nuestras colecciones exclusivas'}
            </p>
          </div>

          {!seasonFilter && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 mb-16">
              <Link href="/catalog/?season=normal">
                <Card className="relative overflow-hidden group cursor-pointer h-80 hover:border-primary/50 transition-all duration-300">
                  <div className="absolute inset-0">
                    <img src="/1.png" alt="Low Collection" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">{t.seasonNormal}</h3>
                    <p className="text-sm md:text-base opacity-90">{t.seasonNormalDesc}</p>
                    <div className="flex items-center gap-2 mt-4">
                      <span className="text-lg font-bold">$325.00</span>
                      <span className="text-sm line-through opacity-70">$649.00</span>
                      <span className="text-xs font-bold bg-green-500 px-2 py-1 rounded">50% OFF</span>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/catalog/?season=high">
                <Card className="relative overflow-hidden group cursor-pointer h-80 hover:border-primary/50 transition-all duration-300">
                  <div className="absolute inset-0">
                    <img src="/6.png" alt="High Collection" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">{t.seasonHigh}</h3>
                    <p className="text-sm md:text-base opacity-90">{t.seasonHighDesc}</p>
                    <div className="flex items-center gap-2 mt-4">
                      <span className="text-lg font-bold">$325.00</span>
                      <span className="text-sm line-through opacity-70">$649.00</span>
                      <span className="text-xs font-bold bg-green-500 px-2 py-1 rounded">50% OFF</span>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/catalog/?season=ballerina">
                <Card className="relative overflow-hidden group cursor-pointer h-80 hover:border-primary/50 transition-all duration-300">
                  <div className="absolute inset-0">
                    <img src="/19.png" alt="Ballerina Collection" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">{t.seasonBallerina}</h3>
                    <p className="text-sm md:text-base opacity-90">{t.seasonBallerinaDesc}</p>
                    <div className="flex items-center gap-2 mt-4">
                      <span className="text-lg font-bold">$325.00</span>
                      <span className="text-sm line-through opacity-70">$649.00</span>
                      <span className="text-xs font-bold bg-green-500 px-2 py-1 rounded">50% OFF</span>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/catalog/?season=multicolor">
                <Card className="relative overflow-hidden group cursor-pointer h-80 hover:border-primary/50 transition-all duration-300">
                  <div className="absolute inset-0">
                    <img src="/13.png" alt="Multicolor Collection" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">{t.seasonMulticolor}</h3>
                    <p className="text-sm md:text-base opacity-90">{t.seasonMulticolorDesc}</p>
                    <div className="flex items-center gap-2 mt-4">
                      <span className="text-lg font-bold">$325.00</span>
                      <span className="text-sm line-through opacity-70">$649.00</span>
                      <span className="text-xs font-bold bg-green-500 px-2 py-1 rounded">50% OFF</span>
                    </div>
                  </div>
                </Card>
              </Link>

              <Link href="/catalog/?season=lightyear">
                <Card className="relative overflow-hidden group cursor-pointer h-80 hover:border-primary/50 transition-all duration-300">
                  <div className="absolute inset-0">
                    <img src="/23.png" alt="Lightyear Collection" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">{t.seasonLightyear}</h3>
                    <p className="text-sm md:text-base opacity-90">{t.seasonLightyearDesc}</p>
                    <div className="flex items-center gap-2 mt-4">
                      <span className="text-lg font-bold">$325.00</span>
                      <span className="text-sm line-through opacity-70">$649.00</span>
                      <span className="text-xs font-bold bg-green-500 px-2 py-1 rounded">50% OFF</span>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>
          )}

          {seasonFilter && (
            <div className="mb-8">
              <Link href="/catalog/" className="inline-flex items-center text-primary hover:underline">
                <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
                Volver a colecciones
              </Link>
            </div>
          )}

          {seasonFilter && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProducts.map((product) => {
              const isInWishlist = wishlist.some(item => item.id === product.id)
              return (
                <Card 
                  key={product.id} 
                  className="group cursor-pointer overflow-hidden border-2 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="relative overflow-hidden bg-gradient-to-br from-secondary/50 to-accent/20">
                    {getProductBadge(product) && (
                      <div className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium">
                        {getProductBadge(product)}
                      </div>
                    )}

                    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleWishlist(product)
                        }}
                        className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                      >
                        <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-rose-500 text-rose-500' : 'text-foreground'}`} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsSizeGuideOpen(true)
                        }}
                        className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                        title="Guía de tallas"
                      >
                        <Ruler className="w-5 h-5 text-foreground" />
                      </button>
                    </div>

                    <div className="relative h-80 overflow-hidden cursor-pointer" onClick={(e) => {
                      e.stopPropagation()
                      openProductDetail(product)
                    }}>
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={getProductName(product)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
                    </div>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <Button size="sm" className="shadow-lg" onClick={() => openProductDetail(product)}>
                        {t.quickView}
                      </Button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl font-bold group-hover:text-primary transition-colors cursor-pointer" onClick={() => openProductDetail(product)}>
                        {getProductName(product)}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4 leading-relaxed cursor-pointer" onClick={() => openProductDetail(product)}>
                      {getProductDescription(product)}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-lg text-muted-foreground line-through">$649.00</span>
                        <div className="flex items-center gap-2">
                          <span className="text-3xl font-bold text-gradient">${(product.price / 100).toFixed(2)}</span>
                          <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">50% OFF</span>
                        </div>
                      </div>
                      <Button 
                        onClick={() => openSizeSelector(product)}
                        variant="outline" 
                        size="sm" 
                        className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
                      >
                        {t.add}
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
            </div>
          )}
        </div>
      </section>

      <footer className="py-8 md:py-12 border-t border-border/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
            <div className="text-center md:text-left">
              <div className="text-lg md:text-xl tracking-[0.2em] font-light text-foreground mb-1 md:mb-2">VINCERO</div>
              <p className="text-xs md:text-sm text-muted-foreground">{t.footerTagline}</p>
            </div>
            
            <div className="flex gap-6 md:gap-8 text-xs md:text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">{t.stores}</a>
              <a href="#" className="hover:text-foreground transition-colors">{t.support}</a>
              <a href="#" className="hover:text-foreground transition-colors">{t.contact}</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Size Selector Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)}>
          <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">{t.selectSize}</h3>
                <button onClick={() => setSelectedProduct(null)} className="hover:bg-accent p-2 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-6">
                {getAvailableSizes(selectedProduct).map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 px-3 rounded border-2 transition-all ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <Button 
                onClick={confirmAddToCart}
                disabled={!selectedSize}
                className="w-full"
              >
                {t.add}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setIsCartOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">{t.cart}</h2>
              <button onClick={() => setIsCartOpen(false)} className="hover:bg-accent p-2 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">{t.emptyCart}</p>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={`${item.id}-${item.size}`} className="flex gap-4 p-4 bg-secondary/30 rounded-lg">
                      <img src={item.image} alt={getProductName(item)} className="w-20 h-20 object-cover rounded" />
                      <div className="flex-1">
                        <h4 className="font-bold">{getProductName(item)}</h4>
                        <p className="text-sm text-muted-foreground">{item.size}</p>
                        <p className="text-sm font-semibold">${(item.price / 100).toFixed(2)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-accent rounded">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-accent rounded">
                            <Plus className="w-4 h-4" />
                          </button>
                          <button onClick={() => removeFromCart(item.id)} className="ml-auto p-1 hover:bg-accent rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t p-6 space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>{t.total}:</span>
                  <span>${(total / 100).toFixed(2)}</span>
                </div>
                <Button 
                  onClick={() => {
                    setIsCartOpen(false)
                    setIsCheckoutFormOpen(true)
                  }}
                  className="w-full"
                >
                  {t.checkout}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Form Modal */}
      {isCheckoutFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsCheckoutFormOpen(false)}>
          <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">{t.checkout}</h3>
                <button onClick={() => setIsCheckoutFormOpen(false)} className="hover:bg-accent p-2 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t.name}</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t.phone}</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg bg-background"
                  />
                </div>
                <Button 
                  onClick={handleStripeCheckout}
                  disabled={isStripeLoading}
                  className="w-full bg-[#635BFF] hover:bg-[#5851DB]"
                >
                  {isStripeLoading ? (
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2" />
                  ) : (
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
                    </svg>
                  )}
                  {isStripeLoading ? 'Procesando...' : 'Pagar con tarjeta'}
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">o</span>
                  </div>
                </div>
                <Button 
                  onClick={handleWhatsAppCheckout}
                  disabled={!customerName.trim() || !customerPhone.trim()}
                  variant="outline"
                  className="w-full border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                >
                  {t.continueWhatsApp}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Product Detail Modal */}
      {productDetailView && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center">
          <Card className="w-full md:max-w-4xl max-h-[90vh] md:max-h-[85vh] overflow-hidden flex flex-col rounded-t-3xl md:rounded-xl">
            <div className="p-4 md:p-6 border-b flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold">{getProductName(productDetailView)}</h2>
              <button onClick={() => setProductDetailView(null)} className="hover:bg-muted rounded-full p-2 transition-colors">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {/* Image Section */}
                <div className="relative">
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-br from-secondary/50 to-accent/20">
                    {getProductBadge(productDetailView) && (
                      <div className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                        {getProductBadge(productDetailView)}
                      </div>
                    )}
                    <img
                      src={productDetailView.images && productDetailView.images.length > 0 ? productDetailView.images[selectedImageIndex] : productDetailView.image}
                      alt={getProductName(productDetailView)}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Image Gallery Thumbnails */}
                  {productDetailView.images && productDetailView.images.length > 1 && (
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {productDetailView.images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImageIndex === index
                              ? 'border-primary scale-95'
                              : 'border-transparent hover:border-primary/50'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${getProductName(productDetailView)} - ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">{getProductName(productDetailView)}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-5 h-5 ${
                              i < Math.floor(productDetailView.rating) 
                                ? 'fill-primary text-primary' 
                                : 'text-muted-foreground'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-lg font-medium">{productDetailView.rating}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-xl text-muted-foreground line-through">$649.00 MXN</span>
                      <span className="text-3xl md:text-4xl font-bold text-gradient">${(productDetailView.price / 100).toFixed(2)} MXN</span>
                      <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">50% OFF</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-bold text-lg mb-2">{t.description}</h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {getProductDescription(productDetailView)}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-bold text-lg mb-2">{t.details}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">{t.color}:</span>
                        <span className="font-medium">{productDetailView.color}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">{t.availableSizesLabel}:</span>
                        <span className="font-medium">
                          {productDetailView.descriptionType === 'high' 
                            ? '17mx - 21mx' 
                            : productDetailView.descriptionType === 'winter' 
                            ? '13mx - 17mx' 
                            : '13mx - 17mx'}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-muted-foreground">{t.material}:</span>
                        <span className="font-medium">Textil / PVC</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-muted-foreground">{t.warranty}:</span>
                        <span className="font-medium">{t.warrantyValue}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="flex items-center gap-2 text-sm text-primary hover:underline mb-4"
                  >
                    <Ruler className="w-4 h-4" />
                    Guía de tallas
                  </button>

                  <div className="mt-auto pt-4">
                    <Button 
                      onClick={() => {
                        setProductDetailView(null)
                        openSizeSelector(productDetailView)
                      }}
                      className="w-full py-6 text-lg"
                      size="lg"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      {t.add}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setIsSizeGuideOpen(false)}>
          <Card className="w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold">Guía de Tallas</h2>
                <button onClick={() => setIsSizeGuideOpen(false)} className="hover:bg-accent p-2 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-primary/10">
                      <th className="border border-border px-3 py-2 text-sm font-bold">TALLA MX</th>
                      <th className="border border-border px-3 py-2 text-sm font-bold">ANCHO CM (A)</th>
                      <th className="border border-border px-3 py-2 text-sm font-bold">LARGO CM (B)</th>
                      <th className="border border-border px-3 py-2 text-sm font-bold">TALLA US</th>
                      <th className="border border-border px-3 py-2 text-sm font-bold">TALLA EU</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-secondary/30 transition-colors">
                      <td className="border border-border px-3 py-2 text-center font-semibold">13</td>
                      <td className="border border-border px-3 py-2 text-center">5</td>
                      <td className="border border-border px-3 py-2 text-center">13.3</td>
                      <td className="border border-border px-3 py-2 text-center">6</td>
                      <td className="border border-border px-3 py-2 text-center">22</td>
                    </tr>
                    <tr className="hover:bg-secondary/30 transition-colors">
                      <td className="border border-border px-3 py-2 text-center font-semibold">14</td>
                      <td className="border border-border px-3 py-2 text-center">5.5</td>
                      <td className="border border-border px-3 py-2 text-center">14.3</td>
                      <td className="border border-border px-3 py-2 text-center">7</td>
                      <td className="border border-border px-3 py-2 text-center">23.5</td>
                    </tr>
                    <tr className="hover:bg-secondary/30 transition-colors">
                      <td className="border border-border px-3 py-2 text-center font-semibold">15</td>
                      <td className="border border-border px-3 py-2 text-center">6</td>
                      <td className="border border-border px-3 py-2 text-center">15.3</td>
                      <td className="border border-border px-3 py-2 text-center">8</td>
                      <td className="border border-border px-3 py-2 text-center">25</td>
                    </tr>
                    <tr className="hover:bg-secondary/30 transition-colors">
                      <td className="border border-border px-3 py-2 text-center font-semibold">16</td>
                      <td className="border border-border px-3 py-2 text-center">6.3</td>
                      <td className="border border-border px-3 py-2 text-center">16.3</td>
                      <td className="border border-border px-3 py-2 text-center">9</td>
                      <td className="border border-border px-3 py-2 text-center">26</td>
                    </tr>
                    <tr className="hover:bg-secondary/30 transition-colors">
                      <td className="border border-border px-3 py-2 text-center font-semibold">17</td>
                      <td className="border border-border px-3 py-2 text-center">6.6</td>
                      <td className="border border-border px-3 py-2 text-center">17.3</td>
                      <td className="border border-border px-3 py-2 text-center">10</td>
                      <td className="border border-border px-3 py-2 text-center">27.5</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-secondary/30 rounded-xl p-4 mb-4">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <Ruler className="w-4 h-4" />
                  Cómo medir tu pie
                </h3>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Usa una cinta métrica flexible</li>
                  <li>Coloca el pie sobre una hoja de papel</li>
                  <li>Mide desde el talón hasta la punta del dedo más largo</li>
                </ol>
              </div>

              <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Tip:</strong> El desarrollo de cada bebé es diferente, las tallas recomendadas son sólo de referencia. Si desea elegir la talla con mayor precisión hay que medir la longitud de los pies de su bebé.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Dynamic Island */}
      <DynamicIsland 
        activeNav="shop"
        wishlistCount={wishlist.length}
      />
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Cargando...</div>}>
      <ShopContent />
    </Suspense>
  )
}
