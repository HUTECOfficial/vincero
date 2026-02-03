-- Eliminar TODAS las imágenes del hero slider
DELETE FROM hero_images;

-- Insertar solo la imagen del calzado rojo
INSERT INTO hero_images (position, image_url_desktop, image_url_mobile, alt_text, is_active) 
VALUES (0, 'https://qhyuoiyamcxxjsznbiyt.supabase.co/storage/v1/object/public/cms-images/correcto%20.png', 
        'https://qhyuoiyamcxxjsznbiyt.supabase.co/storage/v1/object/public/cms-images/correcto%20.png', 
        'Calzado Rojo Vincero', true);
