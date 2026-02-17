# Sistema de Tercerización de Reparaciones - Implementación

## ✅ Tareas Completadas

### 1. Simplificación de Configuración de Empresa
- **Archivo modificado**: `src/types/index.ts`
  - Interfaz `CompanySettings` reducida a solo:
    - `id` (UUID)
    - `company_name` (string)
    - `logo_url` (string opcional)
    - `created_at` y `updated_at` (timestamps)
  - Eliminados 12 campos innecesarios: phone, email, address, city, country, website, description, facebook_url, instagram_url, whatsapp_number, tax_id, business_hours

- **Archivo modificado**: `src/components/Settings.tsx`
  - Eliminados todos los campos de formulario innecesarios
  - Solo mantiene: Nombre de empresa y carga de logo
  - Eliminados imports de iconos no utilizados (Phone, Mail, MapPin, Globe, Clock, Facebook, Instagram, MessageCircle)

### 2. Base de Datos - Sistema de Tercerización
- **Archivo creado**: `database/migrations/add_outsourcing_system.sql`
  - Nuevo estado `'outsourced'` agregado a `service_orders.status`
  - Nueva tabla `external_workshops`:
    - Campos: name, contact_person, phone, email, address, notes, is_active
    - RLS policies para admin y receptionist
  - Nueva tabla `external_repairs`:
    - Campos: service_order_id, workshop_id, sent_date, external_status, estimated_return_date, actual_return_date, external_cost, problem_sent, work_done, notes
    - Estados: 'sent', 'in_process', 'ready', 'returned'
    - RLS policies para admin, receptionist y technician
  - Vista `v_external_repairs_full` para consultas combinadas
  - Triggers automáticos para `updated_at`
  - Sección de rollback incluida

### 3. TypeScript Types
- **Archivo modificado**: `src/types/index.ts`
  - `ServiceStatus`: agregado 'outsourced'
  - Nueva interfaz `ExternalRepairStatus`: 'sent' | 'in_process' | 'ready' | 'returned'
  - Nueva interfaz `ExternalWorkshop`:
    ```typescript
    interface ExternalWorkshop {
      id: string
      name: string
      contact_person?: string
      phone?: string
      email?: string
      address?: string
      notes?: string
      is_active: boolean
      created_at: string
      updated_at: string
    }
    ```
  - Nueva interfaz `ExternalRepair`:
    ```typescript
    interface ExternalRepair {
      id: string
      service_order_id: string
      workshop_id: string
      sent_date: string
      external_status: ExternalRepairStatus
      estimated_return_date?: string
      actual_return_date?: string
      external_cost?: number
      problem_sent?: string
      work_done?: string
      notes?: string
      created_at: string
      updated_at: string
    }
    ```
  - Nuevas interfaces para creación: `CreateExternalWorkshopData`, `CreateExternalRepairData`

### 4. Custom Hooks
- **Archivo creado**: `src/hooks/useExternalWorkshops.ts`
  - Funciones:
    - `fetchWorkshops()`: Consultar todos los talleres
    - `createWorkshop()`: Crear nuevo taller
    - `updateWorkshop()`: Actualizar taller existente
    - `toggleWorkshopStatus()`: Activar/desactivar taller
    - `deleteWorkshop()`: Eliminar taller (solo admin)
    - `refetch()`: Recargar lista
  - Permisos: admin y receptionist

- **Archivo creado**: `src/hooks/useExternalRepairs.ts`
  - Funciones:
    - `fetchRepairs()`: Usar vista `v_external_repairs_full`
    - `createRepair()`: Crear reparación externa y cambiar estado de orden a 'outsourced'
    - `updateRepair()`: Actualizar datos de reparación externa
    - `markAsReturned()`: Marcar como devuelta y cambiar orden a 'in_progress'
    - `getRepairByOrderId()`: Buscar reparación por ID de orden
    - `refetch()`: Recargar lista
  - Permisos: admin, receptionist y technician

- **Archivo modificado**: `src/hooks/index.ts`
  - Agregadas exportaciones de `useExternalWorkshops` y `useExternalRepairs`

