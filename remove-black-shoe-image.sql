-- Eliminar la imagen del calzado negro del slider (posición 0)
-- y mantener solo las otras dos imágenes

-- Primero, eliminar la imagen en posición 0
DELETE FROM hero_images WHERE position = 0;

-- Luego, insertar la nueva imagen del calzado rojo en posición 0
INSERT INTO hero_images (position, image_url_desktop, image_url_mobile, alt_text, is_active) 
VALUES (0, 'https://qhyuoiyamcxxjsznbiyt.supabase.co/storage/v1/object/public/cms-images/correcto%20.png', 
        'https://qhyuoiyamcxxjsznbiyt.supabase.co/storage/v1/object/public/cms-images/correcto%20.png', 
        'Calzado Rojo Vincero', true)
ON CONFLICT (position) DO UPDATE 
SET image_url_desktop = EXCLUDED.image_url_desktop,
    image_url_mobile = EXCLUDED.image_url_mobile,
    alt_text = EXCLUDED.alt_text;
