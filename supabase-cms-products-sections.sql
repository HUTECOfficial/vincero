-- =====================================================
-- SCRIPT PARA INSERTAR PRODUCTOS Y SECCIONES EN EL CMS
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. INSERTAR TODOS LOS PRODUCTOS DEL CATÁLOGO
-- =====================================================

INSERT INTO cms_products (product_id, name_es, name_en, description_es, description_en, price, main_image, gallery_images, badge_key, description_type, rating, color, sizes, is_active, position)
VALUES
-- Colección Low (Normal)
(1, 'Tenis Deportivo Infantil ITALIA/CARAMEL', 'Kids Sport Sneakers ITALIA/CARAMEL', 
 'Calzado deportivo-casual fabricado en textil para buena transpiración y flexibilidad. Interior textil suave al contacto con la piel. Suela de PVC con excelente tracción y durabilidad. Diseño moderno y funcional. Tallas 13mx a 17mx.',
 'Sporty-casual footwear made of textile for excellent breathability and flexibility. Soft textile interior for skin comfort. PVC sole with great traction and durability. Modern and functional design. Sizes 13mx to 17mx.',
 32500, '/1.png', 
 '["/1.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tenniscaramel2.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tenniscaramel3.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tenniscaramel5.png"]'::jsonb,
 'mostPopular', 'normal', 4.9, 'ITALIA/CARAMEL', '["13mx", "14mx", "15mx", "16mx", "17mx"]'::jsonb, true, 1),

(2, 'Tenis Deportivo Infantil ROSA B./ BLANCO', 'Kids Sport Sneakers ROSA B./ BLANCO',
 'Calzado deportivo-casual fabricado en textil para buena transpiración y flexibilidad. Interior textil suave al contacto con la piel. Suela de PVC con excelente tracción y durabilidad. Diseño moderno y funcional. Tallas 13mx a 17mx.',
 'Sporty-casual footwear made of textile for excellent breathability and flexibility. Soft textile interior for skin comfort. PVC sole with great traction and durability. Modern and functional design. Sizes 13mx to 17mx.',
 32500, '/2.png',
 '["/2.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tenisrosa.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tenisrosa1.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tenisrosa3.png"]'::jsonb,
 'favorite', 'normal', 5.0, 'ROSA B./ BLANCO', '["13mx", "14mx", "15mx", "16mx", "17mx"]'::jsonb, true, 2),

(3, 'Tenis Deportivo Infantil OXFORD /PLATA', 'Kids Sport Sneakers OXFORD /PLATA',
 'Calzado deportivo-casual fabricado en textil para buena transpiración y flexibilidad. Interior textil suave al contacto con la piel. Suela de PVC con excelente tracción y durabilidad. Diseño moderno y funcional. Tallas 13mx a 17mx.',
 'Sporty-casual footwear made of textile for excellent breathability and flexibility. Soft textile interior for skin comfort. PVC sole with great traction and durability. Modern and functional design. Sizes 13mx to 17mx.',
 32500, '/3.png',
 '["/3.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tennisgris.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tennisgris2.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tennisgris3.png"]'::jsonb,
 'limitedEdition', 'normal', 4.8, 'OXFORD /PLATA', '["13mx", "14mx", "15mx", "16mx", "17mx"]'::jsonb, true, 3),

(4, 'Tenis Deportivo Infantil BLANCO/ NEGRO', 'Kids Sport Sneakers BLANCO/ NEGRO',
 'Calzado deportivo-casual fabricado en textil para buena transpiración y flexibilidad. Interior textil suave al contacto con la piel. Suela de PVC con excelente tracción y durabilidad. Diseño moderno y funcional. Tallas 13mx a 17mx.',
 'Sporty-casual footwear made of textile for excellent breathability and flexibility. Soft textile interior for skin comfort. PVC sole with great traction and durability. Modern and functional design. Sizes 13mx to 17mx.',
 32500, '/4.png',
 '["/4.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tenisblanco.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tenisblanco3.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/tenisblanco4.png"]'::jsonb,
 'classic', 'normal', 4.9, 'BLANCO/ NEGRO', '["13mx", "14mx", "15mx", "16mx", "17mx"]'::jsonb, true, 4),

