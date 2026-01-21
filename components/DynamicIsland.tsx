'use client'

import { useState } from 'react'
import { Home, Search, Heart, User, Menu } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'

interface DynamicIslandProps {
  activeNav?: string
  setActiveNav?: (nav: string) => void
  onSearchClick?: () => void
  onWishlistClick?: () => void
  onProfileClick?: () => void
  wishlistCount?: number
  isVisible?: boolean
}

export function DynamicIsland({
  activeNav = 'home',
  setActiveNav,
  onSearchClick,
  onWishlistClick,
  onProfileClick,
  wishlistCount = 0,
  isVisible = true
}: DynamicIslandProps) {
  const { t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [localActiveNav, setLocalActiveNav] = useState(activeNav)

  const handleSetActiveNav = (nav: string) => {
    setLocalActiveNav(nav)
    if (setActiveNav) {
      setActiveNav(nav)
    }
  }

  const currentActiveNav = setActiveNav ? activeNav : localActiveNav

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '1.5rem', 
      left: '50%', 
      transform: `translateX(-50%) translateY(${isVisible ? '0' : '150%'})`,
      zIndex: 50,
      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: isVisible ? 1 : 0,
    }}>
      <nav style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        padding: '0.5rem 0.75rem',
        backgroundColor: 'rgba(26, 26, 46, 0.85)',
        backdropFilter: 'blur(24px)',
        borderRadius: '9999px',
        border: '2px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 0, 0, 0.1)'
      }}>
        <a 
          href="/"
          onClick={() => handleSetActiveNav('home')}
          style={{ padding: '0.375rem', cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'none' }}
        >
          <div style={{ 
            width: '2rem', 
            height: '2rem', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: currentActiveNav === 'home' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.15)',
            transition: 'all 0.3s'
          }}>
            <Home className={`w-4 h-4 ${currentActiveNav === 'home' ? 'text-gray-900' : 'text-white/80'}`} />
          </div>
        </a>

        <button 
          onClick={() => {
            handleSetActiveNav('discover')
            if (onSearchClick) onSearchClick()
          }}
          style={{ padding: '0.375rem', cursor: 'pointer', background: 'none', border: 'none' }}
        >
          <div style={{ 
            width: '2rem', 
            height: '2rem', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: currentActiveNav === 'discover' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.15)',
            transition: 'all 0.3s'
          }}>
            <Search className={`w-4 h-4 ${currentActiveNav === 'discover' ? 'text-gray-900' : 'text-white/80'}`} />
          </div>
        </button>

        <button 
          onClick={() => {
            handleSetActiveNav('wishlist')
            if (onWishlistClick) onWishlistClick()
          }}
          style={{ padding: '0.375rem', cursor: 'pointer', background: 'none', border: 'none', position: 'relative' }}
        >
          <div style={{ 
            width: '2rem', 
            height: '2rem', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: currentActiveNav === 'wishlist' ? 'rgba(244, 63, 94, 0.8)' : 'rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s'
          }}>
            <Heart className={`w-4 h-4 ${currentActiveNav === 'wishlist' ? 'text-white' : 'text-white/80'} ${wishlistCount > 0 ? 'fill-current' : ''}`} />
          </div>
          {wishlistCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-0.25rem',
              right: '-0.25rem',
              width: '1rem',
              height: '1rem',
              backgroundColor: 'rgb(244, 63, 94)',
              color: 'white',
              fontSize: '0.625rem',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold'
            }}>
              {wishlistCount}
            </span>
          )}
        </button>

        <button 
          onClick={() => {
            handleSetActiveNav('profile')
            if (onProfileClick) onProfileClick()
          }}
          style={{ padding: '0.375rem', cursor: 'pointer', background: 'none', border: 'none' }}
        >
          <div style={{ 
            width: '2rem', 
            height: '2rem', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: currentActiveNav === 'profile' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.15)',
            transition: 'all 0.3s'
          }}>
            <User className={`w-4 h-4 ${currentActiveNav === 'profile' ? 'text-gray-900' : 'text-white/80'}`} />
          </div>
        </button>

        <button 
          onClick={() => {
            handleSetActiveNav('menu')
            setIsMenuOpen(!isMenuOpen)
          }}
          style={{ padding: '0.375rem', cursor: 'pointer', background: 'none', border: 'none' }}
        >
          <div style={{ 
            width: '2rem', 
            height: '2rem', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: currentActiveNav === 'menu' || isMenuOpen ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.15)',
            transition: 'all 0.3s'
          }}>
            <Menu className={`w-4 h-4 ${currentActiveNav === 'menu' || isMenuOpen ? 'text-gray-900' : 'text-white/80'}`} />
          </div>
        </button>
      </nav>

      {/* Menu Popup */}
      {isMenuOpen && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '0.75rem',
          backgroundColor: 'rgba(26, 26, 46, 0.95)',
          backdropFilter: 'blur(24px)',
          borderRadius: '1rem',
          border: '2px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
          padding: '0.5rem',
          minWidth: '160px'
        }}>
          <a href="/" style={{ display: 'block', padding: '0.75rem 1rem', color: 'white', textDecoration: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }} className="hover:bg-white/10">
            {t.home}
          </a>
          <a href="/catalog" style={{ display: 'block', padding: '0.75rem 1rem', color: 'white', textDecoration: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }} className="hover:bg-white/10">
            {t.catalog}
          </a>
          <a href="/features" style={{ display: 'block', padding: '0.75rem 1rem', color: 'white', textDecoration: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }} className="hover:bg-white/10">
            {t.whyChoose}
          </a>
          <a href="/about" style={{ display: 'block', padding: '0.75rem 1rem', color: 'white', textDecoration: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }} className="hover:bg-white/10">
            {t.aboutUs}
          </a>
        </div>
      )}
    </div>
  )
}
