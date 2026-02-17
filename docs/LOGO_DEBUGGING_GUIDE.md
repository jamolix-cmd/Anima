# 🔍 Guía de Debugging del Sistema de Logos

## Cambios Implementados

### ✅ Correcciones Realizadas

1. **Eliminación correcta del logo anterior**
   - Se corrigió el bug que impedía eliminar logos con parámetros de query
   - Ahora limpia `?t=...` antes de extraer el nombre del archivo
   - Validación de que el nombre del archivo comience con `logo-`

2. **Cache-busting mejorado**
   - Se agregó timestamp dinámico a las URLs en vistas previas
   - Las imágenes ahora cargan con `?t=${Date.now()}` para evitar cache del navegador
   - El base64 para impresión se regenera automáticamente

3. **Logging completo**
   - Cada paso del proceso ahora registra información en consola
   - Fácil identificación de dónde ocurre un problema

4. **Tamaños fijos predeterminados**
   - Login: 200px × 80px
   - Header: 140px × 40px
   - Comanda print: 50mm × 20mm
   - Sticker print: 25mm × 12mm
   - Vistas previas ajustadas proporcionalmente

5. **Eliminación de colores personalizables**
   - Se removió la sección de colores del sistema
   - Los colores predeterminados se mantienen automáticamente

## 📊 Flujo del Sistema

```
1. Usuario selecciona imagen
   └─> Validación de tipo y tamaño
   
2. handleUploadLogo() se ejecuta
   └─> uploadLogo() en el hook
       ├─> Elimina logo anterior (si existe)
       ├─> Sube nuevo logo a Supabase Storage
       └─> Retorna URL pública
   
3. updateSettings() guarda la URL en BD
   └─> fetchSettings() actualiza el estado
   
4. La página se recarga automáticamente
   └─> Todos los componentes cargan el nuevo logo
```

## 🐛 Cómo Debuggear si el Logo NO Cambia

### Paso 1: Abrir la Consola del Navegador

Presiona **F12** y ve a la pestaña **Console**

### Paso 2: Subir un Logo

Verás estos mensajes si todo funciona bien:

```
🚀 Iniciando subida de logo...
📁 Archivo seleccionado: mi-logo.jpg Tamaño: 45.23 KB
🔍 Intentando eliminar logo anterior: logo-1234567890.jpg
✅ Logo anterior eliminado: logo-1234567890.jpg
⬆️ Subiendo nuevo logo: logos/logo-1234567891.jpg
✅ Logo subido exitosamente. URL pública: https://...
💾 Guardando URL en base de datos...
🔧 Actualizando registro existente ID: 1
✅ Configuración actualizada en BD
🔄 Cargando configuración de la empresa...
✅ Configuración cargada: {company_name: '...', logo_url: '...', ...}
✅ URL guardada en base de datos
🔄 Refrescando configuración...
🔃 Recargando página...
```

### Paso 3: Identificar Errores

#### Error: "Bucket not found"

**Solución:** El bucket de Supabase no existe

1. Ve a Supabase Dashboard → Storage
2. Crea un bucket llamado `company-assets`
3. Márcalo como **público**
4. Intenta de nuevo

#### Error: "No se pudo eliminar logo anterior"

**No es crítico** - El logo nuevo se subirá de todos modos

#### Error: No hay mensajes en consola

**Problema:** El JavaScript no se está ejecutando

1. Recarga la página con Ctrl+F5 (recarga dura)
2. Verifica que no haya errores en la pestaña Console
3. Verifica que estés logueado como admin

#### El logo se sube pero no se ve

**Posibles causas:**

1. **Cache del navegador:**
   - Presiona Ctrl+Shift+R para recargar sin cache
   - O abre en modo incógnito

2. **La URL no se guardó en BD:**
   - Verifica en Supabase Dashboard → Table Editor → company_settings
   - Revisa que el campo `logo_url` tenga la URL correcta

3. **Permisos de Storage:**
   - Ve a Supabase Dashboard → Storage → Policies
   - Verifica que haya una política de SELECT pública

### Paso 4: Verificar en la Base de Datos

1. Ve a Supabase Dashboard
2. Table Editor → company_settings
3. Verifica que `logo_url` contenga la URL del nuevo logo
4. La URL debería verse así: `https://[proyecto].supabase.co/storage/v1/object/public/company-assets/logos/logo-[timestamp].jpg`

### Paso 5: Verificar en Supabase Storage

1. Ve a Supabase Dashboard → Storage
2. Bucket: `company-assets` → carpeta `logos`
3. Deberías ver tu archivo `logo-[timestamp].jpg`
4. Haz clic en él y verifica que se pueda ver

## 🔧 Soluciones Rápidas

### Limpiar Cache Manualmente

```javascript
// Ejecuta esto en la consola del navegador
localStorage.clear()
window.location.reload()
```

### Forzar Actualización de Todos los Componentes

```javascript
// En la consola
window.location.href = window.location.href.split('#')[0] + '?t=' + Date.now()
```

### Verificar la Configuración Actual

```javascript
// En la consola, ejecuta:
fetch('https://[tu-proyecto].supabase.co/rest/v1/company_settings', {
  headers: {
    'apikey': '[tu-api-key]',
    'Authorization': 'Bearer [tu-token]'
  }
})
.then(r => r.json())
.then(console.log)
```

## 📍 Ubicaciones del Logo

El logo aparece en estos 5 lugares:

1. **Login** ([Login.tsx](../src/components/Login.tsx))
   - Tamaño: 200px × 80px

2. **Header/Layout** ([Layout.tsx](../src/components/Layout.tsx))
   - Tamaño: 140px × 40px

3. **Comanda (print tirilla)** ([ComandaPreview.tsx](../src/components/ComandaPreview.tsx))
   - Tamaño: 50mm × 20mm

4. **Sticker (print)** ([ComandaPreview.tsx](../src/components/ComandaPreview.tsx))
   - Tamaño: 25mm × 12mm

5. **Múltiples Órdenes** ([MultipleOrdersComandaPreview.tsx](../src/components/MultipleOrdersComandaPreview.tsx))
   - Tamaños variados según vista

## 🆘 Si Nada Funciona

1. **Verifica que eres admin:**
   ```javascript
   // En consola
   console.log(localStorage.getItem('supabase.auth.token'))
   ```

2. **Limpia todo y empieza de nuevo:**
   ```bash
   # En la terminal
   npm run dev
   ```

3. **Revisa las políticas de Supabase:**
   - Ve a Authentication → Policies
   - Verifica que los admins puedan INSERT/UPDATE en company_settings
   - Verifica que los admins puedan INSERT/DELETE en Storage

4. **Últimos recursos:**
   - Cierra el navegador completamente
   - Abre modo incógnito
   - Intenta desde otro navegador
   - Revisa la consola de errores de red (pestaña Network en DevTools)

## 📞 Información para Reporte de Bugs

Si necesitas ayuda, incluye:

1. **Mensajes de la consola** (copia todo el log con Ctrl+A en Console)
2. **Captura de pantalla** del error
3. **URL actual** del logo en company_settings (desde Table Editor)
4. **Tamaño y formato** del archivo que intentas subir
5. **Navegador y versión** (ej: Chrome 120, Firefox 115)

---

**Última actualización:** 2026-02-16