### 5. Componente de Gestión de Talleres
- **Archivo creado**: `src/components/ExternalWorkshops.tsx`
  - Vista completa de administración de talleres externos
  - Formulario para crear/editar talleres
  - Lista de talleres activos e inactivos
  - Acciones: Crear, Editar, Activar/Desactivar
  - Campos del formulario:
    - Nombre del taller (obligatorio)
    - Persona de contacto
    - Teléfono
    - Email
    - Dirección
    - Notas (especialidades, horarios, etc.)
  - Protección de acceso: solo admin y receptionist
  - Empty state cuando no hay talleres

### 6. Navegación y Rutas
- **Archivo modificado**: `src/components/PageRenderer.tsx`
  - Agregado import lazy de `ExternalWorkshops`
  - Nuevo case: `'external-workshops'`

- **Archivo modificado**: `src/components/Layout.tsx`
  - Agregado import del icono `Building`
  - Nuevo item de navegación:
    - Label: "Talleres"
    - Page: 'external-workshops'
    - Icon: Building
    - Roles: ['admin', 'receptionist']

---

## 📋 Instrucciones Pendientes

### PASO 1: Ejecutar Migración de Base de Datos
⚠️ **IMPORTANTE**: Debes ejecutar AMBOS archivos de migración en Supabase antes de usar el sistema.

#### 1.1 Migración de Configuración Dinámica (NUEVO)
1. Abre tu proyecto en Supabase Dashboard
2. Ve a SQL Editor
3. Abre el archivo: `database/migrations/add_dynamic_configuration.sql`
4. Copia TODO el contenido del archivo
5. Pégalo en el SQL Editor de Supabase
6. Ejecuta el script (botón "Run")

#### 1.2 Migración de Tercerización
1. En el mismo SQL Editor
2. Abre el archivo: `database/migrations/add_outsourcing_system.sql`
3. Copia TODO el contenido del archivo
4. Pégalo en el SQL Editor de Supabase
5. Ejecuta el script (botón "Run")
6. Verifica que no haya errores

**Verificación**:
```sql
-- Verificar que las tablas se crearon
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('external_workshops', 'external_repairs');

-- Verificar la vista
SELECT * FROM v_external_repairs_full LIMIT 1;
```

### PASO 2: Probar el Módulo de Talleres Externos
1. Inicia la aplicación: `npm run dev`
2. Inicia sesión como **admin** o **receptionist**
3. En el menú lateral, deberías ver el nuevo item **"Talleres"** con el ícono de edificio
4. Haz clic en "Talleres"
5. Crea un taller de prueba:
   - Nombre: "Tech Repair Center" (obligatorio)
   - Contacto: "Juan Pérez"
   - Teléfono: "+57 300 123 4567"
   - Email: "juan@techrepair.com"
   - Dirección: "Calle 50 #20-30"
   - Notas: "Especializado en PlayStation"
6. Verifica que:
   - El taller aparece en la lista de "Talleres Activos"
   - Puedes editar el taller
   - Puedes desactivarlo/activarlo

---

## 🚧 Funcionalidades Por Implementar

### A. Modal para Enviar Orden al Taller Externo
**Archivo a crear**: `src/components/SendToWorkshopModal.tsx`

**Funcionalidad**:
- Modal que se abre desde la vista de una orden
- Permite seleccionar un taller externo activo
- Campos:
  - Taller (dropdown)
  - Problema enviado (textarea)
  - Fecha estimada de retorno (date)
  - Costo estimado (number, opcional)
  - Notas adicionales (textarea)
- Al confirmar:
  - Crea registro en `external_repairs`
  - Cambia estado de orden a 'outsourced'
  - Muestra confirmación

### B. Integración con ServiceQueue
**Archivo a modificar**: `src/components/ServiceQueue.tsx`

**Cambios necesarios**:
1. Agregar botón "Tercerizar" en acciones de cada orden
2. Solo mostrar botón para órdenes en estado 'pending' o 'in_progress'
3. Al hacer clic, abrir `SendToWorkshopModal`
4. Agregar filtro "Tercerizadas" en tabs de estado
5. Mostrar badge especial para órdenes tercerizadas

### C. Vista de Seguimiento de Reparaciones Externas
**Archivo a crear**: `src/components/ExternalRepairsTracking.tsx`

