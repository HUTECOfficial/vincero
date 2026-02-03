-- =====================================================
-- SCHEMA PARA CMS - CONTENIDO EDITABLE
-- =====================================================

-- Tabla principal de contenido editable
CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section VARCHAR(100) NOT NULL,
  content_key VARCHAR(100) NOT NULL,
  content_type VARCHAR(20) NOT NULL CHECK (content_type IN ('text', 'image', 'html', 'json')),
  value_text TEXT,
  value_image_url TEXT,
  value_json JSONB,
  language VARCHAR(5) DEFAULT 'es',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id),
  UNIQUE(section, content_key, language)
);

-- Tabla para imágenes del hero/banner
CREATE TABLE IF NOT EXISTS hero_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position INTEGER NOT NULL DEFAULT 0,
  image_url_desktop TEXT NOT NULL,
  image_url_mobile TEXT,
  alt_text VARCHAR(255),
  link_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para productos (para poder editarlos desde el CMS)
CREATE TABLE IF NOT EXISTS cms_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id INTEGER UNIQUE NOT NULL,
  name_es VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  description_es TEXT,
  description_en TEXT,
  price INTEGER NOT NULL,
  main_image TEXT NOT NULL,
  gallery_images JSONB DEFAULT '[]',
  badge_key VARCHAR(50),
  description_type VARCHAR(50) DEFAULT 'normal',
  rating DECIMAL(2,1) DEFAULT 5.0,
  color VARCHAR(100),
  sizes JSONB DEFAULT '["13mx", "14mx", "15mx", "16mx", "17mx"]',
  is_active BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para testimonios editables
CREATE TABLE IF NOT EXISTS cms_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name VARCHAR(100) NOT NULL,
  author_image TEXT,
  content_es TEXT NOT NULL,
  content_en TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_active BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para secciones de la página (features, philosophy, etc.)
CREATE TABLE IF NOT EXISTS cms_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name VARCHAR(100) NOT NULL UNIQUE,
  title_es VARCHAR(255),
  title_en VARCHAR(255),
  subtitle_es TEXT,
  subtitle_en TEXT,
  content_es TEXT,
  content_en TEXT,
  image_url TEXT,
  background_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_sections ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública (todos pueden ver el contenido)
CREATE POLICY "Public read access for site_content" ON site_content
  FOR SELECT USING (true);

CREATE POLICY "Public read access for hero_images" ON hero_images
  FOR SELECT USING (true);

CREATE POLICY "Public read access for cms_products" ON cms_products
  FOR SELECT USING (true);

CREATE POLICY "Public read access for cms_testimonials" ON cms_testimonials
  FOR SELECT USING (true);

CREATE POLICY "Public read access for cms_sections" ON cms_sections
  FOR SELECT USING (true);

-- Políticas de escritura solo para admins
-- Nota: Debes crear una función para verificar si el usuario es admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT email IN ('admin@vincero.com', 'vincero@admin.com', 'hutec.ia@gmail.com', 'vinceroadmin@vincero.com.mx')
    FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas de escritura para admins
CREATE POLICY "Admin write access for site_content" ON site_content
  FOR ALL USING (is_admin());

CREATE POLICY "Admin write access for hero_images" ON hero_images
  FOR ALL USING (is_admin());

CREATE POLICY "Admin write access for cms_products" ON cms_products
  FOR ALL USING (is_admin());

CREATE POLICY "Admin write access for cms_testimonials" ON cms_testimonials
  FOR ALL USING (is_admin());

CREATE POLICY "Admin write access for cms_sections" ON cms_sections
  FOR ALL USING (is_admin());

-- Trigger para actualizar updated_at
CREATE TRIGGER update_site_content_updated_at
  BEFORE UPDATE ON site_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hero_images_updated_at
  BEFORE UPDATE ON hero_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cms_products_updated_at
  BEFORE UPDATE ON cms_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cms_testimonials_updated_at
  BEFORE UPDATE ON cms_testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cms_sections_updated_at
  BEFORE UPDATE ON cms_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_site_content_section ON site_content(section);
