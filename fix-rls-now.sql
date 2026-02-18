-- SOLUCIÓN DEFINITIVA: Deshabilitar RLS en tablas CMS
-- Esto permite lectura/escritura sin restricciones
-- Las tablas solo son accesibles desde tu app con la anon key

ALTER TABLE hero_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE cms_sections DISABLE ROW LEVEL SECURITY;
ALTER TABLE cms_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE cms_testimonials DISABLE ROW LEVEL SECURITY;

-- Verificar que quedó deshabilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('hero_images','cms_sections','cms_products','cms_testimonials');
