# ⚡ Guía de Inicio Rápido - Clínica Veterinaria Dalton

Esta guía te ayudará a tener el proyecto funcionando en **menos de 10 minutos**.

## 🎯 Requisitos Previos

Antes de empezar, asegúrate de tener instalado:

- ✅ **Node.js 20+** ([Descargar](https://nodejs.org/))
- ✅ **PostgreSQL 14+** ([Descargar](https://www.postgresql.org/download/))
- ✅ **Git** ([Descargar](https://git-scm.com/))

## 🚀 Instalación en 5 Pasos

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/PoloBustillo/veterinariaWeb.git
cd veterinariaWeb
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

### Paso 3: Configurar Base de Datos

#### Opción A: Crear manualmente

```bash
# Conectarse a PostgreSQL
psql -U postgres

# Crear base de datos
CREATE DATABASE veterinaria_db;
\q

# Ejecutar script de creación
psql -U postgres -d veterinaria_db -f scripts/creation.sql

# (Opcional) Cargar datos de prueba
psql -U postgres -d veterinaria_db -f scripts/seed.sql
```

#### Opción B: Usando Prisma

```bash
# Crear la base de datos
createdb veterinaria_db

# Generar cliente y crear tablas
npx prisma generate
npx prisma db push
```

### Paso 4: Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales
# DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/veterinaria_db"
# AUTH_SECRET="generar-con-comando-abajo"
# AUTH_URL="http://localhost:3000"
```

**Generar AUTH_SECRET:**

```bash
openssl rand -base64 32
```

### Paso 5: Iniciar Servidor

```bash
npm run dev
```

**¡Listo!** Abre tu navegador en [http://localhost:3000](http://localhost:3000)

---

## 👥 Usuarios de Prueba

Si ejecutaste el script `seed.sql`, puedes usar estas credenciales:

### Cliente

- **Email:** `juan.perez@example.com`
- **Password:** `password123`

### Veterinario

- **Email:** `dra.lopez@veterinaria.com`
- **Password:** `vet123`

---

## 🗺️ Navegando por la Aplicación

### Como Cliente

1. **Inicio de Sesión:** `/login`
2. **Registrar Mascota:** `/registrar-mascota`
3. **Mis Mascotas:** `/mis-mascotas`
4. **Agendar Cita:** `/agendar-cita`
5. **Mis Citas:** `/mis-citas`

### Como Veterinario

1. **Dashboard:** `/veterinario/dashboard`
2. **Consultas:** `/veterinario/consultas`
3. **Caja:** `/veterinario/caja`
4. **Ventas:** `/veterinario/ventas`

---

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo
npm run build            # Construir para producción
npm start                # Iniciar servidor de producción

# Base de Datos
npx prisma generate      # Generar cliente de Prisma
npx prisma db push       # Sincronizar schema con DB
npx prisma studio        # Abrir Prisma Studio (GUI)

# Prisma Studio - Ver/Editar datos
npx prisma studio        # Abre en http://localhost:5555
```

---

## 📂 Estructura del Proyecto

```
veterinariaWeb/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── login/             # Página de login
│   ├── registro/          # Página de registro
│   ├── agendar-cita/      # Agendar citas
│   ├── mis-citas/         # Gestión de citas
│   ├── mis-mascotas/      # Gestión de mascotas
│   ├── veterinario/       # Panel de veterinario
│   │   ├── dashboard/
│   │   ├── consultas/
│   │   ├── caja/
│   │   └── ventas/
│   └── page.tsx           # Landing page
├── prisma/
│   └── schema.prisma      # Schema de base de datos
├── scripts/               # Scripts SQL
│   ├── creation.sql       # Crear BD
│   └── seed.sql           # Datos de prueba
└── docs/                  # Documentación
```

---

## 🐛 Solución de Problemas Comunes

### Error: "Prisma Client not generated"

```bash
npx prisma generate
```

### Error: "Database connection failed"

1. Verifica que PostgreSQL esté corriendo:

   ```bash
   # Windows
   Get-Service postgresql*

   # macOS/Linux
   ps aux | grep postgres
   ```

2. Verifica tu `DATABASE_URL` en `.env`

3. Prueba la conexión:
   ```bash
   psql -U postgres -d veterinaria_db
   ```

### Error: "Port 3000 already in use"

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Error: "AUTH_SECRET is not defined"

Asegúrate de tener un archivo `.env` con:

```env
AUTH_SECRET="tu-secret-generado"
```

---

## 🎨 Personalización Rápida

### Cambiar Nombre de la Clínica

Editar en `app/page.tsx`:

```typescript
<span className="text-2xl font-bold text-gray-900">
  Tu Clínica Veterinaria {/* Cambiar aquí */}
</span>
```

### Cambiar Colores

Editar `app/globals.css`:

```css
:root {
  --primary: #2563eb; /* Azul principal */
  --secondary: #10b981; /* Verde secundario */
}
```

### Cambiar Logo

Reemplazar archivo en `public/icono-clinica.png` con tu logo.

---

## 📚 Próximos Pasos

1. **Explora la Documentación:**

   - [README.md](../README.md) - Documentación completa
   - [API.md](API.md) - Documentación de API
   - [DATABASE.md](DATABASE.md) - Documentación de BD
   - [DEPLOYMENT.md](DEPLOYMENT.md) - Guía de despliegue

2. **Personaliza el Sistema:**

   - Agrega tu información de contacto
   - Personaliza los colores y logo
   - Configura datos de tu clínica

3. **Aprende las Funcionalidades:**

   - Prueba el registro de mascotas
   - Agenda una cita de prueba
   - Explora el panel de veterinario
   - Prueba el sistema de caja

4. **Contribuye:**
   - Lee [CONTRIBUTING.md](CONTRIBUTING.md)
   - Reporta bugs o propón mejoras
   - Comparte tu experiencia

---

## 🆘 Necesitas Ayuda?

- 📖 **Documentación:** Revisa los archivos en `/docs`
- 🐛 **Issues:** [GitHub Issues](https://github.com/PoloBustillo/veterinariaWeb/issues)
- 💬 **Discusiones:** [GitHub Discussions](https://github.com/PoloBustillo/veterinariaWeb/discussions)

---

## ✅ Checklist de Inicio

- [ ] Node.js 20+ instalado
- [ ] PostgreSQL 14+ instalado
- [ ] Repositorio clonado
- [ ] Dependencias instaladas (`npm install`)
- [ ] Base de datos creada
- [ ] Scripts SQL ejecutados
- [ ] Archivo `.env` configurado
- [ ] AUTH_SECRET generado
- [ ] Servidor funcionando (`npm run dev`)
- [ ] Aplicación accesible en http://localhost:3000
- [ ] Login funcional con usuarios de prueba

---

**¡Felicidades!** 🎉 Ya tienes el sistema funcionando.

Ahora explora todas las funcionalidades y personaliza según tus necesidades.

**Desarrollado con ❤️ para la BUAP**
