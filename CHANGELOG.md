# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planeado

- Sistema de notificaciones por email
- Reportes PDF de consultas
- Dashboard con gráficos y estadísticas
- Recordatorios automáticos de citas
- Sistema de inventario con alertas
- Historial médico completo de mascotas
- Tests unitarios y de integración
- Internacionalización (i18n)

## [0.1.0] - 2025-11-19

### Agregado

#### Sistema de Autenticación

- Login y registro de usuarios (clientes y veterinarios)
- Autenticación con NextAuth.js v5
- Protección de rutas según rol de usuario
- Sesiones JWT con duración de 30 días
- Encriptación de contraseñas con bcryptjs

#### Gestión de Mascotas

- Registro de nuevas mascotas
- Edición de información de mascotas
- Visualización de lista de mascotas
- Relación dueño-mascota (principal y acreditados)
- Información detallada: nombre, especie, raza, fecha nacimiento, sexo, color, señas

#### Sistema de Citas y Consultas

- Agendamiento de citas por clientes
- Visualización de citas programadas
- Cancelación de citas
- Gestión de consultas por veterinarios
- Estados de consulta: programada, en_proceso, finalizada, cancelada
- Registro de diagnóstico, tratamiento y observaciones
- Asociación de servicios a consultas
- Registro de uso de insumos en consultas

#### Sistema de Caja

- Apertura de caja con saldo inicial
- Registro de movimientos (ingresos y egresos)
- Cierre de caja con cálculo de saldo final
- Asociación de pagos a caja abierta
- Historial de cajas con detalles
- Listado de pagos pendientes
- Reporte de movimientos de caja

#### Punto de Venta

- Venta de productos con sistema de carrito
- Actualización automática de inventario
- Múltiples métodos de pago: efectivo, tarjeta, transferencia, cheque, depósito
- Historial de ventas con filtros
- Cálculo automático de totales

#### Base de Datos

- Schema completo de PostgreSQL
- 15 tablas principales
- Relaciones bien definidas
- Enumeraciones para estados y tipos
- Índices para optimización de consultas
- Scripts de creación y seed
- Triggers para actualización de inventario

#### API REST

- 30+ endpoints RESTful
- Validación de datos con Zod
- Manejo consistente de errores
- Respuestas JSON estandarizadas
- Autenticación en rutas protegidas

#### Interfaz de Usuario

- Landing page informativa
- Dashboard para clientes
- Dashboard administrativo para veterinarios
- Diseño responsive con Tailwind CSS 4
- Componentes reutilizables
- Iconos con Heroicons y Lucide
- Imágenes optimizadas con Next.js Image

#### Documentación

- README completo con instrucciones
- Documentación de API (API.md)
- Documentación de base de datos (DATABASE.md)
- Guía de despliegue (DEPLOYMENT.md)
- Guía de contribución (CONTRIBUTING.md)
- Changelog
- Archivo .env.example

### Tecnologías Utilizadas

#### Frontend

- Next.js 16.0.1
- React 19.2.0
- TypeScript 5
- Tailwind CSS 4
- Heroicons 2.2.0
- Lucide React 0.552.0

#### Backend

- Next.js API Routes
- Prisma 6.18.0
- NextAuth.js v5 (beta 30)
- Bcryptjs 3.0.2
- Zod 4.1.12

#### Base de Datos

- PostgreSQL 14+
- Prisma ORM

#### Herramientas

- TypeScript
- TSX 4.20.6
- PostCSS
- Bun (opcional)

### Configuración Inicial

- Configuración de Next.js 16
- Configuración de TypeScript estricto
- Configuración de Tailwind CSS 4
- Configuración de Prisma ORM
- Configuración de NextAuth.js
- Middleware de autenticación
- Scripts de base de datos

### Seguridad

- Contraseñas encriptadas con bcrypt
- Validación de datos en API
- Protección CSRF con NextAuth
- Headers de seguridad en Next.js
- Sanitización de inputs
- Roles y permisos de usuario

---

## Tipos de Cambios

- `Added` (Agregado): Para nuevas funcionalidades
- `Changed` (Cambiado): Para cambios en funcionalidades existentes
- `Deprecated` (Obsoleto): Para funcionalidades que se eliminarán pronto
- `Removed` (Eliminado): Para funcionalidades eliminadas
- `Fixed` (Corregido): Para corrección de bugs
- `Security` (Seguridad): Para vulnerabilidades corregidas

---

## [0.1.0] - 2025-11-19

Primera versión funcional del sistema de gestión de clínica veterinaria.

**Desarrollado con ❤️ para la BUAP**

[Unreleased]: https://github.com/PoloBustillo/veterinariaWeb/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/PoloBustillo/veterinariaWeb/releases/tag/v0.1.0
