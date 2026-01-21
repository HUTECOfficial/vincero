import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { LanguageProvider } from '@/lib/LanguageContext'
import { AuthProvider } from '@/lib/AuthContext'
import './globals.css'

const _geist = Geist({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});
const _geistMono = Geist_Mono({ 
  subsets: ["latin"],
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://vincero.com.mx'),
  title: {
    default: 'VINCERO - Tenis Infantiles de Alta Calidad | Calzado para Niños México',
    template: '%s | VINCERO'
  },
  description: 'VINCERO: Fabricantes mexicanos de tenis y calzado infantil premium. Diseños modernos, materiales de alta calidad y máximo confort. Colecciones Low, High, Ballerina, Multicolor y Lightyear. Tallas 13mx a 21mx. Envíos a toda la República Mexicana.',
  keywords: ['vincero', 'tenis infantiles', 'calzado infantil', 'zapatos para niños', 'tenis para niños méxico', 'calzado infantil méxico', 'tenis deportivos niños', 'zapatos niños alta calidad', 'tenis ballerina niñas', 'calzado deportivo infantil', 'fabricantes calzado infantil', 'tenis niños modernos', 'zapatos cómodos niños', 'tenis infantiles premium', 'calzado niños méxico'],
  authors: [{ name: 'VINCERO' }],
  creator: 'VINCERO',
  publisher: 'VINCERO',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: 'https://vincero.com.mx',
    siteName: 'VINCERO',
    title: 'VINCERO - Tenis Infantiles de Alta Calidad | Calzado para Niños México',
    description: 'Fabricantes mexicanos de tenis y calzado infantil premium. Diseños modernos, materiales de alta calidad y máximo confort para tus pequeños.',
    images: [
      {
        url: '/1.png',
        width: 1200,
        height: 630,
        alt: 'VINCERO - Tenis Infantiles Premium',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VINCERO - Tenis Infantiles de Alta Calidad',
    description: 'Fabricantes mexicanos de tenis y calzado infantil premium. Diseños modernos y máximo confort.',
    images: ['/1.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#1a1a2e',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <AuthProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
