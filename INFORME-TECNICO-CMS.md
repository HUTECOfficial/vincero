# INFORME TÉCNICO - DESARROLLO CMS VINCERO

## Información del Proyecto

**Proyecto:** Sistema de Gestión de Contenido (CMS) para VINCERO  
**Versión:** 1.0  
**Fecha:** Enero 2026  
**Stack Tecnológico:** Next.js 16, React, TypeScript, Supabase, TailwindCSS

---

## 1. ALCANCE DEL DESARROLLO

### Objetivo
Implementar un sistema completo de gestión de contenido que permita la edición dinámica de imágenes y textos del sitio web sin necesidad de modificar código fuente.

### Módulos Implementados
1. Gestión de imágenes Hero/Banner
2. Gestión de todas las imágenes del sitio por sección
3. Gestión de textos de secciones principales
4. Gestión de catálogo de productos
5. Gestión de testimonios de clientes

---

## 2. ARQUITECTURA DE BASE DE DATOS

### Tablas Creadas en Supabase

#### 2.1 `hero_images`
Almacena las imágenes del carrusel principal.

**Campos:**
- `id` (UUID, PK)
- `position` (INTEGER) - Orden de visualización
- `image_url_desktop` (TEXT) - URL imagen desktop
- `image_url_mobile` (TEXT) - URL imagen móvil
- `alt_text` (VARCHAR) - Texto alternativo SEO
- `link_url` (TEXT) - URL de destino al hacer clic
- `is_active` (BOOLEAN) - Estado activo/inactivo
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Políticas RLS:**
- Lectura: Pública
- Escritura: Solo administradores

---

#### 2.2 `cms_images`
Almacena TODAS las imágenes del sitio organizadas por sección.

**Campos:**
- `id` (UUID, PK)
- `section` (VARCHAR) - Sección a la que pertenece
- `image_key` (VARCHAR) - Identificador único dentro de la sección
- `image_url` (TEXT) - URL de la imagen
- `alt_text` (VARCHAR) - Texto alternativo
- `description` (VARCHAR) - Descripción de la imagen
- `position` (INTEGER) - Orden dentro de la sección
- `is_active` (BOOLEAN) - Estado activo/inactivo
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Constraint:** UNIQUE(section, image_key)

**Secciones implementadas:**
- `general` - Logo y elementos generales (1 imagen)
- `productos` - Imágenes de productos (26 imágenes)
- `features` - Página de características (3 imágenes)
- `about` - Página "Nosotros" (1 imagen)
- `videos` - Videos del sitio (1 video)

**Total inicial:** 32 recursos visuales pre-cargados

**Políticas RLS:**
- Lectura: Pública
- Escritura: Solo administradores

---

#### 2.3 `cms_sections`
Almacena textos editables de las secciones principales.

**Campos:**
- `id` (UUID, PK)
- `section_name` (VARCHAR) - Nombre de la sección
- `title_es` (TEXT) - Título en español
- `title_en` (TEXT) - Título en inglés
- `subtitle_es` (TEXT) - Subtítulo en español
- `subtitle_en` (TEXT) - Subtítulo en inglés
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Secciones pre-cargadas:**
- hero
- features
- philosophy
- testimonials
- shop

**Políticas RLS:**
- Lectura: Pública
- Escritura: Solo administradores

---

#### 2.4 `cms_products`
Gestión del catálogo de productos.

**Campos:**
- `id` (UUID, PK)
- `product_id` (VARCHAR) - ID único del producto
- `name_es` (TEXT) - Nombre en español
- `name_en` (TEXT) - Nombre en inglés
- `description_es` (TEXT) - Descripción en español
- `description_en` (TEXT) - Descripción en inglés
- `image_url` (TEXT) - URL de la imagen principal
- `price` (DECIMAL) - Precio del producto
- `colors` (JSONB) - Array de colores disponibles
- `sizes` (JSONB) - Array de tallas disponibles
- `position` (INTEGER) - Orden en el catálogo
- `is_active` (BOOLEAN) - Estado activo/inactivo
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Políticas RLS:**
- Lectura: Pública (solo activos)
- Escritura: Solo administradores

---

