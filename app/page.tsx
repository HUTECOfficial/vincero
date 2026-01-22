'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronRight, ChevronLeft, Star, Zap, Shield, TrendingUp, Home, Search, Heart, User, ShoppingCart, X, Plus, Minus, Package, MessageCircle, Truck, Award, Lightbulb, Sparkles, HandHeart, Users, LogOut, Mail, Lock, Eye, EyeOff, Menu, Ruler } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from '@/components/ui/carousel'
import { useLanguage } from '@/lib/LanguageContext'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useAuth } from '@/lib/AuthContext'
import { ChristmasEffects } from '@/components/ChristmasEffects'
import { createOrder, getUserOrders } from '@/lib/supabase'
import { AnalyticsTracker } from '@/components/AnalyticsTracker'
import { trackEvent, trackProductView } from '@/lib/analytics'

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

export default function HomePage() {
  const { t, language } = useLanguage()
  const { user, signOut } = useAuth()

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://vincero.com.mx/#organization",
        "name": "VINCERO",
        "url": "https://vincero.com.mx",
        "logo": {
          "@type": "ImageObject",
          "url": "https://vincero.com.mx/1.png"
        },
        "description": "Fabricantes mexicanos de tenis y calzado infantil premium. Diseños modernos, materiales de alta calidad y máximo confort.",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "MX",
          "addressLocality": "México"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+52-477-294-3124",
          "contactType": "customer service",
          "availableLanguage": ["Spanish", "English"]
        },
        "sameAs": [
          "https://www.facebook.com/vincero",
          "https://www.instagram.com/vincero"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://vincero.com.mx/#website",
        "url": "https://vincero.com.mx",
        "name": "VINCERO",
        "description": "Tenis y calzado infantil de alta calidad",
        "publisher": {
          "@id": "https://vincero.com.mx/#organization"
        },
        "inLanguage": "es-MX"
      },
      {
        "@type": "Store",
        "name": "VINCERO",
        "image": "https://vincero.com.mx/1.png",
        "description": "Tienda de tenis y calzado infantil premium",
        "priceRange": "$325 - $649 MXN",
        "currenciesAccepted": "MXN",
        "paymentAccepted": "Cash, Credit Card, WhatsApp",
        "telephone": "+52-477-294-3124"
      }
    ]
  }

  const { signIn, signUp, loading: authLoading } = useAuth()
  const [scrollY, setScrollY] = useState(0)
  const [activeNav, setActiveNav] = useState('home')
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<Product[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [isCheckoutFormOpen, setIsCheckoutFormOpen] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [productDetailView, setProductDetailView] = useState<Product | null>(null)
  const [collectionFilter, setCollectionFilter] = useState<string | null>(null)
  const [isVideoMuted, setIsVideoMuted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)
  const [isStripeLoading, setIsStripeLoading] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  
  // Auth states
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authConfirmPassword, setAuthConfirmPassword] = useState('')
  const [authName, setAuthName] = useState('')
  const [authPhone, setAuthPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authSuccess, setAuthSuccess] = useState('')
  const [userOrders, setUserOrders] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)
  const [heroApi, setHeroApi] = useState<CarouselApi>()
  const [showHeaderLogo, setShowHeaderLogo] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slideProgress, setSlideProgress] = useState(0)
  const [showIntroVideo, setShowIntroVideo] = useState(true)
  const [introVideoEnded, setIntroVideoEnded] = useState(false)
  const introVideoRef = useRef<HTMLVideoElement>(null)
  const introVideoMobileRef = useRef<HTMLVideoElement>(null)
  const heroImagesDesktop = [
    'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/imagenportadahorizontal.png',
    'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/imagenportada2horizontal.png',
    'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/imagenportada3horizontal.png'
  ]
  const heroImagesMobile = [
    'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/imagenportada.png',
    'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/imagenportada2vertical.png',
    'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/imagenportada3vertical.png'
  ]
  
  const heroRef = useRef<HTMLDivElement>(null)
  const shopRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const philosophyRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

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

  // Auth functions
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setAuthSuccess('')
    
    try {
      if (authMode === 'login') {
        await signIn(authEmail, authPassword)
        setAuthSuccess(t.loginSuccess)
        // Load user orders after login
        if (user) {
          loadUserOrders(user.id)
        }
      } else {
        if (authPassword !== authConfirmPassword) {
          setAuthError('Las contraseñas no coinciden')
          return
        }
        await signUp(authEmail, authPassword, authName, authPhone)
        setAuthSuccess(t.registerSuccess)
      }
      // Reset form
      setAuthEmail('')
      setAuthPassword('')
      setAuthConfirmPassword('')
      setAuthName('')
      setAuthPhone('')
    } catch (error: any) {
      setAuthError(error.message || 'Error de autenticación')
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setUserOrders([])
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const loadUserOrders = async (userId: string) => {
    setLoadingOrders(true)
    try {
      const orders = await getUserOrders(userId)
      setUserOrders(orders || [])
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoadingOrders(false)
    }
  }

  // Load orders when user logs in
  useEffect(() => {
    if (user && isProfileOpen) {
      loadUserOrders(user.id)
    }
  }, [user, isProfileOpen])

  // Pre-fill customer info from user
  useEffect(() => {
    if (user?.email) {
      setCustomerName(user.email.split('@')[0] || '')
    }
  }, [user])

  // Pre-set carousel to third slide immediately when API is ready
  useEffect(() => {
    if (heroApi) {
      heroApi.scrollTo(2, true) // true = instant, no animation
    }
  }, [heroApi])

  // Lock body scroll while intro video is playing
  useEffect(() => {
    if (showIntroVideo) {
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.height = '100%'
      document.body.style.top = '0'
      document.body.style.left = '0'
    } else {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.height = ''
      document.body.style.top = ''
      document.body.style.left = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.width = ''
      document.body.style.height = ''
      document.body.style.top = ''
      document.body.style.left = ''
    }
  }, [showIntroVideo])

  // Intro video handler - for both desktop and mobile
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768
    const video = isDesktop ? introVideoRef.current : introVideoMobileRef.current
    if (!video) return

    const handleVideoEnd = () => {
      setIntroVideoEnded(true)
      setTimeout(() => {
        setShowIntroVideo(false)
      }, 300)
    }

    video.addEventListener('ended', handleVideoEnd)
    
    // Auto-play video
    video.play().catch(err => {
      console.log('Video autoplay failed:', err)
      // If autoplay fails, skip video
      setShowIntroVideo(false)
      setIntroVideoEnded(true)
    })

    return () => {
      video.removeEventListener('ended', handleVideoEnd)
    }
  }, [])

  // Hero carousel autoplay with progress bar
  useEffect(() => {
    if (!heroApi || showIntroVideo) return

    const slideDuration = 6000 // 6 seconds per slide
    const progressInterval = 50 // Update progress every 50ms
    let progress = 0

    const updateProgress = () => {
      progress += (progressInterval / slideDuration) * 100
      if (progress >= 100) {
        progress = 0
        heroApi.scrollNext()
      }
      setSlideProgress(progress)
    }

    const interval = setInterval(updateProgress, progressInterval)

    heroApi.on('select', () => {
      setCurrentSlide(heroApi.selectedScrollSnap())
      progress = 0
      setSlideProgress(0)
    })

    return () => {
      clearInterval(interval)
    }
  }, [heroApi, showIntroVideo])

  // Show/hide header logo based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = heroRef.current?.offsetHeight || window.innerHeight
      setShowHeaderLogo(window.scrollY > heroHeight - 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    setSelectedProduct(null)
    setSelectedSize('')
    trackEvent('add_to_cart', 'ecommerce', getProductName(product), product.price, {
      product_id: product.id,
      size: size,
      color: product.color
    })
  }

  const openSizeSelector = (product: Product) => {
    setSelectedProduct(product)
    setSelectedSize('')
  }

  const openProductDetail = (product: Product) => {
    setProductDetailView(product)
    setSelectedImageIndex(0)
    // Track product view
    trackProductView(product.id, getProductName(product))
    trackEvent('product_view', 'engagement', getProductName(product), product.price)
  }

  const openCollection = (collectionType: string) => {
    setCollectionFilter(collectionType)
  }

  const getFilteredProducts = () => {
    if (!collectionFilter) return products
    
    if (collectionFilter === 'deportivo') {
      // Productos 1-4: Tenis Deportivos Low
      return products.filter(p => p.id >= 1 && p.id <= 4)
    } else if (collectionFilter === 'alto') {
      // Productos 5-8, 14: Tenis Deportivos High
      return products.filter(p => (p.id >= 5 && p.id <= 8) || p.id === 14)
    } else if (collectionFilter === 'ballerina') {
      // Productos 10-13: Colección Ballerina
      return products.filter(p => p.id >= 10 && p.id <= 13)
    } else if (collectionFilter === 'multicolor') {
      // Producto 9: Colección Multicolor
      return products.filter(p => p.id === 9)
    } else if (collectionFilter === 'lightyear') {
      // Productos 15-18: Colección Lightyear
      return products.filter(p => p.id >= 15 && p.id <= 18)
    }
    return products
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

  const addWishlistToCart = () => {
    wishlist.forEach(product => openSizeSelector(product))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total = subtotal

  const openCheckoutForm = () => {
    setIsCheckoutFormOpen(true)
  }

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
        // Redirect to Stripe Checkout
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

    // Save order to Supabase (optional, don't block if fails)
    if (user?.id) {
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
          user.id,
          orderItems,
          {
            name: customerName,
            phone: customerPhone,
            email: user.email,
          },
          {
            subtotal: subtotal,
            shipping: 0,
            total: total,
          }
        )
      } catch (error) {
        // Silently fail and continue with WhatsApp
      }
    }

    const phoneNumber = '5214772943124'
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
    
    // Reset form
    setIsCheckoutFormOpen(false)
    setCustomerName('')
    setCustomerPhone('')
    setCart([])
    setIsCartOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      
      const reveals = document.querySelectorAll('.scroll-reveal')
      reveals.forEach((element) => {
        const rect = element.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight * 0.85
        
        if (isVisible) {
          element.classList.add('revealed')
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false)
        setIsWishlistOpen(false)
        setIsProfileOpen(false)
        setIsSearchOpen(false)
        setSelectedProduct(null)
        setIsCheckoutFormOpen(false)
        setProductDetailView(null)
        setCollectionFilter(null)
        setIsMenuOpen(false)
        setIsSizeGuideOpen(false)
        document.body.style.overflow = 'unset'
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  // Video play/pause based on visibility
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const playVideo = async () => {
      try {
        // Try to play with audio
        video.muted = false
        setIsVideoMuted(false)
        await video.play()
      } catch (error) {
        // If autoplay with audio fails, play muted
        console.log('Autoplay with audio blocked, playing muted')
        video.muted = true
        setIsVideoMuted(true)
        video.play()
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playVideo()
          } else {
            video.pause()
          }
        })
      },
      { threshold: 0.3 }
    )

    observer.observe(video)

    return () => {
      observer.disconnect()
    }
  }, [])

  // Prevent body scroll when modals are open
  useEffect(() => {
    const hasOpenModal = selectedProduct || productDetailView || collectionFilter || isCheckoutFormOpen || isSizeGuideOpen
    
    if (hasOpenModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedProduct, productDetailView, collectionFilter, isCheckoutFormOpen, isSizeGuideOpen])

  return (
    <>
      {/* Analytics Tracker */}
      <AnalyticsTracker />
      
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Intro Video Overlay - Desktop and Mobile */}
      {showIntroVideo && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100dvh',
          backgroundColor: '#000',
          zIndex: 9999,
          overflow: 'hidden',
          touchAction: 'none',
          opacity: introVideoEnded ? 0 : 1,
          transition: 'opacity 0.5s ease-out'
        }}>
          {/* Desktop Video */}
          <video
            ref={introVideoRef}
            className="hidden md:block"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100vw',
              height: '100vh',
              minWidth: '100%',
              minHeight: '100%',
              objectFit: 'cover'
            }}
            playsInline
            muted
            preload="auto"
          >
            <source src="https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/videosuk/hf_20260122_193233_d709af2e-e871-41f2-ba47-7cb4d1fa2880.mp4" type="video/mp4" />
          </video>
          {/* Mobile Video */}
          <video
            ref={introVideoMobileRef}
            className="md:hidden"
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100vw',
              height: '100dvh',
              objectFit: 'contain'
            }}
            playsInline
            muted
            preload="auto"
          >
            <source src="https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/videosuk/hf_20260122_203312_63a04753-3358-436e-bfef-cdaf36f92739.mp4" type="video/mp4" />
          </video>
        </div>
      )}
      
      <div className="min-h-screen bg-background relative">
        {/* Christmas Effects */}
        <ChristmasEffects />

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transform: showHeaderLogo ? 'translateY(0)' : 'translateY(-100%)',
        opacity: showHeaderLogo ? 1 : 0,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#E0E5EC',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease'
        }}>
          {/* Language Switcher - Left */}
          <div style={{ flex: '0 0 auto' }}>
            <LanguageSwitcher />
          </div>
          
          {/* Logo - Center */}
          <div style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div className={`transition-all duration-300 ${showHeaderLogo ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <img 
                src="/vincero LOGO.png" 
                alt="Vincero Logo" 
                style={{
                  height: '2rem',
                  width: 'auto'
                }}
              />
            </div>
          </div>

          {/* Cart - Right */}
          <button 
            onClick={() => setIsCartOpen(true)} 
            style={{
              position: 'relative',
              flex: '0 0 auto',
              padding: '0.5rem',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <ShoppingCart style={{ width: '1.5rem', height: '1.5rem', color: 'rgb(30, 30, 30)' }} />
            {cart.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-0.25rem',
                right: '-0.25rem',
                width: '1.125rem',
                height: '1.125rem',
                backgroundColor: 'rgb(251, 191, 36)',
                color: 'white',
                fontSize: '0.625rem',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {cart.length}
              </span>
            )}
          </button>
        </nav>
      </header>

      <section 
        ref={heroRef}
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Hero Carousel Background */}
        <div className="absolute inset-0">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            setApi={setHeroApi}
            className="w-full h-full"
          >
            <CarouselContent className="h-full -ml-0">
              {heroImagesDesktop.map((img, index) => (
                <CarouselItem key={index} className="pl-0 basis-full h-full">
                  {/* Desktop Image */}
                  <div 
                    className="hero-slide-transition hidden md:block"
                    style={{
                      width: '100%',
                      height: '100vh',
                      backgroundImage: `url(${img})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  />
                  {/* Mobile Image */}
                  <div 
                    className="hero-slide-transition md:hidden"
                    style={{
                      width: '100%',
                      height: '100vh',
                      backgroundImage: `url(${heroImagesMobile[index]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        {/* Progress Bar Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3">
          {heroImagesDesktop.map((_, index) => (
            <button
              key={index}
              onClick={() => heroApi?.scrollTo(index)}
              className="group relative"
            >
              <div className={`w-12 md:w-16 h-1 rounded-full overflow-hidden transition-all duration-300 ${
                currentSlide === index ? 'bg-white/30' : 'bg-white/20 hover:bg-white/30'
              }`}>
                {currentSlide === index && (
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-75 ease-linear"
                    style={{ width: `${slideProgress}%` }}
                  />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), transparent, rgba(0,0,0,0.3))',
          zIndex: 10
        }} />

        <div className="absolute inset-0 flex flex-col items-center z-50 px-4 pointer-events-none">
          <div className="text-center animate-fade-in-up bg-black/25 backdrop-blur-[3px] px-5 py-3 md:px-6 md:py-4 rounded-xl border border-white/10 mt-16 md:mt-20 pointer-events-auto">
            <img 
              src="/vincero LOGO.png" 
              alt="Vincero" 
              className="h-10 md:h-12 lg:h-14 w-auto mx-auto mb-1 md:mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]" 
            />
            <p className="text-xs md:text-sm text-white/90 tracking-[0.15em] font-light italic">
              {t.heroSubtitle}
            </p>
          </div>

          {currentSlide === 0 && (
            <div className="absolute bottom-32 md:bottom-40 animate-fade-in-up-delayed pointer-events-auto">
              <Button 
                size="lg" 
                onClick={() => {
                  setActiveNav('shop')
                  shopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className="px-6 md:px-8 lg:px-10 py-4 md:py-5 lg:py-6 text-sm md:text-base lg:text-lg rounded-full border-2 border-foreground/20 backdrop-blur-md bg-background/10 hover:bg-foreground hover:text-background transition-all duration-300 shadow-2xl"
              >
                {t.exploreDesigns}
              </Button>
            </div>
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/40 pointer-events-none z-30" />
      </section>

      {/* Promotions Carousel */}
      <section className="py-8 md:py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              <CarouselItem className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                <div className="relative h-40 md:h-48 rounded-2xl overflow-hidden bg-card p-6 flex items-center" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}>
                  <div className="z-10">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Promoción Especial</p>
                    <h3 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">Envío Gratis</h3>
                    <p className="text-sm text-muted-foreground">En compras mayores a $800 MXN</p>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                <div className="relative h-40 md:h-48 rounded-2xl overflow-hidden bg-card p-6 flex items-center" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}>
                  <div className="z-10">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Calidad Garantizada</p>
                    <h3 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">30 Días</h3>
                    <p className="text-sm text-muted-foreground">Garantía de devolución</p>
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                <div className="relative h-40 md:h-48 rounded-2xl overflow-hidden bg-card p-6 flex items-center" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}>
                  <div className="z-10">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Atención Personalizada</p>
                    <h3 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">WhatsApp</h3>
                    <p className="text-sm text-muted-foreground">Respuesta inmediata</p>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
          <p className="text-center text-sm text-muted-foreground mt-4 md:hidden">← Desliza para ver más →</p>
        </div>
      </section>

      <div style={{ 
        position: 'fixed', 
        bottom: '1.5rem', 
        left: '50%', 
        transform: `translateX(-50%) translateY(${showHeaderLogo ? '0' : '150%'})`,
        zIndex: 50,
        transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease',
        opacity: showHeaderLogo ? 1 : 0,
      }}>
        <nav className="glass-panel" style={{ 
          position: 'relative',
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.25rem',
          padding: '0.625rem 1rem',
          borderRadius: '9999px',
          overflow: 'hidden'
        }}>
          {/* Animated gradient background blob */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: activeNav === 'home' ? '8%' : activeNav === 'discover' ? '28%' : activeNav === 'wishlist' ? '48%' : activeNav === 'profile' ? '68%' : '88%',
            transform: 'translate(-50%, -50%)',
            width: '3.5rem',
            height: '3.5rem',
            background: activeNav === 'wishlist' 
              ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.4) 0%, rgba(220, 38, 38, 0.3) 100%)'
              : 'linear-gradient(135deg, rgba(212, 175, 55, 0.5) 0%, rgba(212, 175, 55, 0.4) 100%)',
            borderRadius: '50%',
            filter: 'blur(16px)',
            transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            opacity: 0.8,
            pointerEvents: 'none',
            zIndex: 0
          }} />

          <button 
            onClick={() => {
              setActiveNav('home')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            style={{ 
              position: 'relative',
              padding: '0.5rem', 
              cursor: 'pointer', 
              background: 'none', 
              border: 'none',
              zIndex: 1
            }}
          >
            <div style={{ 
              width: '2.5rem', 
              height: '2.5rem', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: activeNav === 'home' ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
              transform: activeNav === 'home' ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: activeNav === 'home' ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none'
            }}>
              <Home className={`w-5 h-5 transition-all duration-300 ${activeNav === 'home' ? 'text-gray-900' : 'text-gray-700'}`} />
            </div>
          </button>

          <button 
            onClick={() => {
              setActiveNav('discover')
              setIsSearchOpen(true)
            }}
            style={{ 
              position: 'relative',
              padding: '0.5rem', 
              cursor: 'pointer', 
              background: 'none', 
              border: 'none',
              zIndex: 1
            }}
          >
            <div style={{ 
              width: '2.5rem', 
              height: '2.5rem', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: activeNav === 'discover' ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
              transform: activeNav === 'discover' ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: activeNav === 'discover' ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none'
            }}>
              <Search className={`w-5 h-5 transition-all duration-300 ${activeNav === 'discover' ? 'text-gray-900' : 'text-gray-700'}`} />
            </div>
          </button>

          <button 
            onClick={() => {
              setActiveNav('wishlist')
              setIsWishlistOpen(true)
            }}
            style={{ 
              position: 'relative',
              padding: '0.5rem', 
              cursor: 'pointer', 
              background: 'none', 
              border: 'none',
              zIndex: 1
            }}
          >
            <div style={{ 
              width: '2.5rem', 
              height: '2.5rem', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: activeNav === 'wishlist' ? 'rgba(244, 63, 94, 0.95)' : 'transparent',
              transform: activeNav === 'wishlist' ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: activeNav === 'wishlist' ? '0 4px 12px rgba(244, 63, 94, 0.4)' : 'none'
            }}>
              <Heart className={`w-5 h-5 transition-all duration-300 ${activeNav === 'wishlist' ? 'text-white' : 'text-gray-700'} ${wishlist.length > 0 ? 'fill-current' : ''}`} />
            </div>
            {wishlist.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-0.25rem',
                right: '-0.25rem',
                width: '1.125rem',
                height: '1.125rem',
                background: 'linear-gradient(135deg, rgb(244, 63, 94) 0%, rgb(220, 38, 38) 100%)',
                color: 'white',
                fontSize: '0.625rem',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 2px 8px rgba(244, 63, 94, 0.4)'
              }}>
                {wishlist.length}
              </span>
            )}
          </button>

          <button 
            onClick={() => {
              setActiveNav('profile')
              setIsProfileOpen(true)
            }}
            style={{ 
              position: 'relative',
              padding: '0.5rem', 
              cursor: 'pointer', 
              background: 'none', 
              border: 'none',
              zIndex: 1
            }}
          >
            <div style={{ 
              width: '2.5rem', 
              height: '2.5rem', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: activeNav === 'profile' ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
              transform: activeNav === 'profile' ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: activeNav === 'profile' ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none'
            }}>
              <User className={`w-5 h-5 transition-all duration-300 ${activeNav === 'profile' ? 'text-gray-900' : 'text-gray-700'}`} />
            </div>
          </button>

          <button 
            onClick={() => {
              setActiveNav('menu')
              setIsMenuOpen(!isMenuOpen)
            }}
            style={{ 
              position: 'relative',
              padding: '0.5rem', 
              cursor: 'pointer', 
              background: 'none', 
              border: 'none',
              zIndex: 1
            }}
          >
            <div style={{ 
              width: '2.5rem', 
              height: '2.5rem', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: activeNav === 'menu' || isMenuOpen ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
              transform: activeNav === 'menu' || isMenuOpen ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow: activeNav === 'menu' || isMenuOpen ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none'
            }}>
              <Menu className={`w-5 h-5 transition-all duration-300 ${activeNav === 'menu' || isMenuOpen ? 'text-gray-900' : 'text-gray-700'}`} />
            </div>
          </button>
        </nav>

        {/* Menu Popup */}
        {isMenuOpen && (
          <div className="glass-panel" style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '0.75rem',
            borderRadius: '1.25rem',
            padding: '0.75rem',
            minWidth: '180px',
            animation: 'fadeInUp 0.3s ease-out'
          }}>
            <a href="/" style={{ display: 'block', padding: '0.875rem 1.25rem', color: '#4A5568', textDecoration: 'none', borderRadius: '0.75rem', fontSize: '0.9375rem', fontWeight: '500', transition: 'all 0.2s' }} className="hover:bg-white/40">
              {t.home}
            </a>
            <a href="/catalog" style={{ display: 'block', padding: '0.875rem 1.25rem', color: '#4A5568', textDecoration: 'none', borderRadius: '0.75rem', fontSize: '0.9375rem', fontWeight: '500', transition: 'all 0.2s' }} className="hover:bg-white/40">
              {t.catalog}
            </a>
            <a href="/features" style={{ display: 'block', padding: '0.875rem 1.25rem', color: '#4A5568', textDecoration: 'none', borderRadius: '0.75rem', fontSize: '0.9375rem', fontWeight: '500', transition: 'all 0.2s' }} className="hover:bg-white/40">
              {t.whyChoose}
            </a>
            <a href="/about" style={{ display: 'block', padding: '0.875rem 1.25rem', color: '#4A5568', textDecoration: 'none', borderRadius: '0.75rem', fontSize: '0.9375rem', fontWeight: '500', transition: 'all 0.2s' }} className="hover:bg-white/40">
              {t.aboutUs}
            </a>
          </div>
        )}
      </div>

      {isCartOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center">
          <Card className="w-full md:max-w-2xl max-h-[90vh] md:max-h-[80vh] overflow-hidden flex flex-col rounded-t-3xl md:rounded-xl">
            <div className="p-4 md:p-6 border-b flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold">{t.shoppingCart}</h2>
              <button onClick={() => setIsCartOpen(false)} className="hover:bg-muted rounded-full p-2 transition-colors">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 md:w-16 md:h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-base md:text-lg text-muted-foreground">{t.emptyCart}</p>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {cart.map((item, idx) => (
                    <div key={`${item.id}-${item.size}-${idx}`} className="flex gap-3 md:gap-4 p-3 md:p-4 border rounded-lg">
                      <img src={item.image || "/placeholder.svg"} alt={getProductName(item)} className="w-16 h-16 md:w-20 md:h-20 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm md:text-base truncate">{getProductName(item)}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground">Color: {item.color} | Talla: {item.size}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">${(item.price / 100).toFixed(2)} MXN</p>
                        <div className="flex items-center gap-1.5 md:gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 md:w-8 text-center font-medium text-sm md:text-base">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right flex flex-col justify-between">
                        <p className="font-bold text-sm md:text-base">${((item.price * item.quantity) / 100).toFixed(2)}</p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs md:text-sm text-destructive hover:underline"
                        >
                          {t.remove}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 md:p-6 border-t bg-muted/30">
                <div className="space-y-1.5 md:space-y-2 mb-4">
                  <div className="flex justify-between text-base md:text-lg">
                    <span>{t.subtotal}:</span>
                    <span>${(subtotal / 100).toFixed(2)} MXN</span>
                  </div>
                  <div className="flex justify-between text-xl md:text-2xl font-bold">
                    <span>{t.total}:</span>
                    <span>${(total / 100).toFixed(2)} MXN</span>
                  </div>
                  {total < 80000 && (
                    <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg mt-2">
                      <Truck className="w-4 h-4 flex-shrink-0" />
                      <span>{t.minPurchaseShipping}</span>
                    </div>
                  )}
                  {total >= 80000 && (
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-950/30 p-3 rounded-lg mt-2">
                      <Truck className="w-4 h-4 flex-shrink-0" />
                      <span>{t.freeShippingInfo}</span>
                    </div>
                  )}
                </div>
                <Button 
                  onClick={openCheckoutForm}
                  className="w-full py-5 md:py-6 text-base md:text-lg"
                  size="lg"
                >
                  <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  {t.checkout}
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {isWishlistOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center">
          <Card className="w-full md:max-w-2xl max-h-[90vh] md:max-h-[80vh] overflow-hidden flex flex-col rounded-t-3xl md:rounded-xl">
            <div className="p-4 md:p-6 border-b flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold">{t.myWishlist}</h2>
              <button onClick={() => setIsWishlistOpen(false)} className="hover:bg-muted rounded-full p-2 transition-colors">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              {wishlist.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-12 h-12 md:w-16 md:h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-base md:text-lg text-muted-foreground mb-2">{t.emptyWishlist}</p>
                  <p className="text-sm text-muted-foreground">{t.emptyWishlistDesc}</p>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {wishlist.map(item => (
                    <div key={item.id} className="flex gap-3 md:gap-4 p-3 md:p-4 border rounded-lg hover:border-primary/50 transition-colors">
                      <img src={item.image || "/placeholder.svg"} alt={getProductName(item)} className="w-20 h-20 md:w-24 md:h-24 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm md:text-base mb-1">{getProductName(item)}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground mb-2">{getProductDescription(item)}</p>
                        <div className="flex items-center gap-2">
                          <Star className="w-3 h-3 md:w-4 md:h-4 fill-primary text-primary" />
                          <span className="text-xs md:text-sm font-medium">{item.rating}</span>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between items-end">
                        <p className="font-bold text-sm md:text-lg">${(item.price / 100).toFixed(2)}</p>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              openSizeSelector(item)
                              toggleWishlist(item)
                            }}
                            size="sm"
                            className="text-xs"
                          >
                            {t.add}
                          </Button>
                          <button
                            onClick={() => toggleWishlist(item)}
                            className="text-xs text-destructive hover:underline"
                          >
                            {t.removeItem}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {wishlist.length > 0 && (
              <div className="p-4 md:p-6 border-t bg-muted/30">
                <Button 
                  onClick={() => {
                    addWishlistToCart()
                    setIsWishlistOpen(false)
                    setIsCartOpen(true)
                  }}
                  className="w-full py-5 md:py-6 text-base md:text-lg"
                  size="lg"
                >
                  <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  {t.addAll} ({wishlist.length})
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {isSearchOpen && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-xl z-[100] flex flex-col animate-in fade-in duration-300">
          <div className="container mx-auto px-4 md:px-6 py-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t.searchProducts}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-12 md:pl-14 pr-4 py-4 md:py-6 text-lg md:text-2xl bg-muted/50 border-2 border-border focus:border-primary rounded-2xl outline-none transition-colors"
                />
              </div>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => {
                  setIsSearchOpen(false)
                  setSearchQuery('')
                }}
                className="text-base"
              >
                {t.cancel}
              </Button>
            </div>

            <div className="max-w-4xl mx-auto">
              {searchQuery === '' ? (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                  <p className="text-lg text-muted-foreground">{t.typeToSearch}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    {t.resultsFor} "{searchQuery}"
                  </p>
                  {products
                    .filter(product => 
                      getProductName(product).toLowerCase().includes(searchQuery.toLowerCase()) ||
                      getProductDescription(product).toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(product => (
                      <div
                        key={product.id}
                        className="flex gap-4 p-4 border rounded-xl hover:border-primary/50 hover:bg-muted/50 transition-all cursor-pointer"
                        onClick={() => {
                          setIsSearchOpen(false)
                          setSearchQuery('')
                          shopRef.current?.scrollIntoView({ behavior: 'smooth' })
                        }}
                      >
                        <img src={product.image || "/placeholder.svg"} alt={getProductName(product)} className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h3 className="font-bold text-base md:text-lg mb-1">{getProductName(product)}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{getProductDescription(product)}</p>
                          <div className="flex items-center gap-4">
                            <p className="font-bold text-lg">${(product.price / 100).toFixed(2)} MXN</p>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-primary text-primary" />
                              <span className="text-sm">{product.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  {products.filter(product => 
                    getProductName(product).toLowerCase().includes(searchQuery.toLowerCase()) ||
                    getProductDescription(product).toLowerCase().includes(searchQuery.toLowerCase())
                  ).length === 0 && (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                      <p className="text-lg text-muted-foreground">{t.noProductsFound}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isProfileOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center">
          <Card className="w-full md:max-w-2xl max-h-[90vh] md:max-h-[80vh] overflow-hidden flex flex-col rounded-t-3xl md:rounded-xl">
            <div className="p-4 md:p-6 border-b flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold">{user ? t.myAccount : t.myProfile}</h2>
              <button onClick={() => setIsProfileOpen(false)} className="hover:bg-muted rounded-full p-2 transition-colors">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              {user ? (
                // Logged in view
                <div>
                  <div className="text-center mb-8">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{user.email}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>

                  <div className="space-y-4 max-w-md mx-auto">
                    {/* Orders Section */}
                    <div className="mb-6">
                      <h4 className="font-bold text-lg mb-4">{t.orderHistory}</h4>
                      {loadingOrders ? (
                        <div className="text-center py-8">
                          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                        </div>
                      ) : userOrders.length === 0 ? (
                        <Card className="p-6 text-center">
                          <Package className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">{t.noOrders}</p>
                        </Card>
                      ) : (
                        <div className="space-y-3">
                          {userOrders.map((order) => (
                            <Card key={order.id} className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="font-bold">#{order.id.slice(0, 8)}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(order.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                  order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                  order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-700' :
                                  order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {t[`status${order.status.charAt(0).toUpperCase() + order.status.slice(1)}` as keyof typeof t] || order.status}
                                </span>
                              </div>
                              <p className="font-bold text-lg">${(order.total / 100).toFixed(2)} MXN</p>
                              <p className="text-sm text-muted-foreground">
                                {order.order_items?.length || 0} productos
                              </p>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>

                    <Card className="p-4 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => {
                      setIsProfileOpen(false)
                      setIsWishlistOpen(true)
                    }}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center">
                          <Heart className="w-6 h-6 text-rose-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold">{t.myWishlist}</h4>
                          <p className="text-sm text-muted-foreground">{wishlist.length} productos</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </Card>

                    <Card className="p-4 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => {
                      window.open('https://wa.me/5214772943124', '_blank')
                    }}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <MessageCircle className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold">{t.support}</h4>
                          <p className="text-sm text-muted-foreground">{t.contactWhatsApp}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </Card>
                  </div>
                </div>
              ) : (
                // Login/Register view
                <div>
                  <div className="text-center mb-8">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-1">
                      {authMode === 'login' ? t.welcomeBack : t.joinUs}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {authMode === 'login' ? t.loginToContinue : t.createAccount}
                    </p>
                  </div>

                  <form onSubmit={handleAuth} className="space-y-4 max-w-md mx-auto">
                    {authError && (
                      <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                        {authError}
                      </div>
                    )}
                    {authSuccess && (
                      <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                        {authSuccess}
                      </div>
                    )}

                    {authMode === 'register' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium mb-2">{t.fullName}</label>
                          <input
                            type="text"
                            value={authName}
                            onChange={(e) => setAuthName(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-primary outline-none transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">{t.phoneNumber}</label>
                          <input
                            type="tel"
                            value={authPhone}
                            onChange={(e) => setAuthPhone(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-primary outline-none transition-colors"
                            required
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-2">{t.email}</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="email"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border-2 border-border rounded-lg focus:border-primary outline-none transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">{t.password}</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          className="w-full pl-10 pr-12 py-3 border-2 border-border rounded-lg focus:border-primary outline-none transition-colors"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {authMode === 'register' && (
                      <div>
                        <label className="block text-sm font-medium mb-2">{t.confirmPassword}</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={authConfirmPassword}
                            onChange={(e) => setAuthConfirmPassword(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 border-border rounded-lg focus:border-primary outline-none transition-colors"
                            required
                          />
                        </div>
                      </div>
                    )}

                    <Button type="submit" className="w-full py-5 text-base" size="lg">
                      {authMode === 'login' ? t.login : t.register}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      {authMode === 'login' ? t.noAccount : t.hasAccount}{' '}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode(authMode === 'login' ? 'register' : 'login')
                          setAuthError('')
                          setAuthSuccess('')
                        }}
                        className="text-primary font-medium hover:underline"
                      >
                        {authMode === 'login' ? t.register : t.login}
                      </button>
                    </p>
                  </form>
                </div>
              )}
            </div>

            {user && (
              <div className="p-4 md:p-6 border-t bg-muted/30">
                <Button 
                  variant="outline"
                  onClick={handleSignOut}
                  className="w-full py-5 md:py-6 text-base md:text-lg text-red-500 hover:text-red-600 hover:bg-red-50"
                  size="lg"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  {t.logout}
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center p-4">
          <Card className="w-full md:max-w-lg max-h-[85vh] md:max-h-[80vh] overflow-hidden flex flex-col rounded-t-3xl md:rounded-xl">
            <div className="p-4 md:p-6 border-b flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold">{t.selectSize}</h2>
              <button onClick={() => setSelectedProduct(null)} className="hover:bg-muted rounded-full p-2 transition-colors">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className="flex gap-4 mb-6 p-4 border rounded-lg bg-muted/30">
                <img src={selectedProduct.image || "/placeholder.svg"} alt={getProductName(selectedProduct)} className="w-20 h-20 md:w-24 md:h-24 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-bold text-base md:text-lg mb-1">{getProductName(selectedProduct)}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{t.color}: {selectedProduct.color}</p>
                  <p className="text-lg font-bold text-primary">${(selectedProduct.price / 100).toFixed(2)} MXN</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground mb-3">{t.availableSizes}</p>
                <div className="grid grid-cols-3 gap-3">
                  {getAvailableSizes(selectedProduct).map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`p-4 border-2 rounded-lg font-bold text-lg transition-all ${
                        selectedSize === size
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary/50 hover:bg-muted'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6 border-t bg-muted/30">
              <Button 
                onClick={confirmAddToCart}
                disabled={!selectedSize}
                className="w-full py-5 md:py-6 text-base md:text-lg"
                size="lg"
              >
                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                {selectedSize ? `${t.addSize} ${selectedSize}` : t.selectSizeFirst}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {isCheckoutFormOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center pb-20 md:pb-0">
          <Card className="w-full md:max-w-lg max-h-[85vh] md:max-h-[80vh] overflow-hidden flex flex-col rounded-t-3xl md:rounded-xl mb-safe">
            <div className="p-4 md:p-6 border-b flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold">{t.completeData}</h2>
              <button onClick={() => setIsCheckoutFormOpen(false)} className="hover:bg-muted rounded-full p-2 transition-colors">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">{t.fullName} *</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej: Juan Pérez"
                    className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-primary outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t.phoneNumber} *</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Ej: 4771234567"
                    className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-primary outline-none transition-colors"
                  />
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-bold text-lg mb-3">{t.orderSummary}</h3>
                  <div className="space-y-2">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{getProductName(item)} ({item.color}, {item.size}) x{item.quantity}</span>
                        <span className="font-medium">${((item.price * item.quantity) / 100).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t">
                    <span>{t.total}:</span>
                    <span>${(total / 100).toFixed(2)} MXN</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6 border-t bg-muted/30 pb-6 md:pb-6 space-y-3">
              <Button 
                onClick={handleStripeCheckout}
                disabled={isStripeLoading}
                className="w-full py-5 md:py-6 text-base md:text-lg shadow-lg bg-[#635BFF] hover:bg-[#5851DB]"
                size="lg"
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
                  <span className="bg-muted/30 px-2 text-muted-foreground">o</span>
                </div>
              </div>
              <Button 
                onClick={handleWhatsAppCheckout}
                disabled={!customerName.trim() || !customerPhone.trim()}
                variant="outline"
                className="w-full py-5 md:py-6 text-base md:text-lg border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
                size="lg"
              >
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                {t.sendOrderWhatsApp}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {productDetailView && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center">
          <Card className="w-full md:max-w-4xl max-h-[90vh] md:max-h-[85vh] overflow-hidden flex flex-col rounded-t-3xl md:rounded-xl">
            <div className="p-4 md:p-6 border-b flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold">{t.productDetails}</h2>
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
                      src={productDetailView.images && productDetailView.images.length > 0 ? productDetailView.images[selectedImageIndex] : productDetailView.image || "/placeholder.svg"}
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
                            className={`w-5 h-5 ${i < Math.floor(productDetailView.rating) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-lg font-medium">{productDetailView.rating}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gradient">${(productDetailView.price / 100).toFixed(2)} MXN</span>
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
                        <span className="font-medium">{productDetailView.descriptionType === 'high' ? '17mx - 21mx' : productDetailView.descriptionType === 'winter' ? '13mx - 17mx' : '13mx - 17mx'}</span>
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
                      {t.addToCart}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {collectionFilter && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center p-4">
          <Card className="w-full md:max-w-6xl max-h-[90vh] overflow-hidden flex flex-col rounded-t-3xl md:rounded-xl">
            <div className="p-4 md:p-6 border-b flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold">
                {collectionFilter === 'deportivo' ? t.sportCollection : 
                 collectionFilter === 'alto' ? t.highCollection : 
                 collectionFilter === 'ballerina' ? t.ballerinaCollection :
                 collectionFilter === 'multicolor' ? t.multicolorCollection :
                 collectionFilter === 'lightyear' ? t.seasonLightyear : t.winterCollection}
              </h2>
              <button onClick={() => setCollectionFilter(null)} className="hover:bg-muted rounded-full p-2 transition-colors">
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden p-4 md:p-6">
              <p className="text-center text-sm text-muted-foreground mb-4 md:hidden">← Desliza para ver más →</p>
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {getFilteredProducts().map((product) => {
                    const isInWishlist = wishlist.some(item => item.id === product.id)
                    return (
                      <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-[85%] md:basis-1/2 lg:basis-1/3">
                        <Card 
                          className="group cursor-pointer overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 h-full"
                        >
                          <div className="relative overflow-hidden bg-gradient-to-br from-secondary/50 to-accent/20">
                            {getProductBadge(product) && (
                              <div className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium">
                                {getProductBadge(product)}
                              </div>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleWishlist(product)
                              }}
                              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                            >
                              <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-rose-500 text-rose-500' : 'text-foreground'}`} />
                            </button>

                            <div className="relative h-64 overflow-hidden" onClick={() => openProductDetail(product)}>
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={getProductName(product)}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                          </div>

                          <div className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-xl font-bold group-hover:text-primary transition-colors cursor-pointer" onClick={() => openProductDetail(product)}>
                                {getProductName(product)}
                              </h3>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-primary text-primary" />
                                <span className="text-sm font-medium">{product.rating}</span>
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground mb-4 leading-relaxed text-sm line-clamp-2">
                              {getProductDescription(product)}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground line-through">$649.00</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl font-bold text-gradient">${(product.price / 100).toFixed(2)}</span>
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
                      </CarouselItem>
                    )
                  })}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex -left-4 bg-background/80 backdrop-blur-sm" />
                <CarouselNext className="hidden md:flex -right-4 bg-background/80 backdrop-blur-sm" />
              </Carousel>
            </div>
          </Card>
        </div>
      )}

      <section ref={shopRef} className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              {t.bestSellers}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t.bestSellersDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product, index) => {
              const isInWishlist = wishlist.some(item => item.id === product.id)
              return (
                <Card 
                  key={product.id} 
                  className="group cursor-pointer overflow-hidden border-0 transition-all duration-300 scroll-reveal neu-shadow"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    backgroundColor: '#E0E5EC',
                    borderRadius: '1.5rem'
                  }}
                >
                  <div className="relative overflow-hidden" style={{ backgroundColor: '#d1d5db', borderRadius: '1.5rem 1.5rem 0 0' }}>
                    {getProductBadge(product) && (
                      <div className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium">
                        {getProductBadge(product)}
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleWishlist(product)
                      }}
                      className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-rose-500 text-rose-500' : 'text-foreground'}`} />
                    </button>

                    <div className="relative aspect-[4/3] overflow-hidden cursor-pointer" onClick={(e) => {
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

          <div className="text-center mt-12 scroll-reveal">
            <Button 
              size="lg" 
              variant="outline" 
              className="text-base px-8 py-6 border-2"
              onClick={() => window.location.href = '/shop'}
            >
              {t.viewCollection}
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      <section ref={featuresRef} className="py-24 lg:py-32 relative bg-muted/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16 scroll-reveal">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              {t.whyChoose}{' '}
              <span className="text-gradient">{t.whyChooseHighlight}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t.whyChooseDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card className="md:col-span-2 lg:row-span-2 p-8 bg-card border-0 hover:shadow-xl transition-all duration-300 group scroll-reveal" style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}>
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">{t.qualityGuarantee}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    {t.qualityGuaranteeDesc}
                  </p>
                </div>
                <div className="relative h-48 rounded-xl overflow-hidden">
                  <img
                    src="/1.png"
                    alt="Tenis Vincero Chocolate"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-8 bg-card border-0 hover:shadow-xl transition-all duration-300 group scroll-reveal" style={{ animationDelay: '0.1s', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}>
              <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{t.innovativeDesign}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.innovativeDesignDesc}
              </p>
            </Card>

            <Card className="p-8 bg-card border-0 hover:shadow-xl transition-all duration-300 group scroll-reveal" style={{ animationDelay: '0.2s', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}>
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{t.totalComfort}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.totalComfortDesc}
              </p>
            </Card>

            <Card 
              className="relative overflow-hidden group scroll-reveal cursor-pointer" 
              style={{ animationDelay: '0.3s' }}
              onClick={() => openCollection('deportivo')}
            >
              <Carousel opts={{ align: "start", loop: true, duration: 20, skipSnaps: false }} className="w-full">
                <CarouselContent className="-ml-0">
                  {products.filter(p => p.id >= 1 && p.id <= 4).map((product) => (
                    <CarouselItem key={product.id} className="pl-0 basis-full">
                      <div className="relative" onClick={(e) => {
                        e.stopPropagation()
                        openSizeSelector(product)
                      }}>
                        <img
                          src={product.image}
                          alt={getProductName(product)}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/90 to-transparent p-4 pointer-events-none">
                <div className="text-white">
                  <div className="text-lg font-bold">{t.sportCollection}</div>
                  <div className="text-xs opacity-90">{t.styleComfort}</div>
                  <div className="text-xs mt-1 opacity-70">← Desliza →</div>
                </div>
              </div>
            </Card>

            <Card 
              className="relative overflow-hidden group scroll-reveal cursor-pointer" 
              style={{ animationDelay: '0.4s' }}
              onClick={() => openCollection('alto')}
            >
              <Carousel opts={{ align: "start", loop: true, duration: 20, skipSnaps: false }} className="w-full">
                <CarouselContent className="-ml-0">
                  {products.filter(p => p.id >= 5 && p.id <= 8).map((product) => (
                    <CarouselItem key={product.id} className="pl-0 basis-full">
                      <div className="relative" onClick={(e) => {
                        e.stopPropagation()
                        openSizeSelector(product)
                      }}>
                        <img
                          src={product.image}
                          alt={getProductName(product)}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/90 to-transparent p-4 pointer-events-none">
                <div className="text-white">
                  <div className="text-lg font-bold">{t.highCollection}</div>
                  <div className="text-xs opacity-90">{t.newSportCollection}</div>
                  <div className="text-xs mt-1 opacity-70">← Desliza →</div>
                </div>
              </div>
            </Card>

            <Card 
              className="relative overflow-hidden group scroll-reveal cursor-pointer" 
              style={{ animationDelay: '0.5s' }}
              onClick={() => openCollection('ballerina')}
            >
              <Carousel opts={{ align: "start", loop: true, duration: 20, skipSnaps: false }} className="w-full">
                <CarouselContent className="-ml-0">
                  {products.filter(p => p.id >= 10 && p.id <= 13).map((product) => (
                    <CarouselItem key={product.id} className="pl-0 basis-full">
                      <div className="relative" onClick={(e) => {
                        e.stopPropagation()
                        openSizeSelector(product)
                      }}>
                        <img
                          src={product.image}
                          alt={getProductName(product)}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/90 to-transparent p-4 pointer-events-none">
                <div className="text-white">
                  <div className="text-lg font-bold">{t.ballerinaCollection}</div>
                  <div className="text-xs opacity-90">{t.styleComfort}</div>
                  <div className="text-xs mt-1 opacity-70">← Desliza →</div>
                </div>
              </div>
            </Card>

            <Card 
              className="relative overflow-hidden group scroll-reveal cursor-pointer" 
              style={{ animationDelay: '0.6s' }}
              onClick={() => openCollection('multicolor')}
            >
              <Carousel opts={{ align: "start", loop: true, duration: 20, skipSnaps: false }} className="w-full">
                <CarouselContent className="-ml-0">
                  {products.filter(p => p.id === 9).map((product) => (
                    <CarouselItem key={product.id} className="pl-0 basis-full">
                      <div className="relative" onClick={(e) => {
                        e.stopPropagation()
                        openSizeSelector(product)
                      }}>
                        <img
                          src={product.image}
                          alt={getProductName(product)}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/90 to-transparent p-4 pointer-events-none">
                <div className="text-white">
                  <div className="text-lg font-bold">{t.multicolorCollection}</div>
                  <div className="text-xs opacity-90">{t.winterStyle}</div>
                  <div className="text-xs mt-1 opacity-70">← Desliza →</div>
                </div>
              </div>
            </Card>

            <Card 
              className="relative overflow-hidden group scroll-reveal cursor-pointer" 
              style={{ animationDelay: '0.7s' }}
              onClick={() => openCollection('lightyear')}
            >
              <Carousel opts={{ align: "start", loop: true, duration: 20, skipSnaps: false }} className="w-full">
                <CarouselContent className="-ml-0">
                  {products.filter(p => p.id >= 15 && p.id <= 18).map((product) => (
                    <CarouselItem key={product.id} className="pl-0 basis-full">
                      <div className="relative" onClick={(e) => {
                        e.stopPropagation()
                        openSizeSelector(product)
                      }}>
                        <img
                          src={product.image}
                          alt={getProductName(product)}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/90 to-transparent p-4 pointer-events-none">
                <div className="text-white">
                  <div className="text-lg font-bold">{t.seasonLightyear}</div>
                  <div className="text-xs opacity-90">{t.seasonLightyearDesc}</div>
                  <div className="text-xs mt-1 opacity-70">← Desliza →</div>
                </div>
              </div>
            </Card>
          </div>
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

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 bg-black/50 z-[110] flex items-center justify-center p-4 overflow-y-auto" onClick={() => setIsSizeGuideOpen(false)}>
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
      </div>
    </>
  )
}
