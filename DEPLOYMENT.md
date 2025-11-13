# Guía de Deployment - Producción

## Problema: Admin redirige a login solo en producción

### Causa Principal
El problema es que NextAuth en producción requiere configuración específica de cookies seguras y variables de entorno correctas.

### Solución Aplicada

#### 1. Configuración de Cookies Seguras
Se agregó configuración explícita de cookies en `auth.ts`:
- `httpOnly: true` - Previene acceso desde JavaScript
- `secure: true` en producción - Solo transmite por HTTPS
- `sameSite: 'lax'` - Protección CSRF balanceada
- Nombre de cookie diferente en producción (`__Secure-` prefix)

#### 2. Variables de Entorno Requeridas

**CRÍTICO - Debes configurar estas variables en producción:**

```bash
# 1. Generar AUTH_SECRET
openssl rand -base64 32

# 2. Configurar variables de entorno
AUTH_SECRET=<resultado-del-comando-anterior>
NEXTAUTH_URL=https://tudominio.com
DATABASE_URL=postgresql://...
NODE_ENV=production
```

### Pasos para Deployment

#### Si usas Vercel:

1. Ve a tu proyecto en Vercel Dashboard
2. Settings > Environment Variables
3. Agrega las variables:
   - `AUTH_SECRET`: (genera con `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: `https://tu-dominio.vercel.app`
   - `DATABASE_URL`: tu string de conexión a PostgreSQL
4. Redeploy: `vercel --prod`

#### Si usas Docker:

```yaml
# docker-compose.yml
services:
  app:
    environment:
      - AUTH_SECRET=tu-secret-generado
      - NEXTAUTH_URL=https://tudominio.com
      - DATABASE_URL=postgresql://...
      - NODE_ENV=production
```

#### Si usas servidor tradicional (PM2, etc):

1. Crea archivo `.env.production`:
```bash
AUTH_SECRET=tu-secret-generado
NEXTAUTH_URL=https://tudominio.com
DATABASE_URL=postgresql://...
NODE_ENV=production
```

2. Build y start:
```bash
npm run build
NODE_ENV=production npm start
```

### Verificación Post-Deployment

1. **Verificar HTTPS está habilitado:**
   - Las cookies seguras requieren HTTPS
   - Verifica que `https://` funcione

2. **Probar login:**
   ```bash
   # Abre DevTools (F12) > Application > Cookies
   # Debes ver una cookie llamada:
   # __Secure-next-auth.session-token (en producción)
   ```

3. **Verificar variables de entorno:**
   - Crea endpoint de debug temporal:
   ```typescript
   // app/api/debug/env/route.ts
   export async function GET() {
     return Response.json({
       hasAuthSecret: !!process.env.AUTH_SECRET,
       hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
       nodeEnv: process.env.NODE_ENV,
       // NO mostrar los valores reales
     });
   }
   ```

### Errores Comunes y Soluciones

#### Error: "Session is null" en producción
**Causa:** AUTH_SECRET no configurado o diferente entre builds
**Solución:** 
1. Verificar que AUTH_SECRET esté en variables de entorno
2. Usar el MISMO valor en todas las instancias
3. Limpiar cookies y volver a login

#### Error: Cookies no se guardan
**Causa:** No está usando HTTPS
**Solución:**
1. Habilitar HTTPS en producción
2. O en desarrollo local, usar HTTP sin secure cookies (ya configurado)

#### Error: "CSRF token mismatch"
**Causa:** trustHost no configurado
**Solución:** Ya aplicado - `trustHost: true` en auth.ts

#### Error: Redirect loop infinito
**Causa:** Middleware redirige incluso con sesión válida
**Solución:**
1. Verificar que el token se está leyendo correctamente
2. Verificar que AUTH_SECRET es el mismo que firmó el token
3. Limpiar todas las cookies y volver a login

### Checklist de Deployment

- [ ] AUTH_SECRET generado (32+ caracteres)
- [ ] AUTH_SECRET configurado en producción
- [ ] NEXTAUTH_URL configurado con dominio de producción
- [ ] HTTPS habilitado y funcionando
- [ ] DATABASE_URL apunta a la base de datos correcta
- [ ] Build completado sin errores
- [ ] Cookies se guardan correctamente (verificar en DevTools)
- [ ] Login funciona y redirige correctamente
- [ ] Session persiste en reloads de página

### Debugging en Producción

Si el problema persiste:

1. **Activar logs temporalmente:**
```typescript
// Descomentar solo para debugging
if (process.env.NODE_ENV === 'development') {
  console.log('Auth debug:', { session, token });
}
```

2. **Verificar headers de cookies:**
```bash
# Con curl
curl -I https://tudominio.com/api/auth/session

# Buscar Set-Cookie headers
```

3. **Revisar logs de servidor:**
   - Vercel: `vercel logs`
   - Docker: `docker logs -f <container>`
   - PM2: `pm2 logs`

### Contacto si persiste el problema

Si después de seguir esta guía el problema persiste:

1. Verificar versión de next-auth: `npm list next-auth`
2. Verificar versión de Next.js: `npm list next`
3. Revisar si hay proxies/CDN entre usuario y servidor
4. Verificar configuración de dominio/DNS

### Cambios Aplicados en el Código

1. `auth.ts`:
   - ✅ Agregada configuración explícita de cookies
   - ✅ `trustHost: true` para producción
   - ✅ Removidos console.logs que causan problemas en serverless

2. `middleware.ts`:
   - ✅ Console.logs solo en development
   - ✅ Manejo simplificado de redirects

3. `dashboard/page.tsx`:
   - ✅ Verificación simplificada de sesión
   - ✅ Removidos console.logs innecesarios

### Notas Importantes

- ⚠️ NUNCA commitear .env con AUTH_SECRET real
- ⚠️ Usar HTTPS en producción (requerido para cookies seguras)
- ⚠️ Mismo AUTH_SECRET en todas las instancias
- ⚠️ NEXTAUTH_URL debe coincidir con el dominio real
