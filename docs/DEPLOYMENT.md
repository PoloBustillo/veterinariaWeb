# 🚀 Guía de Despliegue - Clínica Veterinaria Dalton

Esta guía cubre el proceso completo de despliegue del sistema en diferentes plataformas.

## 📋 Índice

- [Requisitos de Producción](#requisitos-de-producción)
- [Variables de Entorno](#variables-de-entorno)
- [Preparación del Código](#preparación-del-código)
- [Despliegue en Vercel](#despliegue-en-vercel)
- [Despliegue en Railway](#despliegue-en-railway)
- [Despliegue en Render](#despliegue-en-render)
- [Despliegue con Docker](#despliegue-con-docker)
- [Configuración de PostgreSQL](#configuración-de-postgresql)
- [Configuración de Dominio](#configuración-de-dominio)
- [Monitoreo y Logs](#monitoreo-y-logs)
- [Solución de Problemas](#solución-de-problemas)

---

## 📦 Requisitos de Producción

### Software Necesario

- **Node.js**: 20.x o superior
- **PostgreSQL**: 14.x o superior
- **Git**: Para control de versiones
- **Cuenta en plataforma de hosting** (Vercel, Railway, Render, etc.)

### Especificaciones Mínimas del Servidor

- **RAM**: 512 MB (mínimo), 1 GB (recomendado)
- **CPU**: 1 vCore
- **Almacenamiento**: 10 GB
- **Ancho de banda**: 100 GB/mes

---

## 🔐 Variables de Entorno

### Archivo `.env.production`

Crea un archivo `.env.production` con las siguientes variables:

```env
# Base de datos PostgreSQL (Producción)
DATABASE_URL="postgresql://usuario:password@host:5432/veterinaria_db?schema=public"

# NextAuth Configuration
AUTH_SECRET="tu-clave-secreta-super-segura-de-produccion"
AUTH_URL="https://tu-dominio.com"

# Environment
NODE_ENV="production"

# Optional: Logging
LOG_LEVEL="error"
```

### Generar AUTH_SECRET Seguro

```bash
# Método 1: OpenSSL
openssl rand -base64 32

# Método 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Método 3: Online
# https://generate-secret.vercel.app/32
```

### Variables Requeridas

| Variable       | Descripción                  | Ejemplo               |
| -------------- | ---------------------------- | --------------------- |
| `DATABASE_URL` | URL de conexión a PostgreSQL | `postgresql://...`    |
| `AUTH_SECRET`  | Clave secreta para JWT       | `abc123xyz...`        |
| `AUTH_URL`     | URL pública de la aplicación | `https://clinica.com` |
| `NODE_ENV`     | Entorno de ejecución         | `production`          |

---

## 🛠️ Preparación del Código

### 1. Verificar el Build Local

Antes de desplegar, verifica que el proyecto compile correctamente:

```bash
# Instalar dependencias
npm install

# Generar Prisma Client
npx prisma generate

# Construir el proyecto
npm run build

# Probar en modo producción
npm start
```

### 2. Optimización para Producción

#### package.json

Asegúrate de tener estos scripts:

```json
{
  "scripts": {
    "dev": "next dev --webpack",
    "build": "next build --webpack",
    "start": "next start",
    "postinstall": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate deploy"
  }
}
```

#### next.config.ts

Optimizaciones recomendadas:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Optimización de imágenes
  images: {
    domains: ["tu-dominio.com"],
    formats: ["image/avif", "image/webp"],
  },

  // Headers de seguridad
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

### 3. Preparar Git

```bash
# Asegúrate de que .env esté en .gitignore
echo ".env*" >> .gitignore
echo "!.env.example" >> .gitignore

# Commit final
git add .
git commit -m "Preparar para producción"
git push origin main
```

---

## ☁️ Despliegue en Vercel

### Método 1: Dashboard de Vercel

1. **Ir a [vercel.com](https://vercel.com)**
2. **Conectar con GitHub**

   - Click en "New Project"
   - Selecciona tu repositorio `veterinariaWeb`
   - Autoriza el acceso

3. **Configurar el Proyecto**

   - Framework: Next.js (detectado automáticamente)
   - Root Directory: `./` (raíz)
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Variables de Entorno**

   - Click en "Environment Variables"
   - Agregar:
     ```
     DATABASE_URL = postgresql://...
     AUTH_SECRET = tu-secret
     AUTH_URL = https://tu-proyecto.vercel.app
     ```

5. **Deploy**
   - Click en "Deploy"
   - Espera a que termine (2-5 minutos)

### Método 2: Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Configurar proyecto
vercel

# Establecer variables de entorno
vercel env add DATABASE_URL production
vercel env add AUTH_SECRET production
vercel env add AUTH_URL production

# Deploy a producción
vercel --prod
```

### Post-Despliegue en Vercel

1. **Configurar PostgreSQL**

   - Usar Vercel Postgres, Railway, o Supabase
   - Actualizar `DATABASE_URL`

2. **Ejecutar Migraciones**

   ```bash
   # Conectar a tu instancia de producción
   DATABASE_URL="postgresql://..." npx prisma db push
   ```

3. **Verificar Funcionamiento**
   - Visita `https://tu-proyecto.vercel.app`
   - Prueba login, registro, y funcionalidades principales

---

## 🚂 Despliegue en Railway

Railway proporciona PostgreSQL automáticamente.

### Paso a Paso

1. **Crear Cuenta en [railway.app](https://railway.app)**

2. **Nuevo Proyecto**

   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Conecta tu repositorio

3. **Agregar PostgreSQL**

   - Click en "+ New"
   - Selecciona "Database" → "PostgreSQL"
   - Railway creará la base de datos automáticamente

4. **Variables de Entorno**

   - Railway detecta automáticamente `DATABASE_URL`
   - Agrega manualmente:
     ```
     AUTH_SECRET=tu-secret-aqui
     AUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}
     NODE_ENV=production
     ```

5. **Configurar Build**

   - Build Command: `npm run build`
   - Start Command: `npm start`

6. **Deploy**
   - Railway desplegará automáticamente
   - Genera un dominio público: `*.railway.app`

### Railway CLI

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Inicializar proyecto
railway init

# Establecer variables
railway variables set AUTH_SECRET="tu-secret"

# Deploy
railway up
```

### Ejecutar Migraciones en Railway

```bash
# Conectar a la base de datos
railway connect PostgreSQL

# O ejecutar comando directo
railway run npx prisma db push
```

---

## 🎨 Despliegue en Render

### Configuración

1. **Crear Cuenta en [render.com](https://render.com)**

2. **Crear PostgreSQL Database**

   - Dashboard → "New" → "PostgreSQL"
   - Nombre: `veterinaria-db`
   - Copia la URL de conexión

3. **Crear Web Service**

   - "New" → "Web Service"
   - Conecta GitHub
   - Selecciona el repositorio

4. **Configuración del Servicio**

   ```yaml
   Name: veterinaria-web
   Environment: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

5. **Variables de Entorno**

   ```
   DATABASE_URL=postgresql://... (de tu DB Render)
   AUTH_SECRET=tu-secret
   AUTH_URL=https://tu-app.onrender.com
   NODE_ENV=production
   ```

6. **Deploy**
   - Click en "Create Web Service"
   - Primer despliegue toma 5-10 minutos

### Ejecutar Migraciones

Después del primer despliegue:

1. Ve a la pestaña "Shell"
2. Ejecuta:
   ```bash
   npx prisma db push
   ```

### Render Blueprint (render.yaml)

Crea un archivo `render.yaml` en la raíz:

```yaml
services:
  - type: web
    name: veterinaria-web
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: AUTH_SECRET
        generateValue: true
      - key: AUTH_URL
        value: https://veterinaria-web.onrender.com
      - key: DATABASE_URL
        fromDatabase:
          name: veterinaria-db
          property: connectionString

databases:
  - name: veterinaria-db
    databaseName: veterinaria_db
    user: veterinaria_user
```

---

## 🐳 Despliegue con Docker

### Dockerfile

```dockerfile
# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Copiar código fuente
COPY . .

# Generar Prisma Client
RUN npx prisma generate

# Build de Next.js
RUN npm run build

# Etapa 2: Producción
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Cambiar a usuario no-root
USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: "3.8"

services:
  # Aplicación Next.js
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/veterinaria_db
      - AUTH_SECRET=${AUTH_SECRET}
      - AUTH_URL=${AUTH_URL}
      - NODE_ENV=production
    depends_on:
      - db
    restart: unless-stopped

  # Base de datos PostgreSQL
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=veterinaria_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/creation.sql:/docker-entrypoint-initdb.d/01-schema.sql
      - ./scripts/seed.sql:/docker-entrypoint-initdb.d/02-seed.sql
    restart: unless-stopped

volumes:
  postgres_data:
```

### Comandos Docker

```bash
# Construir imagen
docker build -t veterinaria-web .

# Ejecutar contenedor
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e AUTH_SECRET="secret" \
  -e AUTH_URL="http://localhost:3000" \
  veterinaria-web

# Con docker-compose
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Ejecutar migraciones
docker-compose exec app npx prisma db push

# Detener
docker-compose down
```

### Despliegue en VPS con Docker

```bash
# En el servidor
git clone https://github.com/PoloBustillo/veterinariaWeb.git
cd veterinariaWeb

# Crear .env
cat > .env << EOF
DATABASE_URL=postgresql://postgres:password@db:5432/veterinaria_db
AUTH_SECRET=$(openssl rand -base64 32)
AUTH_URL=https://tu-dominio.com
NODE_ENV=production
EOF

# Desplegar
docker-compose up -d

# Verificar
docker-compose ps
docker-compose logs -f
```

---

## 🗄️ Configuración de PostgreSQL

### Opción 1: PostgreSQL en Vercel

```bash
# Instalar Vercel Postgres
vercel postgres create

# Conectar a tu proyecto
vercel env pull

# Ejecutar migraciones
npx prisma db push
```

### Opción 2: Railway PostgreSQL

Railway proporciona PostgreSQL automáticamente al crear el proyecto.

### Opción 3: Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ir a Project Settings → Database
3. Copiar Connection String (URI)
4. Usar en `DATABASE_URL`

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
```

### Opción 4: PostgreSQL Propio

En tu VPS:

```bash
# Instalar PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Crear base de datos
sudo -u postgres psql
CREATE DATABASE veterinaria_db;
CREATE USER veterinaria_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE veterinaria_db TO veterinaria_user;
\q

# Configurar acceso remoto
sudo nano /etc/postgresql/14/main/postgresql.conf
# Cambiar: listen_addresses = '*'

sudo nano /etc/postgresql/14/main/pg_hba.conf
# Agregar: host all all 0.0.0.0/0 md5

sudo systemctl restart postgresql
```

### Ejecutar Scripts de Base de Datos

```bash
# Opción 1: Prisma Push (recomendado para desarrollo)
npx prisma db push

# Opción 2: SQL directo
psql -U postgres -d veterinaria_db -f scripts/creation.sql
psql -U postgres -d veterinaria_db -f scripts/seed.sql

# Opción 3: Con DATABASE_URL
DATABASE_URL="postgresql://..." npx prisma db push
```

---

## 🌐 Configuración de Dominio

### Vercel

1. **Agregar Dominio Personalizado**

   - Project Settings → Domains
   - Agregar `www.tu-dominio.com` y `tu-dominio.com`

2. **Configurar DNS**

   ```
   Tipo  Nombre  Valor
   A     @       76.76.21.21
   CNAME www     cname.vercel-dns.com
   ```

3. **Actualizar AUTH_URL**
   ```env
   AUTH_URL=https://tu-dominio.com
   ```

### Railway

1. **Configurar Dominio**

   - Project → Settings → Domains
   - Agregar dominio personalizado

2. **Configurar DNS**
   ```
   CNAME @ railway.app (o el proporcionado)
   ```

### SSL/HTTPS

Vercel y Railway proporcionan SSL automático. Para VPS:

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Renovación automática
sudo certbot renew --dry-run
```

---

## 📊 Monitoreo y Logs

### Vercel

```bash
# Ver logs en tiempo real
vercel logs --follow

# Logs de producción
vercel logs --prod
```

### Railway

```bash
# Ver logs
railway logs

# Seguir logs
railway logs --follow
```

### Docker

```bash
# Ver logs
docker-compose logs -f app

# Últimas 100 líneas
docker-compose logs --tail=100 app
```

### Logs de Aplicación

Agregar logging en el código:

```typescript
// lib/logger.ts
export const logger = {
  info: (message: string) => {
    if (process.env.NODE_ENV === "production") {
      console.log(
        JSON.stringify({ level: "info", message, timestamp: new Date() })
      );
    } else {
      console.log(message);
    }
  },
  error: (message: string, error?: any) => {
    console.error(
      JSON.stringify({ level: "error", message, error, timestamp: new Date() })
    );
  },
};
```

---

## 🐛 Solución de Problemas

### Error: "Prisma Client not generated"

```bash
# Solución
npx prisma generate
npm run build
```

### Error: "Database connection failed"

```bash
# Verificar conexión
psql "postgresql://..."

# Revisar DATABASE_URL
echo $DATABASE_URL

# Probar conexión con Prisma
npx prisma db push
```

### Error: "NextAuth JWT Secret Missing"

```bash
# Verificar AUTH_SECRET
echo $AUTH_SECRET

# Generar nuevo si falta
openssl rand -base64 32
```

### Build Timeout en Vercel

```json
// vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next",
      "config": {
        "maxDuration": 60
      }
    }
  ]
}
```

### Error de Memoria (Railway/Render)

```json
// package.json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

### Prisma Client Takes Too Long

```typescript
// prisma.config.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

---

## ✅ Checklist Pre-Despliegue

- [ ] ✅ Build local exitoso (`npm run build`)
- [ ] ✅ Tests pasando (si existen)
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ `AUTH_SECRET` generado seguro
- [ ] ✅ Base de datos PostgreSQL lista
- [ ] ✅ Scripts SQL ejecutados
- [ ] ✅ `.env` en `.gitignore`
- [ ] ✅ Dominio configurado (si aplica)
- [ ] ✅ SSL habilitado
- [ ] ✅ Backup de base de datos configurado

## ✅ Checklist Post-Despliegue

- [ ] ✅ Aplicación accesible
- [ ] ✅ Login funcional
- [ ] ✅ Registro funcional
- [ ] ✅ Base de datos conectada
- [ ] ✅ Imágenes cargando
- [ ] ✅ Sin errores en consola
- [ ] ✅ Funcionalidades principales probadas
- [ ] ✅ Monitoreo configurado
- [ ] ✅ Logs funcionando

---

**¡Felicidades! Tu aplicación está en producción** 🎉

Para soporte adicional, consulta:

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Railway](https://docs.railway.app)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Prisma](https://www.prisma.io/docs)
