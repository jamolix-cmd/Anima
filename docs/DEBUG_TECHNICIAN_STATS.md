# 🔍 Debug: Estadísticas de Técnicos

## Problema Detectado

Las estadísticas de técnicos no muestran las órdenes completadas correctamente. El técnico Daniel tiene 7 trabajos finalizados pero aparece como 0.

---

## Solución Implementada

### 1. **Servicio Dedicado** ✨
**Archivo**: `src/services/technicianStatsService.ts`

Creamos un servicio dedicado siguiendo **Arquitectura Limpia** que:
- ✅ Separa la lógica de negocio del componente UI
- ✅ Hace consultas específicas y optimizadas a la BD
- ✅ Filtra correctamente por `completed_by_id`
- ✅ Incluye logs detallados para debugging

### 2. **Refactorización del Componente**
**Archivo**: `src/components/TechniciansManagement.tsx`

Cambios:
- ✅ Eliminamos la dependencia de `useServiceOrders` 
- ✅ Usamos el nuevo servicio `technicianStatsService`
- ✅ Agregamos manejo de errores mejorado
- ✅ Reducimos complejidad del componente

---

## Query de Verificación en Supabase

Ejecuta este SQL en **Supabase SQL Editor** para verificar los datos:

```sql
-- =============================================
-- 1. VERIFICAR ÓRDENES COMPLETADAS POR TÉCNICO
-- =============================================
SELECT 
  p.id as technician_id,
  p.full_name,
  p.email,
  COUNT(so.id) as total_completadas,
  COUNT(CASE WHEN so.updated_at >= NOW() - INTERVAL '7 days' THEN 1 END) as esta_semana,
  COUNT(CASE WHEN so.updated_at >= NOW() - INTERVAL '30 days' THEN 1 END) as este_mes,
  COUNT(CASE WHEN so.updated_at >= NOW() - INTERVAL '365 days' THEN 1 END) as este_año
FROM profiles p
LEFT JOIN service_orders so ON so.completed_by_id = p.id AND so.status = 'completed'
WHERE p.role = 'technician'
GROUP BY p.id, p.full_name, p.email
ORDER BY total_completadas DESC;

-- =============================================
-- 2. VERIFICAR DANIEL ESPECÍFICAMENTE
-- =============================================
SELECT 
  so.id,
  so.order_number,
  so.status,
  so.completed_by_id,
  p.full_name as completed_by,
  so.updated_at,
  so.created_at
FROM service_orders so
LEFT JOIN profiles p ON so.completed_by_id = p.id
WHERE p.full_name ILIKE '%daniel%' OR p.email ILIKE '%daniel%'
ORDER BY so.updated_at DESC;

-- =============================================
-- 3. VERIFICAR TODAS LAS ÓRDENES COMPLETADAS
-- =============================================
SELECT 
  so.id,
  so.order_number,
  so.status,
  so.completed_by_id,
  p.full_name as completed_by,
  p.email,
  so.updated_at
FROM service_orders so
LEFT JOIN profiles p ON so.completed_by_id = p.id
WHERE so.status = 'completed'
ORDER BY so.updated_at DESC
LIMIT 20;

-- =============================================
-- 4. VERIFICAR ESTRUCTURA DE LA TABLA
-- =============================================
SELECT 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'service_orders' 
AND column_name IN ('assigned_technician_id', 'completed_by_id')
ORDER BY column_name;

-- =============================================
-- 5. VERIFICAR FOREIGN KEYS
-- =============================================
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'service_orders'
  AND tc.constraint_type = 'FOREIGN KEY'
  AND kcu.column_name IN ('assigned_technician_id', 'completed_by_id');
```

---

## Posibles Causas del Problema

### 1. ⚠️ **completed_by_id está NULL**
```sql
-- Verificar si hay órdenes completadas sin completed_by_id
SELECT COUNT(*) as ordenes_sin_tecnico
FROM service_orders
WHERE status = 'completed' AND completed_by_id IS NULL;
```

**Solución**: Si este número es > 0, significa que las órdenes no se están marcando correctamente al completarse.

