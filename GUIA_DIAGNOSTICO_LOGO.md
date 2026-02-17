# 🔍 GUÍA COMPLETA: Resolver Problema del Logo

## 📋 RESUMEN DEL PROBLEMA
El logo se sube correctamente **pero no aparece** en la interfaz después de recargar. Esta guía te ayudará a diagnosticar y resolver el problema paso a paso.

---

## ⚡ SOLUCIÓN RÁPIDA (Prueba esto primero)

### Paso 1: Verificar en Supabase
1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Ve a **SQL Editor**
4. Ejecuta esta consulta:
   ```sql
   SELECT id, company_name, logo_url, updated_at
   FROM company_settings;
   ```
5. **¿Qué debes ver?**
   - ✅ Una fila con datos
   - ✅ `logo_url` debe tener una URL que empiece con `https://...supabase.co/storage/...`
   - ❌ Si `logo_url` es `NULL` → **El problema está en guardar la URL**
   - ❌ Si no hay filas → **No existe configuración, hay que crearla**

### Paso 2: Verificar Storage
1. En Supabase, ve a **Storage**
2. Busca el bucket **"company-assets"**
3. **¿Qué debes ver?**
   - ✅ El bucket existe
   - ✅ El bucket está marcado como **PÚBLICO** (tiene un ícono de ojo abierto)
   - ✅ Hay una carpeta **logos/**
   - ✅ Dentro de `logos/` hay archivos .png o .jpg
   
4. **Si NO existe el bucket** → [Ve a la sección "Crear Bucket"](#crear-bucket)

### Paso 3: Probar Actualización Manual
En SQL Editor, ejecuta (reemplaza con la URL real de tu logo):
```sql
UPDATE company_settings
SET logo_url = 'https://TU_PROYECTO.supabase.co/storage/v1/object/public/company-assets/logos/logo-XXXXXXX.png',
    updated_at = NOW()
WHERE id IS NOT NULL;
```

Luego **refresca tu aplicación** con `Ctrl + Shift + R` (recarga forzada).

**¿El logo apareció?**
- ✅ **SÍ** → El problema es que la aplicación no está guardando la URL correctamente
- ❌ **NO** → El problema es de cache o la URL es incorrecta

---

## 🛠️ DIAGNÓSTICO COMPLETO

### 1️⃣ Ejecutar Script de Diagnóstico

1. Abre el archivo: `database/DIAGNOSTICO_LOGO.sql`
2. Copia TODO el contenido
3. Ve a Supabase → **SQL Editor**
4. Pega el contenido
5. Ejecuta **CADA CONSULTA** una por una (sepáralas con `;`)
6. Lee los resultados y anota cualquier error

### 2️⃣ Verificar Logs en el Navegador

1. **Abre la aplicación** en tu navegador
2. Presiona `F12` para abrir **DevTools**
3. Ve a la pestaña **Console**
4. **Borra la consola** (icono 🚫 o `clear()`)
5. Ve a **Configuración** en tu app
6. Sube un logo nuevo
7. **OBSERVA** la consola - deberías ver esto:

```
🚀 ============ INICIANDO SUBIDA DE LOGO ============
📁 Archivo: mi-logo.png | Tamaño: 45.23 KB
⚙️ Settings actuales: {id: "...", company_name: "...", ...}
🖼️ Logo_url actual: https://... o NO HAY LOGO

✅ ============ LOGO SUBIDO A STORAGE ============
📍 URL del archivo subido: https://...

💾 Guardando URL en base de datos...
🔍 URL que se guardará: https://...

✅ ============ URL GUARDADA EN BD ============

🔄 Refrescando configuración desde BD...

✅ ============ DATOS RECIBIDOS DE BD ============
📊 Data completa: {id: "...", logo_url: "https://...", ...}
🖼️ Logo URL: https://...

📊 ============ ESTADO DESPUÉS DE REFRESH ============
Settings después del refresh: {id: "...", logo_url: "https://...", ...}

🔃 ============ RECARGANDO PÁGINA ============
```

### 3️⃣ Interpretar los Logs

#### ✅ TODO BIEN - Logs correctos:
- ✅ "LOGO SUBIDO A STORAGE" aparece
- ✅ "URL GUARDADA EN BD" aparece
- ✅ "DATOS RECIBIDOS DE BD" muestra el logo_url con la nueva URL
- ✅ "Settings después del refresh" muestra el logo_url actualizado

**Resultado:** Si ves todo esto pero el logo NO aparece → Es un problema de **CACHE**

**Solución:**
1. Ctrl + Shift + Delete → Borrar cache del navegador
2. Cerrar pestaña
3. Abrir en **ventana incógnito**
4. Probar de nuevo

---

#### ❌ PROBLEMA: "Logo URL: NO HAY LOGO" después del refresh

**Causa:** La URL no se está guardando en la base de datos

**Soluciones:**

**A) Verificar permisos de usuario:**
```sql
-- En SQL Editor de Supabase
SELECT id, email, full_name, role
FROM profiles
WHERE email = 'TU_EMAIL_AQUI';
```

El campo `role` **DEBE** ser exactamente `'admin'` (minúsculas).

Si no lo es, corrígelo:
```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'TU_EMAIL_AQUI';
```

**B) Verificar políticas RLS:**
```sql
-- Verificar si RLS permite UPDATE
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'company_settings'
  AND cmd = 'UPDATE';
```

Debe existir una política `company_settings_update_policy`.

Si NO existe, ejecuta esto:
```sql
CREATE POLICY "company_settings_update_policy" ON company_settings
    FOR UPDATE 
    USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
```

---

#### ❌ PROBLEMA: Error "bucket not found" en consola

**Causa:** El bucket `company-assets` no existe

**Solución:** [Ve a "Crear Bucket"](#crear-bucket)

---

#### ❌ PROBLEMA: Error "new row violates row-level security policy"

**Causa:** Las políticas RLS están bloqueando la actualización

**Solución:**

1. Verifica que eres admin:
   ```sql
   SELECT role FROM profiles WHERE id = auth.uid();
   ```

2. Si NO eres admin, conviértete en admin:
   ```sql
   UPDATE profiles
   SET role = 'admin'
   WHERE email = 'TU_EMAIL_AQUI';
   ```

3. Cierra sesión y vuelve a entrar

---

## 🪣 CREAR BUCKET

Si el bucket `company-assets` no existe:

### En Panel de Supabase:

1. Ve a **Storage** (menú izquierdo)
2. Click en **"New bucket"**
3. Nombre: `company-assets`
4. ✅ Marcar **"Public bucket"**
5. Click **"Create bucket"**

### Crear Carpeta logos/:

1. Click en el bucket `company-assets`
2. Click **"Create folder"**
3. Nombre: `logos`
4. Click **"Create"**

### Crear Políticas de Storage:

1. Ve a **Storage** → **Policies**
2. Selecciona `company-assets`
3. Click **"New policy"**

**Política 1: SELECT (público)**
```sql
CREATE POLICY "Ver logos públicamente"
ON storage.objects FOR SELECT
USING (bucket_id = 'company-assets');
```

**Política 2: INSERT (solo admins)**
```sql
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
```

**Política 3: DELETE (solo admins)**
```sql
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

## 🔄 LIMPIAR Y EMPEZAR DE CERO

Si nada funciona, prueba esto:

### 1. Eliminar configuración vieja:
```sql
DELETE FROM company_settings;
```

### 2. Crear configuración fresca:
```sql
INSERT INTO company_settings (
  company_name,
  phone,
  email,
  address,
  city,
  country,
  description,
  business_hours
) VALUES (
  'GameBox Service',
  '+57 XXX XXX XXXX',
  'contacto@gameboxservice.com',
  'Ingrese su dirección',
  'Manizales',
  'Colombia',
  'Centro de reparación de consolas y controles',
  'Lun-Vie: 9AM-6PM, Sáb: 9AM-1PM'
);
```

### 3. Verificar que se creó:
```sql
SELECT * FROM company_settings;
```

### 4. En tu aplicación:
1. Ctrl + Shift + R (recarga forzada)
2. Ve a Configuración
3. Sube el logo de nuevo
4. Observa la consola (F12)

---

## 🆘 SI NADA FUNCIONA

### Verificación Final:

1. **¿Ejecutaste el script de migración?**
   - Archivo: `database/migrations/add_company_settings_fields.sql`
   - Ejecútalo en SQL Editor si no lo has hecho

2. **¿Recompilaste el proyecto?**
   ```powershell
   npm run build
   ```

3. **¿Limpiaste el cache del navegador?**
   - Ctrl + Shift + Delete
   - Marcar "Imágenes y archivos en caché"
   - Click "Borrar datos"

4. **¿Probaste en ventana incógnito?**
   - Ctrl + Shift + N (Chrome)
   - Ctrl + Shift + P (Firefox)

---

## 📸 COMPARTIR LOGS

Si sigues teniendo problemas, comparte:

1. **Screenshot de la consola** (F12 → Console) después de subir el logo
2. **Resultado de esta consulta:**
   ```sql
   SELECT id, company_name, logo_url, updated_at
   FROM company_settings;
   ```
3. **Screenshot del bucket** en Storage mostrando la carpeta logos/

---

## ✅ CHECKLIST COMPLETO

Marca cada item que hayas verificado:

- [ ] El bucket `company-assets` existe y es PÚBLICO
- [ ] La carpeta `logos/` existe dentro del bucket
- [ ] Hay políticas de Storage configuradas
- [ ] Mi usuario tiene `role = 'admin'` en la tabla profiles
- [ ] Las políticas RLS existen para company_settings
- [ ] Ejecuté el script `add_company_settings_fields.sql`
- [ ] La tabla company_settings tiene la columna `logo_url`
- [ ] Al subir un logo, veo los logs correctos en la consola
- [ ] Después de subir, la consulta SQL muestra el logo_url actualizado
- [ ] Borré el cache del navegador
- [ ] Probé en ventana incógnito
- [ ] Recompilé el proyecto con `npm run build`

---

**Si marcaste TODO lo anterior y el logo SIGUE sin aparecer, comparte los logs de consola para análisis detallado.** 🔍
