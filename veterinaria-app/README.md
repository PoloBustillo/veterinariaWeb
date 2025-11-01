# 🐾 Veterinaria App - Sistema de Gestión Veterinaria

Aplicación web profesional para gestión de veterinarias construida con Next.js 15, Prisma ORM y TypeScript.

## 📋 Características

- ✅ Gestión de mascotas y dueños
- ✅ Control de consultas veterinarias
- ✅ Administración de servicios e insumos
- ✅ Sistema de pagos y facturación
- ✅ Control de inventario (productos e insumos)
- ✅ Gestión de caja
- ✅ Historial médico completo
- ✅ Dashboard con estadísticas

## 🛠️ Tecnologías

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **ORM**: Prisma
- **Base de Datos**: PostgreSQL
- **Estilos**: Tailwind CSS
- **Iconos**: Heroicons

## 📦 Estructura del Proyecto

```
veterinaria-app/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Landing page
│   ├── dashboard/         # Panel de administración
│   └── api/               # API Routes
├── lib/                   # Utilidades y configuración
│   └── prisma.ts         # Cliente de Prisma
├── prisma/               # Prisma ORM
│   └── schema.prisma     # Esquema de base de datos
├── public/               # Archivos estáticos
└── components/           # Componentes reutilizables
```

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+ 
- PostgreSQL 13+
- npm o yarn

### Pasos de Instalación

1. **Instalar dependencias**
```bash
npm install
```

2. **Configurar variables de entorno**

Edita el archivo `.env` con tus credenciales de PostgreSQL:

```env
# Reemplaza con tus credenciales reales
DATABASE_URL="postgresql://tu_usuario:tu_password@localhost:5432/veterinaria?schema=dalton"

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-key-aqui

NEXT_PUBLIC_APP_NAME="Veterinaria App"
```

3. **Crear la base de datos**

Si aún no has creado la base de datos, usa los scripts SQL que están en la carpeta `../scripts/`:

```bash
# Desde PostgreSQL o pgAdmin, ejecuta:
# 1. ../scripts/creation.sql    (Crea las tablas)
# 2. ../scripts/seed.sql        (Inserta datos de ejemplo)
```

4. **Generar el cliente de Prisma**
```bash
npx prisma generate
```

5. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

6. **Abrir en el navegador**
```
http://localhost:3000
```

## 📊 Modelos de Base de Datos

### Principales Entidades

- **Dueno**: Propietarios de mascotas
- **Mascota**: Información de las mascotas
- **Veterinario**: Personal veterinario
- **Consulta**: Consultas médicas
- **Servicio**: Servicios ofrecidos
- **Producto**: Productos en venta
- **Insumo**: Insumos médicos
- **Pago**: Pagos y facturación
- **Caja**: Control de caja

## 🔐 Comandos de Prisma

```bash
# Ver el schema en Prisma Studio
npx prisma studio

# Generar cliente de Prisma
npx prisma generate

# Crear migración
npx prisma migrate dev --name nombre_migracion

# Aplicar migraciones en producción
npx prisma migrate deploy

# Validar schema
npx prisma validate

# Formatear schema
npx prisma format
```

## 📱 Páginas de la Aplicación

- `/` - Landing page principal
- `/dashboard` - Panel de control
- `/dashboard/consultas` - Gestión de consultas
- `/dashboard/mascotas` - Gestión de mascotas
- `/dashboard/duenos` - Gestión de dueños
- `/dashboard/productos` - Gestión de productos
- `/dashboard/servicios` - Gestión de servicios
- `/dashboard/pagos` - Gestión de pagos

## 🎨 Características de la UI

- ✨ Diseño moderno y responsivo
- 🎨 Gradientes y animaciones suaves
- 📱 Mobile-first design
- ♿ Accesible (WCAG)
- 🌙 Preparado para modo oscuro

## 📝 Consultas SQL Disponibles

El proyecto incluye más de 250 consultas SQL predefinidas en:
- `../scripts/consultas250_new.sql`

Estas consultas incluyen:
- Listados con JOIN de múltiples tablas
- Agregaciones y estadísticas
- Reportes financieros
- Historial de mascotas
- Análisis de servicios

## 🔧 Scripts NPM

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar en producción
npm start

# Linting
npm run lint

# Prisma Studio
npx prisma studio
```

## 📚 Próximos Pasos

1. **Implementar páginas del dashboard**
   - Crear CRUD para cada entidad
   - Implementar formularios con validación
   - Agregar tablas con paginación y filtros

2. **Agregar autenticación**
   - Implementar NextAuth.js
   - Roles de usuario (admin, veterinario, recepción)
   - Protección de rutas

3. **Implementar las consultas SQL**
   - Convertir las 250+ consultas a funciones de Prisma
   - Crear API routes
   - Agregar reportes y dashboards

4. **Mejorar UI/UX**
   - Agregar gráficas (Chart.js / Recharts)
   - Implementar búsqueda avanzada
   - Agregar exportación a PDF/Excel

5. **Testing**
   - Unit tests con Jest
   - Integration tests con Cypress
   - E2E tests

## 🤝 Contribución

Este proyecto está en desarrollo activo.

## 📄 Licencia

Este proyecto es privado y está bajo la licencia de uso interno.

## 👥 Autores

- Repositorio: veterinariaWeb (PoloBustillo)

---

**Última actualización**: Octubre 2025

🐾 Desarrollado con ❤️ para el cuidado de mascotas

