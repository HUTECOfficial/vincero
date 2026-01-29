'use client'

import { useState, useEffect } from 'react'
import { 
  getHeroImages, 
  getCMSSections, 
  getCMSProducts,
  getCMSTestimonials,
  type HeroImage,
  type CMSSection,
  type CMSProduct,
  type CMSTestimonial
} from '@/lib/cms'

interface CMSContent {
  heroImages: HeroImage[]
  sections: Record<string, CMSSection>
  products: CMSProduct[]
  testimonials: CMSTestimonial[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useCMSContent(): CMSContent {
  const [heroImages, setHeroImages] = useState<HeroImage[]>([])
  const [sections, setSections] = useState<Record<string, CMSSection>>({})
  const [products, setProducts] = useState<CMSProduct[]>([])
  const [testimonials, setTestimonials] = useState<CMSTestimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContent = async () => {
    try {
      setLoading(true)
      setError(null)

      const [heroData, sectionsData, productsData, testimonialsData] = await Promise.all([
        getHeroImages(),
        getCMSSections(),
        getCMSProducts(),
        getCMSTestimonials()
      ])

      setHeroImages(heroData)
      
      // Convert sections array to object keyed by section_name
      const sectionsMap: Record<string, CMSSection> = {}
      sectionsData.forEach(section => {
        sectionsMap[section.section_name] = section
      })
      setSections(sectionsMap)
      
      setProducts(productsData)
      setTestimonials(testimonialsData)
    } catch (err) {
      console.error('Error fetching CMS content:', err)
      setError('Error al cargar el contenido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContent()
  }, [])

  return {
    heroImages,
    sections,
    products,
    testimonials,
    loading,
    error,
    refetch: fetchContent
  }
}

// Hook específico para las imágenes del hero
export function useHeroImages() {
  const [images, setImages] = useState<{ desktop: string[]; mobile: string[] }>({
    desktop: [],
    mobile: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const heroData = await getHeroImages()
        
        if (heroData.length > 0) {
          setImages({
            desktop: heroData.map(h => h.image_url_desktop),
            mobile: heroData.map(h => h.image_url_mobile || h.image_url_desktop)
          })
        }
      } catch (err) {
        console.error('Error fetching hero images:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchHeroImages()
  }, [])

  return { images, loading }
}

// Hook para obtener una sección específica
export function useCMSSection(sectionName: string) {
  const [section, setSection] = useState<CMSSection | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSection = async () => {
      try {
        const sectionsData = await getCMSSections()
        const found = sectionsData.find(s => s.section_name === sectionName)
        setSection(found || null)
      } catch (err) {
        console.error('Error fetching section:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSection()
  }, [sectionName])

  return { section, loading }
}