#### 2.5 `cms_testimonials`
Gestión de testimonios de clientes.

**Campos:**
- `id` (UUID, PK)
- `author_name` (VARCHAR) - Nombre del cliente
- `author_image` (TEXT) - Foto del cliente
- `content_es` (TEXT) - Testimonio en español
- `content_en` (TEXT) - Testimonio en inglés
- `rating` (INTEGER) - Calificación 1-5 estrellas
- `position` (INTEGER) - Orden de visualización
- `is_active` (BOOLEAN) - Estado activo/inactivo
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Políticas RLS:**
- Lectura: Pública (solo activos)
- Escritura: Solo administradores

---

#### 2.6 `site_content`
Tabla genérica para contenido adicional.

**Campos:**
- `id` (UUID, PK)
- `section` (VARCHAR) - Sección del contenido
- `content_key` (VARCHAR) - Clave del contenido
- `content_type` (VARCHAR) - Tipo: text, image, html, json
- `value_text` (TEXT) - Valor si es texto
- `value_image_url` (TEXT) - URL si es imagen
- `value_json` (JSONB) - Datos si es JSON
- `language` (VARCHAR) - Idioma del contenido
- `updated_at` (TIMESTAMP)
- `updated_by` (UUID) - Usuario que actualizó

**Constraint:** UNIQUE(section, content_key, language)

**Políticas RLS:**
- Lectura: Pública
- Escritura: Solo administradores

---

### Función de Seguridad

#### `is_admin()`
Función PostgreSQL que valida si el usuario actual es administrador.

