# Configuración de Supabase para Vincero

## Problema: Reset Password redirige a localhost

### Solución: Configurar URLs en Supabase

1. **Accede a tu Dashboard de Supabase**
   - Ve a: https://supabase.com/dashboard
   - Selecciona tu proyecto Vincero

2. **Configurar URL Configuration**
   - En el menú lateral, ve a: **Authentication → URL Configuration**
   - Configura los siguientes valores:

   **Site URL:**
   ```
   https://vincero.com.mx
   ```

   **Redirect URLs** (agregar todas estas):
   ```
   https://vincero.com.mx/**
   https://vincero.com.mx/reset-password
   http://localhost:3000/** (solo para desarrollo)
   ```

3. **Configurar Email Templates**
   - Ve a: **Authentication → Email Templates**
   - Selecciona: **Reset Password**
   - Verifica que el template use la variable `{{ .ConfirmationURL }}`
   - Esta URL automáticamente usará tu Site URL configurada

4. **Guardar cambios**
   - Haz clic en **Save** en cada sección modificada

---

## Configuración de Admin

### Emails de Administrador Autorizados

Los siguientes emails tienen acceso al panel de administración:

- `vinceroadmin@vincero.com.mx`
- `admin@vincero.com`
- `vincero@admin.com`
- `hutec.ia@gmail.com`

### Agregar un nuevo administrador

1. **Actualizar el código:**
   - Edita: `app/admin/page.tsx` línea 102
   - Agrega el email al array `adminEmails`

2. **Actualizar la base de datos:**
   - Ejecuta en Supabase SQL Editor:
   ```sql
   CREATE OR REPLACE FUNCTION is_admin()
   RETURNS BOOLEAN AS $$
   BEGIN
     RETURN (
       SELECT email IN ('admin@vincero.com', 'vincero@admin.com', 'hutec.ia@gmail.com', 'vinceroadmin@vincero.com.mx', 'nuevo@email.com')
       FROM auth.users
       WHERE id = auth.uid()
     );
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;
   ```

---

## Variables de Entorno de Producción

Asegúrate de configurar estas variables en tu servidor de producción (Vercel/Netlify):

```env
NEXT_PUBLIC_APP_URL=https://vincero.com.mx
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Cómo obtener las credenciales de Supabase:

1. Ve a tu proyecto en Supabase Dashboard
2. **Settings → API**
3. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Verificación

Después de configurar todo:

1. **Prueba el reset password:**
   - Ve a tu sitio en producción
   - Haz clic en "Olvidé mi contraseña"
   - Ingresa un email registrado
   - Verifica que el email recibido tenga un link a `vincero.com.mx` (no localhost)

2. **Prueba el acceso de admin:**
   - Ve a `https://vincero.com.mx/admin`
   - Inicia sesión con `vinceroadmin@vincero.com.mx`
   - Verifica que tengas acceso completo al CMS

---

## Optimizaciones del CMS

Se han implementado las siguientes optimizaciones para evitar que el CMS se trabe:

- ✅ Uso de `useCallback` para memorizar funciones
- ✅ Actualización de estado con función callback (`prev =>`)
- ✅ Evitar re-renders innecesarios en campos de texto

Esto mejora significativamente el rendimiento al editar contenido.