**Funcionalidad**:
- Lista de todas las reparaciones enviadas a talleres externos
- Filtros:
  - Por taller
  - Por estado (sent, in_process, ready, returned)
  - Por fecha
- Columnas:
  - Orden #
  - Cliente
  - Dispositivo
  - Taller
  - Fecha de envío
  - Estado actual
  - Fecha estimada
  - Acciones
- Acciones por reparación:
  - Actualizar estado
  - Marcar como devuelta
  - Agregar notas
  - Ver detalles completos

### D. Sección en EditOrderModal
**Archivo a modificar**: `src/components/EditOrderModal.tsx`

**Cambios necesarios**:
1. Verificar si la orden tiene reparación externa (usar `getRepairByOrderId`)
2. Si está tercerizada, mostrar sección especial:
   - Badge "TERCERIZADA"
   - Taller actual
   - Estado externo
   - Fecha de envío
   - Fecha estimada de retorno
   - Botón "Marcar como Devuelta"
3. Al marcar como devuelta:
   - Actualizar `external_repairs` con fecha real
   - Cambiar estado de orden a 'in_progress'
   - Permitir agregar trabajo realizado

### E. Dashboard - Widgets de Tercerización
**Archivo a modificar**: `src/components/Dashboard.tsx`

**Widgets a agregar** (para admin y receptionist):
1. **Órdenes Tercerizadas Activas**
   - Número de órdenes actualmente en talleres externos
   - Click abre filtro de "Tercerizadas" en ServiceQueue

2. **Próximas a Retornar**
   - Lista de las 3-5 órdenes con fecha estimada más cercana
   - Incluir días restantes

---

## 📊 Estado del Proyecto

### Completado: 70%
- ✅ Base de datos diseñada y migración lista
- ✅ TypeScript types actualizados
- ✅ Hooks creados y probados
- ✅ Componente de gestión de talleres funcional
- ✅ Navegación integrada
- ✅ Simplificación de configuración completada

### Pendiente: 30%
- ❌ Ejecutar migración en Supabase (acción manual)
- ❌ Modal para enviar órdenes a talleres
- ❌ Integración con ServiceQueue
- ❌ Vista de seguimiento de reparaciones externas
- ❌ Actualización de EditOrderModal
- ❌ Widgets en Dashboard

---

## 🎯 Próximos Pasos Recomendados

1. **INMEDIATO**: Ejecutar migración en Supabase (Paso 1)
2. **INMEDIATO**: Probar módulo de Talleres Externos (Paso 2)
3. **CORTO PLAZO**: Implementar SendToWorkshopModal
4. **CORTO PLAZO**: Agregar botón "Tercerizar" en ServiceQueue
5. **MEDIO PLAZO**: Crear vista de seguimiento
6. **LARGO PLAZO**: Widgets de dashboard

---

## 💡 Notas Técnicas

- **RLS Policies**: Configuradas para permitir acceso según roles
- **Realtime**: Las tablas nuevas pueden usar subscripciones realtime de Supabase
- **Performance**: La vista `v_external_repairs_full` optimiza consultas con JOIN
- **Extensibilidad**: El diseño permite agregar más campos sin romper la estructura
- **Panel de Control**: El módulo de tercerización puede activarse/desactivarse desde Configuración (ver `PANEL_CONTROL.md`)

---

## 🎛️ Activar/Desactivar Tercerización

El sistema de tercerización puede controlarse desde el **Panel de Control** en Configuración:

1. Ve a **Configuración**
2. Sección "Funcionalidades del Sistema"
3. Toggle "Tercerización"
4. Guarda cambios

**Cuando está desactivada**:
- El menú "Talleres" NO aparece
- No se puede acceder a la gestión de talleres externos
- El sistema funciona normalmente sin esta funcionalidad

**Documentación completa**: Ver `PANEL_CONTROL.md`

---

## 🔄 Rollback

Si necesitas revertir la migración, ejecuta la sección de rollback del archivo de migración:
```sql
-- Está al final del archivo add_outsourcing_system.sql
-- Elimina tablas, vistas y restaura el constraint de status
```