```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT email IN (
      'vinceroadmin@vincero.mx',
      'admin@vincero.com',
      'vincero@admin.com'
    )
    FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 3. STORAGE (SUPABASE)

### Bucket: `cms-images`

**Configuración:**
- Acceso público para lectura
- Subida restringida a administradores
- Estructura de carpetas por tipo:
  - `/hero/` - Imágenes del banner
  - `/products/` - Imágenes de productos
  - `/sections/` - Imágenes de secciones
  - `/testimonials/` - Fotos de clientes
  - `/cms_images/` - Imágenes generales del CMS

**Políticas de Storage:**
- SELECT: Público
- INSERT: Solo administradores autenticados
- UPDATE: Solo administradores autenticados
- DELETE: Solo administradores autenticados

---

## 4. CÓDIGO IMPLEMENTADO

### 4.1 Backend - `lib/cms.ts`

**Líneas de código:** 526  
**Funcionalidad:** Capa de abstracción para interactuar con Supabase

**Interfaces TypeScript:**
- `HeroImage`
- `CMSSection`
- `CMSProduct`
- `CMSTestimonial`
- `CMSImage`
- `SiteContent`

**Funciones de Lectura (Públicas):**
- `getHeroImages()` - Obtiene imágenes del hero
- `getCMSSections()` - Obtiene todas las secciones
- `getCMSSection(name)` - Obtiene una sección específica
- `getCMSProducts()` - Obtiene productos activos
- `getCMSTestimonials()` - Obtiene testimonios activos
- `getSiteContent(section, key, lang)` - Obtiene contenido genérico
- `getCMSImages(section?)` - Obtiene imágenes por sección
- `getCMSImagesBySection()` - Obtiene todas las imágenes agrupadas
- `getAllCMSImages()` - Obtiene todas las imágenes

**Funciones de Escritura (Solo Admin):**
- `createHeroImage(data)` - Crea nueva imagen hero
- `updateHeroImage(id, updates)` - Actualiza imagen hero
- `deleteHeroImage(id)` - Elimina imagen hero
- `updateCMSSection(id, updates)` - Actualiza sección
- `createCMSProduct(data)` - Crea producto
- `updateCMSProduct(id, updates)` - Actualiza producto
- `deleteCMSProduct(id)` - Elimina producto
- `createCMSTestimonial(data)` - Crea testimonio
- `updateCMSTestimonial(id, updates)` - Actualiza testimonio
- `deleteCMSTestimonial(id)` - Elimina testimonio
- `createCMSImage(data)` - Crea imagen en CMS
- `updateCMSImage(id, updates)` - Actualiza imagen
- `deleteCMSImage(id)` - Elimina imagen

**Funciones de Storage:**
- `uploadCMSImage(file, folder)` - Sube imagen a Supabase Storage
- `deleteStorageImage(url)` - Elimina imagen del Storage

**Funciones Auxiliares:**
- `reorderItems(table, items)` - Reordena elementos por posición

---

### 4.2 Frontend - `components/admin/CMSEditor.tsx`

**Líneas de código:** 1,158  
**Funcionalidad:** Interfaz de usuario para gestión de contenido

**Estructura de Componente:**
- Sistema de pestañas (Tabs)
- Estados para cada módulo
- Manejo de carga y guardado
- Sistema de mensajes (success/error)
- Upload de archivos con preview
- Drag & drop para reordenar

**Pestañas Implementadas:**
1. **Hero/Banner** - Gestión de carrusel principal
2. **Todas las Imágenes** - Vista organizada por secciones
3. **Secciones** - Edición de textos principales
4. **Productos** - CRUD completo de productos
5. **Testimonios** - CRUD completo de testimonios

**Características UI:**
- Diseño Neumorphic (neu-shadow, neu-btn)
- Responsive para todos los dispositivos
- Feedback visual inmediato
- Confirmaciones antes de eliminar
- Estados de carga y guardado
- Preview de imágenes antes de subir

---

### 4.3 Hooks - `hooks/useCMSContent.ts`

**Líneas de código:** ~150  
**Funcionalidad:** Custom hooks para consumir datos del CMS

**Hooks Implementados:**
- `useCMSContent()` - Hook genérico para cualquier contenido
- `useHeroImages()` - Hook específico para imágenes hero
- `useCMSSection(name)` - Hook para una sección específica
- `useCMSImages(section)` - Hook para imágenes por sección

**Características:**
- Carga automática al montar
- Estado de loading
- Manejo de errores
- Re-fetch manual disponible
- Cache en memoria

---

### 4.4 Integración en Admin - `app/admin/page.tsx`

**Modificaciones:**
- Añadida pestaña "CMS" en el dashboard
- Integración del componente `CMSEditor`
- Sistema de login integrado en la misma página
- Validación de permisos de administrador
- Manejo de sesión persistente

**Credenciales de Acceso:**
- Email: `vinceroadmin@vincero.mx`
- Emails adicionales autorizados:
  - `admin@vincero.com`
  - `vincero@admin.com`

---

### 4.5 Consumo en Páginas Públicas

**Páginas Actualizadas:**
- `app/page.tsx` - Usa `useHeroImages()` para carrusel dinámico
- `app/about/page.tsx` - Preparada para consumir imágenes del CMS
- `app/features/page.tsx` - Preparada para consumir imágenes del CMS

**Implementación:**
```typescript
const { heroImages, loading } = useHeroImages()