CREATE INDEX IF NOT EXISTS idx_site_content_key ON site_content(content_key);
CREATE INDEX IF NOT EXISTS idx_hero_images_position ON hero_images(position);
CREATE INDEX IF NOT EXISTS idx_cms_products_position ON cms_products(position);

-- Tabla para TODAS las imágenes del sitio organizadas por sección
CREATE TABLE IF NOT EXISTS cms_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section VARCHAR(100) NOT NULL,
  image_key VARCHAR(100) NOT NULL,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(255),
  description VARCHAR(255),
  position INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section, image_key)
);

-- Habilitar RLS para cms_images
ALTER TABLE cms_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for cms_images" ON cms_images
  FOR SELECT USING (true);

CREATE POLICY "Admin write access for cms_images" ON cms_images
  FOR ALL USING (is_admin());

CREATE TRIGGER update_cms_images_updated_at
  BEFORE UPDATE ON cms_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_cms_images_section ON cms_images(section);

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar secciones principales
INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en) VALUES
('hero', 'Calzado Premium para Niños', 'Premium Kids Footwear', 'Diseño, confort y calidad en cada paso', 'Design, comfort and quality in every step'),
('features', 'Características', 'Features', 'Lo que nos hace únicos', 'What makes us unique'),
('philosophy', 'Nuestra Filosofía', 'Our Philosophy', 'Creemos en la calidad sobre la cantidad', 'We believe in quality over quantity'),
('testimonials', 'Testimonios', 'Testimonials', 'Lo que dicen nuestros clientes', 'What our customers say'),
('shop', 'Catálogo', 'Catalog', 'Descubre nuestra colección', 'Discover our collection')
ON CONFLICT (section_name) DO NOTHING;

-- Insertar TODAS las imágenes del sitio por sección
-- LOGO
INSERT INTO cms_images (section, image_key, image_url, alt_text, description, position) VALUES
('general', 'logo', '/vincero LOGO.png', 'Vincero Logo', 'Logo principal de la marca', 0)
ON CONFLICT (section, image_key) DO NOTHING;

-- PRODUCTOS (imágenes principales)
INSERT INTO cms_images (section, image_key, image_url, alt_text, description, position) VALUES
('productos', 'producto_1', '/1.png', 'Tennis Caramel', 'Producto 1 - Italia/Caramel', 1),
('productos', 'producto_2', '/2.png', 'Tennis Rosa', 'Producto 2 - Rosa B./Blanco', 2),
('productos', 'producto_3', '/3.png', 'Tennis Gris', 'Producto 3 - Oxford/Plata', 3),
('productos', 'producto_4', '/4.png', 'Tennis Blanco', 'Producto 4 - Blanco/Negro', 4),
('productos', 'producto_5', '/5.png', 'Tennis Deportivo', 'Producto 5 - Deportivo', 5),
('productos', 'producto_6', '/6.png', 'High Blanco', 'Producto 6 - High Blanco', 6),
('productos', 'producto_7', '/7.png', 'High Caramel', 'Producto 7 - High Caramel', 7),
('productos', 'producto_8', '/8.png', 'High Azul', 'Producto 8 - High Marino', 8),
('productos', 'producto_9', '/9.png', 'High Negro', 'Producto 9 - High Negro', 9),
('productos', 'producto_10', '/10.png', 'Colección Alta', 'Producto 10 - Colección Alta', 10),
('productos', 'producto_11', '/11.png', 'Tennis 11', 'Producto 11', 11),
('productos', 'producto_12', '/12.png', 'Tennis 12', 'Producto 12', 12),
('productos', 'producto_13', '/13.png', 'Winter Collection', 'Producto 13 - Colección Invierno', 13),
('productos', 'producto_14', '/14.png', 'Tennis 14', 'Producto 14', 14),
('productos', 'producto_15', '/15.png', 'Tennis 15', 'Producto 15', 15),
('productos', 'producto_16', '/16.png', 'Tennis 16', 'Producto 16', 16),
('productos', 'producto_17', '/17.png', 'Tennis 17', 'Producto 17', 17),
('productos', 'producto_18', '/18.png', 'Balerina Gris', 'Producto 18 - Balerina Negro/Blanco', 18),
('productos', 'producto_19', '/19.png', 'Balerina Rosa', 'Producto 19 - Balerina Rosa', 19),
('productos', 'producto_20', '/20.png', 'Balerina Rojo', 'Producto 20 - Balerina Rojo', 20),
('productos', 'producto_21', '/21.png', 'Balerina Negro', 'Producto 21 - Balerina Negro', 21),
('productos', 'producto_22', '/22.png', 'High Gris', 'Producto 22 - High Oxford', 22),
('productos', 'producto_23', '/23.png', 'Lightyear Negro', 'Producto 23 - Lightyear Negro/Blanco', 23),
('productos', 'producto_24', '/24.png', 'Lightyear Verde', 'Producto 24 - Lightyear V.Bandera/Blanco', 24),
('productos', 'producto_25', '/25.png', 'Lightyear Azul', 'Producto 25 - Lightyear Azul/Blanco', 25),
('productos', 'producto_26', '/26.png', 'Lightyear Rosa', 'Producto 26 - Lightyear Rosa/Blanco', 26)
ON CONFLICT (section, image_key) DO NOTHING;