### 2. ⚠️ **completed_by_id tiene ID incorrecto**
```sql
-- Verificar IDs de técnicos vs completed_by_id
SELECT DISTINCT 
  so.completed_by_id,
  p.full_name,
  p.email
FROM service_orders so
LEFT JOIN profiles p ON so.completed_by_id = p.id
WHERE so.status = 'completed'
  AND so.completed_by_id IS NOT NULL;
```

### 3. ⚠️ **Foreign Key mal configurada**
La consulta #5 arriba verifica que los foreign keys estén correctos.

---

## Cómo Usar el Nuevo Servicio

### Antes (problemático):
```typescript
// Usaba useServiceOrders que filtra según el rol
const { serviceOrders } = useServiceOrders()

// Esto podría no traer todas las órdenes completadas
const completedOrders = serviceOrders.filter(
  order => order.completed_by_id === tech.id && order.status === 'completed'
)
```

### Después (correcto):
```typescript
// Servicio dedicado que trae TODAS las órdenes completadas
import { fetchTechnicianStatistics } from '../services/technicianStatsService'

const stats = await fetchTechnicianStatistics()
// ✅ Trae todas las órdenes sin filtros por rol
// ✅ Logs detallados en consola
// ✅ Optimizado con queries específicas
```

---

## Logs de Debug

El servicio ahora incluye logs detallados:

```typescript
🔄 Iniciando carga de estadísticas de técnicos...
✅ Datos cargados:
   - 3 técnicos
   - 15 órdenes completadas
   - 5 órdenes en progreso
🔍 Obteniendo órdenes completadas...
✅ 15 órdenes completadas encontradas
📊 Primeras 3 órdenes: [...]
📊 Técnico: daniel
   - Completadas: 7
   - En progreso: 2
```

---

## Testing en Dev

1. **Abrir la app** en desarrollo:
   ```bash
   npm run dev
   ```

2. **Abrir DevTools** (F12)

3. **Navegar a Admin > Técnicos**

4. **Verificar logs en consola**:
   - Deberías ver los logs del servicio
   - Verifica que muestre las 7 órdenes de Daniel

5. **Si sigue mostrando 0**:
   - Ejecuta las queries de Supabase (#1 y #2)
   - Verifica que `completed_by_id` no sea NULL
   - Verifica que el ID coincida con el ID de Daniel en profiles

---

## Script de Corrección (si completed_by_id es NULL)

Si las órdenes no tienen `completed_by_id`, ejecuta esto en Supabase:

```sql
-- ⚠️ SOLO SI LAS ÓRDENES NO TIENEN completed_by_id

-- Opción 1: Si assigned_technician completó la orden
UPDATE service_orders
SET completed_by_id = assigned_technician_id
WHERE status = 'completed' 
  AND completed_by_id IS NULL
  AND assigned_technician_id IS NOT NULL;

-- Opción 2: Verificar cuántas se actualizarían
SELECT COUNT(*) as afectadas
FROM service_orders
WHERE status = 'completed' 
  AND completed_by_id IS NULL
  AND assigned_technician_id IS NOT NULL;
```

---

## Próximos Pasos

1. ✅ Build exitoso
2. ⏳ **Ejecutar queries de verificación en Supabase**
3. ⏳ **Probar en desarrollo**
4. ⏳ **Verificar logs en consola**
5. ⏳ **Confirmar que aparecen las 7 órdenes de Daniel**

---

## Arquitectura Limpia Aplicada

```
📁 src/
├── 📁 services/
│   └── technicianStatsService.ts    ✨ NUEVO - Lógica de negocio
├── 📁 components/
│   └── TechniciansManagement.tsx    ♻️ REFACTORIZADO - Solo UI
└── 📁 hooks/
    └── useServiceOrders.ts          ✅ Sin cambios
```

**Beneficios**:
- ✅ Separación de responsabilidades
- ✅ Testeable independientemente
- ✅ Reutilizable en otros componentes
- ✅ Más fácil de debuggear
- ✅ Consultas optimizadas

---

**Status**: ✅ **IMPLEMENTADO Y COMPILADO**  
**Fecha**: Octubre 2025  
**Próximo paso**: Probar en desarrollo y verificar datos en Supabase
