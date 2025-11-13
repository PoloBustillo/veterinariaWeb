# SOLUCIÓN RÁPIDA - Admin redirige a login en producción

## El Problema
NextAuth requiere configuración específica de cookies para producción.

## La Solución (3 pasos)

### 1. Generar AUTH_SECRET
```bash
openssl rand -base64 32
```

### 2. Configurar en Producción

**Vercel:**
- Dashboard → Settings → Environment Variables
- Agregar: `AUTH_SECRET` = (resultado del paso 1)
- Agregar: `NEXTAUTH_URL` = `https://tu-dominio.vercel.app`
- Redeploy

**Otra plataforma:**
Agregar estas variables de entorno:
```
AUTH_SECRET=<tu-secret-generado>
NEXTAUTH_URL=https://tudominio.com
NODE_ENV=production
```

### 3. Verificar
- Debe usar HTTPS (obligatorio)
- Limpiar cookies del navegador
- Login nuevamente

## Verificación Rápida

Después del deployment, abre DevTools (F12) → Application → Cookies
Debe aparecer: `__Secure-next-auth.session-token`

Si no aparece = problema con AUTH_SECRET o HTTPS

## Cambios Aplicados al Código

✅ Configuración de cookies seguras para producción
✅ trustHost habilitado para proxies
✅ Console.logs removidos (causan problemas en serverless)
✅ AUTH_SECRET explícito en configuración

## Si sigue fallando

1. Verificar que AUTH_SECRET esté configurado: `echo $AUTH_SECRET`
2. Verificar HTTPS funciona: `curl -I https://tudominio.com`
3. Limpiar TODAS las cookies del dominio
4. Hacer hard refresh (Ctrl+Shift+R)
5. Revisar logs del servidor
