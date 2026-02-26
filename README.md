# 🎮 GameBox Service - Sistema de Gestión para Taller de Reparación

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?logo=vite)](https://vite.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Ready-3ECF8E?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)

> Sistema completo de gestión para talleres de servicio técnico de videojuegos, consolas y accesorios. Desarrollado con React, TypeScript, Vite y Supabase (PostgreSQL + Auth).

---

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Demo y Credenciales](#-demo-y-credenciales)
- [Inicio Rápido](#-inicio-rápido)
- [Configuración de Base de Datos](#-configuración-de-base-de-datos)
- [Deployment](#-deployment)
- [Arquitectura](#-arquitectura)
- [Documentación](#-documentación)

---

## ✨ Características Principales

### 🔐 Sistema de Autenticación Multi-Rol
- **3 roles diferenciados**: Admin, Recepcionista, Técnico
- Permisos granulares por funcionalidad
- Navegación dinámica según privilegios
- Protección RLS a nivel de base de datos

### 📋 Gestión Completa de Órdenes
- ✅ **Números de orden únicos** (formato: OS-YYYYMMDD-XXXXXX)
- ✅ **Estados del ciclo de vida**: Pendiente → En Progreso → Completada → Entregada
- ✅ **Sistema de tercerización**: Envío a talleres externos
- ✅ **Tracking completo**: Quién recibió, quién completó, cuándo se entregó
- ✅ **Auto-refresh cada 15 segundos**: Sincronización automática sin recargar
- ✅ **Filtros avanzados**: Por estado, técnico, fecha, cliente

### 🖨️ Sistema de Impresión Profesional
- **Comanda completa**: Documento con todos los dispositivos del cliente
- **Stickers individuales**: Etiquetas para marcar cada dispositivo  
- **Vista previa** antes de imprimir
- **Descarga en PDF** para archivo digital
- **Optimizado para impresoras térmicas** y papel normal

### 👥 Gestión de Clientes
- Búsqueda rápida por cédula
- Historial completo de reparaciones
- Edición y eliminación (solo admin)
- Múltiples dispositivos por cliente
- Información de contacto completa

### 🔧 Cola de Reparaciones
- Vista de trabajos disponibles para técnicos
- Asignación automática al tomar una orden
- Prioridades visuales (Alta, Media, Baja)
- Estadísticas de rendimiento por técnico

### 🏢 Configuración Personalizable
- **Logo dinámico** con caché localStorage (carga instantánea)
- **Favicon y título** dinámicos según empresa
- **Colores personalizables** (primario, secundario)
- **Información de contacto** y redes sociales
- **Campos configurables** en formularios

### 🔄 Sistema de Tercerización
- Gestión de talleres externos
- Seguimiento de reparaciones enviadas
- Estados: Enviado → En Proceso → Listo → Retornado
- Control de costos externos

---

## 🎮 Demo y Credenciales

La aplicación incluye modo demostración con datos de prueba.

### 👑 Administrador
```
Email: admin@gameboxservice.com
Contraseña: gameboxservice123
```
**Permisos**: Acceso completo, configuración, reportes, gestión de usuarios

### 📋 Recepcionista  
```
Email: recepcion@gameboxservice.com
Contraseña: gameboxservice123
```
**Permisos**: Crear órdenes, buscar clientes, marcar entregas

### 🔧 Técnico
```
Email: tecnico@gameboxservice.com
Contraseña: gameboxservice123
```
**Permisos**: Ver y gestionar reparaciones asignadas, completar trabajos

---

## 🚀 Inicio Rápido

### 1. Clonar e Instalar

```bash
git clone https://github.com/tu-usuario/gameboxservice.git
cd gameboxservice
npm install
```

### 2. Ejecutar en Desarrollo

```bash
npm run dev
```

### 3. Acceder
```
http://localhost:5173
```

**Nota**: En modo desarrollo usa datos de demostración. Para producción configura Supabase (ver siguiente sección).

---

## 🗄️ Configuración de Base de Datos

### Opción A: Setup Automático (Recomendado)

Ve a la carpeta [database/](./database/) y sigue los pasos en [README_SETUP.md](./database/README_SETUP.md)

**Resumen**:
1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta `01_init_database.sql` en SQL Editor
3. Ejecuta `02_init_policies.sql` en SQL Editor
4. Ejecuta `03_setup_storage.sql` en SQL Editor
5. Crea tu primer usuario administrador
6. ¡Listo!

### Opción B: Setup Manual

Consulta el archivo [database/README_SETUP.md](./database/README_SETUP.md) para instrucciones detalladas paso a paso.

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Configuration
VITE_APP_NAME=GameBox Service
VITE_APP_VERSION=3.0.0
```

**Dónde encontrar las credenciales**:
- Project Settings → API → Project URL
- Project Settings → API → anon/public key

---

## 🚀 Deployment

### Render (Static Site)

1. Conecta tu repositorio GitHub a Render
2. Configura el servicio:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
3. Agrega variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy automático en cada push

El archivo [`render.yaml`](./render.yaml) ya está configurado para deployment automático.

### Vercel

```bash
npm install -g vercel
vercel
```

O conecta desde el dashboard de Vercel:
- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`

### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

O conecta desde el dashboard de Netlify:
- Build command: `npm run build`
- Publish directory: `dist`

---

## 📐 Arquitectura

```
src/
├── components/           # Componentes React
│   ├── ui/              # Componentes reutilizables (Button, Modal, Card)
│   ├── Login.tsx        # Autenticación
│   ├── Layout.tsx       # Layout principal con sidebar y logo dinámico
│   ├── Dashboard.tsx    # Dashboard por roles con auto-refresh
│   ├── ServiceQueue.tsx # Gestión de órdenes
│   ├── CustomerSearch.tsx # Búsqueda y gestión de clientes
│   ├── CreateOrder.tsx  # Formulario de nueva orden
│   ├── RepairQueue.tsx  # Cola de reparaciones para técnicos
│   └── CompanySettings.tsx # Configuración personalizable
│
├── contexts/            # Contextos React
│   ├── AuthContext.tsx  # Autenticación con Supabase
│   └── RouterContext.tsx # Navegación SPA
│
├── hooks/               # Hooks personalizados
│   ├── useServiceOrders.ts # Gestión de órdenes
│   ├── useCustomers.ts     # Gestión de clientes
│   ├── useCompanySettings.ts # Configuración con caché
│   ├── useAutoRefresh.ts   # Sistema de actualización automática
│   └── useDynamicPageInfo.ts # Favicon y título dinámicos
│
├── types/               # Tipos TypeScript
│   └── index.ts
│
├── lib/                 # Configuración
│   └── supabase.ts      # Cliente Supabase
│
└── database/            # Scripts SQL
    ├── 01_init_database.sql # Tablas, funciones, índices
    ├── 02_init_policies.sql # Políticas RLS
    ├── 03_setup_storage.sql # Bucket para logos
    └── README_SETUP.md      # Guía completa de setup
```

---

## 📚 Documentación

### Arquitectura y Mejores Prácticas
- [📐 ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Arquitectura del sistema
- [✨ BEST_PRACTICES.md](./docs/BEST_PRACTICES.md) - Mejores prácticas
- [♻️ REFACTORING_SUMMARY.md](./docs/REFACTORING_SUMMARY.md) - Resumen de refactorización

### Performance y Optimización
- [📦 BUNDLE_OPTIMIZATION.md](./docs/BUNDLE_OPTIMIZATION.md) - Optimización de bundle
- [📱 RESPONSIVE_COMPLETE.md](./docs/RESPONSIVE_COMPLETE.md) - Diseño responsive

### Características Específicas
- [🎯 LOGO_DINAMICO_COMPLETO.md](./docs/LOGO_DINAMICO_COMPLETO.md) - Sistema de logo dinámico
- [📄 PAGINATION_FEATURE.md](./docs/PAGINATION_FEATURE.md) - Paginación implementada
- [🔒 SECURITY_SUMMARY.md](./docs/SECURITY_SUMMARY.md) - Seguridad y RLS

### Sistema de Configuración
- [⚙️ SISTEMA_CONFIGURACION_PERSONALIZABLE.md](./docs/SISTEMA_CONFIGURACION_PERSONALIZABLE.md) - Configuración personalizable

---

## 🛠️ Tecnologías Utilizadas

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| **Frontend** | React | 18.3 |
| **Lenguaje** | TypeScript | 5.6 |
| **Build Tool** | Vite | 7.1 |
| **Styling** | Tailwind CSS | 4.0 |
| **Backend** | Supabase | Latest |
| **Base de Datos** | PostgreSQL | 15+ |
| **Autenticación** | Supabase Auth | Latest |
| **Storage** | Supabase Storage | Latest |
| **Iconos** | Lucide React | Latest |

---

## 🔒 Seguridad

### Row Level Security (RLS)

Todas las tablas tienen políticas RLS configuradas:

| Acción | Admin | Receptionist | Technician |
|--------|-------|--------------|------------|
| Ver clientes | ✅ | ✅ | ✅ |
| Crear clientes | ✅ | ✅ | ❌ |
| Editar clientes | ✅ | ❌ | ❌ |
| Eliminar clientes | ✅ | ❌ | ❌ |
| Ver órdenes | ✅ Todas | ✅ Todas | ✅ Solo asignadas |
| Crear órdenes | ✅ | ✅ | ❌ |
| Editar órdenes | ✅ | ✅ | ✅ Solo asignadas |
| Eliminar órdenes | ✅ | ❌ | ❌ |
| Ver configuración | ✅ | ✅ | ✅ |
| Editar configuración | ✅ | ❌ | ❌ |

### Características de Seguridad

- ✅ **RLS en todas las tablas**: Políticas a nivel de base de datos
- ✅ **Función SECURITY DEFINER**: Evita recursión infinita en políticas
- ✅ **Validación de roles**: Backend y frontend
- ✅ **Autenticación JWT**: Tokens seguros de Supabase
- ✅ **Caché seguro**: localStorage solo para datos públicos (logo, nombre)

---

## 🎨 Características de Diseño

- ✅ **Responsive Design**: Funciona en móviles, tablets y desktop
- ✅ **Tema Moderno**: Diseño limpio con Tailwind CSS 4.0
- ✅ **Iconografía Consistente**: Lucide React
- ✅ **Estados Visuales**: Colores y badges informativos
- ✅ **UX Intuitivo**: Navegación clara y acciones obvias
- ✅ **Accesibilidad**: Componentes semánticos y accesibles
- ✅ **Optimizado para Impresión**: Comandas y stickers profesionales

---

## 📊 Estadísticas del Proyecto

- **Componentes React**: 25+
- **Hooks Personalizados**: 10+
- **Rutas Principales**: 8
- **Tablas en BD**: 6
- **Políticas RLS**: 25
- **Líneas de Código**: ~15,000
- **Archivos TypeScript**: 50+

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Changelog

### Versión 3.0.0 (2026-02-17)
- ✅ Scripts SQL consolidados en 3 archivos
- ✅ Sistema de caché para logos (carga instantánea)
- ✅ Favicon y título dinámicos
- ✅ Permisos admin-only para clientes
- ✅ Eliminación de recursión RLS
- ✅ Guía de setup simplificada

### Versión 2.0.0 (2026-02-16)
- ✅ Sistema de tercerización completo
- ✅ Tracking de técnicos
- ✅ Campos adicionales (serial_number, observations)
- ✅ Configuración dinámica

### Versión 1.0.0 (2026-02-01)
- ✅ Sistema base de órdenes
- ✅ Gestión de clientes
- ✅ Autenticación multi-rol
- ✅ Sistema de impresión

---

## 📞 Soporte

¿Problemas o preguntas?

1. Revisa la [documentación](./docs/)
2. Consulta [database/README_SETUP.md](./database/README_SETUP.md)
3. Abre un [Issue](https://github.com/tu-usuario/gameboxservice/issues)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

**Desarrollado con ❤️ para talleres de reparación de videojuegos**

🎮 **GameBox Service** - La solución completa para tu taller de reparación


3. **Abrir en el navegador:**
   ```
   http://localhost:5173
   ```

4. **¡Listo!** Usa las credenciales de demostración para probar todas las funcionalidades.

## 📱 **Navegación de la Aplicación**

### **Dashboard Principal**
- Estadísticas según el rol del usuario
- Órdenes recientes
- Acceso rápido a funciones principales

### **Órdenes de Servicio**
- Vista organizada por estados (Pendiente, En Progreso, Completada, Entregada)
- Botón "Nueva Orden" para recepcionistas y admins
- Acciones contextuales para técnicos

### **Búsqueda de Clientes**
- Búsqueda por número de cédula
- Historial completo de reparaciones
- Información de contacto
- Botones de acción para entregas

### **Crear Nueva Orden** (Recepcionistas/Admins)
- Búsqueda automática de cliente por cédula
- Formulario de registro para nuevos clientes
- Detalles completos del dispositivo y problema
- Asignación de prioridades

## 🔄 **Flujo de Trabajo Típico**

### **1. Recepción de Equipo**
1. Recepcionista inicia sesión
2. Crea nueva orden de servicio
3. Busca cliente por cédula (o registra nuevo)
4. **Selecciona modo**: Dispositivo único o múltiples dispositivos
5. **Dispositivo único**: Completa detalles y crea orden
6. **Múltiples dispositivos**: Agrega cada dispositivo a la lista, puede duplicar dispositivos similares
7. **Genera comanda de impresión**:
   - Comanda completa con todos los dispositivos
   - Stickers individuales para marcar cada consola
8. Todas las órdenes entran en cola "Pendiente"

### **2. Asignación y Reparación**
1. Técnico inicia sesión
2. Ve reparaciones disponibles en la cola
3. Toma una reparación (pasa a "En Progreso")
4. Completa la reparación
5. Agrega notas del trabajo realizado
6. Marca como "Completada" - **El sistema registra automáticamente qué técnico la completó**
7. La orden aparece como "Finalizada" con el nombre del técnico visible

### **3. Entrega al Cliente**
1. Recepcionista busca cliente por cédula
2. Ve todas las reparaciones completadas
3. Entrega el equipo al cliente
4. Marca como "Entregada"

## 📊 **Datos de Demostración Incluidos**

La aplicación incluye:
- ✅ **5 clientes** de ejemplo con datos completos
- ✅ **5 órdenes de servicio** en diferentes estados
- ✅ **Historial** de reparaciones realistas
- ✅ **Variedad** de dispositivos (PS5, Xbox, Nintendo Switch, controles)

## 🔮 **Configuración con Supabase Real**

Para usar la aplicación con una base de datos real:

1. **Crear proyecto en [Supabase](https://supabase.com)**
2. **Ejecutar scripts SQL** (incluidos en `/database/setup.sql`)
3. **Configurar variables de entorno** en `.env`:
   ```env
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_clave_anonima
   ```
4. **Cambiar imports** en componentes:
   - De `AuthContextDemo` a `AuthContext`
   - De `useServiceOrdersDemo` a `useServiceOrders`
   - De `useCustomersDemo` a `useCustomers`

## 🏗️ **Arquitectura del Proyecto**

```
src/
├── components/           # Componentes React
│   ├── ui/              # Componentes reutilizables (Button, Input, Card)
│   ├── Login.tsx        # Pantalla de autenticación
│   ├── Layout.tsx       # Layout principal con sidebar
│   ├── Dashboard.tsx    # Dashboard por roles con auto-refresh
│   ├── ServiceQueue.tsx # Gestión de órdenes con actualización automática
│   ├── CustomerSearch.tsx # Búsqueda de clientes
│   ├── CreateOrder.tsx  # Formulario nueva orden
│   ├── AutoRefreshIndicator.tsx # Indicador de actualización automática
│   └── PageRenderer.tsx # Router de páginas
├── contexts/            # Contextos React
│   ├── AuthContextDemo.tsx # Auth con datos locales
│   └── RouterContext.tsx   # Navegación SPA
├── hooks/               # Hooks personalizados
│   ├── useServiceOrdersDemo.ts # Gestión órdenes (demo)
│   ├── useCustomersDemo.ts     # Gestión clientes (demo)
│   ├── useServiceOrders.ts     # Gestión órdenes con Supabase
│   ├── useCustomers.ts         # Gestión clientes con Supabase
│   └── useAutoRefresh.ts       # Sistema de actualización automática
├── data/                # Datos de demostración
│   └── demoData.ts      # Clientes y órdenes de ejemplo
├── types/               # Tipos TypeScript
│   └── index.ts         # Definiciones de tipos
└── lib/                 # Configuración
    └── supabase.ts      # Cliente Supabase
```

## 🎨 **Características de Diseño**

- ✅ **Responsive Design** - Funciona en móviles, tablets y desktop
- ✅ **Tema Moderno** - Diseño limpio con Tailwind CSS
- ✅ **Iconografía Consistente** - Iconos de Lucide React
- ✅ **Estados Visuales** - Colores y badges para estados de órdenes
- ✅ **UX Intuitivo** - Navegación clara y acciones obvias
- ✅ **Accesibilidad** - Componentes accesibles y semánticos
- ✅ **Actualización en Tiempo Real** - Indicadores visuales de sincronización

## 🔄 **Sistema de Auto-Refresh**

### **¿Qué es el Auto-Refresh?**
El sistema de auto-refresh mantiene los datos actualizados automáticamente sin necesidad de recargar la página. Ideal para talleres donde múltiples usuarios trabajan simultáneamente.

### **Características:**
- 🕐 **Actualización cada 15 segundos**: Todos los datos se mantienen frescos
- 👀 **Indicadores visuales**: Muestra la última actualización y el estado de sincronización  
- ⚡ **Sin recargas de página**: Experiencia fluida y rápida
- 🎯 **Selectivo**: Cada componente puede elegir si usar auto-refresh o no
- 🛡️ **Robusto**: Maneja errores de red sin afectar la experiencia del usuario

### **Componentes con Auto-Refresh:**
- **Dashboard**: Estadísticas actualizadas para todos los roles
- **Cola de Reparaciones**: Sincronización automática para técnicos
- **Búsqueda de Clientes**: Información siempre al día
- **Gestión de Órdenes**: Estados actualizados en tiempo real

### **Hooks Disponibles:**
```typescript
// Hook general con auto-refresh personalizable
const { data, loading, lastRefresh } = useServiceOrders(true)

// Hooks específicos - todos con 15 segundos
useServiceOrdersAutoRefresh() // 15 segundos
useGeneralAutoRefresh()       // 15 segundos
useAutoRefresh(callback)      // Personalizable (por defecto 15 segundos)
```

## 🚀 **Despliegue en Producción**

### **Vercel (Recomendado)**
1. Conectar repositorio GitHub a Vercel
2. Configurar variables de entorno de Supabase
3. Deploy automático

### **Netlify**
1. Conectar repositorio GitHub a Netlify  
2. Build command: `npm run build`
3. Publish directory: `dist`

## 🗄️ **Configuración de Base de Datos**

Para habilitar todas las funcionalidades (tracking de técnicos, números de serie, observaciones), ejecuta esta migración en el SQL Editor de Supabase:

```sql
-- Migración para agregar campos de serial number y tracking de técnicos
-- Ejecutar en el SQL Editor de Supabase

-- 1. Agregar columna de número de serie
ALTER TABLE service_orders 
ADD COLUMN serial_number TEXT;

-- 2. Agregar columna para observaciones
ALTER TABLE service_orders 
ADD COLUMN observations TEXT;

-- 3. Agregar columna para técnico que completó la orden
ALTER TABLE service_orders 
ADD COLUMN completed_by_id UUID REFERENCES profiles(id);

-- 4. Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_service_orders_completed_by_id ON service_orders(completed_by_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_serial_number ON service_orders(serial_number);
```

## 🤝 **Próximas Funcionalidades**

- [ ] **Notificaciones push** con Service Workers
- [ ] **Reportes y analíticas** avanzadas
- [ ] **Gestión de inventario** de repuestos
- [ ] **Facturación integrada**
- [ ] **API REST** para integraciones
- [ ] **App móvil** con React Native
- [ ] **WhatsApp integration** para notificaciones
- [ ] **Configuración de intervalos** de auto-refresh por usuario
- [ ] **Websockets** para actualizaciones instantáneas

---

## 🎯 **¿Listo para Producción?**

**¡SÍ!** Esta aplicación está lista para usar en un taller real. Solo necesitas:

1. ✅ **Configurar Supabase** (base de datos gratuita)
2. ✅ **Ejecutar la migración de base de datos** (arriba)
3. ✅ **Cambiar a contextos reales** (líneas ya preparadas)
4. ✅ **Crear usuarios** en la base de datos
5. ✅ **¡Empezar a usar!**

La aplicación ya maneja todos los casos de uso de un taller de reparación de videojuegos y está optimizada para un flujo de trabajo eficiente.

**Desarrollado con ❤️ para talleres de reparación de videojuegos**
    },
  },
])
```
# AnimatecService
"# AnimatecService" 
# AnimatecService
"# AnimatecService" 
"# AnimatecServ" 
"# AnimatecServ" 
# AnimatecService
# AnimatecS
# AnimatecS
