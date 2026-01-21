'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronRight, Zap, Shield, TrendingUp, Ruler, X } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { DynamicIsland } from '@/components/DynamicIsland'
import { ChristmasEffects } from '@/components/ChristmasEffects'
import Link from 'next/link'

export default function FeaturesPage() {
  const { t } = useLanguage()
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)

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

            <Link href="/shop" className="text-sm font-medium hover:text-primary transition-colors">
              {t.bestSellers}
            </Link>
          </div>
        </nav>
      </header>

      <section className="pt-32 pb-24 lg:pb-32 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              {t.whyChoose}{' '}
              <span className="text-gradient">{t.whyChooseHighlight}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t.whyChooseDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card className="md:col-span-2 lg:row-span-2 p-8 bg-gradient-to-br from-card to-secondary/30 border-2 hover:border-primary/50 transition-all duration-300 group">
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

            <Card className="p-8 bg-gradient-to-br from-card to-accent/20 border-2 hover:border-primary/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{t.innovativeDesign}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.innovativeDesignDesc}
              </p>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-card to-primary/10 border-2 hover:border-primary/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{t.totalComfort}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.totalComfortDesc}
              </p>
            </Card>

            <Card 
              className="relative overflow-hidden group cursor-pointer" 
              onClick={() => window.location.href = '/shop'}
            >
              <img
                src="/5.png"
                alt="Tenis Deportivo VINCERO"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="text-xl font-bold">{t.sportCollection}</div>
                  <div className="text-sm opacity-90">{t.styleComfort}</div>
                </div>
              </div>
            </Card>

            <Card 
              className="relative overflow-hidden group cursor-pointer" 
              onClick={() => window.location.href = '/shop'}
            >
              <img
                src="/10.png"
                alt="Colección Tenis Altos"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex items-end p-6">
                <div className="text-white">
                  <div className="text-xl font-bold">{t.highCollection}</div>
                  <div className="text-sm opacity-90">{t.newSportCollection}</div>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center mt-12 space-y-4">
            <Link href="/shop">
              <Button size="lg" variant="outline" className="text-base px-8 py-6 border-2">
                {t.viewCollection}
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <div>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Ruler className="w-4 h-4" />
                Guía de tallas
              </button>
            </div>
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
      <DynamicIsland activeNav="features" />

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
