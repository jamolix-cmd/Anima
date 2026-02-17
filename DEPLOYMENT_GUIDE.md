# 🚀 Guía de Despliegue - GameBox Service

Esta guía te permitirá desplegar GameBox Service en una nueva instancia de Supabase para una nueva tienda.

## 📋 Pre-requisitos

- [ ] Una cuenta de Supabase (gratis o de pago)
- [ ] Acceso al proyecto de React compilado
- [ ] Variables de entorno configuradas

---

## 🗄️ PASO 1: Configurar Base de Datos

### 1.1 Crear Proyecto en Supabase

1. Accede a [Supabase Dashboard](https://app.supabase.com)
2. Crea un nuevo proyecto
3. Anota las credenciales:
   - **Project URL** (ejemplo: `https://xxxxx.supabase.co`)
   - **Project API Key (anon/public)** (clave pública, segura de compartir)

### 1.2 Ejecutar Script de Migración

1. Ve a **SQL Editor** en tu proyecto de Supabase
2. Crea un nuevo query
3. Copia **TODO** el contenido de [`database/complete_migration.sql`](database/complete_migration.sql)
4. Pega en el editor y haz clic en **Run**
5. Verifica que veas el mensaje: `✅ Migración completada exitosamente!`

> ⏱️ La migración debería tardar menos de 30 segundos.

---

## 📦 PASO 2: Configurar Storage para Logos

### 2.1 Crear Bucket

1. Ve a **Storage** en el menú lateral
2. Haz clic en **Create a new bucket**
3. Configura:
   - **Name**: `company-assets`
   - **Public bucket**: ✅ **SÍ** (activar)
   - **File size limit**: `2 MB`
   - **Allowed MIME types**: `image/jpeg, image/png, image/gif, image/webp`
4. Crea el bucket

### 2.2 Configurar Políticas de Storage

1. En **Storage**, selecciona el bucket `company-assets`
2. Ve a la pestaña **Policies**
3. Copia y ejecuta en **SQL Editor** las siguientes políticas:

```sql
-- Política para VER archivos (público)
CREATE POLICY "Ver logos públicamente"
ON storage.objects FOR SELECT
USING (bucket_id = 'company-assets');

-- Política para SUBIR archivos (solo admins)
CREATE POLICY "Solo admins pueden subir logos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'company-assets' 
  AND auth.role() = 'authenticated'
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Política para ACTUALIZAR archivos (solo admins)
CREATE POLICY "Solo admins pueden actualizar logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'company-assets'
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Política para ELIMINAR archivos (solo admins)
CREATE POLICY "Solo admins pueden eliminar logos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'company-assets'
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

---

## 👤 PASO 3: Crear Usuario Administrador

### 3.1 Crear Usuario en Supabase Auth

1. Ve a **Authentication** → **Users**
2. Haz clic en **Add user** → **Create new user**
3. Configura:
   - **Email**: El email del administrador (ej: `admin@gameboxservice.com`)
   - **Password**: Una contraseña segura
   - **Auto Confirm User**: ✅ Activar (para que no necesite confirmar email)
4. Crea el usuario

### 3.2 Asignar Rol de Admin

1. Ve a **SQL Editor**
2. Ejecuta el siguiente SQL (reemplaza el email):

```sql
UPDATE profiles 
SET role = 'admin', 
    full_name = 'Administrador',
    sede = 'Tu Sede Aquí',
    branch_phone = 'Tu Teléfono Aquí'
WHERE id = (SELECT id FROM auth.users WHERE email = 'TU_EMAIL@AQUI.com');
```

Por ejemplo:
```sql
UPDATE profiles 
SET role = 'admin', 
    full_name = 'Carlos Gómez',
    sede = 'Centro Comercial Los Molinos',
    branch_phone = '3201234567'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@gameboxservice.com');
```

3. Verifica que se actualizó:
```sql
SELECT email, role, full_name, sede, branch_phone 
FROM profiles 
WHERE role = 'admin';
```

---

## ⚙️ PASO 4: Configurar Frontend

### 4.1 Actualizar Variables de Entorno

1. En la raíz del proyecto, crea/edita el archivo `.env`:

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-publica-anon-key
```

2. Reemplaza con tus credenciales reales de Supabase

### 4.2 Compilar y Desplegar Frontend

#### Opción A: Despliegue en Render.com (Recomendado)

1. Sube tu código a GitHub
2. Ve a [Render.com](https://render.com) y crea una cuenta
3. Crea un nuevo **Static Site**
4. Conecta tu repositorio de GitHub
5. Configura:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**: Agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`
6. Despliega

#### Opción B: Despliegue en Netlify

1. Sube tu código a GitHub
2. Ve a [Netlify](https://netlify.com) y crea una cuenta
3. Crea un nuevo sitio desde Git
4. Conecta tu repositorio
5. Configura:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**: Agrega las variables de Supabase
6. Despliega

#### Opción C: Despliegue en Vercel

1. Sube tu código a GitHub
2. Ve a [Vercel](https://vercel.com) y crea una cuenta
3. Importa tu repositorio
4. Vercel detectará automáticamente que es un proyecto Vite
5. Agrega las variables de entorno
6. Despliega

---

## ✅ PASO 5: Verificar Instalación

### 5.1 Acceder a la Aplicación

1. Accede a la URL de tu aplicación desplegada
2. Inicia sesión con el usuario admin creado
3. Verifica que puedas acceder al dashboard

### 5.2 Configurar Empresa

1. Ve a **Configuración** (ícono de engranaje)
2. Configura:
   - Nombre de la empresa
   - Logo (subir imagen)
   - Datos de contacto
   - Información de la sede

### 5.3 Crear Usuarios Adicionales

1. Ve a **Gestión de Usuarios** en el panel admin
2. Crea usuarios para:
   - **Recepcionistas** (reciben órdenes, gestionan clientes)
   - **Técnicos** (ven su cola de trabajo, marcan como completado)

---

## 🎯 Funcionalidades Verificadas

Después del despliegue, verifica que funcionan:

- [ ] Login y autenticación
- [ ] Creación de clientes
- [ ] Registro de órdenes de servicio
- [ ] Asignación de técnicos
- [ ] Cola de reparaciones para técnicos
- [ ] Marcado de órdenes como completadas
- [ ] Entrega de órdenes
- [ ] Impresión de comandas
- [ ] Gestión de talleres externos (tercerización)
- [ ] Configuración personalizable
- [ ] Subida de logo

---

## 🔧 Personalización por Tienda

Cada tienda puede personalizar:

### Por Usuario:
- **Sede**: Nombre de la sucursal (ej: "Parque Caldas", "Centro")
- **Teléfono de sede**: Número que aparece en comandas impresas

### Global (Admin):
- **Nombre de empresa**: Aparece en comandas y headers
- **Logo**: Se muestra en el header y comandas
- **Datos de contacto**: Email, teléfono principal, redes sociales
- **Campos obligatorios**: Personalizar qué campos son requeridos
- **Funcionalidades**: Habilitar/deshabilitar tercerización, garantías, etc.

---

## 📞 Soporte

### Problemas Comunes

**Error: "Failed to fetch" al iniciar sesión**
- Verifica que las variables de entorno (`VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`) estén correctas
- Asegúrate de haber reconstruido la aplicación después de cambiar las variables

**No puedo subir el logo**
- Verifica que el bucket `company-assets` exista y sea público
- Verifica que las políticas de storage estén configuradas
- Verifica que tu usuario tenga rol `admin`

**Las comandas no muestran la sede correcta**
- Ve a **Gestión de Usuarios** y edita tu usuario
- Configura el campo **Sede** y **Teléfono**

**No veo las órdenes creadas**
- Verifica las políticas RLS con:
  ```sql
  SELECT * FROM service_orders;
  ```
- Si no devuelve resultados, revisa que la migración se ejecutó correctamente

---

## 🔄 Actualizar a Nueva Versión

Si hay una nueva versión del código con cambios en la base de datos:

1. Ejecuta las migraciones adicionales en **SQL Editor**
2. Reconstruye el frontend con `npm run build`
3. Re-despliega en tu plataforma (Render/Netlify/Vercel)

---

## 📊 Estructura de la Base de Datos

### Tablas Principales

| Tabla | Descripción |
|-------|-------------|
| `profiles` | Usuarios del sistema (admin, receptionist, technician) |
| `customers` | Clientes con cédula única |
| `service_orders` | Órdenes de reparación |
| `company_settings` | Configuración personalizable |
| `external_workshops` | Talleres externos para tercerización |
| `external_repairs` | Seguimiento de reparaciones tercerizadas |

### Relaciones

```
auth.users (Supabase Auth)
    ↓
profiles (usuarios del sistema)
    ↓
service_orders (órdenes de servicio)
    ↓
customers (clientes)
```

---

## 🎉 ¡Listo!

Tu nueva instancia de GameBox Service está lista para usar. Cada tienda tendrá:

✅ Su propia base de datos en Supabase  
✅ Su propia configuración (logo, sede, teléfono)  
✅ Usuarios independientes  
✅ Gestión completa de órdenes de reparación  
✅ Sistema de tercerización opcional  

---

## 📝 Notas Técnicas

- **Supabase Free Tier**: Suficiente para hasta 50,000 usuarios autenticados
- **Base de datos**: PostgreSQL con Row Level Security (RLS)
- **Storage**: 1GB incluido en plan gratuito
- **Límite de requests**: 500,000 al mes en plan gratuito

Para producción, considera:
- Habilitar backups automáticos en Supabase
- Actualizar a un plan de pago si necesitas más capacidad
- Configurar un dominio personalizado
- Habilitar SSL/HTTPS (incluido en Render/Netlify/Vercel)
