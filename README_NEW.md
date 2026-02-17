# 🎮 GameBox Service - Sistema de Gestión para Taller de Reparación

<div align="center">

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![React](https://img.shields.io/badge/React-18.3-blue)
![Vite](https://img.shields.io/badge/Vite-7.1-purple)
![License](https://img.shields.io/badge/License-Private-red)

**Sistema completo de gestión para taller de servicio técnico de videojuegos**

[Características](#-características) • [Instalación](#-instalación) • [Uso](#-uso) • [Arquitectura](#-arquitectura) • [Documentación](#-documentación)

</div>

---

## 📋 Tabla de Contenidos

- [Acerca del Proyecto](#-acerca-del-proyecto)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Arquitectura](#-arquitectura)
- [Documentación](#-documentación)
- [Scripts](#-scripts)
- [Contribución](#-contribución)

---

## 🎯 Acerca del Proyecto

GameBox Service es una aplicación web moderna y completa diseñada específicamente para talleres de reparación de consolas y dispositivos de videojuegos. Proporciona gestión integral de órdenes de servicio, seguimiento de reparaciones, y administración de clientes y técnicos.

### ✨ Destacados

- 🔐 Sistema de autenticación con roles (Admin, Recepcionista, Técnico)
- 📱 Interfaz responsive y moderna
- 🔄 Actualización automática en tiempo real
- 🖨️ Sistema de impresión con comandas y stickers
- 📊 Dashboards personalizados por rol
- 🎨 Diseño intuitivo y profesional

---

## 🚀 Características

### 🔐 **Autenticación y Roles**
- Sistema de login seguro
- 3 niveles de acceso: Administrador, Recepcionista, Técnico
- Navegación dinámica según permisos
- Gestión de usuarios e invitaciones

### 📋 **Gestión de Órdenes**
- Creación y seguimiento de órdenes de servicio
- Múltiples dispositivos por cliente
- Estados: Pendiente → En Progreso → Completada → Entregada
- Números de orden únicos: `OS-YYYYMMDD-XXXXXX`
- Historial completo por cliente

### 🔧 **Cola de Reparaciones**
- Vista especializada para técnicos
- Asignación automática y manual
- Tracking de quién completó cada reparación
- Prioridades visuales

### 🖨️ **Sistema de Impresión**
- **Comanda completa**: Documento con todos los dispositivos
- **Stickers individuales**: Etiquetas para marcar cada dispositivo
- Vista previa antes de imprimir
- Exportación a PDF
- Formato optimizado para impresoras térmicas (80mm)

### 🔄 **Auto-Refresh**
- Actualización automática cada 15 segundos
- Indicadores visuales de última actualización
- Optimización inteligente de peticiones

### 👥 **Gestión de Clientes**
- Búsqueda por cédula
- Registro completo de información
- Historial de servicios
- Información de contacto

---

## 🛠️ Tecnologías

### Frontend
- **React 18.3** - Librería UI
- **TypeScript 5.2** - Tipado estático
- **Vite 7.1** - Build tool y dev server
- **Tailwind CSS 3.4** - Estilos utilitarios

### Backend
- **Supabase** - Base de datos PostgreSQL
- **Supabase Auth** - Autenticación
- **Supabase Realtime** - Actualizaciones en tiempo real

### Herramientas de Desarrollo
- **ESLint** - Linting
- **PostCSS** - Procesamiento CSS
- **Lucide React** - Iconos
- **Date-fns** - Manejo de fechas

---

## 📦 Instalación

### Prerrequisitos

- **Node.js 18+**
- **npm** o **yarn**
- **Cuenta de Supabase** (opcional para desarrollo local)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/sling18/GameboxService.git
   cd GameboxService
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```

4. **Editar `.env` con tus credenciales**
   ```env
   VITE_SUPABASE_URL=tu_supabase_url
   VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```

5. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

6. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

---

## ⚙️ Configuración

### Base de Datos

Los scripts SQL para configurar la base de datos están en:

```
database/
├── migrations/           # Scripts de migración
│   ├── database_migration.sql
│   ├── database_policies.sql
│   └── ...
├── setup.sql            # Configuración inicial
└── sample_data.sql      # Datos de ejemplo
```

**Ejecutar en orden:**
1. `setup.sql` - Crea tablas y estructuras
2. `database_policies.sql` - Configura permisos y políticas
3. `sample_data.sql` - (Opcional) Datos de prueba

### Roles y Permisos

El sistema tiene 3 roles principales:

| Rol | Permisos |
|-----|----------|
| **admin** | Acceso completo, gestión de usuarios, configuración |
| **receptionist** | Crear órdenes, buscar clientes, marcar entregas |
| **technician** | Ver cola, tomar reparaciones, completar trabajos |

---

## 🎮 Uso

### Credenciales de Demostración

#### 👑 Administrador
```
Email: admin@gameboxservice.com
Password: gameboxservice123
```

#### 📋 Recepcionista
```
Email: recepcion@gameboxservice.com
Password: gameboxservice123
```

#### 🔧 Técnico
```
Email: tecnico@gameboxservice.com
Password: gameboxservice123
```

### Flujo de Trabajo Típico

1. **Recepción de Cliente** (Recepcionista)
   - Buscar cliente por cédula o crear uno nuevo
   - Crear orden de servicio para cada dispositivo
   - Imprimir comanda y stickers

2. **Reparación** (Técnico)
   - Ver cola de reparaciones disponibles
   - Tomar trabajo (cambia a "En Progreso")
   - Completar con notas detalladas

3. **Entrega** (Recepcionista)
   - Marcar orden como "Entregada"
   - Cliente recoge dispositivo reparado

---

## 🏗️ Arquitectura

### Estructura del Proyecto

```
src/
├── assets/           # Recursos estáticos (logos, imágenes)
├── components/       # Componentes React
│   └── ui/          # Componentes UI reutilizables
├── config/          # Configuraciones
├── constants/       # ✨ Constantes centralizadas
├── contexts/        # React Contexts (Auth, Router)
├── hooks/           # ✨ Custom Hooks reutilizables
├── lib/             # Configuración de librerías (Supabase)
├── types/           # TypeScript type definitions
└── utils/           # ✨ Funciones utilitarias

database/
├── migrations/      # Scripts SQL organizados
└── utils/           # Utilidades SQL

docs/
├── ARCHITECTURE.md          # ✨ Documentación de arquitectura
├── BEST_PRACTICES.md        # ✨ Guía de buenas prácticas
├── REFACTORING_SUMMARY.md   # ✨ Resumen de refactorización
└── REFACTORING_CHECKLIST.md # ✨ Checklist de cambios
```

> **✨ = Agregado en la refactorización reciente**

### Principios Aplicados

- ✅ **DRY** (Don't Repeat Yourself)
- ✅ **SOLID** (Principios de diseño orientado a objetos)
- ✅ **Clean Code** (Código limpio y legible)
- ✅ **Separation of Concerns** (Separación de responsabilidades)

### Componentes Principales

- **Dashboard** - Vista principal por rol
- **ServiceQueue** - Cola de reparaciones
- **CreateOrder** - Creación de órdenes
- **ComandaPreview** - Vista previa e impresión
- **CustomerSearch** - Búsqueda de clientes
- **TechniciansManagement** - Gestión de técnicos (Admin)

---

## 📚 Documentación

### Documentos Disponibles

| Documento | Descripción |
|-----------|-------------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arquitectura detallada del proyecto |
| [BEST_PRACTICES.md](docs/BEST_PRACTICES.md) | Guía de buenas prácticas de desarrollo |
| [REFACTORING_SUMMARY.md](docs/REFACTORING_SUMMARY.md) | Resumen de refactorización reciente |
| [REFACTORING_CHECKLIST.md](docs/REFACTORING_CHECKLIST.md) | Checklist de cambios implementados |

### Mejoras Recientes

**Octubre 2025 - Refactorización Arquitectónica** ✨

- ✅ Eliminación de código duplicado (-83% en componentes principales)
- ✅ Creación de utilidades reutilizables
- ✅ Custom hooks para lógica común
- ✅ Constantes centralizadas
- ✅ Organización de archivos SQL
- ✅ Documentación completa

Ver [REFACTORING_SUMMARY.md](docs/REFACTORING_SUMMARY.md) para detalles completos.

---

## 🔧 Scripts

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo

# Producción
npm run build            # Compila para producción
npm run preview          # Preview de build

# Calidad de Código
npm run lint             # Ejecuta ESLint
npm run type-check       # Verifica tipos TypeScript
```

---

## 🤝 Contribución

### Guía de Contribución

1. **Fork** el proyecto
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Sigue** las guías en [BEST_PRACTICES.md](docs/BEST_PRACTICES.md)
4. **Commit** tus cambios (`git commit -m 'feat: add amazing feature'`)
5. **Push** a la rama (`git push origin feature/AmazingFeature`)
6. **Abre** un Pull Request

### Formato de Commits

```bash
feat: nueva funcionalidad
fix: corrección de bug
refactor: refactorización de código
docs: cambios en documentación
style: cambios de formato
test: agregar o modificar tests
chore: tareas de mantenimiento
```

---

## 📄 Licencia

Este proyecto es privado y está bajo licencia propietaria.

---

## 👥 Equipo

- **Desarrollo**: Equipo GameBox Service
- **Arquitectura**: GitHub Copilot
- **Diseño**: Equipo Interno

---

## 📞 Soporte

Para soporte técnico o preguntas, contacta al equipo de desarrollo.

---

## 🔜 Roadmap

### Corto Plazo
- [ ] Tests unitarios con Jest
- [ ] Tests E2E con Cypress
- [ ] CI/CD con GitHub Actions

### Mediano Plazo
- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push
- [ ] Reportes avanzados

### Largo Plazo
- [ ] App móvil nativa
- [ ] Sistema de inventario
- [ ] Integración con WhatsApp Business

---

## 🙏 Agradecimientos

- React Team por React
- Supabase por su excelente plataforma
- La comunidad open source

---

<div align="center">

**Hecho con ❤️ para talleres de reparación de videojuegos**

[⬆ Volver arriba](#-gamebox-service---sistema-de-gestión-para-taller-de-reparación)

</div>
