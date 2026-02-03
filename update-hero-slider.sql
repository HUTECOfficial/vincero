-- Script para actualizar las imágenes del hero slider
-- Elimina todas las imágenes actuales y agrega solo 2: zapato rojo y una más

-- 1. Eliminar todas las imágenes actuales del slider
DELETE FROM hero_images;

-- 2. Insertar solo 2 imágenes: zapato rojo (correcto.png) y la segunda imagen
INSERT INTO hero_images (position, image_url_desktop, image_url_mobile, alt_text, is_active) 
VALUES 
  -- Primera imagen: Zapato rojo (correcto.png)
  (
    0, 
    'https://qhyuoiyamcxxjsznbiyt.supabase.co/storage/v1/object/public/cms-images/correcto%20.png',
    'https://qhyuoiyamcxxjsznbiyt.supabase.co/storage/v1/object/public/cms-images/correcto%20.png',
    'Calzado Rojo Vincero',
    true
  ),
  -- Segunda imagen: Imagen horizontal 2
  (
    1,
    'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/imagenportada2horizontal.png',
    'https://jwevnxyvrktqmzlgfzqj.supabase.co/storage/v1/object/public/fotos/imagenportada2vertical.png',
    'Hero Image 2',
    true
  );

-- Mensaje de confirmación
SELECT 'Hero slider actualizado: 2 imágenes (zapato rojo + imagen 2)' as mensaje;