-- Colección High
(5, 'Tenis Deportivo Alto Infantil BLANCO', 'Kids High-Top Sneakers BLANCO',
 'Calzado deportivo alto fabricado en textil para buena transpiración y flexibilidad. Interior textil suave al contacto con la piel. Suela de PVC con excelente tracción y durabilidad. Diseño moderno y funcional. Tallas 17mx a 21mx.',
 'High-top sporty footwear made of textile for excellent breathability and flexibility. Soft textile interior for skin comfort. PVC sole with great traction and durability. Modern and functional design. Sizes 17mx to 21mx.',
 32500, '/6.png',
 '["/6.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highblanco.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highblanco2.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highblanco3.png", "https://qhyuoiyamcxxjsznbiyt.supabase.co/storage/v1/object/public/fotos/highblancotennis.png"]'::jsonb,
 'newProduct', 'high', 5.0, 'BLANCO', '["17mx", "18mx", "19mx", "20mx", "21mx"]'::jsonb, true, 5),

(6, 'Tenis Deportivo Alto Infantil CARAMEL', 'Kids High-Top Sneakers CARAMEL',
 'Calzado deportivo alto fabricado en textil para buena transpiración y flexibilidad. Interior textil suave al contacto con la piel. Suela de PVC con excelente tracción y durabilidad. Diseño moderno y funcional. Tallas 17mx a 21mx.',
 'High-top sporty footwear made of textile for excellent breathability and flexibility. Soft textile interior for skin comfort. PVC sole with great traction and durability. Modern and functional design. Sizes 17mx to 21mx.',
 32500, '/7.png',
 '["/7.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highcafe.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highcafe2.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highcafe3.png", "https://qhyuoiyamcxxjsznbiyt.supabase.co/storage/v1/object/public/fotos/highcafetennis.png"]'::jsonb,
 'trending', 'high', 4.8, 'CARAMEL', '["17mx", "18mx", "19mx", "20mx", "21mx"]'::jsonb, true, 6),

(7, 'Tenis Deportivo Alto Infantil MARINO', 'Kids High-Top Sneakers MARINO',
 'Calzado deportivo alto fabricado en textil para buena transpiración y flexibilidad. Interior textil suave al contacto con la piel. Suela de PVC con excelente tracción y durabilidad. Diseño moderno y funcional. Tallas 17mx a 21mx.',
 'High-top sporty footwear made of textile for excellent breathability and flexibility. Soft textile interior for skin comfort. PVC sole with great traction and durability. Modern and functional design. Sizes 17mx to 21mx.',
 32500, '/8.png',
 '["/8.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highazul.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highazul3.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highazul4.png", "https://qhyuoiyamcxxjsznbiyt.supabase.co/storage/v1/object/public/fotos/highazultennis.png"]'::jsonb,
 'popular', 'high', 4.9, 'MARINO', '["17mx", "18mx", "19mx", "20mx", "21mx"]'::jsonb, true, 7),

(8, 'Tenis Deportivo Alto Infantil NEGRO', 'Kids High-Top Sneakers NEGRO',
 'Calzado deportivo alto fabricado en textil para buena transpiración y flexibilidad. Interior textil suave al contacto con la piel. Suela de PVC con excelente tracción y durabilidad. Diseño moderno y funcional. Tallas 17mx a 21mx.',
 'High-top sporty footwear made of textile for excellent breathability and flexibility. Soft textile interior for skin comfort. PVC sole with great traction and durability. Modern and functional design. Sizes 17mx to 21mx.',
 32500, '/9.png',
 '["/9.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highnegro.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highnegro2.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highnegro4.png", "https://qhyuoiyamcxxjsznbiyt.supabase.co/storage/v1/object/public/fotos/highnegrotennis.png"]'::jsonb,
 'exclusive', 'high', 4.9, 'NEGRO', '["17mx", "18mx", "19mx", "20mx", "21mx"]'::jsonb, true, 8),

(14, 'Tenis Deportivo Alto Infantil OXFORD', 'Kids High-Top Sneakers OXFORD',
 'Calzado deportivo alto fabricado en textil para buena transpiración y flexibilidad. Interior textil suave al contacto con la piel. Suela de PVC con excelente tracción y durabilidad. Diseño moderno y funcional. Tallas 17mx a 21mx.',
 'High-top sporty footwear made of textile for excellent breathability and flexibility. Soft textile interior for skin comfort. PVC sole with great traction and durability. Modern and functional design. Sizes 17mx to 21mx.',
 32500, '/22.png',
 '["/22.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highgris2.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/highgris3.png", "https://qhyuoiyamcxxjsznbiyt.supabase.co/storage/v1/object/public/fotos/highgristennis.png"]'::jsonb,
 'newProduct', 'high', 4.9, 'OXFORD', '["17mx", "18mx", "19mx", "20mx", "21mx"]'::jsonb, true, 9),

