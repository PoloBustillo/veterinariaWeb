# 🤝 Guía de Contribución - Clínica Veterinaria Dalton

¡Gracias por tu interés en contribuir a este proyecto! Esta guía te ayudará a empezar.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Configuración del Entorno](#configuración-del-entorno)
- [Flujo de Trabajo con Git](#flujo-de-trabajo-con-git)
- [Estándares de Código](#estándares-de-código)
- [Estructura de Commits](#estructura-de-commits)
- [Pull Requests](#pull-requests)
- [Reportar Bugs](#reportar-bugs)
- [Proponer Nuevas Funcionalidades](#proponer-nuevas-funcionalidades)
- [Testing](#testing)
- [Documentación](#documentación)

---

## 📜 Código de Conducta

### Nuestro Compromiso

Nos comprometemos a hacer de este proyecto una experiencia libre de acoso para todos, independientemente de:

- Edad
- Discapacidad
- Etnia
- Identidad y expresión de género
- Nivel de experiencia
- Nacionalidad
- Apariencia personal
- Raza
- Religión
- Orientación sexual

### Comportamiento Esperado

- **Sé respetuoso**: Trata a todos con respeto y consideración
- **Sé colaborativo**: Trabaja en equipo y ayuda a otros
- **Sé profesional**: Mantén un lenguaje y comportamiento profesional
- **Acepta críticas constructivas**: El feedback es parte del aprendizaje

### Comportamiento Inaceptable

- Lenguaje o imágenes sexualizadas
- Comentarios insultantes o despectivos
- Acoso público o privado
- Publicar información privada de otros sin permiso
- Otras conductas que podrían considerarse inapropiadas en un entorno profesional

---

## 🚀 Cómo Contribuir

### Tipos de Contribuciones

Aceptamos varios tipos de contribuciones:

1. **🐛 Reportar Bugs**: Ayúdanos a encontrar y corregir errores
2. **✨ Nuevas Funcionalidades**: Propón o implementa nuevas características
3. **📚 Documentación**: Mejora o amplía la documentación
4. **🎨 Mejoras de UI/UX**: Optimiza la interfaz de usuario
5. **⚡ Optimización**: Mejora el rendimiento del código
6. **🧪 Testing**: Agrega o mejora tests
7. **🌐 Traducciones**: Agrega soporte para otros idiomas

### Proceso General

1. **Fork** el repositorio
2. **Crea una rama** para tu contribución
3. **Haz tus cambios** siguiendo los estándares
4. **Escribe tests** para tu código (si aplica)
5. **Documenta** tus cambios
6. **Envía un Pull Request**
7. **Responde al feedback** de los revisores

---

## 🛠️ Configuración del Entorno

### Requisitos Previos

- Node.js 20+ o Bun
- PostgreSQL 14+
- Git
- Editor de código (recomendado: VS Code)

### Fork y Clone

```bash
# 1. Fork el repositorio en GitHub

# 2. Clonar tu fork
git clone https://github.com/TU-USUARIO/veterinariaWeb.git
cd veterinariaWeb

# 3. Agregar el repositorio original como upstream
git remote add upstream https://github.com/PoloBustillo/veterinariaWeb.git

# 4. Verificar los remotos
git remote -v
```

### Instalación de Dependencias

```bash
# Con npm
npm install

# Con Bun (recomendado)
bun install
```

### Configurar Base de Datos

```bash
# 1. Crear base de datos
createdb veterinaria_db_dev

# 2. Crear archivo .env
cp .env.example .env

# 3. Editar .env con tus credenciales
# DATABASE_URL="postgresql://postgres:password@localhost:5432/veterinaria_db_dev"
# AUTH_SECRET="tu-secret-para-desarrollo"
# AUTH_URL="http://localhost:3000"

# 4. Ejecutar migraciones
npx prisma db push

# 5. (Opcional) Cargar datos de prueba
psql -U postgres -d veterinaria_db_dev -f scripts/seed.sql
```

### Ejecutar en Desarrollo

```bash
# Con npm
npm run dev

# Con Bun
bun run dev

# La aplicación estará en http://localhost:3000
```

### Extensiones Recomendadas para VS Code

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

---

## 🌿 Flujo de Trabajo con Git

### Mantener tu Fork Actualizado

```bash
# Obtener cambios del repositorio original
git fetch upstream

# Actualizar tu rama main
git checkout main
git merge upstream/main

# Subir a tu fork
git push origin main
```

### Crear una Rama para tu Contribución

```bash
# Crear y cambiar a nueva rama
git checkout -b feature/nombre-descriptivo

# Ejemplos de nombres de rama:
# feature/agregar-historial-ventas
# fix/corregir-calculo-caja
# docs/actualizar-readme
# refactor/optimizar-consultas-db
```

### Convenciones de Nombres de Ramas

| Prefijo     | Uso                       | Ejemplo                         |
| ----------- | ------------------------- | ------------------------------- |
| `feature/`  | Nueva funcionalidad       | `feature/notificaciones-email`  |
| `fix/`      | Corrección de bug         | `fix/error-login-veterinario`   |
| `docs/`     | Cambios en documentación  | `docs/agregar-guia-api`         |
| `refactor/` | Refactorización de código | `refactor/componentes-mascotas` |
| `style/`    | Cambios de estilo/formato | `style/mejorar-ui-dashboard`    |
| `test/`     | Agregar o modificar tests | `test/agregar-tests-caja`       |
| `chore/`    | Tareas de mantenimiento   | `chore/actualizar-dependencias` |

---

## 📝 Estándares de Código

### TypeScript

- **Usar TypeScript estricto**: Nunca usar `any`, preferir tipos específicos
- **Interfaces sobre types** para objetos
- **Nombres descriptivos**: Variables y funciones deben ser autoexplicativas

```typescript
// ❌ Mal
const d = new Date();
const calc = (a: any, b: any) => a + b;

// ✅ Bien
const currentDate = new Date();
const calculateTotal = (price: number, quantity: number): number => {
  return price * quantity;
};
```

### React y Next.js

- **Componentes funcionales** con hooks
- **Server Components** por defecto, Client Components cuando sea necesario
- **Nombres en PascalCase** para componentes
- **Props tipadas** con TypeScript

```typescript
// ✅ Ejemplo de componente
interface MascotaCardProps {
  mascota: {
    nombre: string;
    especie: string;
    edad: number;
  };
  onEdit: (id: number) => void;
}

export function MascotaCard({ mascota, onEdit }: MascotaCardProps) {
  return (
    <div className="card">
      <h3>{mascota.nombre}</h3>
      <p>
        {mascota.especie} - {mascota.edad} años
      </p>
      <button onClick={() => onEdit(mascota.id)}>Editar</button>
    </div>
  );
}
```

### API Routes

- **Validación de datos** con Zod
- **Manejo de errores** consistente
- **Respuestas JSON** con estructura estándar

```typescript
// ✅ Ejemplo de API Route
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const mascotaSchema = z.object({
  nombre: z.string().min(2).max(100),
  especie: z.string(),
  fecha_nacimiento: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos
    const validatedData = mascotaSchema.parse(body);

    // Lógica de negocio...

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Datos inválidos",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Error interno del servidor",
      },
      { status: 500 }
    );
  }
}
```

### Prisma

- **Nombres de modelos en PascalCase**
- **Nombres de campos en snake_case**
- **Relaciones bien definidas**

```prisma
// ✅ Ejemplo
model Mascota {
  id_mascota          Int       @id @default(autoincrement())
  nombre              String    @db.VarChar(100)
  especie             String    @db.VarChar(50)
  fecha_nacimiento    DateTime? @db.Date

  // Relaciones
  consultas           Consulta[]
  relaciones_dueno    Relacion_Dueno_Mascota[]
}
```

### Tailwind CSS

- **Clases ordenadas**: Layout → Espaciado → Tipografía → Visual → Estados
- **Usar nombres semánticos** para colores personalizados
- **Responsive design** con prefijos `sm:`, `md:`, `lg:`

```tsx
// ✅ Bien organizado
<div
  className="
  flex flex-col 
  p-6 m-4 
  text-lg font-semibold 
  bg-white rounded-lg shadow-md 
  hover:shadow-lg transition
  md:flex-row md:p-8
"
>
  {children}
</div>
```

### Comentarios

- **JSDoc** para funciones públicas
- **Comentarios explicativos** para lógica compleja
- **TODO** para trabajo pendiente

```typescript
/**
 * Calcula el total de una venta de productos
 * @param productos - Array de productos con cantidad y precio
 * @returns Total de la venta
 */
function calcularTotalVenta(productos: Producto[]): number {
  // TODO: Agregar soporte para descuentos
  return productos.reduce((total, producto) => {
    return total + producto.precio * producto.cantidad;
  }, 0);
}
```

---

## 📋 Estructura de Commits

### Convenciones de Mensajes

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipo>(<alcance>): <descripción>

[cuerpo opcional]

[footer opcional]
```

### Tipos de Commit

| Tipo       | Descripción                                 | Ejemplo                                      |
| ---------- | ------------------------------------------- | -------------------------------------------- |
| `feat`     | Nueva funcionalidad                         | `feat(caja): agregar reporte mensual`        |
| `fix`      | Corrección de bug                           | `fix(login): corregir validación de email`   |
| `docs`     | Cambios en documentación                    | `docs(readme): actualizar instrucciones`     |
| `style`    | Formato, espacios, etc.                     | `style(components): formatear código`        |
| `refactor` | Refactorización sin cambio de funcionalidad | `refactor(api): simplificar lógica de pagos` |
| `test`     | Agregar o modificar tests                   | `test(mascotas): agregar test de registro`   |
| `chore`    | Mantenimiento                               | `chore(deps): actualizar dependencias`       |
| `perf`     | Mejora de rendimiento                       | `perf(consultas): optimizar query SQL`       |

### Ejemplos de Buenos Commits

```bash
# Feature
git commit -m "feat(ventas): agregar historial de ventas con filtros"

# Fix
git commit -m "fix(caja): corregir cálculo de saldo final"

# Docs
git commit -m "docs(api): documentar endpoints de mascotas"

# Refactor con cuerpo
git commit -m "refactor(components): extraer lógica de formularios

- Crear hook useFormValidation
- Simplificar componentes de formulario
- Mejorar reusabilidad"

# Breaking change
git commit -m "feat(auth)!: migrar a NextAuth v5

BREAKING CHANGE: Requiere actualizar configuración de auth.
Ver guía de migración en docs/MIGRATION.md"
```

### Buenas Prácticas

- ✅ **Usa presente imperativo**: "agregar" no "agregado" ni "agrega"
- ✅ **Primera línea < 72 caracteres**
- ✅ **Descripción clara y concisa**
- ✅ **Un commit = un cambio lógico**
- ✅ **Referencias a issues**: `fix #123` o `closes #456`

---

## 🔍 Pull Requests

### Antes de Enviar

1. ✅ **Actualiza tu rama** con los últimos cambios de `main`
2. ✅ **Ejecuta los tests** (cuando estén disponibles)
3. ✅ **Verifica el build**: `npm run build`
4. ✅ **Revisa tu código**: Elimina console.logs, comentarios innecesarios
5. ✅ **Actualiza la documentación** si es necesario

### Crear Pull Request

```bash
# 1. Push a tu fork
git push origin feature/tu-feature

# 2. En GitHub, crear Pull Request desde tu rama hacia main
```

### Plantilla de Pull Request

```markdown
## Descripción

Breve descripción de los cambios

## Tipo de Cambio

- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación
- [ ] Otro (especificar):

## ¿Cómo se ha probado?

Describe las pruebas realizadas

## Checklist

- [ ] Mi código sigue los estándares del proyecto
- [ ] He realizado una auto-revisión de mi código
- [ ] He comentado áreas difíciles de entender
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan nuevos warnings
- [ ] He agregado tests que prueban mi fix/feature
- [ ] Los tests nuevos y existentes pasan localmente

## Screenshots (si aplica)

Agregar capturas de pantalla de cambios visuales

## Issues Relacionados

Closes #123
Ref #456
```

### Proceso de Revisión

1. **Revisión automática**: CI/CD ejecuta tests y linting
2. **Revisión de código**: Un mantenedor revisará tu PR
3. **Feedback**: Pueden solicitar cambios
4. **Aprobación**: Una vez aprobado, se hará merge

### Responder al Feedback

```bash
# Hacer cambios solicitados
git add .
git commit -m "fix: aplicar feedback del code review"
git push origin feature/tu-feature

# El PR se actualizará automáticamente
```

---

## 🐛 Reportar Bugs

### Antes de Reportar

1. **Busca issues existentes**: Verifica si ya fue reportado
2. **Verifica que sea reproducible**: Confirma el bug en la última versión
3. **Recopila información**: Screenshots, logs, pasos para reproducir

### Plantilla de Bug Report

```markdown
**Descripción del Bug**
Descripción clara y concisa del problema

**Pasos para Reproducir**

1. Ir a '...'
2. Click en '...'
3. Scroll hacia '...'
4. Ver error

**Comportamiento Esperado**
Qué debería suceder

**Comportamiento Actual**
Qué está sucediendo

**Screenshots**
Si aplica, agregar screenshots

**Información del Entorno**

- OS: [e.g. Windows 11, macOS 14]
- Navegador: [e.g. Chrome 120, Firefox 121]
- Versión Node: [e.g. 20.10.0]
- Versión del Proyecto: [e.g. 0.1.0]

**Logs de Error**
```

Pegar logs relevantes aquí

```

**Contexto Adicional**
Cualquier otra información relevante
```

---

## ✨ Proponer Nuevas Funcionalidades

### Plantilla de Feature Request

```markdown
**¿Es tu propuesta relacionada con un problema?**
Una descripción clara del problema. Ej: "Siempre me frustro cuando [...]"

**Describe la solución que te gustaría**
Una descripción clara de lo que quieres que suceda

**Describe alternativas consideradas**
Otras soluciones o features que has considerado

**Mockups/Wireframes**
Si aplica, agregar diseños o diagramas

**Contexto Adicional**
Cualquier otra información relevante

**¿Estás dispuesto a trabajar en esto?**

- [ ] Sí, puedo implementarlo
- [ ] Necesitaría ayuda
- [ ] Solo estoy sugiriendo la idea
```

### Proceso de Aprobación

1. **Discusión**: El equipo discutirá la propuesta
2. **Aprobación**: Si se aprueba, se etiquetará como `approved`
3. **Implementación**: Tú u otro contributor puede trabajar en ello

---

## 🧪 Testing

### Estructura de Tests (Futuro)

```typescript
// __tests__/api/mascotas.test.ts
import { describe, test, expect } from "bun:test";

describe("API de Mascotas", () => {
  test("POST /api/mascotas - debe crear una mascota", async () => {
    const response = await fetch("http://localhost:3000/api/mascotas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: "Max",
        especie: "Perro",
        raza: "Labrador",
      }),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.data.nombre).toBe("Max");
  });

  test("POST /api/mascotas - debe fallar con datos inválidos", async () => {
    const response = await fetch("http://localhost:3000/api/mascotas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: "M", // Muy corto
      }),
    });

    expect(response.status).toBe(400);
  });
});
```

### Ejecutar Tests

```bash
# Ejecutar todos los tests
npm run test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con coverage
npm run test:coverage
```

---

## 📚 Documentación

### Documentar Código

```typescript
/**
 * Registra un nuevo pago en el sistema y lo asocia a una caja abierta
 *
 * @param consulta_id - ID de la consulta relacionada (opcional)
 * @param monto - Monto del pago en formato decimal
 * @param metodo - Método de pago (efectivo, tarjeta, etc.)
 * @returns Objeto Pago con id_pago generado
 * @throws {Error} Si no hay caja abierta o datos inválidos
 *
 * @example
 * const pago = await registrarPago(15, 300.00, 'efectivo');
 * console.log(pago.id_pago); // 42
 */
async function registrarPago(
  consulta_id: number | null,
  monto: number,
  metodo: MetodoPago
): Promise<Pago> {
  // Implementación...
}
```

### Actualizar Documentación

Cuando hagas cambios que afecten:

- **API**: Actualizar `docs/API.md`
- **Base de Datos**: Actualizar `docs/DATABASE.md`
- **Despliegue**: Actualizar `docs/DEPLOYMENT.md`
- **README**: Actualizar `README.md`

---

## 🎉 Reconocimientos

Todos los contributors serán reconocidos en el proyecto:

### Contributors

Gracias a estas personas por sus contribuciones:

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- Automáticamente generado, no editar manualmente -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

---

## 📞 Contacto

¿Tienes preguntas? Contacta:

- **Issues**: [GitHub Issues](https://github.com/PoloBustillo/veterinariaWeb/issues)
- **Discussions**: [GitHub Discussions](https://github.com/PoloBustillo/veterinariaWeb/discussions)
- **Email**: [email del proyecto]

---

## 📄 Licencia

Al contribuir, aceptas que tus contribuciones se licenciarán bajo la misma licencia del proyecto.

---

**¡Gracias por contribuir!** 🙏

Tu ayuda hace que este proyecto sea mejor para todos.
