-- =====================================================
-- FIX CMS PERMISSIONS - Ejecutar en Supabase SQL Editor
-- =====================================================

-- 1. Verificar que las tablas existen
CREATE TABLE IF NOT EXISTS hero_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position INTEGER DEFAULT 0,
  image_url_desktop TEXT NOT NULL,
  image_url_mobile TEXT,
  alt_text TEXT,
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cms_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name TEXT UNIQUE NOT NULL,
  title_es TEXT,
  title_en TEXT,
  subtitle_es TEXT,
  subtitle_en TEXT,
  content_es TEXT,
  content_en TEXT,
  image_url TEXT,
  background_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cms_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id INTEGER UNIQUE NOT NULL,
  name_es TEXT NOT NULL,
  name_en TEXT,
  description_es TEXT,
  description_en TEXT,
  price DECIMAL(10,2) NOT NULL,
  main_image TEXT NOT NULL,
  gallery_images JSONB DEFAULT '[]',
  badge_key TEXT,
  description_type TEXT DEFAULT 'normal',
  rating DECIMAL(2,1) DEFAULT 5.0,
  color TEXT,
  sizes JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cms_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  author_image TEXT,
  content_es TEXT NOT NULL,
  content_en TEXT,
  rating DECIMAL(2,1) DEFAULT 5.0,
  is_active BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilitar RLS pero permitir lectura pública y escritura para usuarios autenticados
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_testimonials ENABLE ROW LEVEL SECURITY;

-- 3. Eliminar políticas existentes para evitar conflictos
DROP POLICY IF EXISTS "hero_images_public_read" ON hero_images;
DROP POLICY IF EXISTS "hero_images_auth_write" ON hero_images;
DROP POLICY IF EXISTS "cms_sections_public_read" ON cms_sections;
DROP POLICY IF EXISTS "cms_sections_auth_write" ON cms_sections;
DROP POLICY IF EXISTS "cms_products_public_read" ON cms_products;
DROP POLICY IF EXISTS "cms_products_auth_write" ON cms_products;
DROP POLICY IF EXISTS "cms_testimonials_public_read" ON cms_testimonials;
DROP POLICY IF EXISTS "cms_testimonials_auth_write" ON cms_testimonials;

-- 4. Crear políticas de lectura pública (cualquier visitante puede ver)
CREATE POLICY "hero_images_public_read" ON hero_images FOR SELECT USING (true);
CREATE POLICY "cms_sections_public_read" ON cms_sections FOR SELECT USING (true);
CREATE POLICY "cms_products_public_read" ON cms_products FOR SELECT USING (true);
CREATE POLICY "cms_testimonials_public_read" ON cms_testimonials FOR SELECT USING (true);

-- 5. Crear políticas de escritura para usuarios autenticados (admin)
CREATE POLICY "hero_images_auth_write" ON hero_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "cms_sections_auth_write" ON cms_sections FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "cms_products_auth_write" ON cms_products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "cms_testimonials_auth_write" ON cms_testimonials FOR ALL USING (auth.role() = 'authenticated');

-- 6. Verificar que el bucket de storage existe y es público
-- (Esto se hace desde el dashboard de Supabase > Storage)

SELECT 'Permisos del CMS configurados correctamente' as mensaje;