-- Colección Multicolor
(9, 'Tenis Deportivo Infantil MULTICOLOR', 'Kids Sport Sneakers MULTICOLOR',
 'Calzado deportivo de temporada otoño/invierno fabricado en textil para buena transpiración y flexibilidad. Interior textil suave al contacto con la piel. Suela de PVC con excelente tracción y durabilidad. Diseño moderno y funcional. Tallas 13mx a 17mx.',
 'Fall/winter season sporty footwear made of textile for excellent breathability and flexibility. Soft textile interior for skin comfort. PVC sole with great traction and durability. Modern and functional design. Sizes 13mx to 17mx.',
 32500, '/13.png',
 '["/13.png"]'::jsonb,
 'winterCollection', 'winter', 4.9, 'MULTICOLOR', '["13mx", "14mx", "15mx", "16mx", "17mx"]'::jsonb, true, 10),

-- Colección Balerina
(11, 'Tenis Balerina Infantil NEGRO/BLANCO', 'Kids Balerina Sneakers BLACK/WHITE',
 'Calzado estilo balerina fabricado en textil suave y flexible. Interior acolchado para máxima comodidad. Suela de PVC con excelente tracción. Diseño elegante y femenino perfecto para cualquier ocasión. Tallas 13mx a 17mx.',
 'Balerina-style footwear made of soft and flexible textile. Cushioned interior for maximum comfort. PVC sole with excellent traction. Elegant and feminine design perfect for any occasion. Sizes 13mx to 17mx.',
 32500, '/18.png',
 '["/18.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/balerinagrisblanco.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/balerinagris2.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/balerinagris3.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/balerinagris4.png"]'::jsonb,
 'ballerina', 'ballerina', 4.9, 'NEGRO/BLANCO', '["13mx", "14mx", "15mx", "16mx", "17mx"]'::jsonb, true, 11),

(12, 'Tenis Balerina Infantil ROJO', 'Kids Balerina Sneakers RED',
 'Calzado estilo balerina fabricado en textil suave y flexible. Interior acolchado para máxima comodidad. Suela de PVC con excelente tracción. Diseño elegante y femenino perfecto para cualquier ocasión. Tallas 13mx a 17mx.',
 'Balerina-style footwear made of soft and flexible textile. Cushioned interior for maximum comfort. PVC sole with excellent traction. Elegant and feminine design perfect for any occasion. Sizes 13mx to 17mx.',
 32500, '/20.png',
 '["/20.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/balerinarojo1.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/balerinarojo2.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/balerinarojo3.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/balerinarojo4.png"]'::jsonb,
 'ballerina', 'ballerina', 4.9, 'ROJO', '["13mx", "14mx", "15mx", "16mx", "17mx"]'::jsonb, true, 12),

-- Colección Lightyear
(15, 'Tenis Lightyear Infantil NEGRO/BLANCO', 'Kids Lightyear Sneakers BLACK/WHITE',
 'Calzado deportivo inspirado en aventuras espaciales, fabricado en textil resistente y flexible. Interior acolchado para máximo confort. Suela de PVC con excelente tracción y durabilidad. Diseño moderno y dinámico perfecto para pequeños exploradores. Tallas 13mx a 17mx.',
 'Sports footwear inspired by space adventures, made of durable and flexible textile. Cushioned interior for maximum comfort. PVC sole with excellent traction and durability. Modern and dynamic design perfect for little explorers. Sizes 13mx to 17mx.',
 32500, '/23.png',
 '["/23.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearnegro.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearnegro2.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearnegro3.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearnegro4.png"]'::jsonb,
 'lightyear', 'lightyear', 5.0, 'NEGRO/BLANCO', '["13mx", "14mx", "15mx", "16mx", "17mx"]'::jsonb, true, 13),

(16, 'Tenis Lightyear Infantil V. BANDERA/BLANCO', 'Kids Lightyear Sneakers V. FLAG/WHITE',
 'Calzado deportivo inspirado en aventuras espaciales, fabricado en textil resistente y flexible. Interior acolchado para máximo confort. Suela de PVC con excelente tracción y durabilidad. Diseño moderno y dinámico perfecto para pequeños exploradores. Tallas 13mx a 17mx.',
 'Sports footwear inspired by space adventures, made of durable and flexible textile. Cushioned interior for maximum comfort. PVC sole with excellent traction and durability. Modern and dynamic design perfect for little explorers. Sizes 13mx to 17mx.',
 32500, '/24.png',
 '["/24.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearverdes.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearverdes1.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearverdes3.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearverdes2.png"]'::jsonb,
 'lightyear', 'lightyear', 4.9, 'V. BANDERA/BLANCO', '["13mx", "14mx", "15mx", "16mx", "17mx"]'::jsonb, true, 14),

