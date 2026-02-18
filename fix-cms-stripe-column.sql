-- =====================================================
-- EJECUTAR EN SUPABASE SQL EDITOR
-- Agrega columna stripe_price_id y corrige permisos
-- =====================================================

-- 1. Agregar columna stripe_price_id a cms_products
ALTER TABLE cms_products 
ADD COLUMN IF NOT EXISTS stripe_price_id TEXT DEFAULT NULL;

-- 2. Asegurar que RLS está habilitado
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_testimonials ENABLE ROW LEVEL SECURITY;

-- 3. Eliminar políticas viejas
DROP POLICY IF EXISTS "hero_images_public_read" ON hero_images;
DROP POLICY IF EXISTS "hero_images_auth_write" ON hero_images;
DROP POLICY IF EXISTS "cms_sections_public_read" ON cms_sections;
DROP POLICY IF EXISTS "cms_sections_auth_write" ON cms_sections;
DROP POLICY IF EXISTS "cms_products_public_read" ON cms_products;
DROP POLICY IF EXISTS "cms_products_auth_write" ON cms_products;
DROP POLICY IF EXISTS "cms_testimonials_public_read" ON cms_testimonials;
DROP POLICY IF EXISTS "cms_testimonials_auth_write" ON cms_testimonials;

-- 4. Crear políticas permisivas
CREATE POLICY "hero_images_public_read" ON hero_images FOR SELECT USING (true);
CREATE POLICY "hero_images_auth_write" ON hero_images FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "cms_sections_public_read" ON cms_sections FOR SELECT USING (true);
CREATE POLICY "cms_sections_auth_write" ON cms_sections FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "cms_products_public_read" ON cms_products FOR SELECT USING (true);
CREATE POLICY "cms_products_auth_write" ON cms_products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "cms_testimonials_public_read" ON cms_testimonials FOR SELECT USING (true);
CREATE POLICY "cms_testimonials_auth_write" ON cms_testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 5. Verificar
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'cms_products' ORDER BY ordinal_position;
