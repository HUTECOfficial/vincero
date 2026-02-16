-- Script para inicializar las tablas del CMS en Supabase
-- Ejecuta este script en el SQL Editor de Supabase

-- 1. Crear tabla hero_images si no existe
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

-- 2. Crear tabla cms_sections si no existe
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

-- 3. Crear tabla cms_products si no existe
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

-- 4. Crear tabla cms_testimonials si no existe
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

-- 5. Insertar datos iniciales en cms_sections (solo si está vacía)
INSERT INTO cms_sections (section_name, title_es, title_en, is_active)
SELECT 'hero', 'Bienvenido a VINCERO', 'Welcome to VINCERO', true
WHERE NOT EXISTS (SELECT 1 FROM cms_sections WHERE section_name = 'hero');

INSERT INTO cms_sections (section_name, title_es, title_en, is_active)
SELECT 'about', 'Sobre Nosotros', 'About Us', true
WHERE NOT EXISTS (SELECT 1 FROM cms_sections WHERE section_name = 'about');

-- 6. Insertar productos Combat en cms_products
INSERT INTO cms_products (
  product_id, name_es, name_en, description_es, description_en, 
  price, main_image, gallery_images, badge_key, description_type, 
  rating, color, sizes, is_active, position
)
VALUES 
  (
    19,
    'Tenis Combat Alto BLANCO',
    'High Combat Sneakers WHITE',
    'Tenis deportivo alto estilo Combat fabricado en textil resistente y transpirable. Diseño táctico moderno con detalles reforzados.',
    'High-top Combat-style sports sneakers made of durable and breathable textile. Modern tactical design with reinforced details.',
    32500,
    'https://qhyuoiyamcxxjsznbiyt.supabase.co/storage/v1/object/public/fotos/tennisversion2.png',
    '["https://qhyuoiyamcxxjsznbiyt.supabase.co/storage/v1/object/public/fotos/tennisversion2.png"]'::jsonb,
    'combat',
    'combat',
    5.0,
    'BLANCO',
    '["17mx", "18mx", "19mx", "20mx", "21mx"]'::jsonb,
    true,
    19
  ),
  (
    20,
    'Tenis Combat Alto CARAMEL',
    'High Combat Sneakers CARAMEL',
    'Tenis deportivo alto estilo Combat fabricado en textil resistente y transpirable. Diseño táctico moderno con detalles reforzados.',
    'High-top Combat-style sports sneakers made of durable and breathable textile. Modern tactical design with reinforced details.',
    32500,
    'https://qhyuoiyamcxxjsznbiyt.supabase.co/storage/v1/object/public/fotos/tennisversion2(1).png',
    '["https://qhyuoiyamcxxjsznbiyt.supabase.co/storage/v1/object/public/fotos/tennisversion2(1).png"]'::jsonb,
    'combat',
    'combat',
    4.8,
    'CARAMEL',
    '["17mx", "18mx", "19mx", "20mx", "21mx"]'::jsonb,
    true,
    20
  ),
  (
    21,
    'Tenis Combat Alto OXFORD',
    'High Combat Sneakers OXFORD',
    'Tenis deportivo alto estilo Combat fabricado en textil resistente y transpirable. Diseño táctico moderno con detalles reforzados.',
    'High-top Combat-style sports sneakers made of durable and breathable textile. Modern tactical design with reinforced details.',
    32500,
    'https://qhyuoiyamcxxjsznbiyt.supabase.co/storage/v1/object/public/fotos/tennisversion2(2).png.png',
    '["https://qhyuoiyamcxxjsznbiyt.supabase.co/storage/v1/object/public/fotos/tennisversion2(2).png.png"]'::jsonb,
    'combat',
    'combat',
    4.9,
    'OXFORD',
    '["17mx", "18mx", "19mx", "20mx", "21mx"]'::jsonb,
    true,
    21
  )
ON CONFLICT (product_id) DO UPDATE SET
  name_es = EXCLUDED.name_es,
  name_en = EXCLUDED.name_en,
  description_es = EXCLUDED.description_es,
  description_en = EXCLUDED.description_en,
  price = EXCLUDED.price,
  main_image = EXCLUDED.main_image,
  gallery_images = EXCLUDED.gallery_images,
  badge_key = EXCLUDED.badge_key,
  description_type = EXCLUDED.description_type,
  rating = EXCLUDED.rating,
  color = EXCLUDED.color,
  sizes = EXCLUDED.sizes,
  updated_at = NOW();

-- 7. Insertar un testimonio de ejemplo si la tabla está vacía
INSERT INTO cms_testimonials (author_name, content_es, content_en, rating, is_active, position)
SELECT 
  'Cliente Satisfecho',
  'Excelente calidad y diseño. Mis hijos están encantados con sus nuevos tenis.',
  'Excellent quality and design. My kids are delighted with their new sneakers.',
  5.0,
  true,
  0
WHERE NOT EXISTS (SELECT 1 FROM cms_testimonials);

-- 8. Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_hero_images_active ON hero_images(is_active, position);
CREATE INDEX IF NOT EXISTS idx_cms_products_active ON cms_products(is_active, position);
CREATE INDEX IF NOT EXISTS idx_cms_testimonials_active ON cms_testimonials(is_active, position);
CREATE INDEX IF NOT EXISTS idx_cms_sections_active ON cms_sections(is_active);

-- Mensaje de confirmación
SELECT 'Tablas del CMS inicializadas correctamente' as mensaje;