(17, 'Tenis Lightyear Infantil AZUL/BLANCO', 'Kids Lightyear Sneakers BLUE/WHITE',
 'Calzado deportivo inspirado en aventuras espaciales, fabricado en textil resistente y flexible. Interior acolchado para máximo confort. Suela de PVC con excelente tracción y durabilidad. Diseño moderno y dinámico perfecto para pequeños exploradores. Tallas 13mx a 17mx.',
 'Sports footwear inspired by space adventures, made of durable and flexible textile. Cushioned interior for maximum comfort. PVC sole with excellent traction and durability. Modern and dynamic design perfect for little explorers. Sizes 13mx to 17mx.',
 32500, '/25.png',
 '["/25.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearazul.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearazul2.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearazul3.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearazul4.png"]'::jsonb,
 'lightyear', 'lightyear', 4.9, 'AZUL/BLANCO', '["13mx", "14mx", "15mx", "16mx", "17mx"]'::jsonb, true, 15),

(18, 'Tenis Lightyear Infantil ROSA/BLANCO', 'Kids Lightyear Sneakers PINK/WHITE',
 'Calzado deportivo inspirado en aventuras espaciales, fabricado en textil resistente y flexible. Interior acolchado para máximo confort. Suela de PVC con excelente tracción y durabilidad. Diseño moderno y dinámico perfecto para pequeños exploradores. Tallas 13mx a 17mx.',
 'Sports footwear inspired by space adventures, made of durable and flexible textile. Cushioned interior for maximum comfort. PVC sole with excellent traction and durability. Modern and dynamic design perfect for little explorers. Sizes 13mx to 17mx.',
 32500, '/26.png',
 '["/26.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearrosa1.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearrosa2.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearrosa3.png", "https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/lightyearrosa4.png"]'::jsonb,
 'lightyear', 'lightyear', 4.9, 'ROSA/BLANCO', '["13mx", "14mx", "15mx", "16mx", "17mx"]'::jsonb, true, 16)

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
  is_active = EXCLUDED.is_active,
  position = EXCLUDED.position;

-- =====================================================
-- 2. INSERTAR/ACTUALIZAR SECCIONES DE TEXTO PARA EL CMS
-- =====================================================

-- Hero Section
INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en, content_es, content_en, is_active, metadata)
VALUES ('hero', 'VINCERO', 'VINCERO', 'First Steps', 'First Steps', 'EXPLORAR DISEÑOS', 'EXPLORE DESIGNS', true, '{"type": "hero"}'::jsonb)
ON CONFLICT (section_name) DO UPDATE SET
  title_es = EXCLUDED.title_es, title_en = EXCLUDED.title_en,
  subtitle_es = EXCLUDED.subtitle_es, subtitle_en = EXCLUDED.subtitle_en,
  content_es = EXCLUDED.content_es, content_en = EXCLUDED.content_en,
  metadata = EXCLUDED.metadata;

-- Best Sellers Section
INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en, content_es, content_en, is_active, metadata)
VALUES ('best_sellers', 'Más Vendidos', 'Best Sellers', 
 'Los favoritos de nuestra comunidad. Descubre por qué son tan populares.', 
 'Our community favorites. Discover why they are so popular.',
 'Ver Toda la Colección', 'View Full Collection', true, '{"type": "shop"}'::jsonb)
ON CONFLICT (section_name) DO UPDATE SET
  title_es = EXCLUDED.title_es, title_en = EXCLUDED.title_en,
  subtitle_es = EXCLUDED.subtitle_es, subtitle_en = EXCLUDED.subtitle_en,
  content_es = EXCLUDED.content_es, content_en = EXCLUDED.content_en,
  metadata = EXCLUDED.metadata;

-- Video Section
INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en, content_es, content_en, is_active, metadata)
VALUES ('video_section', 'Mira Nuestros', 'Watch Our', 'Tenis en Acción', 'Sneakers in Action',
 'Descubre la calidad y estilo de nuestros tenis deportivos infantiles en este video.',
 'Discover the quality and style of our kids sport sneakers in this video.', true, '{"type": "video"}'::jsonb)
ON CONFLICT (section_name) DO UPDATE SET
  title_es = EXCLUDED.title_es, title_en = EXCLUDED.title_en,
  subtitle_es = EXCLUDED.subtitle_es, subtitle_en = EXCLUDED.subtitle_en,
  content_es = EXCLUDED.content_es, content_en = EXCLUDED.content_en,
  metadata = EXCLUDED.metadata;

