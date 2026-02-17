# 🎨 Sistema de Configuración Personalizable - GameBox Service

## 📋 Descripción General

Se ha implementado un **sistema completo de configuración personalizable** que permite a cada local adaptar el sistema a su marca e información de negocio sin necesidad de modificar código.

## ✨ Características Implementadas

### 🖼️ Logo Personalizado
- Subida de logo propio (JPG, PNG, GIF, WebP)
- Máximo 2MB por archivo
- Preview en tiempo real
- El logo se muestra automáticamente en toda la aplicación

### 🏢 Información Empresarial
- **Datos básicos:**
  - Nombre de la empresa
  - RUC / Cédula Jurídica
  - Descripción del negocio

- **Contacto:**
  - Teléfono
  - Email
  - WhatsApp

- **Ubicación:**
  - Dirección completa
  - Ciudad
  - País

- **Online:**
  - Sitio web
  - Facebook
  - Instagram

- **Operación:**
  - Horarios de atención

### 🎨 Personalización Visual
- Color primario personalizable
- Color secundario personalizable
- Vista previa de colores en tiempo real

## 🚀 Instalación y Configuración

### Paso 1: Ejecutar el Script SQL

1. Abre Supabase Dashboard
2. Ve a **SQL Editor**
3. Ejecuta el script: `database/setup_configuracion_personalizable.sql`

```sql
-- El script automáticamente:
-- ✅ Agrega los nuevos campos a company_settings
-- ✅ Inserta datos iniciales por defecto
-- ✅ Configura las políticas de seguridad
```

### Paso 2: Crear Bucket de Storage

1. Ve a **Storage** en Supabase Dashboard
2. Haz clic en **New bucket**
3. Configura:
   - **Name:** `company-assets`
   - **Public bucket:** ✅ YES
   - **File size limit:** 2 MB
   - **Allowed MIME types:** 
     - image/jpeg
     - image/jpg
     - image/png
     - image/gif
     - image/webp

4. Haz clic en **Create bucket**

### Paso 3: Configurar Políticas de Storage

Después de crear el bucket, ejecuta estas políticas en SQL Editor:

```sql
-- Ver logos públicamente
CREATE POLICY "Ver logos públicamente"
ON storage.objects FOR SELECT
USING (bucket_id = 'company-assets');

-- Solo admins pueden subir logos
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

-- Solo admins pueden actualizar logos
CREATE POLICY "Solo admins pueden actualizar logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'company-assets'
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Solo admins pueden eliminar logos
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

## 📖 Uso del Sistema

### Acceder a Configuración

1. Inicia sesión como **Administrador**
2. En el menú lateral, haz clic en **⚙️ Configuración**
3. Verás el panel de configuración completo

### Subir Logo

1. En la sección "Logo de la Empresa"
2. Haz clic en **"Seleccionar Logo"**
3. Elige tu imagen (máx 2MB)
4. Verás un preview inmediato
5. Haz clic en **"Guardar Logo"**
6. ✅ El logo se actualizará en toda la aplicación

### Editar Información

1. Completa los campos que desees actualizar:
   - Nombre de la empresa
   - Teléfono, email, dirección
   - Redes sociales
   - Horarios
   - etc.

2. Haz clic en **"Guardar Cambios"**
3. Confirma la acción
4. ✅ Los cambios se aplicarán inmediatamente

### Personalizar Colores

1. En la sección "Colores del Sistema"
2. Usa el selector de color o ingresa un código HEX
3. Color Primario: Se usa en botones principales, encabezados
4. Color Secundario: Se usa en elementos secundarios
5. Haz clic en **"Guardar Cambios"**

## 🔒 Seguridad

### Permisos

| Acción | Admin | Recepcionista | Técnico |
|--------|-------|---------------|---------|
| **Ver configuración** | ✅ | ✅ | ✅ |
| **Editar configuración** | ✅ | ❌ | ❌ |
| **Subir logo** | ✅ | ❌ | ❌ |
| **Cambiar colores** | ✅ | ❌ | ❌ |

### Validaciones

- ✅ Solo administradores pueden modificar configuración
- ✅ Tamaño máximo de logo: 2MB
- ✅ Formatos permitidos: JPG, PNG, GIF, WebP
- ✅ Validación de campos obligatorios
- ✅ Confirmación antes de guardar cambios

## 🏗️ Arquitectura Técnica

### Archivos Creados/Modificados

```
📁 database/
  ├── migrations/
  │   └── add_company_settings_fields.sql      [NUEVO]
  └── setup_configuracion_personalizable.sql   [NUEVO]

