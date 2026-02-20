'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Image as ImageIcon, 
  Type, 
  Save, 
  Upload, 
  Trash2, 
  Plus, 
  GripVertical,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Check,
  X,
  Edit3,
  Star,
  MessageSquare,
  Layout,
  Package,
  Sparkles
} from 'lucide-react'
import { 
  getHeroImages, 
  getCMSSections, 
  getCMSProducts,
  getCMSTestimonials,
  updateHeroImage,
  createHeroImage,
  deleteHeroImage,
  updateCMSSection,
  updateCMSProduct,
  createCMSProduct,
  deleteCMSProduct,
  updateCMSTestimonial,
  createCMSTestimonial,
  deleteCMSTestimonial,
  uploadCMSImage,
  type HeroImage,
  type CMSSection,
  type CMSProduct,
  type CMSTestimonial
} from '@/lib/cms'

type CMSTab = 'hero' | 'sections' | 'products' | 'testimonials'

export default function CMSEditor() {
  const [activeTab, setActiveTab] = useState<CMSTab>('hero')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Data states
  const [heroImages, setHeroImages] = useState<HeroImage[]>([])
  const [sections, setSections] = useState<CMSSection[]>([])
  const [products, setProducts] = useState<CMSProduct[]>([])
  const [testimonials, setTestimonials] = useState<CMSTestimonial[]>([])

  // Edit states
  const [editingHero, setEditingHero] = useState<string | null>(null)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [editingTestimonial, setEditingTestimonial] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadTarget, setUploadTarget] = useState<{ type: string; id: string; field: string } | null>(null)
  const [stripeSearchId, setStripeSearchId] = useState('')
  const [stripeSearching, setStripeSearching] = useState(false)
  const [newProductForm, setNewProductForm] = useState<any>(null)

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/cms')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      setHeroImages(json.heroImages || [])
      setSections(json.sections || [])
      setProducts(json.products || [])
      setTestimonials(json.testimonials || [])
    } catch (error) {
      console.error('❌ CMS load error:', error)
      showMessage('error', `Error al cargar: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    } finally {
      setLoading(false)
    }
  }

  const showMessage = useCallback((type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !uploadTarget) return

    setSaving(true)
    try {
      const imageUrl = await uploadCMSImage(file, uploadTarget.type)
      if (!imageUrl) throw new Error('Error al subir imagen')

      // Update the corresponding item
      if (uploadTarget.type === 'hero') {
        const updated = heroImages.map(h => 
          h.id === uploadTarget.id 
            ? { ...h, [uploadTarget.field]: imageUrl }
            : h
        )
        setHeroImages(updated)
        await updateHeroImage(uploadTarget.id, { [uploadTarget.field]: imageUrl } as any)
      } else if (uploadTarget.type === 'sections') {
        const updated = sections.map(s => 
          s.id === uploadTarget.id 
            ? { ...s, [uploadTarget.field]: imageUrl }
            : s
        )
        setSections(updated)
        await updateCMSSection(uploadTarget.id, { [uploadTarget.field]: imageUrl } as any)
      } else if (uploadTarget.type === 'products') {
        const updated = products.map(p => 
          p.id === uploadTarget.id 
            ? { ...p, [uploadTarget.field]: imageUrl }
            : p
        )
        setProducts(updated)
        await updateCMSProduct(uploadTarget.id, { [uploadTarget.field]: imageUrl } as any)
      } else if (uploadTarget.type === 'product-gallery') {
        // Append to gallery_images array
        const product = products.find(p => p.id === uploadTarget.id)
        const existing = Array.isArray(product?.gallery_images) ? product!.gallery_images as string[] : []
        const newGallery = [...existing, imageUrl]
        setProducts(prev => prev.map(p =>
          p.id === uploadTarget.id ? { ...p, gallery_images: newGallery } : p
        ))
        await updateCMSProduct(uploadTarget.id, { gallery_images: newGallery } as any)
      } else if (uploadTarget.type === 'testimonials') {
        const updated = testimonials.map(t => 
          t.id === uploadTarget.id 
            ? { ...t, [uploadTarget.field]: imageUrl }
            : t
        )
        setTestimonials(updated)
        await updateCMSTestimonial(uploadTarget.id, { [uploadTarget.field]: imageUrl } as any)
      }

      showMessage('success', 'Imagen subida correctamente')
    } catch (error) {
      console.error('Error uploading file:', error)
      showMessage('error', 'Error al subir la imagen')
    } finally {
      setSaving(false)
      setUploadTarget(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const triggerUpload = (type: string, id: string, field: string) => {
    setUploadTarget({ type, id, field })
    fileInputRef.current?.click()
  }

  const lookupStripeProduct = async (productId: string) => {
    if (!productId.startsWith('prod_')) {
      showMessage('error', 'El ID debe empezar con prod_ (ej: prod_TpU0No8suvCdsj)')
      return
    }
    setStripeSearching(true)
    try {
      const res = await fetch(`/api/admin/stripe-product?id=${productId}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setNewProductForm({
        name_es: data.name || '',
        name_en: data.name || '',
        description_es: data.description || '',
        description_en: data.description || '',
        price: data.default_price?.unit_amount || 32500,
        main_image: data.images?.[0] || 'https://qhyuoiyamcxxjsznbiyt.supabase.co/storage/v1/object/public/cms-images/placeholder.png',
        stripe_price_id: data.default_price?.id || '',
        stripe_product_id: productId,
        color: '',
        badge_key: null,
        description_type: 'normal',
        sizes: [],
        gender: 'kids',
      })
      showMessage('success', `Producto encontrado: ${data.name}`)
    } catch (error: any) {
      showMessage('error', `No se encontró el producto: ${error.message}`)
      setNewProductForm(null)
    } finally {
      setStripeSearching(false)
    }
  }

  const handleCreateFromStripe = async () => {
    if (!newProductForm) return
    setSaving(true)
    try {
      const sizesMap: Record<string, string[]> = {
        kids:   ['13mx','14mx','15mx','16mx','17mx','18mx'],
        ladies: ['22mx','23mx','24mx','25mx','26mx'],
        mens:   ['25mx','26mx','27mx','28mx','29mx','30mx'],
      }
      const newProduct = await createCMSProduct({
        product_id: Math.floor(Math.random() * 900000) + 100000,
        name_es: newProductForm.name_es,
        name_en: newProductForm.name_en,
        description_es: newProductForm.description_es,
        description_en: newProductForm.description_en,
        price: newProductForm.price,
        main_image: newProductForm.main_image,
        gallery_images: newProductForm.main_image ? [newProductForm.main_image] : [],
        badge_key: newProductForm.badge_key,
        description_type: newProductForm.description_type,
        rating: 5.0,
        color: newProductForm.color || '',
        sizes: newProductForm.sizes.length > 0 ? newProductForm.sizes : sizesMap[newProductForm.gender] || sizesMap.kids,
        stripe_price_id: newProductForm.stripe_price_id || null,
        is_active: true,
        position: products.length,
      } as any)
      // Always close the form and reload regardless
      setNewProductForm(null)
      setStripeSearchId('')
      if (newProduct) {
        setProducts(prev => [...prev, newProduct])
        setEditingProduct(newProduct.id)
        showMessage('success', '¡Producto creado! Ahora puedes subir imágenes.')
      } else {
        // Reload from DB to get the created product
        const refreshed = await getCMSProducts()
        setProducts(refreshed)
        showMessage('success', 'Producto creado correctamente')
      }
    } catch (error: any) {
      showMessage('error', `Error: ${error?.message}`)
    } finally {
      setSaving(false)
    }
  }

  // =====================================================
  // HERO IMAGES HANDLERS
  // =====================================================

  const handleSaveHero = async (hero: HeroImage) => {
    setSaving(true)
    try {
      await updateHeroImage(hero.id, {
        image_url_desktop: hero.image_url_desktop,
        image_url_mobile: hero.image_url_mobile,
        alt_text: hero.alt_text,
        link_url: hero.link_url,
        is_active: hero.is_active
      })
      showMessage('success', 'Imagen guardada correctamente')
      setEditingHero(null)
    } catch (error) {
      showMessage('error', 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleAddHero = async () => {
    setSaving(true)
    try {
      const newHero = await createHeroImage({
        position: heroImages.length,
        image_url_desktop: 'https://via.placeholder.com/1920x600?text=Nueva+Imagen',
        image_url_mobile: 'https://via.placeholder.com/600x800?text=Nueva+Imagen',
        alt_text: 'Nueva imagen',
        link_url: null,
        is_active: true
      })
      if (newHero) {
        setHeroImages([...heroImages, newHero])
        setEditingHero(newHero.id)
        showMessage('success', 'Imagen añadida')
      }
    } catch (error) {
      showMessage('error', 'Error al añadir imagen')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteHero = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta imagen?')) return
    setSaving(true)
    try {
      await deleteHeroImage(id)
      setHeroImages(heroImages.filter(h => h.id !== id))
      showMessage('success', 'Imagen eliminada')
    } catch (error) {
      showMessage('error', 'Error al eliminar')
    } finally {
      setSaving(false)
    }
  }

  const updateHeroLocal = useCallback((id: string, field: string, value: any) => {
    setHeroImages(prev => prev.map(h => 
      h.id === id ? { ...h, [field]: value } : h
    ))
  }, [])

  // =====================================================
  // SECTIONS HANDLERS
  // =====================================================

  const handleSaveSection = async (section: CMSSection) => {
    setSaving(true)
    try {
      await updateCMSSection(section.id, {
        title_es: section.title_es,
        title_en: section.title_en,
        subtitle_es: section.subtitle_es,
        subtitle_en: section.subtitle_en,
        content_es: section.content_es,
        content_en: section.content_en,
        image_url: section.image_url,
        background_image_url: section.background_image_url,
        is_active: section.is_active
      })
      showMessage('success', 'Sección guardada correctamente')
      setEditingSection(null)
    } catch (error) {
      showMessage('error', 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const updateSectionLocal = useCallback((id: string, field: string, value: any) => {
    setSections(prev => prev.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ))
  }, [])

  // =====================================================
  // PRODUCTS HANDLERS
  // =====================================================

  const handleSaveProduct = async (product: CMSProduct) => {
    setSaving(true)
    try {
      const baseUpdate: any = {
        name_es: product.name_es,
        name_en: product.name_en,
        description_es: product.description_es,
        description_en: product.description_en,
        price: product.price,
        main_image: product.main_image,
        gallery_images: product.gallery_images,
        badge_key: product.badge_key,
        color: product.color,
        description_type: product.description_type,
        is_active: product.is_active
      }
      if ((product as any).stripe_price_id !== undefined) {
        baseUpdate.stripe_price_id = (product as any).stripe_price_id || null
      }
      await updateCMSProduct(product.id, baseUpdate)
      showMessage('success', 'Producto guardado correctamente')
      setEditingProduct(null)
    } catch (error) {
      showMessage('error', 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleAddProduct = async () => {
    setSaving(true)
    try {
      const newProduct = await createCMSProduct({
        product_id: Date.now(),
        name_es: 'Nuevo Producto',
        name_en: 'New Product',
        description_es: 'Descripción del producto',
        description_en: 'Product description',
        price: 32500,
        main_image: 'https://via.placeholder.com/400x400?text=Producto',
        gallery_images: [],
        badge_key: null,
        description_type: 'normal',
        rating: 5.0,
        color: 'Color',
        sizes: ['13mx', '14mx', '15mx', '16mx', '17mx'],
        is_active: true,
        position: products.length
      } as any)
      if (newProduct) {
        setProducts([...products, newProduct])
        setEditingProduct(newProduct.id)
        showMessage('success', 'Producto añadido')
      }
    } catch (error: any) {
      showMessage('error', `Error: ${error?.message || JSON.stringify(error)}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return
    setSaving(true)
    try {
      await deleteCMSProduct(id)
      setProducts(products.filter(p => p.id !== id))
      showMessage('success', 'Producto eliminado')
    } catch (error) {
      showMessage('error', 'Error al eliminar')
    } finally {
      setSaving(false)
    }
  }

  const updateProductLocal = useCallback((id: string, field: string, value: any) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ))
  }, [])

  // =====================================================
  // TESTIMONIALS HANDLERS
  // =====================================================

  const handleSaveTestimonial = async (testimonial: CMSTestimonial) => {
    setSaving(true)
    try {
      await updateCMSTestimonial(testimonial.id, {
        author_name: testimonial.author_name,
        author_image: testimonial.author_image,
        content_es: testimonial.content_es,
        content_en: testimonial.content_en,
        rating: testimonial.rating,
        is_active: testimonial.is_active
      })
      showMessage('success', 'Testimonio guardado correctamente')
      setEditingTestimonial(null)
    } catch (error) {
      showMessage('error', 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleAddTestimonial = async () => {
    setSaving(true)
    try {
      const newTestimonial = await createCMSTestimonial({
        author_name: 'Nuevo Cliente',
        author_image: null,
        content_es: 'Escribe aquí el testimonio...',
        content_en: 'Write testimonial here...',
        rating: 5,
        is_active: true,
        position: testimonials.length
      })
      if (newTestimonial) {
        setTestimonials([...testimonials, newTestimonial])
        setEditingTestimonial(newTestimonial.id)
        showMessage('success', 'Testimonio añadido')
      }
    } catch (error) {
      showMessage('error', 'Error al añadir testimonio')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este testimonio?')) return
    setSaving(true)
    try {
      await deleteCMSTestimonial(id)
      setTestimonials(testimonials.filter(t => t.id !== id))
      showMessage('success', 'Testimonio eliminado')
    } catch (error) {
      showMessage('error', 'Error al eliminar')
    } finally {
      setSaving(false)
    }
  }

  const updateTestimonialLocal = useCallback((id: string, field: string, value: any) => {
    setTestimonials(prev => prev.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ))
  }, [])

  // =====================================================
  // RENDER
  // =====================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-8 h-8 animate-spin text-[#D4AF37]" />
        <span className="ml-3 text-gray-600">Cargando CMS...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Message Toast */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {message.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {/* Saving Overlay */}
      {saving && (
        <div className="fixed inset-0 bg-black/20 z-40 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 shadow-xl flex items-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-[#D4AF37]" />
            <span>Guardando...</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestor de Contenido (CMS)</h2>
          <p className="text-gray-500">Edita textos e imágenes de tu sitio web</p>
        </div>
        <Button onClick={loadAllData} variant="outline" className="neu-btn border-0">
          <RefreshCw className="w-4 h-4 mr-2" />
          Recargar
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'hero', label: 'Hero/Banner', icon: ImageIcon },
          { id: 'sections', label: 'Secciones', icon: Layout },
          { id: 'products', label: 'Productos', icon: Package },
          { id: 'testimonials', label: 'Testimonios', icon: MessageSquare },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as CMSTab)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#D4AF37] text-white shadow-lg'
                : 'neu-btn text-gray-600 hover:text-[#D4AF37]'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hero Images Tab */}
      {activeTab === 'hero' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-700">Imágenes del Banner Principal</h3>
            <Button onClick={handleAddHero} className="bg-[#D4AF37] hover:bg-[#B8962E] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Añadir Imagen
            </Button>
          </div>

          {heroImages.length === 0 ? (
            <Card className="p-8 text-center neu-shadow border-0 bg-[#E0E5EC]">
              <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No hay imágenes del hero. Añade una para comenzar.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {heroImages.map((hero, index) => (
                <Card key={hero.id} className="p-4 neu-shadow border-0 bg-[#E0E5EC]">
                  <div className="flex items-start gap-4">
                    {/* Drag Handle */}
                    <div className="flex flex-col items-center gap-2 pt-2">
                      <GripVertical className="w-5 h-5 text-gray-400 cursor-grab" />
                      <span className="text-xs text-gray-400">#{index + 1}</span>
                    </div>

                    {/* Image Preview */}
                    <div className="flex-shrink-0">
                      <div className="relative group">
                        <img
                          src={hero.image_url_desktop}
                          alt={hero.alt_text || 'Hero image'}
                          className="w-40 h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => triggerUpload('hero', hero.id, 'image_url_desktop')}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
                        >
                          <Upload className="w-6 h-6 text-white" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 text-center">Desktop</p>
                    </div>

                    <div className="flex-shrink-0">
                      <div className="relative group">
                        <img
                          src={hero.image_url_mobile || hero.image_url_desktop}
                          alt={hero.alt_text || 'Hero image mobile'}
                          className="w-16 h-24 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => triggerUpload('hero', hero.id, 'image_url_mobile')}
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
                        >
                          <Upload className="w-5 h-5 text-white" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 text-center">Móvil</p>
                    </div>

                    {/* Edit Fields */}
                    <div className="flex-1 space-y-3">
                      {editingHero === hero.id ? (
                        <>
                          <div>
                            <label className="text-xs text-gray-500">Texto alternativo (SEO)</label>
                            <input
                              type="text"
                              value={hero.alt_text || ''}
                              onChange={(e) => updateHeroLocal(hero.id, 'alt_text', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                              placeholder="Descripción de la imagen"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">URL de enlace (opcional)</label>
                            <input
                              type="text"
                              value={hero.link_url || ''}
                              onChange={(e) => updateHeroLocal(hero.id, 'link_url', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                              placeholder="https://..."
                            />
                          </div>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={hero.is_active}
                                onChange={(e) => updateHeroLocal(hero.id, 'is_active', e.target.checked)}
                                className="rounded"
                              />
                              <span className="text-sm text-gray-600">Activo</span>
                            </label>
                          </div>
                        </>
                      ) : (
                        <div>
                          <p className="text-sm text-gray-700">{hero.alt_text || 'Sin descripción'}</p>
                          <p className="text-xs text-gray-400">{hero.link_url || 'Sin enlace'}</p>
                          <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs ${
                            hero.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {hero.is_active ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      {editingHero === hero.id ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleSaveHero(hero)}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingHero(null)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingHero(hero.id)}
                            className="neu-btn border-0"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteHero(hero.id)}
                            className="text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sections Tab */}
      {activeTab === 'sections' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Secciones de la Página</h3>

          {sections.length === 0 ? (
            <Card className="p-8 text-center neu-shadow border-0 bg-[#E0E5EC]">
              <Layout className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No hay secciones configuradas.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {sections.map((section) => (
                <Card key={section.id} className="p-4 neu-shadow border-0 bg-[#E0E5EC]">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 capitalize">{section.section_name}</h4>
                      <p className="text-xs text-gray-400">Sección: {section.section_name}</p>
                    </div>
                    <div className="flex gap-2">
                      {editingSection === section.id ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleSaveSection(section)}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Guardar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingSection(null)}
                          >
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingSection(section.id)}
                          className="neu-btn border-0"
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                      )}
                    </div>
                  </div>

                  {editingSection === section.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500">Título (Español)</label>
                        <input
                          type="text"
                          value={section.title_es || ''}
                          onChange={(e) => updateSectionLocal(section.id, 'title_es', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Título (Inglés)</label>
                        <input
                          type="text"
                          value={section.title_en || ''}
                          onChange={(e) => updateSectionLocal(section.id, 'title_en', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Subtítulo (Español)</label>
                        <textarea
                          value={section.subtitle_es || ''}
                          onChange={(e) => updateSectionLocal(section.id, 'subtitle_es', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Subtítulo (Inglés)</label>
                        <textarea
                          value={section.subtitle_en || ''}
                          onChange={(e) => updateSectionLocal(section.id, 'subtitle_en', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                          rows={2}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs text-gray-500">Contenido (Español)</label>
                        <textarea
                          value={section.content_es || ''}
                          onChange={(e) => updateSectionLocal(section.id, 'content_es', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                          rows={3}
                        />
                      </div>
                      <div className="md:col-span-2 flex gap-4">
                        {section.image_url && (
                          <div className="relative group">
                            <img
                              src={section.image_url}
                              alt="Section image"
                              className="w-32 h-20 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => triggerUpload('sections', section.id, 'image_url')}
                              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
                            >
                              <Upload className="w-5 h-5 text-white" />
                            </button>
                          </div>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => triggerUpload('sections', section.id, 'image_url')}
                          className="neu-btn border-0"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {section.image_url ? 'Cambiar imagen' : 'Subir imagen'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">Título ES:</p>
                        <p className="text-gray-700">{section.title_es || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Título EN:</p>
                        <p className="text-gray-700">{section.title_en || '-'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-500 text-xs">Subtítulo:</p>
                        <p className="text-gray-700">{section.subtitle_es || '-'}</p>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Productos del Catálogo</h3>

          {/* Stripe Product Lookup */}
          <Card className="p-4 neu-shadow border-0 bg-[#E0E5EC]">
            <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              Agregar producto desde Stripe
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={stripeSearchId}
                onChange={(e) => setStripeSearchId(e.target.value)}
                placeholder="Pega el Stripe Product ID: prod_XXXX..."
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && lookupStripeProduct(stripeSearchId)}
              />
              <Button
                onClick={() => lookupStripeProduct(stripeSearchId)}
                disabled={stripeSearching || !stripeSearchId}
                className="bg-[#D4AF37] hover:bg-[#B8962E] text-white"
              >
                {stripeSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Buscar'}
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Stripe Dashboard → Products → selecciona producto → copia el ID (empieza con prod_)</p>

            {/* Preview after lookup */}
            {newProductForm && (
              <div className="mt-4 p-4 bg-white/60 rounded-xl space-y-3">
                <div className="flex gap-4 items-start">
                  {newProductForm.main_image && !newProductForm.main_image.includes('placeholder') && (
                    <img src={newProductForm.main_image} alt="" className="w-20 h-20 object-cover rounded-lg" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{newProductForm.name_es}</p>
                    <p className="text-sm text-[#D4AF37] font-bold">${(newProductForm.price / 100).toFixed(0)} MXN</p>
                    <p className="text-xs text-green-600">✓ Price ID: {newProductForm.stripe_price_id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 font-medium">Nombre en español</label>
                    <input
                      type="text"
                      value={newProductForm.name_es}
                      onChange={(e) => setNewProductForm({ ...newProductForm, name_es: e.target.value })}
                      className="w-full px-2 py-1.5 rounded border border-gray-200 text-sm mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-medium">Color</label>
                    <input
                      type="text"
                      value={newProductForm.color}
                      onChange={(e) => setNewProductForm({ ...newProductForm, color: e.target.value })}
                      className="w-full px-2 py-1.5 rounded border border-gray-200 text-sm mt-1"
                      placeholder="BLANCO, NEGRO, CARAMEL..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 font-medium">Tipo de producto</label>
                    <select
                      value={newProductForm.description_type}
                      onChange={(e) => setNewProductForm({ ...newProductForm, description_type: e.target.value })}
                      className="w-full px-2 py-1.5 rounded border border-gray-200 text-sm mt-1"
                    >
                      <option value="normal">Normal (Low)</option>
                      <option value="high">High</option>
                      <option value="winter">Multicolor</option>
                      <option value="ballerina">Balerina</option>
                      <option value="lightyear">Lightyear</option>
                      <option value="combat">Combat</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-medium">¿Para quién?</label>
                    <select
                      value={newProductForm.gender}
                      onChange={(e) => setNewProductForm({ ...newProductForm, gender: e.target.value, sizes: [] })}
                      className="w-full px-2 py-1.5 rounded border border-gray-200 text-sm mt-1"
                    >
                      <option value="kids">Niños (13mx–18mx)</option>
                      <option value="ladies">Dama (22mx–26mx)</option>
                      <option value="mens">Caballero (25mx–30mx)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    onClick={handleCreateFromStripe}
                    disabled={saving}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                  >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                    Crear Producto
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { setNewProductForm(null); setStripeSearchId('') }}
                    className="px-4"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {products.length === 0 ? (
            <Card className="p-8 text-center neu-shadow border-0 bg-[#E0E5EC]">
              <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No hay productos en el CMS aún.</p>
              <p className="text-sm text-gray-400 mt-2">Usa el buscador de arriba para agregar productos desde Stripe.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Card key={product.id} className="neu-shadow border-0 bg-[#E0E5EC] overflow-hidden">
                  {/* Product Image Header */}
                  <div className="relative group h-40 bg-gray-100">
                    <img
                      src={product.main_image}
                      alt={product.name_es}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => triggerUpload('products', product.id, 'main_image')}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <Upload className="w-6 h-6 text-white" />
                      <span className="text-white text-sm ml-2">Cambiar imagen</span>
                    </button>
                    {product.badge_key && (
                      <span className="absolute top-2 left-2 bg-[#D4AF37] text-white text-xs px-2 py-1 rounded-full">
                        {product.badge_key}
                      </span>
                    )}
                    <span className="absolute top-2 right-2 bg-white/90 text-gray-700 text-xs px-2 py-1 rounded-full">
                      ID: {product.product_id}
                    </span>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    {editingProduct === product.id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-500">Nombre (Español)</label>
                          <input
                            type="text"
                            value={product.name_es}
                            onChange={(e) => updateProductLocal(product.id, 'name_es', e.target.value)}
                            className="w-full px-2 py-1.5 rounded border border-gray-200 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Nombre (Inglés)</label>
                          <input
                            type="text"
                            value={product.name_en || ''}
                            onChange={(e) => updateProductLocal(product.id, 'name_en', e.target.value)}
                            className="w-full px-2 py-1.5 rounded border border-gray-200 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">Descripción (Español)</label>
                          <textarea
                            value={product.description_es || ''}
                            onChange={(e) => updateProductLocal(product.id, 'description_es', e.target.value)}
                            className="w-full px-2 py-1.5 rounded border border-gray-200 text-sm"
                            rows={2}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-500">Precio (centavos)</label>
                            <input
                              type="number"
                              value={product.price}
                              onChange={(e) => updateProductLocal(product.id, 'price', parseInt(e.target.value))}
                              className="w-full px-2 py-1.5 rounded border border-gray-200 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">Color</label>
                            <input
                              type="text"
                              value={product.color || ''}
                              onChange={(e) => updateProductLocal(product.id, 'color', e.target.value)}
                              className="w-full px-2 py-1.5 rounded border border-gray-200 text-sm"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-500">Badge</label>
                            <select
                              value={product.badge_key || ''}
                              onChange={(e) => updateProductLocal(product.id, 'badge_key', e.target.value || null)}
                              className="w-full px-2 py-1.5 rounded border border-gray-200 text-sm"
                            >
                              <option value="">Sin badge</option>
                              <option value="mostPopular">Más Popular</option>
                              <option value="favorite">Favorito</option>
                              <option value="limitedEdition">Edición Limitada</option>
                              <option value="classic">Clásico</option>
                              <option value="newProduct">Nuevo</option>
                              <option value="trending">Tendencia</option>
                              <option value="popular">Popular</option>
                              <option value="exclusive">Exclusivo</option>
                              <option value="winterCollection">Otoño/Invierno</option>
                              <option value="ballerina">Balerina</option>
                              <option value="lightyear">Lightyear</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">Tipo</label>
                            <select
                              value={product.description_type}
                              onChange={(e) => updateProductLocal(product.id, 'description_type', e.target.value)}
                              className="w-full px-2 py-1.5 rounded border border-gray-200 text-sm"
                            >
                              <option value="normal">Normal (Low)</option>
                              <option value="high">High</option>
                              <option value="winter">Multicolor</option>
                              <option value="ballerina">Balerina</option>
                              <option value="lightyear">Lightyear</option>
                              <option value="combat">Combat</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 font-semibold text-orange-600">⚡ Stripe Price ID</label>
                          <input
                            type="text"
                            value={(product as any).stripe_price_id || ''}
                            onChange={(e) => updateProductLocal(product.id, 'stripe_price_id', e.target.value || null)}
                            className="w-full px-2 py-1.5 rounded border border-orange-300 text-sm bg-orange-50"
                            placeholder="price_1Abc123... (de tu dashboard de Stripe)"
                          />
                          <p className="text-xs text-gray-400 mt-0.5">Copia el Price ID de Stripe Dashboard → Products → tu producto → Price ID</p>
                        </div>

                        {/* Gallery Images */}
                        <div>
                          <label className="text-xs text-gray-500 font-semibold block mb-2">📸 Imágenes de galería</label>
                          <div className="grid grid-cols-3 gap-2">
                            {/* Existing gallery images */}
                            {(Array.isArray(product.gallery_images) ? product.gallery_images : []).map((imgUrl: string, idx: number) => (
                              <div key={idx} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                <img src={imgUrl} alt={`Galería ${idx + 1}`} className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...(product.gallery_images as string[])]
                                    updated.splice(idx, 1)
                                    updateProductLocal(product.id, 'gallery_images', updated)
                                  }}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                            {/* Empty placeholder slots (up to 6 total) */}
                            {Array.from({ length: Math.max(0, 6 - (Array.isArray(product.gallery_images) ? product.gallery_images.length : 0)) }).map((_, idx) => (
                              <button
                                key={`slot-${idx}`}
                                type="button"
                                onClick={() => {
                                  setUploadTarget({ type: 'product-gallery', id: product.id, field: 'gallery_images' })
                                  fileInputRef.current?.click()
                                }}
                                className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-[#D4AF37] hover:bg-yellow-50 transition-colors"
                              >
                                <Upload className="w-4 h-4 text-gray-400" />
                                <span className="text-xs text-gray-400 mt-1">Subir</span>
                              </button>
                            ))}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">Máximo 6 imágenes. Haz clic en una imagen para eliminarla.</p>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveProduct(product)}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Guardar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingProduct(null)}
                            className="flex-1"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h4 className="font-medium text-gray-800 text-sm leading-tight mb-1">{product.name_es}</h4>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[#D4AF37] font-bold">${(product.price / 100).toFixed(0)} MXN</p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500">{product.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">Color: {product.color}</p>
                        <p className="text-xs text-gray-400">Tipo: {product.description_type}</p>
                        <p className="text-xs mb-3">
                          {(product as any).stripe_price_id 
                            ? <span className="text-green-600">✓ Stripe vinculado</span>
                            : <span className="text-red-400">⚠ Sin Stripe Price ID</span>
                          }
                        </p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingProduct(product.id)}
                            className="flex-1 neu-btn border-0 text-xs"
                          >
                            <Edit3 className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-500 hover:bg-red-50 text-xs px-3"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Testimonials Tab */}
      {activeTab === 'testimonials' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-700">Testimonios de Clientes</h3>
            <Button onClick={handleAddTestimonial} className="bg-[#D4AF37] hover:bg-[#B8962E] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Añadir Testimonio
            </Button>
          </div>

          {testimonials.length === 0 ? (
            <Card className="p-8 text-center neu-shadow border-0 bg-[#E0E5EC]">
              <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No hay testimonios. Añade uno para comenzar.</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="p-4 neu-shadow border-0 bg-[#E0E5EC]">
                  <div className="flex gap-4">
                    {/* Author Image */}
                    <div className="relative group flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                        {testimonial.author_image ? (
                          <img
                            src={testimonial.author_image}
                            alt={testimonial.author_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Star className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => triggerUpload('testimonials', testimonial.id, 'author_image')}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center"
                      >
                        <Upload className="w-4 h-4 text-white" />
                      </button>
                    </div>

                    {/* Testimonial Content */}
                    <div className="flex-1">
                      {editingTestimonial === testimonial.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={testimonial.author_name}
                            onChange={(e) => updateTestimonialLocal(testimonial.id, 'author_name', e.target.value)}
                            className="w-full px-2 py-1 rounded border border-gray-200 text-sm font-medium"
                            placeholder="Nombre del cliente"
                          />
                          <textarea
                            value={testimonial.content_es}
                            onChange={(e) => updateTestimonialLocal(testimonial.id, 'content_es', e.target.value)}
                            className="w-full px-2 py-1 rounded border border-gray-200 text-sm"
                            rows={3}
                            placeholder="Testimonio..."
                          />
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-500">Rating:</span>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => updateTestimonialLocal(testimonial.id, 'rating', star)}
                                  className={`${star <= testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                >
                                  <Star className="w-4 h-4 fill-current" />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSaveTestimonial(testimonial)}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Guardar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingTestimonial(null)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-800">{testimonial.author_name}</h4>
                            <div className="flex">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 italic">"{testimonial.content_es}"</p>
                          <div className="flex gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingTestimonial(testimonial.id)}
                              className="neu-btn border-0 text-xs"
                            >
                              <Edit3 className="w-3 h-3 mr-1" />
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteTestimonial(testimonial.id)}
                              className="text-red-500 hover:bg-red-50 text-xs"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  )
}
