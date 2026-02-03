-- Actualizar la primera imagen del hero carousel con la imagen del calzado rojo
UPDATE hero_images 
SET image_url_desktop = 'https://qhyuoiyamcxxjsznbiyt.supabase.co/storage/v1/object/public/cms-images/correcto%20.png'
WHERE position = 0;
