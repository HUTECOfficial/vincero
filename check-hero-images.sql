-- Script para ver todas las imágenes actuales en el slider del homepage

SELECT 
  position,
  image_url_desktop,
  image_url_mobile,
  alt_text,
  is_active,
  created_at
FROM hero_images
ORDER BY position ASC;
