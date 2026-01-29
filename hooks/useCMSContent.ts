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

// Hook específico para productos del CMS
export function useCMSProducts() {
  const [products, setProducts] = useState<CMSProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getCMSProducts()
        setProducts(productsData)
      } catch (err) {
        console.error('Error fetching CMS products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return { products, loading }
}

// Hook para obtener todas las secciones del CMS
export function useCMSSections() {
  const [sections, setSections] = useState<Record<string, CMSSection>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const sectionsData = await getCMSSections()
        const sectionsMap: Record<string, CMSSection> = {}
        sectionsData.forEach(section => {
          sectionsMap[section.section_name] = section
        })
        setSections(sectionsMap)
      } catch (err) {
        console.error('Error fetching CMS sections:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSections()
  }, [])

  return { sections, loading }
}

// Función helper para convertir CMSProduct a formato de producto de la página
export function convertCMSProductToPageProduct(cmsProduct: CMSProduct, language: 'es' | 'en' = 'es') {
  return {
    id: cmsProduct.product_id,
    name: language === 'es' ? cmsProduct.name_es : (cmsProduct.name_en || cmsProduct.name_es),
    description: language === 'es' ? cmsProduct.description_es : (cmsProduct.description_en || cmsProduct.description_es),
    price: cmsProduct.price,
    image: cmsProduct.main_image,
    images: cmsProduct.gallery_images,
    badge: cmsProduct.badge_key,
    descriptionType: cmsProduct.description_type,
    rating: cmsProduct.rating,
    color: cmsProduct.color,
    sizes: cmsProduct.sizes,
    isActive: cmsProduct.is_active
  }
}

// Función helper para obtener texto de sección según idioma
export function getSectionText(
  section: CMSSection | undefined, 
  field: 'title' | 'subtitle' | 'content', 
  language: 'es' | 'en' = 'es'
): string {
  if (!section) return ''
  
  if (field === 'title') {
    return language === 'es' ? (section.title_es || '') : (section.title_en || section.title_es || '')
  }
  if (field === 'subtitle') {
    return language === 'es' ? (section.subtitle_es || '') : (section.subtitle_en || section.subtitle_es || '')
  }
  if (field === 'content') {
    return language === 'es' ? (section.content_es || '') : (section.content_en || section.content_es || '')
  }
  return ''
}