-- Testimonials Section
INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en, content_es, content_en, is_active, metadata)
VALUES ('testimonials', 'Lo que dicen nuestros', 'What our', 'clientes', 'customers say',
 'Padres satisfechos que confían en Vincero para el calzado de sus hijos.',
 'Satisfied parents who trust Vincero for their children''s footwear.', true, '{"type": "testimonials"}'::jsonb)
ON CONFLICT (section_name) DO UPDATE SET
  title_es = EXCLUDED.title_es, title_en = EXCLUDED.title_en,
  subtitle_es = EXCLUDED.subtitle_es, subtitle_en = EXCLUDED.subtitle_en,
  content_es = EXCLUDED.content_es, content_en = EXCLUDED.content_en,
  metadata = EXCLUDED.metadata;

-- Features Section (Why Choose)
INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en, content_es, content_en, is_active, metadata)
VALUES ('features', 'Por qué elegir', 'Why choose', 'Vincero', 'Vincero',
 'Calidad excepcional en cada detalle. Diseñado para quienes buscan lo mejor.',
 'Exceptional quality in every detail. Designed for those who seek the best.', true, '{"type": "features"}'::jsonb)
ON CONFLICT (section_name) DO UPDATE SET
  title_es = EXCLUDED.title_es, title_en = EXCLUDED.title_en,
  subtitle_es = EXCLUDED.subtitle_es, subtitle_en = EXCLUDED.subtitle_en,
  content_es = EXCLUDED.content_es, content_en = EXCLUDED.content_en,
  metadata = EXCLUDED.metadata;

-- Feature: Quality Guarantee
INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en, content_es, content_en, is_active, metadata)
VALUES ('feature_quality', 'Garantía de Calidad', 'Quality Guarantee', NULL, NULL,
 'Cada par está respaldado por nuestra garantía de 30 días. Calidad que perdura.',
 'Each pair is backed by our 30-day warranty. Quality that lasts.', true, '{"type": "feature_item", "icon": "shield"}'::jsonb)
ON CONFLICT (section_name) DO UPDATE SET
  title_es = EXCLUDED.title_es, title_en = EXCLUDED.title_en,
  content_es = EXCLUDED.content_es, content_en = EXCLUDED.content_en,
  metadata = EXCLUDED.metadata;

-- Feature: Innovative Design
INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en, content_es, content_en, is_active, metadata)
VALUES ('feature_design', 'Diseño Innovador', 'Innovative Design', NULL, NULL,
 'Diseños modernos y coloridos que a los niños les encantan.',
 'Modern and colorful designs that kids love.', true, '{"type": "feature_item", "icon": "lightbulb"}'::jsonb)
ON CONFLICT (section_name) DO UPDATE SET
  title_es = EXCLUDED.title_es, title_en = EXCLUDED.title_en,
  content_es = EXCLUDED.content_es, content_en = EXCLUDED.content_en,
  metadata = EXCLUDED.metadata;

-- Feature: Total Comfort
INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en, content_es, content_en, is_active, metadata)
VALUES ('feature_comfort', 'Comodidad Total', 'Total Comfort', NULL, NULL,
 'Suelas acolchadas perfectas para jugar todo el día.',
 'Cushioned soles perfect for playing all day.', true, '{"type": "feature_item", "icon": "sparkles"}'::jsonb)
ON CONFLICT (section_name) DO UPDATE SET
  title_es = EXCLUDED.title_es, title_en = EXCLUDED.title_en,
  content_es = EXCLUDED.content_es, content_en = EXCLUDED.content_en,
  metadata = EXCLUDED.metadata;

-- About Us Section
INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en, content_es, content_en, is_active, metadata)
VALUES ('about_us', 'Nosotros', 'About Us', 'Organizacional', 'Philosophy', NULL, NULL, true, '{"type": "about"}'::jsonb)
ON CONFLICT (section_name) DO UPDATE SET
  title_es = EXCLUDED.title_es, title_en = EXCLUDED.title_en,
  subtitle_es = EXCLUDED.subtitle_es, subtitle_en = EXCLUDED.subtitle_en,
  metadata = EXCLUDED.metadata;

