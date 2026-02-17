# 📋 GUÍA: Conectar Proyecto a Nueva Base de Datos Supabase

## 🎯 Objetivo
Conectar el proyecto GameBox Service a una nueva instancia de Supabase para otra tienda.

---

## ✅ PARTE 1: PREPARAR LA BASE DE DATOS EN SUPABASE

### Paso 1.1: Ejecutar la Migración
1. Ve a tu proyecto en Supabase Dashboard (https://app.supabase.com)
2. Navega a **SQL Editor** (icono de base de datos en el menú lateral)
3. Copia todo el contenido del archivo `database/complete_migration.sql`
4. Pégalo en el SQL Editor
5. Haz clic en **Run** (o presiona `Ctrl + Enter`)
6. Espera a que diga: **"✅ Migración completada exitosamente!"**

### Paso 1.2: Crear el Bucket de Storage
1. Ve a **Storage** en el menú lateral de Supabase
2. Haz clic en **Create a new bucket**
3. Configura el bucket:
   - **Name:** `company-assets`
   - **Public bucket:** ✅ **SÍ** (marcar como público)
   - **File size limit:** 2MB
   - **Allowed MIME types:** `image/jpeg, image/png, image/gif, image/webp`
4. Haz clic en **Create bucket**

### Paso 1.3: Configurar Políticas de Storage
1. En **Storage**, selecciona el bucket `company-assets`
2. Ve a la pestaña **Policies**
3. Haz clic en **New Policy** y crea las siguientes:

**Política 1 - Ver logos públicamente:**
```sql
CREATE POLICY "Ver logos públicamente"
ON storage.objects FOR SELECT
USING (bucket_id = 'company-assets');
```

**Política 2 - Solo admins pueden subir logos:**
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

**Política 3 - Solo admins pueden actualizar logos:**
```sql
CREATE POLICY "Solo admins pueden actualizar logos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'company-assets'
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

**Política 4 - Solo admins pueden eliminar logos:**
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

## 🔑 PARTE 2: OBTENER CREDENCIALES DE SUPABASE

### Paso 2.1: Obtener URL y Anon Key
1. En Supabase Dashboard, ve a **Project Settings** (icono de engranaje)
2. Selecciona **API** en el menú lateral
3. Copia los siguientes valores:
   - **Project URL** (ejemplo: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public** key (la clave larga que empieza con `eyJ...`)

📝 **Guarda estos valores en un lugar seguro, los necesitarás en el siguiente paso.**

---

## 💻 PARTE 3: CONFIGURAR EL PROYECTO FRONTEND

### Paso 3.1: Actualizar el archivo .env
1. Abre el archivo `.env` en la raíz de tu proyecto
2. Reemplaza los valores con las credenciales de tu nueva base de datos:

```env
# Configuración de Supabase
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ...tu_clave_completa_aqui
```

⚠️ **IMPORTANTE:** 
- Reemplaza `https://xxxxxxxxxxxxx.supabase.co` con tu Project URL real
- Reemplaza la anon key completa (es una clave muy larga)
- NO compartas estas credenciales públicamente

### Paso 3.2: Verificar la Configuración
El proyecto debería detectar automáticamente las nuevas credenciales. La configuración está en:
- 📄 `src/config/supabase.ts` (lee las variables de entorno)
- 📄 `src/lib/supabase.ts` (cliente de Supabase)

---

## 👤 PARTE 4: CREAR USUARIO ADMINISTRADOR

### Paso 4.1: Crear Usuario en Authentication
1. En Supabase Dashboard, ve a **Authentication** > **Users**
2. Haz clic en **Add user** > **Create new user**
3. Completa los datos:
   - **Email:** admin@tunegocio.com (o el email que prefieras)
   - **Password:** Una contraseña segura
   - **Auto Confirm User:** ✅ **SÍ** (marcar)
4. Haz clic en **Create user**

### Paso 4.2: Asignar Rol de Admin
1. Ve a **SQL Editor** en Supabase
2. Ejecuta este SQL (reemplaza el email con el que creaste):

```sql
UPDATE profiles 
SET role = 'admin', 
    full_name = 'Administrador',
    sede = 'Nombre de tu Sede',
    branch_phone = 'Teléfono de contacto'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@tunegocio.com');
```

3. Verifica que se actualizó correctamente:

```sql
SELECT email, full_name, role, sede FROM profiles WHERE role = 'admin';
```

---

## 🚀 PARTE 5: PROBAR LA CONEXIÓN

### Paso 5.1: Reiniciar el Servidor de Desarrollo
Si tienes el proyecto corriendo, deténlo y vuelve a iniciarlo:

```bash
# Detener el servidor (Ctrl + C)
# Luego iniciar de nuevo
npm run dev
```

### Paso 5.2: Iniciar Sesión
1. Abre el navegador en `http://localhost:5173` (o el puerto que uses)
2. Ve a la página de login
3. Ingresa con el usuario admin que creaste:
   - **Email:** admin@tunegocio.com
   - **Password:** La contraseña que definiste
4. Deberías poder acceder al panel de administración

### Paso 5.3: Verificar Funcionalidades
✅ **Verifica que funcione:**
- Login con el usuario admin
- Crear un cliente nuevo
- Crear una orden de servicio
- Ver el dashboard
- Subir logo de la empresa (Storage)

---

## 🎨 PARTE 6: PERSONALIZAR LA NUEVA TIENDA

### Paso 6.1: Actualizar Configuración de la Empresa
1. Inicia sesión como admin
2. Ve a **Panel de Control** o **Configuración**
3. Actualiza los datos de la nueva tienda:
   - Nombre de la empresa
   - Teléfono
   - Email
   - Dirección
   - Ciudad
   - Logo (sube el logo de la nueva tienda)
   - Colores personalizados

### Paso 6.2: Crear Usuarios Adicionales
1. Ve a **Usuarios** en el panel de administración
2. Crea usuarios para recepcionistas y técnicos
3. Asigna roles apropiadamente
4. Configura sedes si aplica

---

## 📦 PARTE 7: DESPLEGAR PARA PRODUCCIÓN (OPCIONAL)

Si quieres desplegar esta nueva tienda en producción:

### Opción A: Desplegar en Render.com
1. Crea un nuevo servicio en Render.com
2. Conecta tu repositorio
3. Configura las variables de entorno en Render:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Despliega

### Opción B: Desplegar en Netlify/Vercel
1. Crea un nuevo proyecto
2. Conecta tu repositorio
3. Agrega las variables de entorno
4. Despliega

---

## 🔒 SEGURIDAD - MUY IMPORTANTE

### ⚠️ NO Comitear Credenciales
El archivo `.env` **NO** debe subirse a Git. Verifica que esté en `.gitignore`:

```bash
# Verificar que .env está ignorado
cat .gitignore | grep .env
```

Debería mostrar:
```
.env
.env.local
.env.production
```

### 🔐 Archivo .env.example
Para compartir el proyecto sin exponer credenciales, usa `.env.example`:
```env
# Configuración de Supabase
VITE_SUPABASE_URL=tu_supabase_url_aqui
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key_aqui
```

---

## ✅ CHECKLIST COMPLETO

Marca cada paso a medida que lo completes:

- [ ] 1. Ejecutar migración en SQL Editor
- [ ] 2. Crear bucket "company-assets" (público)
- [ ] 3. Configurar 4 políticas de storage
- [ ] 4. Copiar Project URL de Supabase
- [ ] 5. Copiar anon key de Supabase
- [ ] 6. Actualizar archivo .env con nuevas credenciales
- [ ] 7. Crear usuario admin en Authentication
- [ ] 8. Asignar rol admin con SQL
- [ ] 9. Reiniciar servidor de desarrollo
- [ ] 10. Probar login con admin
- [ ] 11. Verificar que funcionen las operaciones básicas
- [ ] 12. Personalizar datos de la empresa
- [ ] 13. Subir logo de la nueva tienda
- [ ] 14. Crear usuarios adicionales (recepcionistas, técnicos)
- [ ] 15. (Opcional) Desplegar a producción

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Problema: "Error de conexión a Supabase"
**Solución:** Verifica que las credenciales en `.env` sean correctas y que empieces con `https://`

### Problema: "No puedo crear órdenes"
**Solución:** Verifica que el usuario tenga rol 'admin' o 'receptionist' ejecutando:
```sql
SELECT email, role FROM profiles;
```

### Problema: "No puedo subir logos"
**Solución:** Verifica que el bucket sea público y que las políticas estén creadas.

### Problema: "La página queda en blanco"
**Solución:** 
1. Abre la consola del navegador (F12)
2. Busca errores en rojo
3. Verifica que el servidor esté corriendo
4. Reinicia el servidor con `npm run dev`

---

## 📞 CONTACTO Y SOPORTE

Si tienes problemas, verifica:
1. Logs de la consola del navegador (F12)
2. Logs del servidor de desarrollo
3. Logs en Supabase Dashboard > Database > Logs

---

**¡Listo! Tu nueva tienda debería estar conectada y funcionando.** 🎉
