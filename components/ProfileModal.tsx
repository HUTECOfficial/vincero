'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { X, User, Heart, Package, MessageCircle, ChevronRight, Mail, Lock, Eye, EyeOff, LogOut } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import { useAuth } from '@/lib/AuthContext'
import { supabase, getUserOrders } from '@/lib/supabase'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onWishlistClick?: () => void
  wishlistCount?: number
}

export function ProfileModal({ isOpen, onClose, onWishlistClick, wishlistCount = 0 }: ProfileModalProps) {
  const { t } = useLanguage()
  const { user, signIn, signUp, signOut } = useAuth()
  
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authConfirmPassword, setAuthConfirmPassword] = useState('')
  const [authName, setAuthName] = useState('')
  const [authPhone, setAuthPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authSuccess, setAuthSuccess] = useState('')
  const [resetEmail, setResetEmail] = useState('')
  const [userOrders, setUserOrders] = useState<any[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)

  const loadUserOrders = async (userId: string) => {
    setLoadingOrders(true)
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      )
      const ordersPromise = getUserOrders(userId)
      const orders = await Promise.race([ordersPromise, timeoutPromise]) as any[]
      setUserOrders(orders || [])
    } catch (error) {
      console.error('Error loading orders:', error)
      setUserOrders([])
    } finally {
      setLoadingOrders(false)
    }
  }

  useEffect(() => {
    if (user && isOpen) {
      loadUserOrders(user.id)
    }
  }, [user, isOpen])

  useEffect(() => {
    const handleEmailConfirmed = (event: CustomEvent) => {
      const { type } = event.detail
      if (type === 'signup' || type === 'email') {
        setAuthSuccess('¡Tu cuenta ha sido verificada exitosamente! 🎉 Ya puedes disfrutar de todos los beneficios.')
      } else if (type === 'recovery') {
        setAuthSuccess('¡Sesión iniciada! Ahora puedes cambiar tu contraseña.')
      }
    }

    window.addEventListener('emailConfirmed', handleEmailConfirmed as EventListener)
    return () => {
      window.removeEventListener('emailConfirmed', handleEmailConfirmed as EventListener)
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      const error = hashParams.get('error')
      const errorDescription = hashParams.get('error_description')
      
      if (error) {
        if (error === 'access_denied' && errorDescription?.includes('expired')) {
          setAuthError('El enlace ha expirado. Por favor solicita uno nuevo.')
          setAuthMode('login')
        } else {
          setAuthError(errorDescription || 'Error de autenticación')
        }
        window.history.replaceState(null, '', window.location.pathname)
      }
    }
  }, [isOpen])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setAuthSuccess('')
    
    try {
      if (authMode === 'login') {
        await signIn(authEmail, authPassword)
        setAuthSuccess(t.loginSuccess)
      } else {
        if (authPassword !== authConfirmPassword) {
          setAuthError('Las contraseñas no coinciden')
          return
        }
        await signUp(authEmail, authPassword, authName, authPhone)
        setAuthSuccess('¡Cuenta creada! Por favor revisa tu email y confirma tu cuenta para poder iniciar sesión.')
      }
      setAuthEmail('')
      setAuthPassword('')
      setAuthConfirmPassword('')
      setAuthName('')
      setAuthPhone('')
    } catch (error: any) {
      let errorMessage = error.message || 'Error de autenticación'
      
      if (errorMessage.includes('Invalid login credentials')) {
        errorMessage = 'Email o contraseña incorrectos. Si acabas de registrarte, confirma tu email primero.'
      } else if (errorMessage.includes('User already registered')) {
        errorMessage = 'Este email ya está registrado. Intenta iniciar sesión.'
      }
      
      setAuthError(errorMessage)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setAuthSuccess('')
    
    if (!resetEmail.trim()) {
      setAuthError('Por favor ingresa tu email')
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/reset-password`,
      })
      
      if (error) throw error
      
      setAuthSuccess('Te hemos enviado un email con instrucciones para recuperar tu contraseña')
      setResetEmail('')
    } catch (error: any) {
      setAuthError(error.message || 'Error al enviar el email de recuperación')
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      onClose()
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
      window.location.href = '/'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center">
      <Card className="w-full md:max-w-2xl max-h-[90vh] md:max-h-[80vh] overflow-hidden flex flex-col rounded-t-3xl md:rounded-xl">
        <div className="p-4 md:p-6 border-b flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold">{user ? t.myAccount : t.myProfile}</h2>
          <button onClick={onClose} className="hover:bg-muted rounded-full p-2 transition-colors">
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {user ? (
            <div>
              <div className="text-center mb-8">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-1">{user.email}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              {authSuccess && (
                <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm mb-4 max-w-md mx-auto">
                  {authSuccess}
                </div>
              )}

              <div className="space-y-4 max-w-md mx-auto">
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

                {onWishlistClick && (
                  <Card className="p-4 hover:border-primary/50 transition-colors cursor-pointer" onClick={() => {
                    onClose()
                    onWishlistClick()
                  }}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-rose-500" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold">{t.myWishlist}</h4>
                        <p className="text-sm text-muted-foreground">{wishlistCount} productos</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </Card>
                )}

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
            <div>
              <div className="text-center mb-8">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-1">
                  {authMode === 'login' ? t.welcomeBack : authMode === 'register' ? t.joinUs : 'Recuperar Contraseña'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {authMode === 'login' ? t.loginToContinue : authMode === 'register' ? t.createAccount : 'Ingresa tu email para recuperar tu contraseña'}
                </p>
              </div>

              <form onSubmit={authMode === 'forgot' ? handlePasswordReset : handleAuth} className="space-y-4 max-w-md mx-auto">
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
                      value={authMode === 'forgot' ? resetEmail : authEmail}
                      onChange={(e) => authMode === 'forgot' ? setResetEmail(e.target.value) : setAuthEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-border rounded-lg focus:border-primary outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                {authMode !== 'forgot' && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium">{t.password}</label>
                      {authMode === 'login' && (
                        <button
                          type="button"
                          onClick={() => {
                            setAuthMode('forgot')
                            setAuthError('')
                            setAuthSuccess('')
                          }}
                          className="text-xs text-primary hover:underline"
                        >
                          ¿Olvidaste tu contraseña?
                        </button>
                      )}
                    </div>
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
                )}

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
                  {authMode === 'login' ? t.login : authMode === 'register' ? t.register : 'Enviar Email de Recuperación'}
                </Button>

                {authMode === 'forgot' ? (
                  <p className="text-center text-sm text-muted-foreground">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('login')
                        setAuthError('')
                        setAuthSuccess('')
                      }}
                      className="text-primary font-medium hover:underline"
                    >
                      Volver al inicio de sesión
                    </button>
                  </p>
                ) : (
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
                )}
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
  )
}