-- About Product
INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en, content_es, content_en, is_active, metadata)
VALUES ('about_product', 'Nuestro Calzado', 'Our Footwear', NULL, NULL,
 'Nuestro producto se caracteriza por ser calzado deportivo – casual, fabricado en textil, lo que garantiza una buena transpiración y flexibilidad, ideal para actividades deportivas y el uso diario. Su interior también es de textil, ofreciendo una sensación suave y agradable al contacto con la piel. La suela de PVC proporciona una excelente tracción y durabilidad, permitiendo que los niños se desplacen con confianza en diversas superficies. Con un diseño moderno y funcional, estos tenis son perfectos para acompañar a los más pequeños en sus aventuras cotidianas.',
 'Our product is characterized by being sporty-casual footwear, made of textile, which guarantees good breathability and flexibility, ideal for sports activities and daily use. Its interior is also textile, offering a soft and pleasant sensation in contact with the skin. The PVC sole provides excellent traction and durability, allowing children to move confidently on various surfaces. With a modern and functional design, these sneakers are perfect to accompany the little ones in their daily adventures.',
 true, '{"type": "about_product"}'::jsonb)
ON CONFLICT (section_name) DO UPDATE SET
  title_es = EXCLUDED.title_es, title_en = EXCLUDED.title_en,
  content_es = EXCLUDED.content_es, content_en = EXCLUDED.content_en,
  metadata = EXCLUDED.metadata;

-- Our Values Section
INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en, content_es, content_en, is_active, metadata)
VALUES ('our_values', 'Nuestros Valores', 'Our Values', NULL, NULL, NULL, NULL, true, '{"type": "values"}'::jsonb)
ON CONFLICT (section_name) DO UPDATE SET
  title_es = EXCLUDED.title_es, title_en = EXCLUDED.title_en,
  metadata = EXCLUDED.metadata;

-- Value: Care
INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en, content_es, content_en, is_active, metadata)
VALUES ('value_care', 'Cuidado', 'Care', NULL, NULL,
 'Cada par está diseñado para la seguridad de los niños.',
 'Each pair is designed for children''s safety.', true, '{"type": "value_item", "icon": "heart"}'::jsonb)
ON CONFLICT (section_name) DO UPDATE SET
  title_es = EXCLUDED.title_es, title_en = EXCLUDED.title_en,
  content_es = EXCLUDED.content_es, content_en = EXCLUDED.content_en,
  metadata = EXCLUDED.metadata;

-- Value: Innovation
INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en, content_es, content_en, is_active, metadata)
VALUES ('value_innovation', 'Innovación Constante', 'Constant Innovation', NULL, NULL,
 'Buscamos, diseñamos y creamos con la más alta calidad de materiales para el proceso del calzado.',
 'We search, design and create with the highest quality materials for the footwear process.', true, '{"type": "value_item", "icon": "lightbulb"}'::jsonb)
ON CONFLICT (section_name) DO UPDATE SET
  title_es = EXCLUDED.title_es, title_en = EXCLUDED.title_en,
  content_es = EXCLUDED.content_es, content_en = EXCLUDED.content_en,
  metadata = EXCLUDED.metadata;

-- Value: Creativity
INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en, content_es, content_en, is_active, metadata)
VALUES ('value_creativity', 'Creatividad', 'Creativity', NULL, NULL,
 'Lo exclusivo está en los detalles.',
 'Exclusivity is in the details.', true, '{"type": "value_item", "icon": "sparkles"}'::jsonb)
ON CONFLICT (section_name) DO UPDATE SET
  title_es = EXCLUDED.title_es, title_en = EXCLUDED.title_en,
  content_es = EXCLUDED.content_es, content_en = EXCLUDED.content_en,
  metadata = EXCLUDED.metadata;

-- Value: Commitment
INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en, content_es, content_en, is_active, metadata)
VALUES ('value_commitment', 'Compromiso', 'Commitment', NULL, NULL,
 '"Honramos" el trabajo y la confianza para la comodidad de cada familia.',
 'We "honor" the work and trust for the comfort of each family.', true, '{"type": "value_item", "icon": "shield"}'::jsonb)
ON CONFLICT (section_name) DO UPDATE SET
  title_es = EXCLUDED.title_es, title_en = EXCLUDED.title_en,
  content_es = EXCLUDED.content_es, content_en = EXCLUDED.content_en,
  metadata = EXCLUDED.metadata;

-- Value: Inclusion
INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en, content_es, content_en, is_active, metadata)
VALUES ('value_inclusion', 'Inclusión', 'Inclusion', NULL, NULL,
 'Promoviendo que cada diseño tenga un sentido de pertenencia.',
 'Promoting that each design has a sense of belonging.', true, '{"type": "value_item", "icon": "users"}'::jsonb)
ON CONFLICT (section_name) DO UPDATE SET
  title_es = EXCLUDED.title_es, title_en = EXCLUDED.title_en,
  content_es = EXCLUDED.content_es, content_en = EXCLUDED.content_en,
  metadata = EXCLUDED.metadata;

