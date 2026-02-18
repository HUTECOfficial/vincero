import { supabase } from './supabase'

// Helper: wraps a thenable (like Supabase query) with a timeout
const withTimeout = <T>(thenable: PromiseLike<T>, ms = 8000): Promise<T> => {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`CMS query timeout after ${ms}ms`)), ms)
  )
  return Promise.race([Promise.resolve(thenable), timeout])
}

// =====================================================
// TIPOS PARA EL CMS
// =====================================================

export interface HeroImage {
  id: string
  position: number
  image_url_desktop: string
  image_url_mobile: string | null
  alt_text: string | null
  link_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CMSSection {
  id: string
  section_name: string
  title_es: string | null
  title_en: string | null
  subtitle_es: string | null
  subtitle_en: string | null
  content_es: string | null
  content_en: string | null
  image_url: string | null
  background_image_url: string | null
  is_active: boolean
  metadata: Record<string, any>
  updated_at: string
}

export interface CMSProduct {
  id: string
  product_id: number
  name_es: string
  name_en: string | null
  description_es: string | null
  description_en: string | null
  price: number
  main_image: string
  gallery_images: string[]
  badge_key: string | null
  description_type: string
  rating: number
  color: string | null
  sizes: string[]
  is_active: boolean
  position: number
  created_at: string
  updated_at: string
}

export interface CMSTestimonial {
  id: string
  author_name: string
  author_image: string | null
  content_es: string
  content_en: string | null
  rating: number
  is_active: boolean
  position: number
  created_at: string
  updated_at: string
}

export interface SiteContent {
  id: string
  section: string
  content_key: string
  content_type: 'text' | 'image' | 'html' | 'json'
  value_text: string | null
  value_image_url: string | null
  value_json: Record<string, any> | null
  language: string
  updated_at: string
}

export interface CMSImage {
  id: string
  section: string
  image_key: string
  image_url: string
  alt_text: string | null
  description: string | null
  position: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// =====================================================
// FUNCIONES DE LECTURA (PÚBLICAS)
// =====================================================

export const getHeroImages = async (): Promise<HeroImage[]> => {
  try {
    const result = await withTimeout(
      supabase.from('hero_images').select('*').eq('is_active', true).order('position', { ascending: true })
    ) as { data: HeroImage[] | null; error: unknown }
    if (result.error) {
      console.error('Error fetching hero images:', result.error)
      return []
    }
    return result.data || []
  } catch (error) {
    console.error('Error fetching hero images:', error)
    return []
  }
}

export const getCMSSections = async (): Promise<CMSSection[]> => {
  try {
    const result = await withTimeout(
      supabase.from('cms_sections').select('*').eq('is_active', true)
    ) as { data: CMSSection[] | null; error: unknown }
    if (result.error) {
      console.error('Error fetching CMS sections:', result.error)
      return []
    }
    return result.data || []
  } catch (error) {
    console.error('Error fetching CMS sections:', error)
    return []
  }
}

export const getCMSSection = async (sectionName: string): Promise<CMSSection | null> => {
  try {
    const { data, error } = await supabase
      .from('cms_sections')
      .select('*')
      .eq('section_name', sectionName)
      .single()

    if (error) {
      console.error('Error fetching CMS section:', error)
      return null
    }
    return data
  } catch (error) {
    console.error('Error fetching CMS section:', error)
    return null
  }
}

export const getCMSProducts = async (): Promise<CMSProduct[]> => {
  try {
    const result = await withTimeout(
      supabase.from('cms_products').select('*').eq('is_active', true).order('position', { ascending: true })
    ) as { data: CMSProduct[] | null; error: unknown }
    if (result.error) {
      console.error('Error fetching CMS products:', result.error)
      return []
    }
    return result.data || []
  } catch (error) {
    console.error('Error fetching CMS products:', error)
    return []
  }
}

export const getCMSTestimonials = async (): Promise<CMSTestimonial[]> => {
  try {
    const result = await withTimeout(
      supabase.from('cms_testimonials').select('*').eq('is_active', true).order('position', { ascending: true })
    ) as { data: CMSTestimonial[] | null; error: unknown }
    if (result.error) {
      console.error('Error fetching CMS testimonials:', result.error)
      return []
    }
    return result.data || []
  } catch (error) {
    console.error('Error fetching CMS testimonials:', error)
    return []
  }
}

export const getSiteContent = async (section: string, language: string = 'es'): Promise<Record<string, SiteContent>> => {
  try {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('section', section)
      .eq('language', language)

    if (error) {
      console.error('Error fetching site content:', error)
      return {}
    }

    const contentMap: Record<string, SiteContent> = {}
    data?.forEach(item => {
      contentMap[item.content_key] = item
    })
    return contentMap
  } catch (error) {
    console.error('Error fetching site content:', error)
    return {}
  }
}

// =====================================================
// FUNCIONES PARA CMS_IMAGES (TODAS LAS IMÁGENES)
// =====================================================

export const getCMSImages = async (section?: string): Promise<CMSImage[]> => {
  try {
    let query = supabase
      .from('cms_images')
      .select('*')
      .eq('is_active', true)
      .order('position', { ascending: true })

    if (section) {
      query = query.eq('section', section)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching CMS images:', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('Error fetching CMS images:', error)
    return []
  }
}

export const getCMSImagesBySection = async (): Promise<Record<string, CMSImage[]>> => {
  try {
    const { data, error } = await supabase
      .from('cms_images')
      .select('*')
      .order('section', { ascending: true })
      .order('position', { ascending: true })

    if (error) {
      console.error('Error fetching CMS images:', error)
      return {}
    }

    const grouped: Record<string, CMSImage[]> = {}
    data?.forEach(img => {
      if (!grouped[img.section]) {
        grouped[img.section] = []
      }
      grouped[img.section].push(img)
    })
    return grouped
  } catch (error) {
    console.error('Error fetching CMS images:', error)
    return {}
  }
}

export const getAllCMSImages = async (): Promise<CMSImage[]> => {
  try {
    const { data, error } = await supabase
      .from('cms_images')
      .select('*')
      .order('section', { ascending: true })
      .order('position', { ascending: true })

    if (error) {
      console.error('Error fetching all CMS images:', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('Error fetching all CMS images:', error)
    return []
  }
}

export const updateCMSImage = async (id: string, updates: Partial<CMSImage>): Promise<boolean> => {
  const { error } = await supabase
    .from('cms_images')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('Error updating CMS image:', error)
    return false
  }
  return true
}

export const createCMSImage = async (image: Omit<CMSImage, 'id' | 'created_at' | 'updated_at'>): Promise<CMSImage | null> => {
  const { data, error } = await supabase
    .from('cms_images')
    .insert(image)
    .select()
    .single()

  if (error) {
    console.error('Error creating CMS image:', error)
    return null
  }
  return data
}

export const deleteCMSImage = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('cms_images')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting CMS image:', error)
    return false
  }
  return true
}

// =====================================================
// FUNCIONES DE ESCRITURA (SOLO ADMINS)
// =====================================================

export const updateHeroImage = async (id: string, updates: Partial<HeroImage>): Promise<boolean> => {
  const { error } = await supabase
    .from('hero_images')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('Error updating hero image:', error)
    return false
  }
  return true
}

export const createHeroImage = async (heroImage: Omit<HeroImage, 'id' | 'created_at' | 'updated_at'>): Promise<HeroImage | null> => {
  const { data, error } = await supabase
    .from('hero_images')
    .insert(heroImage)
    .select()
    .single()

  if (error) {
    console.error('Error creating hero image:', error)
    return null
  }
  return data
}

export const deleteHeroImage = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('hero_images')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting hero image:', error)
    return false
  }
  return true
}