// Fallback a imágenes por defecto si no hay datos
const displayImages = heroImages.length > 0 ? heroImages : defaultImages
```

---

## 5. SEGURIDAD IMPLEMENTADA

### Row Level Security (RLS)

**Políticas Aplicadas:**
- Todas las tablas tienen RLS habilitado
- Lectura pública para contenido activo
- Escritura restringida a función `is_admin()`
- Validación a nivel de base de datos

### Autenticación

**Sistema:** Supabase Auth  
**Método:** Email/Password  
**Validación:** Por lista de emails autorizados  
**Sesión:** JWT tokens con refresh automático

### Validaciones

**Frontend:**
- Verificación de usuario autenticado
- Verificación de email en lista de admins
- Redirección si no autorizado

**Backend:**
- RLS en todas las operaciones de escritura
- Función `is_admin()` en políticas
- Validación de permisos en cada query

---

## 6. DATOS INICIALES PRE-CARGADOS

### Hero Images
- 3 imágenes configuradas (desktop + móvil)
- Posiciones: 0, 1, 2
- Todas activas por defecto

### CMS Images
- **General:** 1 imagen (logo)
- **Productos:** 26 imágenes (tennis, balerinas, high, lightyear)
- **Features:** 3 imágenes
- **About:** 1 imagen
- **Videos:** 1 video de introducción
- **Total:** 32 recursos

### Sections
- 5 secciones configuradas con textos en ES/EN
- Secciones: hero, features, philosophy, testimonials, shop

### Products
- Estructura lista para añadir productos
- Campos configurados para colores y tallas

### Testimonials
- Estructura lista para añadir testimonios
- Sistema de rating 1-5 estrellas

---

## 7. ARCHIVOS DE DOCUMENTACIÓN

### `supabase-cms-schema.sql`
**Líneas:** 288  
**Contenido:**
- Definición de todas las tablas
- Políticas RLS
- Función `is_admin()`
- Triggers para `updated_at`
- Datos iniciales (INSERT statements)
- Comentarios de configuración

### `CMS-SETUP.md`
**Contenido:**
- Guía paso a paso de configuración
- Instrucciones para ejecutar schema
- Creación de bucket de storage
- Configuración de usuario admin
- Troubleshooting común

### `PRESENTACION-CMS-VINCERO.md`
**Contenido:**
- Documentación completa del sistema
- Características y beneficios
- Guía de uso
- Casos de uso

---

## 8. FLUJO DE DATOS

### Lectura (Público)
```
Usuario → Página Web → Hook (useCMSContent) → lib/cms.ts → Supabase → Datos
```

### Escritura (Admin)
```
Admin → CMSEditor → handleSave → lib/cms.ts → Supabase (RLS Check) → Update
```

### Upload de Imágenes
```
Admin → File Input → uploadCMSImage() → Supabase Storage → Public URL → Update DB
```

---

## 9. MÉTRICAS DEL DESARROLLO

### Código Escrito
- **Total:** ~2,200 líneas de código
- `lib/cms.ts`: 526 líneas
- `components/admin/CMSEditor.tsx`: 1,158 líneas
- `hooks/useCMSContent.ts`: ~150 líneas
- `app/admin/page.tsx`: Modificaciones ~200 líneas
- `supabase-cms-schema.sql`: 288 líneas

### Base de Datos
- **Tablas creadas:** 6
- **Funciones:** 1 (`is_admin`)
- **Políticas RLS:** 12+ políticas
- **Triggers:** 6 (updated_at)
- **Índices:** 6+ índices

### Interfaces TypeScript
- 6 interfaces principales
- Type safety completo
- Validación en tiempo de compilación

---

## 10. TECNOLOGÍAS Y DEPENDENCIAS

### Stack Principal
- **Next.js:** 16.1.4 (App Router)
- **React:** 19.x
- **TypeScript:** 5.x
- **Supabase:** Cliente JS v2
- **TailwindCSS:** 3.x

### Librerías UI
- **Radix UI:** Componentes accesibles
- **Lucide React:** Iconos
- **Custom Components:** Card, Button, Input

### Base de Datos
- **PostgreSQL:** 15+ (via Supabase)
- **Supabase Storage:** Para archivos

---

## 11. CARACTERÍSTICAS TÉCNICAS

### Performance
- Carga lazy de imágenes
- Optimización de queries con índices
- Cache en cliente con React hooks
- Imágenes optimizadas en Storage

### Escalabilidad
- Arquitectura modular
- Fácil añadir nuevas secciones
- Tablas preparadas para crecimiento
- Storage ilimitado (según plan Supabase)

### Mantenibilidad
- Código documentado
- Separación de responsabilidades
- TypeScript para type safety
- Estructura clara de carpetas

### Accesibilidad
- Textos alternativos en imágenes
- Navegación por teclado
- Componentes Radix UI accesibles
- Contraste de colores adecuado

---

## 12. TESTING Y VALIDACIÓN

### Validaciones Implementadas
- Validación de tipos con TypeScript
- Validación de permisos en RLS
- Validación de formatos de archivo
- Confirmaciones antes de eliminar

### Manejo de Errores
- Try-catch en todas las operaciones async
- Mensajes de error descriptivos
- Fallbacks en caso de fallo de carga
- Logs en consola para debugging

---

## 13. CONFIGURACIÓN REQUERIDA

### Variables de Entorno
```
NEXT_PUBLIC_SUPABASE_URL=https://qhyuoiyamcxxjsznbiyt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Supabase Setup
1. Ejecutar `supabase-cms-schema.sql`
2. Crear bucket `cms-images`
3. Configurar políticas de storage
4. Crear usuario admin