-- Mission
INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en, content_es, content_en, is_active, metadata)
VALUES ('mission', 'Nuestra Misión', 'Our Mission', NULL, NULL,
 'Acompañar los pasos más importantes de la infancia con calzado seguro, cómodo y lleno de estilo. En Vincero elaboramos zapatos que dan confianza a los padres y libertad a los niños. Elevar el calzado infantil a un nivel accesible, creando piezas únicas que combinan diseño exclusivo, confort superior y seguridad en cada paso. Promoviendo la autonomía desde temprana edad. En Vincero transformamos la innovación y el trabajo manual en experiencias que acompañan la infancia con estilo y calidad impecable.',
 'To accompany the most important steps of childhood with safe, comfortable and stylish footwear. At Vincero we make shoes that give confidence to parents and freedom to children. To elevate children''s footwear to an accessible level, creating unique pieces that combine exclusive design, superior comfort and safety in every step. Promoting autonomy from an early age. At Vincero we transform innovation and manual work into experiences that accompany childhood with style and impeccable quality.',
 true, '{"type": "mission"}'::jsonb)
ON CONFLICT (section_name) DO UPDATE SET
  title_es = EXCLUDED.title_es, title_en = EXCLUDED.title_en,
  content_es = EXCLUDED.content_es, content_en = EXCLUDED.content_en,
  metadata = EXCLUDED.metadata;

-- Vision
INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en, content_es, content_en, is_active, metadata)
VALUES ('vision', 'Nuestra Visión', 'Our Vision', NULL, NULL,
 'Queremos que Vincero sea la primera elección de los padres que buscan distinción y bienestar para sus hijos, porque saben que con nosotros encuentran un calzado diseñado y elaborado con estándares de calidad para el bienestar de los pequeños. Queremos que Vincero sea un referente nacional y una fuente de inspiración para la evolución del calzado infantil.',
 'We want Vincero to be the first choice for parents seeking distinction and well-being for their children, because they know that with us they find footwear designed and made with quality standards for the well-being of the little ones. We want Vincero to be a national reference and a source of inspiration for the evolution of children''s footwear.',
 true, '{"type": "vision"}'::jsonb)
ON CONFLICT (section_name) DO UPDATE SET
  title_es = EXCLUDED.title_es, title_en = EXCLUDED.title_en,
  content_es = EXCLUDED.content_es, content_en = EXCLUDED.content_en,
  metadata = EXCLUDED.metadata;

-- Footer
INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en, content_es, content_en, is_active, metadata)
VALUES ('footer', 'VINCERO', 'VINCERO', 'Calzado para peques con estilo', 'Stylish footwear for little ones', NULL, NULL, true, '{"type": "footer"}'::jsonb)
ON CONFLICT (section_name) DO UPDATE SET
  title_es = EXCLUDED.title_es, title_en = EXCLUDED.title_en,
  subtitle_es = EXCLUDED.subtitle_es, subtitle_en = EXCLUDED.subtitle_en,
  metadata = EXCLUDED.metadata;

-- Promotions
INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en, content_es, content_en, is_active, metadata)
VALUES ('promo_shipping', 'Envío Gratis', 'Free Shipping', 'Promoción Especial', 'Special Promotion',
 'En compras mayores a $800 MXN', 'On purchases over $800 MXN', true, '{"type": "promo"}'::jsonb)
ON CONFLICT (section_name) DO UPDATE SET
  title_es = EXCLUDED.title_es, title_en = EXCLUDED.title_en,
  subtitle_es = EXCLUDED.subtitle_es, subtitle_en = EXCLUDED.subtitle_en,
  content_es = EXCLUDED.content_es, content_en = EXCLUDED.content_en,
  metadata = EXCLUDED.metadata;

INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en, content_es, content_en, is_active, metadata)
VALUES ('promo_warranty', '30 Días', '30 Days', 'Calidad Garantizada', 'Quality Guaranteed',
 'Garantía de devolución', 'Return warranty', true, '{"type": "promo"}'::jsonb)
ON CONFLICT (section_name) DO UPDATE SET
  title_es = EXCLUDED.title_es, title_en = EXCLUDED.title_en,
  subtitle_es = EXCLUDED.subtitle_es, subtitle_en = EXCLUDED.subtitle_en,
  content_es = EXCLUDED.content_es, content_en = EXCLUDED.content_en,
  metadata = EXCLUDED.metadata;

INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en, content_es, content_en, is_active, metadata)
VALUES ('promo_support', 'WhatsApp', 'WhatsApp', 'Atención Personalizada', 'Personalized Support',
 'Respuesta inmediata', 'Immediate response', true, '{"type": "promo"}'::jsonb)
