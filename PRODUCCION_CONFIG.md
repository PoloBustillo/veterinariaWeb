# CONFIGURACIÓN DE PRODUCCIÓN - Variables de Entorno

## Variables que DEBES cambiar en producción:

### 1. NEXTAUTH_URL
**Local:**
```
NEXTAUTH_URL=http://localhost:3000
```

**Producción:**
```
NEXTAUTH_URL=https://tu-dominio-real.com
```

### 2. AUTH_SECRET y NEXTAUTH_SECRET
Mantener el mismo valor que tienes (ya generado):
```
AUTH_SECRET=oquDGaZY+Td3kGhS1Ih7kxpYEs6neWSPieM9Gn86trU=
NEXTAUTH_SECRET=oquDGaZY+Td3kGhS1Ih7kxpYEs6neWSPieM9Gn86trU=
```

### 3. DATABASE_URL
Verificar que apunte a la base de datos de producción (puede ser la misma):
```
DATABASE_URL="postgresql://dbstudent:fcc@01@146.190.119.145:5432/veterinaria?schema=dalton&connection_limit=50&pool_timeout=20&connect_timeout=10"
```

## IMPORTANTE: Deployment en producción

### Si usas Vercel:
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega/edita:
   - `NEXTAUTH_URL` = `https://tu-app.vercel.app` (o tu dominio custom)
   - `AUTH_SECRET` = `oquDGaZY+Td3kGhS1Ih7kxpYEs6neWSPieM9Gn86trU=`
   - `NEXTAUTH_SECRET` = `oquDGaZY+Td3kGhS1Ih7kxpYEs6neWSPieM9Gn86trU=`
   - `DATABASE_URL` = (tu string de conexión)
4. Redeploy

### Si usas otro hosting:
Configura las variables de entorno en tu plataforma asegurándote que:
- `NEXTAUTH_URL` sea la URL completa con HTTPS
- `AUTH_SECRET` y `NEXTAUTH_SECRET` tengan el mismo valor
- `NODE_ENV=production`

## Cambios realizados en el código:

1. **middleware.ts**: Simplificado para usar solo authConfig
2. **auth.config.ts**: Mejorada la lógica de autorización con roles
3. **auth.ts**: Agregada configuración de cookies seguras

## Verificación:

Después de deployar:
1. Abre tu sitio en producción
2. Intenta hacer login como admin
3. Si redirige a login → revisar variables de entorno
4. Si funciona → problema resuelto ✅

## Debugging:

Si sigue fallando, verificar en los logs de producción:
- "🔍 Middleware" debe mostrar que hay token y el rol correcto
- Si no aparece el log, middleware no se está ejecutando
- Si aparece "No token", las variables de entorno están mal

## Checklist:

- [ ] NEXTAUTH_URL configurado con dominio de producción (https://)
- [ ] AUTH_SECRET igual en todas partes
- [ ] NEXTAUTH_SECRET igual a AUTH_SECRET
- [ ] HTTPS habilitado
- [ ] Variables de entorno configuradas en la plataforma
- [ ] Redeployed después de cambiar variables
- [ ] Cookies limpias en el navegador
