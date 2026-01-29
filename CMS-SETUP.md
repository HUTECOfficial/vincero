# Configuración del CMS - VINCERO

Este documento explica cómo configurar el sistema CMS para poder editar imágenes y textos desde el panel de administración.

## Paso 1: Ejecutar el Schema en Supabase

1. Ve a tu proyecto en [Supabase](https://supabase.com/dashboard)
2. Navega a **SQL Editor**
3. Copia y pega el contenido del archivo `supabase-cms-schema.sql`
4. Ejecuta el script

## Paso 2: Crear el Bucket de Storage para Imágenes

En el SQL Editor de Supabase, ejecuta:

```sql
-- Crear bucket para imágenes del CMS
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cms-images', 'cms-images', true)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir lectura pública
CREATE POLICY "Public read access for cms-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'cms-images');

-- Política para permitir subida a usuarios autenticados
CREATE POLICY "Authenticated users can upload to cms-images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'cms-images' 
    AND auth.role() = 'authenticated'
  );

-- Política para permitir actualización a usuarios autenticados
CREATE POLICY "Authenticated users can update cms-images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'cms-images' 
    AND auth.role() = 'authenticated'
  );

-- Política para permitir eliminación a usuarios autenticados
CREATE POLICY "Authenticated users can delete from cms-images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'cms-images' 
    AND auth.role() = 'authenticated'
  );
```

## Paso 3: Acceder al CMS

1. Inicia sesión con una cuenta de administrador:
   - `admin@vincero.com`
   - `vincero@admin.com`
   - `hutec.ia@gmail.com`

2. Ve a `/admin`

3. Haz clic en la pestaña **CMS**

## Funcionalidades del CMS

### Hero/Banner
- Añadir, editar y eliminar imágenes del carrusel principal
- Subir imágenes para desktop y móvil por separado
- Configurar texto alternativo (SEO) y enlaces

### Secciones
- Editar títulos y subtítulos de las secciones principales
- Soporte para español e inglés
- Subir imágenes de fondo

### Productos (Próximamente)
- Añadir nuevos productos desde el CMS
- Editar precios, nombres y colores
- Subir imágenes de productos

### Testimonios
- Añadir testimonios de clientes
- Subir fotos de los clientes
- Configurar rating (estrellas)

## Cómo Funciona

1. **Los cambios son en tiempo real**: Cuando guardas algo en el CMS, se actualiza inmediatamente en la base de datos de Supabase.

2. **La página principal carga desde la BD**: La página principal (`page.tsx`) usa el hook `useHeroImages` para cargar las imágenes del hero desde Supabase.

3. **Fallback automático**: Si no hay datos en el CMS, la página usa las imágenes por defecto que están en el código.

## Estructura de Archivos

```
lib/
  cms.ts                    # Funciones para interactuar con el CMS
  
hooks/
  useCMSContent.ts          # Hooks para cargar contenido dinámico

components/admin/
  CMSEditor.tsx             # Componente del editor CMS

app/admin/
  page.tsx                  # Panel de admin con pestaña CMS

supabase-cms-schema.sql     # Schema de la base de datos
```

## Tablas de la Base de Datos

| Tabla | Descripción |
|-------|-------------|
| `hero_images` | Imágenes del carrusel principal |
| `cms_sections` | Secciones de la página (hero, features, etc.) |
| `cms_products` | Productos editables desde el CMS |
| `cms_testimonials` | Testimonios de clientes |
| `site_content` | Contenido genérico (textos, etc.) |

## Notas Importantes

- Solo los emails de administrador pueden editar el contenido
- Las imágenes se suben al bucket `cms-images` de Supabase Storage
- Los cambios se reflejan inmediatamente en la página pública
- Si eliminas todas las imágenes del hero, se mostrarán las imágenes por defecto