ON CONFLICT (section_name) DO UPDATE SET
  title_es = EXCLUDED.title_es, title_en = EXCLUDED.title_en,
  subtitle_es = EXCLUDED.subtitle_es, subtitle_en = EXCLUDED.subtitle_en,
  content_es = EXCLUDED.content_es, content_en = EXCLUDED.content_en,
  metadata = EXCLUDED.metadata;

-- Catalog Collections
INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en, content_es, content_en, is_active, metadata)
VALUES ('collection_low', 'Colección Low by VINCERO', 'Low Collection by VINCERO',
 'Colección clásica para el día a día', 'Classic collection for everyday', NULL, NULL, true, '{"type": "collection", "filter": "normal"}'::jsonb)
ON CONFLICT (section_name) DO UPDATE SET
  title_es = EXCLUDED.title_es, title_en = EXCLUDED.title_en,
  subtitle_es = EXCLUDED.subtitle_es, subtitle_en = EXCLUDED.subtitle_en,
  metadata = EXCLUDED.metadata;

INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en, content_es, content_en, is_active, metadata)
VALUES ('collection_high', 'Colección High by VINCERO', 'High Collection by VINCERO',
 'Colección premium de edición especial', 'Premium special edition collection', NULL, NULL, true, '{"type": "collection", "filter": "high"}'::jsonb)
ON CONFLICT (section_name) DO UPDATE SET
  title_es = EXCLUDED.title_es, title_en = EXCLUDED.title_en,
  subtitle_es = EXCLUDED.subtitle_es, subtitle_en = EXCLUDED.subtitle_en,
  metadata = EXCLUDED.metadata;

INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en, content_es, content_en, is_active, metadata)
VALUES ('collection_ballerina', 'Colección Balerina by VINCERO', 'Balerina Collection by VINCERO',
 'Estilo elegante y femenino', 'Elegant and feminine style', NULL, NULL, true, '{"type": "collection", "filter": "ballerina"}'::jsonb)
ON CONFLICT (section_name) DO UPDATE SET
  title_es = EXCLUDED.title_es, title_en = EXCLUDED.title_en,
  subtitle_es = EXCLUDED.subtitle_es, subtitle_en = EXCLUDED.subtitle_en,
  metadata = EXCLUDED.metadata;

INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en, content_es, content_en, is_active, metadata)
VALUES ('collection_multicolor', 'Colección Multicolor by VINCERO', 'Multicolor Collection by VINCERO',
 'Diseño vibrante y único', 'Vibrant and unique design', NULL, NULL, true, '{"type": "collection", "filter": "multicolor"}'::jsonb)
ON CONFLICT (section_name) DO UPDATE SET
  title_es = EXCLUDED.title_es, title_en = EXCLUDED.title_en,
  subtitle_es = EXCLUDED.subtitle_es, subtitle_en = EXCLUDED.subtitle_en,
  metadata = EXCLUDED.metadata;

INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en, content_es, content_en, is_active, metadata)
VALUES ('collection_lightyear', 'Colección LIGHTYEAR by VINCERO', 'LIGHTYEAR Collection by VINCERO',
 'Aventura al infinito y más allá', 'To infinity and beyond', NULL, NULL, true, '{"type": "collection", "filter": "lightyear"}'::jsonb)
ON CONFLICT (section_name) DO UPDATE SET
  title_es = EXCLUDED.title_es, title_en = EXCLUDED.title_en,
  subtitle_es = EXCLUDED.subtitle_es, subtitle_en = EXCLUDED.subtitle_en,
  metadata = EXCLUDED.metadata;

-- Catalog Page
INSERT INTO cms_sections (section_name, title_es, title_en, subtitle_es, subtitle_en, content_es, content_en, is_active, metadata)
VALUES ('catalog', 'Catálogo', 'Catalog', 'Selecciona una colección', 'Select a collection', NULL, NULL, true, '{"type": "catalog"}'::jsonb)
ON CONFLICT (section_name) DO UPDATE SET
  title_es = EXCLUDED.title_es, title_en = EXCLUDED.title_en,
  subtitle_es = EXCLUDED.subtitle_es, subtitle_en = EXCLUDED.subtitle_en,
  metadata = EXCLUDED.metadata;

-- =====================================================
-- 3. VERIFICAR INSERCIÓN
-- =====================================================

SELECT 'Productos insertados:' as info, COUNT(*) as total FROM cms_products;
SELECT 'Secciones insertadas:' as info, COUNT(*) as total FROM cms_sections;
