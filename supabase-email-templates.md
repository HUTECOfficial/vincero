# Personalización de Templates de Email en Supabase

## Instrucciones para configurar los emails personalizados de Vincero

### 1. Acceder a la configuración de Email Templates

1. Ve a tu proyecto de Supabase: https://qhyuoiyamcxxjsznbiyt.supabase.co
2. En el menú lateral, ve a **Authentication** → **Email Templates**

### 2. Template de Confirmación de Registro (Confirm Signup)

Reemplaza el contenido con este template personalizado:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenido a Vincero</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header con logo y fondo dorado -->
          <tr>
            <td style="background: linear-gradient(135deg, #D4AF37 0%, #F4E4B0 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                VINCERO
              </h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.95;">
                Tenis Infantiles de Calidad Premium
              </p>
            </td>
          </tr>
          
          <!-- Contenido principal -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 24px; font-weight: 600;">
                ¡Bienvenido a la Familia Vincero! 🎉
              </h2>
              
              <p style="margin: 0 0 16px 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Estamos emocionados de tenerte con nosotros. En <strong>Vincero</strong>, nos dedicamos a ofrecer los mejores tenis infantiles con diseños únicos y la más alta calidad.
              </p>
              
              <p style="margin: 0 0 16px 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Para completar tu registro y comenzar a disfrutar de nuestros productos exclusivos, por favor confirma tu correo electrónico:
              </p>
              
              <!-- Botón de confirmación -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" 
                       style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #D4AF37 0%, #F4E4B0 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);">
                      Confirmar mi Cuenta
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 20px 0 0 0; color: #6a6a6a; font-size: 14px; line-height: 1.5;">
                Si no creaste esta cuenta, puedes ignorar este correo de forma segura.
              </p>
            </td>
          </tr>
          
          <!-- Beneficios -->
          <tr>
            <td style="padding: 0 30px 30px 30px;">
              <div style="background-color: #f9f9f9; border-radius: 12px; padding: 24px;">
                <h3 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 18px; font-weight: 600;">
                  ✨ Beneficios de tu cuenta:
                </h3>
                <ul style="margin: 0; padding: 0 0 0 20px; color: #4a4a4a; font-size: 14px; line-height: 1.8;">
                  <li>Acceso a colecciones exclusivas</li>
                  <li>Seguimiento de tus pedidos en tiempo real</li>
                  <li>Ofertas y promociones especiales</li>
                  <li>Atención personalizada vía WhatsApp</li>
                </ul>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1a1a1a; padding: 30px; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #D4AF37; font-size: 20px; font-weight: 600;">
                VINCERO
              </p>
              <p style="margin: 0 0 16px 0; color: #999999; font-size: 14px;">
                Calidad Premium para los Pequeños Campeones
              </p>
              <p style="margin: 0; color: #666666; font-size: 12px;">
                <a href="https://vincero.com.mx" style="color: #D4AF37; text-decoration: none;">vincero.com.mx</a> | 
                <a href="https://wa.me/5214772943124" style="color: #D4AF37; text-decoration: none;">WhatsApp: +52 477 294 3124</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

### 3. Template de Recuperación de Contraseña (Reset Password)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuperar Contraseña - Vincero</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #D4AF37 0%, #F4E4B0 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                VINCERO
              </h1>
              <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 14px; opacity: 0.95;">
                Tenis Infantiles de Calidad Premium
              </p>
            </td>
          </tr>
          
          <!-- Contenido -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1a1a1a; font-size: 24px; font-weight: 600;">
                Recupera tu Contraseña 🔐
              </h2>
              
              <p style="margin: 0 0 16px 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en <strong>Vincero</strong>.
              </p>
              
              <p style="margin: 0 0 16px 0; color: #4a4a4a; font-size: 16px; line-height: 1.6;">
                Haz clic en el botón de abajo para crear una nueva contraseña:
              </p>
              
              <!-- Botón -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="{{ .ConfirmationURL }}" 
                       style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #D4AF37 0%, #F4E4B0 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);">
                      Restablecer Contraseña
                    </a>
                  </td>
                </tr>
              </table>
              
              <div style="background-color: #fff3cd; border-left: 4px solid #D4AF37; padding: 16px; margin: 24px 0; border-radius: 4px;">
                <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.5;">
                  ⚠️ <strong>Importante:</strong> Este enlace expirará en 1 hora por seguridad.
                </p>
              </div>
              
              <p style="margin: 20px 0 0 0; color: #6a6a6a; font-size: 14px; line-height: 1.5;">
                Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña permanecerá sin cambios.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #1a1a1a; padding: 30px; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #D4AF37; font-size: 20px; font-weight: 600;">
                VINCERO
              </p>
              <p style="margin: 0 0 16px 0; color: #999999; font-size: 14px;">
                Calidad Premium para los Pequeños Campeones
              </p>
              <p style="margin: 0; color: #666666; font-size: 12px;">
                <a href="https://vincero.com.mx" style="color: #D4AF37; text-decoration: none;">vincero.com.mx</a> | 
                <a href="https://wa.me/5214772943124" style="color: #D4AF37; text-decoration: none;">WhatsApp: +52 477 294 3124</a>
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

### 4. Configuración Adicional

#### Configurar el Site URL:
1. Ve a **Authentication** → **URL Configuration**
2. Establece el **Site URL**: `https://vincero.com.mx`
3. Agrega **Redirect URLs**:
   - `https://vincero.com.mx/reset-password`
   - `https://vincero.com.mx`

#### Configurar Email Settings:
1. Ve a **Project Settings** → **Authentication** → **SMTP Settings**
2. Si quieres usar tu propio servidor SMTP (recomendado para producción):
   - Host: `smtp.gmail.com` (o tu proveedor)
   - Port: `587`
   - Username: tu email
   - Password: contraseña de aplicación
   - Sender email: `noreply@vincero.com.mx`
   - Sender name: `Vincero - Tenis Infantiles`

### 5. Probar los Templates

1. Registra un nuevo usuario en tu aplicación
2. Verifica que el email de confirmación llegue con el nuevo diseño
3. Prueba la recuperación de contraseña desde la app
4. Verifica que el email de recuperación tenga el diseño personalizado

### Notas Importantes:

- Los templates usan variables de Supabase como `{{ .ConfirmationURL }}`
- Los colores principales son: Dorado `#D4AF37` y Negro `#1a1a1a`
- Los emails son responsive y se ven bien en móvil y desktop
- Los enlaces expiran en 1 hora por seguridad (configurable en Supabase)