-- FEATURES PAGE
INSERT INTO cms_images (section, image_key, image_url, alt_text, description, position) VALUES
('features', 'quality_image', '/1.png', 'Calidad Garantizada', 'Imagen de calidad en Features', 1),
('features', 'sport_collection', '/5.png', 'Colección Deportiva', 'Imagen colección deportiva', 2),
('features', 'high_collection', '/10.png', 'Colección Alta', 'Imagen colección alta', 3)
ON CONFLICT (section, image_key) DO NOTHING;

-- ABOUT PAGE
INSERT INTO cms_images (section, image_key, image_url, alt_text, description, position) VALUES
('about', 'team_photo', '/professional-businessman-portrait.png', 'Equipo Vincero', 'Foto del equipo', 1)
ON CONFLICT (section, image_key) DO NOTHING;

-- VIDEO INTRO
INSERT INTO cms_images (section, image_key, image_url, alt_text, description, position) VALUES
('videos', 'intro_video', 'https://qhyuoiyamcxxjsznbiyt.supabase.co/storage/v1/object/public/videos/calzadorojo.mp4', 'Video Intro', 'Video de introducción', 1)
ON CONFLICT (section, image_key) DO NOTHING;

-- Insertar imágenes del hero por defecto
INSERT INTO hero_images (position, image_url_desktop, image_url_mobile, alt_text, is_active) VALUES
(0, 'https://qhyuoiyamcxxjsznbiyt.supabase.co/storage/v1/object/public/cms-images/correcto%20.png', 'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/imagenportada.png', 'Hero Image 1', true),
(1, 'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/imagenportada2horizontal.png', 'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/imagenportada2vertical.png', 'Hero Image 2', true),
(2, 'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/imagenportada3horizontal.png', 'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/imagenportada3vertical.png', 'Hero Image 3', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- STORAGE BUCKET PARA IMÁGENES DEL CMS
-- =====================================================
-- Ejecutar esto en el SQL Editor de Supabase:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('cms-images', 'cms-images', true);

-- Política para permitir subida de imágenes a admins
-- CREATE POLICY "Admin upload access" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'cms-images' AND is_admin()
--   );

-- CREATE POLICY "Public read access for cms-images" ON storage.objects
--   FOR SELECT USING (bucket_id = 'cms-images');