📁 src/
  ├── components/
  │   ├── Settings.tsx                          [NUEVO]
  │   ├── Layout.tsx                            [MODIFICADO]
  │   └── PageRenderer.tsx                      [MODIFICADO]
  ├── hooks/
  │   ├── useCompanySettings.ts                 [NUEVO]
  │   └── index.ts                              [MODIFICADO]
  └── types/
      └── index.ts                              [MODIFICADO]
```

### Base de Datos

**Tabla:** `company_settings`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID | Identificador único |
| `company_name` | TEXT | Nombre de la empresa |
| `logo_url` | TEXT | URL del logo en storage |
| `primary_color` | TEXT | Color primario (HEX) |
| `secondary_color` | TEXT | Color secundario (HEX) |
| `phone` | TEXT | Teléfono de contacto |
| `email` | TEXT | Email de contacto |
| `address` | TEXT | Dirección física |
| `city` | TEXT | Ciudad |
| `country` | TEXT | País |
| `website` | TEXT | Sitio web |
| `description` | TEXT | Descripción del negocio |
| `facebook_url` | TEXT | URL de Facebook |
| `instagram_url` | TEXT | URL de Instagram |
| `whatsapp_number` | TEXT | Número de WhatsApp |
| `tax_id` | TEXT | RUC/Cédula Jurídica |
| `business_hours` | TEXT | Horarios de atención |
| `created_at` | TIMESTAMP | Fecha de creación |
| `updated_at` | TIMESTAMP | Última actualización |

### Hook: useCompanySettings

```typescript
const {
  settings,        // Configuración actual
  loading,         // Estado de carga
  error,           // Errores
  updateSettings,  // Actualizar configuración
  uploadLogo,      // Subir logo
  refreshSettings  // Refrescar datos
} = useCompanySettings()
```

## 🎯 Casos de Uso

### Caso 1: Nuevo Local
1. Ejecuta el setup SQL
2. Crea el bucket de storage
3. Accede a Configuración
4. Sube tu logo
5. Completa información de tu local
6. ✅ Sistema personalizado listo

### Caso 2: Cambio de Marca
1. Accede a Configuración
2. Sube nuevo logo
3. Actualiza colores corporativos
4. Actualiza información de contacto
5. ✅ Rebrand completo sin código

### Caso 3: Múltiples Sucursales
Cada instancia del sistema puede tener:
- ✅ Su propio logo
- ✅ Su propia información de contacto
- ✅ Sus propios colores
- ✅ Datos independientes por local

## 📊 Beneficios

### Para el Negocio
- 🎨 **Personalización total** sin desarrolladores
- 🏢 **Múltiples locales** con sus propias marcas
- ⚡ **Cambios inmediatos** sin deployments
- 💰 **Ahorro de costos** en mantenimiento

### Para Usuarios
- 👁️ **Marca consistente** en toda la aplicación
- 🎯 **Información actualizada** siempre
- 📱 **Experiencia profesional** personalizada

## ❓ Troubleshooting

### El logo no se ve

**Solución:**
1. Verifica que el bucket `company-assets` existe
2. Verifica que el bucket es PÚBLICO
3. Verifica las políticas de storage
4. Refresca la página (Ctrl + F5)

### No puedo subir el logo

**Posibles causas:**
- ❌ No eres administrador
- ❌ Archivo muy grande (> 2MB)
- ❌ Formato no permitido
- ❌ Bucket no creado
- ❌ Políticas de storage faltantes

### Los cambios no se guardan

**Solución:**
1. Verifica que eres administrador
2. Revisa la consola del navegador
3. Verifica permisos en Supabase
4. Verifica que la tabla existe

## 🔄 Migración desde Sistema Anterior

Si ya tienes el sistema funcionando:

```sql
-- Ejecuta solo la migración
\i database/migrations/add_company_settings_fields.sql

-- Verifica los datos
SELECT * FROM company_settings;
```

## 📝 Notas Importantes

- ⚠️ **Solo UN registro** de configuración por sistema
- 🔒 **Solo administradores** pueden modificar
- 📁 **Bucket público** necesario para logos
- 🎨 **Colores en formato HEX** (#RRGGBB)
- 💾 **Cambios inmediatos** sin cache

## 🎉 ¡Listo!

Ahora tu sistema GameBox Service es completamente personalizable y adaptable a cualquier negocio. Cada local puede tener su propia identidad visual mientras usa el mismo código base.

---

**Desarrollado:** 16 de Febrero, 2026  
**Versión:** 1.0  
**Estado:** ✅ Producción Ready
