'use client'

import { Card } from '@/components/ui/card'
import { Award, Lightbulb, Sparkles, Shield, HandHeart, Users, TrendingUp, Star } from 'lucide-react'
import { useLanguage } from '@/lib/LanguageContext'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { DynamicIsland } from '@/components/DynamicIsland'
import Link from 'next/link'

export default function AboutPage() {
  const { t } = useLanguage()

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
              {t.aboutUs}
            </h1>
          </div>

          {/* About Product */}
          <div className="mb-16">
            <Card className="p-8 md:p-12 bg-card/50 backdrop-blur-sm border-2 hover:border-primary/50 transition-all duration-300">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{t.aboutProduct}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {t.aboutProductDesc}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Values */}
          <div className="mb-16">
            <h3 className="text-3xl font-bold mb-8 text-center">{t.ourValues}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 hover:border-primary/50 transition-all duration-300 group">
                <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <HandHeart className="w-6 h-6 text-rose-500" />
                </div>
                <h4 className="text-xl font-bold mb-2">{t.valueCare}</h4>
                <p className="text-sm text-muted-foreground">{t.valueCareDesc}</p>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 hover:border-primary/50 transition-all duration-300 group">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-6 h-6 text-blue-500" />
                </div>
                <h4 className="text-xl font-bold mb-2">{t.valueInnovation}</h4>
                <p className="text-sm text-muted-foreground">{t.valueInnovationDesc}</p>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 hover:border-primary/50 transition-all duration-300 group">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-purple-500" />
                </div>
                <h4 className="text-xl font-bold mb-2">{t.valueCreativity}</h4>
                <p className="text-sm text-muted-foreground">{t.valueCreativityDesc}</p>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 hover:border-primary/50 transition-all duration-300 group">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-amber-500" />
                </div>
                <h4 className="text-xl font-bold mb-2">{t.valueCommitment}</h4>
                <p className="text-sm text-muted-foreground">{t.valueCommitmentDesc}</p>
              </Card>

              <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 hover:border-primary/50 transition-all duration-300 group">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-green-500" />
                </div>
                <h4 className="text-xl font-bold mb-2">{t.valueInclusion}</h4>
                <p className="text-sm text-muted-foreground">{t.valueInclusionDesc}</p>
              </Card>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <Card className="p-8 md:p-10 bg-gradient-to-br from-primary/10 to-card border-2 hover:border-primary/50 transition-all duration-300">
              <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">{t.ourMission}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.missionContent}
              </p>
            </Card>

            <Card className="p-8 md:p-10 bg-gradient-to-br from-accent/10 to-card border-2 hover:border-primary/50 transition-all duration-300">
              <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center mb-6">
                <Star className="w-7 h-7 text-accent-foreground" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">{t.ourVision}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t.visionContent}
              </p>
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

      {/* Dynamic Island */}
      <DynamicIsland activeNav="about" />
    </div>
  )
}
