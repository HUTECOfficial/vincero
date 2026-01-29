'use client'

import { useState, useEffect, useRef } from 'react'
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
  getCMSImagesBySection,
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
  updateCMSImage,
  createCMSImage,
  deleteCMSImage,
  uploadCMSImage,
  reorderItems,
  type HeroImage,
  type CMSSection,
  type CMSProduct,
  type CMSTestimonial,
  type CMSImage
} from '@/lib/cms'

type CMSTab = 'hero' | 'images' | 'sections' | 'products' | 'testimonials'

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
  const [allImages, setAllImages] = useState<Record<string, CMSImage[]>>({})

  // Edit states
  const [editingHero, setEditingHero] = useState<string | null>(null)
  const [editingSection, setEditingSection] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [editingTestimonial, setEditingTestimonial] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadTarget, setUploadTarget] = useState<{ type: string; id: string; field: string } | null>(null)

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    setLoading(true)
    try {
      const [heroData, sectionsData, productsData, testimonialsData, imagesData] = await Promise.all([
        getHeroImages(),
        getCMSSections(),
        getCMSProducts(),
        getCMSTestimonials(),
        getCMSImagesBySection()
      ])
      setHeroImages(heroData)
      setSections(sectionsData)
      setProducts(productsData)
      setTestimonials(testimonialsData)
      setAllImages(imagesData)
    } catch (error) {
      console.error('Error loading CMS data:', error)
      showMessage('error', 'Error al cargar los datos')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

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
      } else if (uploadTarget.type === 'testimonials') {
        const updated = testimonials.map(t => 
          t.id === uploadTarget.id 
            ? { ...t, [uploadTarget.field]: imageUrl }
            : t
        )
        setTestimonials(updated)
        await updateCMSTestimonial(uploadTarget.id, { [uploadTarget.field]: imageUrl } as any)
      } else if (uploadTarget.type === 'cms_images') {
        // Update CMS image
        const section = uploadTarget.field // field contains the section name
        const updatedSection = allImages[section]?.map(img => 
          img.id === uploadTarget.id 
            ? { ...img, image_url: imageUrl }
            : img
        ) || []
        setAllImages({ ...allImages, [section]: updatedSection })
        await updateCMSImage(uploadTarget.id, { image_url: imageUrl })
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

  const updateHeroLocal = (id: string, field: string, value: any) => {
    setHeroImages(heroImages.map(h => 
      h.id === id ? { ...h, [field]: value } : h
    ))
  }

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

  const updateSectionLocal = (id: string, field: string, value: any) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ))
  }

  // =====================================================
  // PRODUCTS HANDLERS
  // =====================================================

  const handleSaveProduct = async (product: CMSProduct) => {
    setSaving(true)
    try {
      await updateCMSProduct(product.id, {
        name_es: product.name_es,
        name_en: product.name_en,
        description_es: product.description_es,
        description_en: product.description_en,
        price: product.price,
        main_image: product.main_image,
        gallery_images: product.gallery_images,
        badge_key: product.badge_key,
        color: product.color,
        is_active: product.is_active
      })
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
      })
      if (newProduct) {
        setProducts([...products, newProduct])
        setEditingProduct(newProduct.id)
        showMessage('success', 'Producto añadido')
      }
    } catch (error) {
      showMessage('error', 'Error al añadir producto')
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

  const updateProductLocal = (id: string, field: string, value: any) => {
    setProducts(products.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

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

  const updateTestimonialLocal = (id: string, field: string, value: any) => {
    setTestimonials(testimonials.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ))
  }

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
          { id: 'images', label: 'Todas las Imágenes', icon: Sparkles },
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
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-700">Productos del Catálogo</h3>
            <Button onClick={handleAddProduct} className="bg-[#D4AF37] hover:bg-[#B8962E] text-white">
              <Plus className="w-4 h-4 mr-2" />
              Añadir Producto
            </Button>
          </div>

          <p className="text-sm text-gray-500 bg-yellow-50 p-3 rounded-lg">
            <Sparkles className="w-4 h-4 inline mr-2 text-yellow-600" />
            Los productos que añadas aquí aparecerán en el catálogo de la tienda.
          </p>

          {products.length === 0 ? (
            <Card className="p-8 text-center neu-shadow border-0 bg-[#E0E5EC]">
              <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No hay productos en el CMS.</p>
              <p className="text-sm text-gray-400 mt-2">Ejecuta el script <code className="bg-gray-200 px-1 rounded">supabase-cms-products-sections.sql</code> para cargar los productos.</p>
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
                            </select>
                          </div>
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
                        <p className="text-xs text-gray-400 mb-3">Tipo: {product.description_type}</p>
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

      {/* All Images Tab */}
      {activeTab === 'images' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Todas las Imágenes del Sitio</h3>
              <p className="text-sm text-gray-500">Organizadas por sección. Haz clic en una imagen para cambiarla.</p>
            </div>
          </div>

          {Object.keys(allImages).length === 0 ? (
            <Card className="p-8 text-center neu-shadow border-0 bg-[#E0E5EC]">
              <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No hay imágenes en el CMS. Ejecuta el schema SQL para cargar las imágenes.</p>
            </Card>
          ) : (
            Object.entries(allImages).map(([sectionName, images]) => (
              <Card key={sectionName} className="p-4 neu-shadow border-0 bg-[#E0E5EC]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-800 capitalize flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#D4AF37]"></span>
                    {sectionName === 'general' ? 'General' : 
                     sectionName === 'productos' ? 'Productos' :
                     sectionName === 'features' ? 'Página Features' :
                     sectionName === 'about' ? 'Página About' :
                     sectionName === 'videos' ? 'Videos' :
                     sectionName}
                  </h4>
                  <span className="text-xs text-gray-400">{images.length} imágenes</span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {images.map((img) => (
                    <div key={img.id} className="group relative">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-transparent hover:border-[#D4AF37] transition-all">
                        {img.image_url.includes('.mp4') ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white text-xs">
                            🎬 Video
                          </div>
                        ) : (
                          <img
                            src={img.image_url}
                            alt={img.alt_text || img.image_key}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=Error'
                            }}
                          />
                        )}
                        <button
                          onClick={() => triggerUpload('cms_images', img.id, sectionName)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1"
                        >
                          <Upload className="w-6 h-6 text-white" />
                          <span className="text-xs text-white">Cambiar</span>
                        </button>
                      </div>
                      <div className="mt-1">
                        <p className="text-xs font-medium text-gray-700 truncate">{img.description || img.image_key}</p>
                        <p className="text-[10px] text-gray-400 truncate">{img.image_key}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))
          )}

          <Card className="p-4 neu-shadow border-0 bg-[#D4AF37]/10">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#D4AF37] mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Nota sobre las imágenes</p>
                <p className="text-sm text-gray-600">
                  Las imágenes se cargan desde la tabla <code className="bg-gray-200 px-1 rounded">cms_images</code> en Supabase. 
                  Ejecuta el schema SQL (<code className="bg-gray-200 px-1 rounded">supabase-cms-schema.sql</code>) para poblar las imágenes iniciales.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