export const updateCMSSection = async (id: string, updates: Partial<CMSSection>): Promise<boolean> => {
  const { error } = await supabase
    .from('cms_sections')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('Error updating CMS section:', error)
    return false
  }
  return true
}

export const updateCMSProduct = async (id: string, updates: Partial<CMSProduct>): Promise<boolean> => {
  const { error } = await supabase
    .from('cms_products')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('Error updating CMS product:', error)
    return false
  }
  return true
}

export const createCMSProduct = async (product: Omit<CMSProduct, 'id' | 'created_at' | 'updated_at'>): Promise<CMSProduct | null> => {
  const { data, error } = await supabase
    .from('cms_products')
    .insert(product)
    .select()
    .single()

  if (error) {
    console.error('Error creating CMS product:', error)
    return null
  }
  return data
}

export const deleteCMSProduct = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('cms_products')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting CMS product:', error)
    return false
  }
  return true
}

export const updateCMSTestimonial = async (id: string, updates: Partial<CMSTestimonial>): Promise<boolean> => {
  const { error } = await supabase
    .from('cms_testimonials')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('Error updating CMS testimonial:', error)
    return false
  }
  return true
}

export const createCMSTestimonial = async (testimonial: Omit<CMSTestimonial, 'id' | 'created_at' | 'updated_at'>): Promise<CMSTestimonial | null> => {
  const { data, error } = await supabase
    .from('cms_testimonials')
    .insert(testimonial)
    .select()
    .single()

  if (error) {
    console.error('Error creating CMS testimonial:', error)
    return null
  }
  return data
}

export const deleteCMSTestimonial = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('cms_testimonials')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting CMS testimonial:', error)
    return false
  }
  return true
}

export const updateSiteContent = async (
  section: string,
  contentKey: string,
  value: string,
  contentType: 'text' | 'image' | 'html' | 'json' = 'text',
  language: string = 'es'
): Promise<boolean> => {
  const updates: Partial<SiteContent> = {
    updated_at: new Date().toISOString()
  }

  if (contentType === 'text' || contentType === 'html') {
    updates.value_text = value
  } else if (contentType === 'image') {
    updates.value_image_url = value
  } else if (contentType === 'json') {
    updates.value_json = JSON.parse(value)
  }

  const { error } = await supabase
    .from('site_content')
    .upsert({
      section,
      content_key: contentKey,
      content_type: contentType,
      language,
      ...updates
    }, {
      onConflict: 'section,content_key,language'
    })

  if (error) {
    console.error('Error updating site content:', error)
    return false
  }
  return true
}

// =====================================================
// FUNCIONES DE SUBIDA DE IMÁGENES
// =====================================================

export const uploadCMSImage = async (file: File, folder: string = 'general'): Promise<string | null> => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('cms-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Error uploading image:', error)
    return null
  }

  const { data: urlData } = supabase.storage
    .from('cms-images')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

export const deleteStorageImage = async (imageUrl: string): Promise<boolean> => {
  const path = imageUrl.split('/cms-images/')[1]
  if (!path) return false

  const { error } = await supabase.storage
    .from('cms-images')
    .remove([path])

  if (error) {
    console.error('Error deleting storage image:', error)
    return false
  }
  return true
}

// =====================================================
// FUNCIONES AUXILIARES
// =====================================================

export const reorderItems = async (
  table: 'hero_images' | 'cms_products' | 'cms_testimonials',
  items: { id: string; position: number }[]
): Promise<boolean> => {
  try {
    for (const item of items) {
      const { error } = await supabase
        .from(table)
        .update({ position: item.position })
        .eq('id', item.id)

      if (error) throw error
    }
    return true
  } catch (error) {
    console.error('Error reordering items:', error)
    return false
  }
}
