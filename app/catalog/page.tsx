'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Ruler, X } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { DynamicIsland } from '@/components/DynamicIsland'
import { ProfileModal } from '@/components/ProfileModal'
import Link from 'next/link'

export default function CatalogPage() {
  const { t } = useLanguage()
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
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
        zIndex: 50
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
            <Link href="/">
              <img 
                src="/vincero LOGO.png" 
                alt="Vincero Logo" 
                style={{
                  height: '2rem',
                  width: 'auto',
                  cursor: 'pointer'
                }}
              />
            </Link>
          </div>

          {/* Empty space for symmetry - Right */}
          <div style={{ flex: '0 0 auto', width: '2.5rem' }}></div>
        </nav>
      </header>

      <section className="pt-32 pb-24 lg:pb-32 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              {t.catalog}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t.selectSeason}
            </p>
            <button
              onClick={() => setIsSizeGuideOpen(true)}
              className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Ruler className="w-4 h-4" />
              Guía de tallas
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Colección Low */}
            <Link href="/shop?season=normal">
              <Card className="group cursor-pointer overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 h-full">
                <div className="relative h-64 md:h-80 overflow-hidden bg-gradient-to-br from-secondary/50 to-accent/20">
                  <img
                    src="/1.png"
                    alt={t.seasonNormal}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {t.seasonNormal}
                    </h2>
                    <p className="text-white/80 text-sm md:text-base">
                      {t.seasonNormalDesc}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Colección High */}
            <Link href="/shop?season=high">
              <Card className="group cursor-pointer overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 h-full">
                <div className="relative h-64 md:h-80 overflow-hidden bg-gradient-to-br from-secondary/50 to-accent/20">
                  <img
                    src="/6.png"
                    alt={t.seasonHigh}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {t.seasonHigh}
                    </h2>
                    <p className="text-white/80 text-sm md:text-base">
                      {t.seasonHighDesc}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Colección Ballerina */}
            <Link href="/shop?season=ballerina">
              <Card className="group cursor-pointer overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 h-full">
                <div className="relative h-64 md:h-80 overflow-hidden bg-gradient-to-br from-secondary/50 to-accent/20">
                  <img
                    src="/19.png"
                    alt={t.seasonBallerina}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {t.seasonBallerina}
                    </h2>
                    <p className="text-white/80 text-sm md:text-base">
                      {t.seasonBallerinaDesc}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Colección Multicolor */}
            <Link href="/shop?season=multicolor">
              <Card className="group cursor-pointer overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 h-full">
                <div className="relative h-64 md:h-80 overflow-hidden bg-gradient-to-br from-secondary/50 to-accent/20">
                  <img
                    src="/13.png"
                    alt={t.seasonMulticolor}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {t.seasonMulticolor}
                    </h2>
                    <p className="text-white/80 text-sm md:text-base">
                      {t.seasonMulticolorDesc}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>

            {/* Colección LIGHTYEAR */}
            <Link href="/shop?season=lightyear">
              <Card className="group cursor-pointer overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 h-full">
                <div className="relative h-64 md:h-80 overflow-hidden bg-gradient-to-br from-secondary/50 to-accent/20">
                  <img
                    src="/23.png"
                    alt={t.seasonLightyear}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {t.seasonLightyear}
                    </h2>
                    <p className="text-white/80 text-sm md:text-base">
                      {t.seasonLightyearDesc}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
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

      {/* Dynamic Island */}
      <DynamicIsland activeNav="catalog" onProfileClick={() => setIsProfileOpen(true)} />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

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
    </div>
  )
}
