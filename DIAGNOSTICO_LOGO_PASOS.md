# 🔍 DIAGNÓSTICO: Logo No Cambia

## ✅ Pasos para Diagnosticar

### 1️⃣ Verificar que el logo se guardó en la BD
Ejecuta esto en **Supabase SQL Editor**:
```sql
SELECT id, company_name, logo_url, updated_at
FROM company_settings
ORDER BY updated_at DESC
LIMIT 1;
```

**¿Qué debería salir?**
- ✅ Debe mostrar la URL completa del logo: `https://accgsxxauagpzzolysgz.supabase.co/storage/v1/object/public/company-assets/logos/logo-XXXXX.jpeg`
- ❌ Si sale `NULL` o vacío → el logo NO se guardó en la BD

---

### 2️⃣ Verificar que el archivo existe en Storage
1. Abre: https://supabase.com/dashboard/project/accgsxxauagpzzolysgz/storage/buckets/company-assets
2. Entra a la carpeta `logos/`
3. **¿Está tu archivo ahí?** (debe llamarse `logo-NÚMEROS.jpeg` o similar)
   - ✅ Si está → el archivo subió correcto
   - ❌ Si NO está → la subida falló

---

### 3️⃣ Ver los logs de la consola del navegador
Abre la consola de Chrome/Edge (F12) y busca estos mensajes:

**Al subir el logo:**
```
🚀 ============ INICIANDO SUBIDA DE LOGO ============
✅ ============ LOGO SUBIDO A STORAGE ============
📍 URL del archivo subido: [LA URL COMPLETA]
✅ ============ URL GUARDADA EN BD ============
```

**Al cargar la página:**
```
🔄 ============ CARGANDO CONFIGURACIÓN ============
✅ ============ DATOS RECIBIDOS DE BD ============
🖼️ Logo URL: [LA URL COMPLETA O "NO HAY LOGO"]
```

**Pega aquí los logs de tu consola:**
```
[COPIA Y PEGA LOS LOGS AQUÍ]
```

---

## 🔧 SOLUCIONES SEGÚN EL PROBLEMA

### Problema A: El logo NO se guardó en la BD
**Síntoma:** La query SQL muestra `logo_url = NULL`

**Solución:**
1. En Settings, sube el logo de nuevo
2. Verifica en la consola que salga `✅ URL GUARDADA EN BD`
3. Ejecuta el SELECT de nuevo para confirmar

---

### Problema B: El archivo NO está en Storage
**Síntoma:** No ves el archivo en la carpeta `logos/`

**Solución:**
1. Verifica que el bucket `company-assets` existe
2. Verifica que las políticas de Storage están creadas (ejecuta setup_storage.sql de nuevo)
3. Sube el logo nuevamente

---

### Problema C: El logo está en BD y Storage PERO no se ve
**Síntoma:** La URL está guardada, el archivo existe, pero sigue mostrando el logo anterior

**Solución:** Problema de caché del navegador
1. Presiona **Ctrl + Shift + R** (hard refresh)
2. O cierra y abre el navegador de nuevo
3. O prueba en modo incógnito

---

### Problema D: Error "Bucket not found" en la consola
**Síntoma:** Aparece `StorageApiError: Bucket not found`

**Solución:**
1. Ejecuta `setup_storage.sql` de nuevo
2. Verifica que el bucket existe en: https://supabase.com/dashboard/project/accgsxxauagpzzolysgz/storage/buckets

---

## 📝 CHECKLIST DE VERIFICACIÓN

- [ ] ✅ El bucket `company-assets` existe
- [ ] ✅ Las políticas de Storage están creadas
- [ ] ✅ El archivo del logo está en `logos/` folder
- [ ] ✅ La URL del logo está guardada en `company_settings.logo_url`
- [ ] ✅ La consola muestra "✅ URL GUARDADA EN BD"
- [ ] ✅ Hice hard refresh (Ctrl + Shift + R)

---

## 🚀 SI TODO LO ANTERIOR ESTÁ BIEN Y AÚN NO FUNCIONA

Hay un bug en el código. Necesito ver:
1. **Logs completos de la consola** cuando subes el logo
2. **Resultado de la query SQL** de company_settings
3. **Captura de pantalla** de la carpeta logos/ en Storage

Con eso puedo identificar exactamente qué está fallando.
