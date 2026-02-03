-- Eliminar el video antiguo de la base de datos
DELETE FROM cms_images WHERE section = 'videos' AND image_key = 'intro_video';
