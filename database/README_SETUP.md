# 🚀 GameBox Service - Guía de Setup de Base de Datos

## 📋 Tabla de Contenidos
- [Requisitos Previos](#requisitos-previos)
- [Pasos de Instalación](#pasos-de-instalación)
- [Crear Usuario Administrador](#crear-usuario-administrador)
- [Verificación](#verificación)
- [Solución de Problemas](#solución-de-problemas)

---

## ✅ Requisitos Previos

1. **Cuenta de Supabase** activa
2. **Proyecto de Supabase** creado
3. Credenciales del proyecto:
   - URL del proyecto (ej: `https://xxxxx.supabase.co`)
   - Anon/Public Key

---

## 🔧 Pasos de Instalación

### Paso 1: Ejecutar Scripts SQL en Orden

Ve al **SQL Editor** de Supabase (`https://supabase.com/dashboard/project/[PROJECT_ID]/sql/new`)

#### 1️⃣ Inicializar Base de Datos

```sql
-- Ejecutar: database/01_init_database.sql
```

**Este script crea:**
- ✅ 6 Tablas principales (profiles, customers, service_orders, company_settings, external_workshops, external_repairs)
- ✅ 3 Funciones helper (handle_new_user, update_updated_at_column, current_user_role)
- ✅ 7 Triggers automáticos
- ✅ 14 Índices de rendimiento
- ✅ 1 Vista útil (v_external_repairs_full)
- ✅ Configuración inicial de la empresa

**Tiempo estimado:** 10-15 segundos

---

#### 2️⃣ Configurar Políticas de Seguridad

```sql
-- Ejecutar: database/02_init_policies.sql
```

**Este script crea:**
- ✅ 25 Políticas RLS (Row Level Security)
- ✅ Permisos diferenciados por rol (admin, receptionist, technician)
- ✅ Protección contra recursión infinita

**Tiempo estimado:** 5-10 segundos

---

#### 3️⃣ Configurar Storage para Logos

```sql
-- Ejecutar: database/03_setup_storage.sql
```

**Este script crea:**
- ✅ Bucket "company-assets" (público)
- ✅ Límite de 10 MB por archivo
- ✅ Formatos permitidos: JPEG, PNG, GIF, WebP, SVG
- ✅ 4 Políticas de Storage

**Tiempo estimado:** 5 segundos

---

### Paso 2: Crear Usuario Administrador

Ve a **Authentication > Users** en Supabase Dashboard

#### Opción A: Crear desde Dashboard

1. Click en **"Add user"** → **"Create new user"**
2. Email: `admin@tuempresa.com` (o el que prefieras)
3. Password: `TuPasswordSeguro123!`
4. Confirma que el email está verificado (toggle)
5. Click en **"Create user"**

#### Opción B: Crear desde SQL Editor

```sql
-- Opción para crear usuario directamente
-- NOTA: Solo funciona si tienes acceso a la función de creación de usuarios

-- Primero obtén el ID del usuario creado en el paso anterior
-- Luego actualiza su rol:
UPDATE profiles 
SET 
  role = 'admin', 
  full_name = 'Administrador Principal',
  sede = 'Parque Caldas',
  branch_phone = '3116638302'
WHERE email = 'admin@tuempresa.com';
```

---

### Paso 3: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# App Configuration
VITE_APP_NAME=GameBox Service
VITE_APP_VERSION=3.0.0
```

**Dónde encontrar las credenciales:**
1. Ve a **Project Settings** → **API**
2. Copia **Project URL** → `VITE_SUPABASE_URL`
3. Copia **anon public** key → `VITE_SUPABASE_ANON_KEY`

---

## 🧪 Verificación

### 1. Verificar Tablas Creadas

```sql
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

**Deberías ver:**
- ✅ company_settings
- ✅ customers
- ✅ external_repairs
- ✅ external_workshops
- ✅ profiles
- ✅ service_orders

---

### 2. Verificar Políticas RLS

```sql
SELECT 
  tablename,
  COUNT(*) as num_policies,
  '✅' as status
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;
```

**Resultado esperado:**
```
company_settings    | 4
customers           | 4
external_repairs    | 4
external_workshops  | 4
profiles            | 5
service_orders      | 4
```

---

### 3. Verificar Storage

```sql
SELECT 
  id,
  name,
  public,
  file_size_limit,
  '✅' as status
FROM storage.buckets
WHERE id = 'company-assets';
```

**Resultado esperado:**
```
company-assets | company-assets | true | 10485760 | ✅
```

---

### 4. Verificar Usuario Admin

```sql
SELECT 
  id,
  email,
  full_name,
  role,
  '✅' as status
FROM profiles 
WHERE role = 'admin';
```

**Resultado esperado:**
- Deberías ver al menos 1 usuario con rol 'admin'

---

## 🐛 Solución de Problemas

### Error: "relation already exists"

**Causa:** Las tablas ya existen en la base de datos.

**Solución:**
```sql
-- Eliminar todas las tablas y empezar de cero
DROP TABLE IF EXISTS external_repairs CASCADE;
DROP TABLE IF EXISTS external_workshops CASCADE;
DROP TABLE IF EXISTS service_orders CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS company_settings CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Luego vuelve a ejecutar los scripts
```

---

### Error: "infinite recursion detected in policy"

**Causa:** Las políticas antiguas causan recursión.

**Solución:**
```sql
-- Eliminar TODAS las políticas de profiles
DROP POLICY IF EXISTS "Usuarios pueden ver su propio perfil" ON profiles;
DROP POLICY IF EXISTS "Administradores pueden ver todos los perfiles" ON profiles;
-- ... (ejecuta todas las líneas DROP POLICY del archivo 02_init_policies.sql)

-- Luego vuelve a ejecutar: 02_init_policies.sql
```

---

### Error: "bucket already exists"

**Causa:** El bucket company-assets ya existe.

**Solución:** Este error es normal y seguro. El script usa `ON CONFLICT DO UPDATE` para actualizar el bucket existente.

---

### Usuario no puede iniciar sesión

**Causa:** El perfil no tiene el rol correcto.

**Solución:**
```sql
-- Verificar el usuario
SELECT id, email, role FROM profiles WHERE email = 'tu-email@example.com';

-- Si no existe el perfil, créalo
INSERT INTO profiles (id, email, full_name, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'tu-email@example.com'),
  'tu-email@example.com',
  'Tu Nombre',
  'admin'
);

-- Si existe pero tiene rol incorrecto, actualízalo
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'tu-email@example.com';
```

---

## 📦 Deployment a Producción

### Render (Web Service)

1. Conecta tu repositorio de GitHub
2. Configura las variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Build Command: `npm install && npm run build`
4. Start Command: `npm run preview` o usa un static server
5. Deploy!

---

### Vercel / Netlify

1. Conecta tu repositorio
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Agrega variables de entorno
6. Deploy!

---

## 🔒 Seguridad

### Roles y Permisos

| Acción | Admin | Receptionist | Technician |
|--------|-------|--------------|------------|
| Ver clientes | ✅ | ✅ | ✅ |
| Crear clientes | ✅ | ✅ | ❌ |
| Editar clientes | ✅ | ❌ | ❌ |
| Eliminar clientes | ✅ | ❌ | ❌ |
| Ver órdenes | ✅ | ✅ | Solo asignadas |
| Crear órdenes | ✅ | ✅ | ❌ |
| Editar órdenes | ✅ | ✅ | Solo asignadas |
| Eliminar órdenes | ✅ | ❌ | ❌ |
| Ver configuración | ✅ | ✅ | ✅ |
| Editar configuración | ✅ | ❌ | ❌ |
| Gestionar talleres externos | ✅ | ❌ | ❌ |
| Gestionar reparaciones externas | ✅ | ✅ | ❌ |

---

## 📞 Soporte

Si encuentras algún problema:

1. Revisa la sección **Verificación**
2. Consulta **Solución de Problemas**
3. Revisa los logs en Supabase Dashboard → Logs
4. Verifica las políticas RLS activas

---

## 📝 Changelog

### Versión 3.0 (2026-02-17)
- ✅ Scripts consolidados en 3 archivos principales
- ✅ Eliminación de recursión infinita en políticas RLS
- ✅ Permisos admin-only para editar/eliminar clientes
- ✅ Sistema de caché para logos (localStorage)
- ✅ Favicon y título dinámicos
- ✅ Optimización de rendimiento con índices

### Versión 2.0 (2026-02-16)
- ✅ Sistema de tercerización (external_workshops, external_repairs)
- ✅ Campos adicionales en service_orders (serial_number, observations, delivery_notes)
- ✅ Configuración dinámica de empresa

### Versión 1.0 (2026-02-01)
- ✅ Sistema base de órdenes de servicio
- ✅ Gestión de clientes
- ✅ Roles de usuario
- ✅ Configuración personalizable

---

**¡Listo!** Tu base de datos GameBox Service está configurada y lista para usar 🎮🔧