### Usuario Admin
- Email: `vinceroadmin@vincero.mx`
- Password: (Configurado en Supabase Auth)
- Auto-confirm: Activado

---

## 14. ENDPOINTS Y RUTAS

### Rutas Públicas
- `/` - Homepage con hero dinámico
- `/about` - Página nosotros
- `/features` - Página características
- `/shop` - Catálogo de productos

### Rutas Admin
- `/admin` - Dashboard principal
- `/admin?tab=cms` - Acceso directo al CMS

### API Routes
- Usa Supabase directamente (no API routes custom)
- Autenticación via Supabase Auth

---

## 15. LIMITACIONES Y CONSIDERACIONES

### Limitaciones Actuales
- Imágenes limitadas por plan de Supabase Storage
- No hay versionado de contenido (historial)
- No hay preview antes de publicar
- Edición de un admin a la vez (sin locks)

### Consideraciones de Uso
- Imágenes deben ser optimizadas antes de subir
- Nombres de archivos se generan automáticamente
- URLs de imágenes son permanentes
- Cambios son inmediatos (sin staging)

---

## 16. MEJORAS FUTURAS SUGERIDAS

### Funcionalidades
- Sistema de versionado de contenido
- Preview antes de publicar
- Programación de publicaciones
- Multi-idioma expandido
- Analytics de contenido
- Búsqueda de imágenes

### Técnicas
- Optimización automática de imágenes
- CDN para imágenes
- Cache más agresivo
- Webhooks para notificaciones
- API REST para integraciones

---

## 17. COMANDOS ÚTILES

### Desarrollo
```bash
npm run dev          # Iniciar servidor desarrollo
npm run build        # Build de producción
npm run start        # Iniciar producción
npm run lint         # Linter
```

### Base de Datos
```bash
# Ejecutar en Supabase SQL Editor
-- Cargar schema completo
\i supabase-cms-schema.sql
```

---

## 18. ESTRUCTURA DE ARCHIVOS

```
/Users/mac/Downloads/code (1)/
├── app/
│   ├── admin/
│   │   └── page.tsx              # Dashboard admin con CMS
│   ├── page.tsx                  # Homepage con hero dinámico
│   ├── about/page.tsx            # Página nosotros
│   └── features/page.tsx         # Página características
├── components/
│   └── admin/
│       └── CMSEditor.tsx         # Componente principal del CMS
├── hooks/
│   └── useCMSContent.ts          # Custom hooks para CMS
├── lib/
│   ├── cms.ts                    # Funciones de CMS
│   └── supabase.ts               # Cliente Supabase
├── supabase-cms-schema.sql       # Schema de base de datos
├── CMS-SETUP.md                  # Guía de configuración
└── INFORME-TECNICO-CMS.md        # Este documento
```

---

## 19. RESUMEN EJECUTIVO TÉCNICO

### Entregables
✅ 6 tablas de base de datos con RLS  
✅ 1 bucket de storage configurado  
✅ 2,200+ líneas de código TypeScript/React  
✅ 5 módulos de gestión de contenido  
✅ 32 recursos visuales pre-cargados  
✅ Sistema de autenticación y permisos  
✅ Documentación completa  

### Tiempo de Implementación
- Diseño de arquitectura: 2 horas
- Desarrollo backend (lib/cms.ts): 4 horas
- Desarrollo frontend (CMSEditor): 8 horas
- Integración y testing: 3 horas
- Documentación: 2 horas
- **Total:** ~19 horas de desarrollo

### Complejidad
- **Backend:** Media (Supabase abstrae mucha complejidad)
- **Frontend:** Alta (UI compleja con múltiples estados)
- **Integración:** Media (Hooks y componentes bien estructurados)

---

## 20. CONTACTO TÉCNICO

Para consultas técnicas sobre la implementación:
- Revisar documentación en `CMS-SETUP.md`
- Consultar comentarios en código fuente
- Verificar logs en consola del navegador
- Revisar logs de Supabase Dashboard

---

**Fin del Informe Técnico**

*Documento generado: Enero 2026*  
*Versión: 1.0*
