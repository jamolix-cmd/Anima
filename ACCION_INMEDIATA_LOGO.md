# ⚡ ACCIÓN INMEDIATA - Logo No Actualiza

## 🎯 QUÉ HACER AHORA (5 minutos)

### 1️⃣ VERIFICAR BASE DE DATOS (2 min)

Abre Supabase → SQL Editor → Ejecuta:

```sql
SELECT id, company_name, logo_url 
FROM company_settings;
```

**Resultado:**
- ✅ **HAY una fila** → Continúa al paso 2
- ❌ **NO hay filas** → Ejecuta esto y continúa:
  ```sql
  INSERT INTO company_settings (company_name, city, country) 
  VALUES ('GameBox Service', 'Manizales', 'Colombia');
  ```

---

### 2️⃣ VERIFICAR STORAGE (1 min)

En Supabase → Storage:

- ✅ **Existe bucket `company-assets`** → Continúa al paso 3
- ❌ **NO existe** → [Crear bucket](#crear-bucket-30-segundos)

---

### 3️⃣ PROBAR CON CONSOLA (2 min)

1. Abre tu app
2. **F12** (abrir consola)
3. Ve a **Console**
4. Borra consola (icono 🚫)
5. Inicia sesión como admin
6. Ve a **Configuración**
7. Sube un logo

**¿Qué ves en la consola?**

#### ✅ CASO 1: Logs exitosos
```
✅ ============ LOGO SUBIDO A STORAGE ============
✅ ============ URL GUARDADA EN BD ============
✅ ============ DATOS RECIBIDOS DE BD ============
🖼️ Logo URL: https://...
```

**Problema:** CACHE del navegador
**Solución:** 
- Ctrl + Shift + R (recarga forzada)
- O abrir en ventana incógnito
- Si sigue sin aparecer → borrar caché completo del navegador

---

#### ❌ CASO 2: Error "bucket not found"
```
❌ Error: bucket not found
```

**Solución:** [Crear bucket](#crear-bucket-30-segundos)

---

#### ❌ CASO 3: URL no se guarda
```
✅ Logo subido...
💾 Guardando URL...
❌ Error: new row violates row-level security
```

**Problema:** No tienes permisos de admin
**Solución:**
```sql
-- En SQL Editor
UPDATE profiles
SET role = 'admin'
WHERE email = 'TU_EMAIL@ejemplo.com';
```

Luego cierra sesión y vuelve a entrar.

---

#### ❌ CASO 4: "Logo URL: NO HAY LOGO" después del refresh
```
✅ LOGO SUBIDO...
✅ URL GUARDADA...
🔄 Refrescando...
🖼️ Logo URL: NO HAY LOGO    ← ⚠️ PROBLEMA AQUÍ
```

**Problema:** La URL se perdió en la BD
**Solución:**

1. Verifica permisos:
   ```sql
   SELECT email, role FROM profiles WHERE id = auth.uid();
   ```
   Debe ser `role = 'admin'`

2. Verifica políticas:
   ```sql
   SELECT policyname 
   FROM pg_policies 
   WHERE tablename = 'company_settings';
   ```
   Deben existir 4 políticas (select, insert, update, delete)

3. Si faltan políticas → Ejecuta `database/migrations/database_policies.sql`

---

## 🪣 CREAR BUCKET (30 segundos)

En Supabase:

1. **Storage** (menú izquierdo)
2. **New bucket**
3. Nombre: `company-assets`
4. ✅ Marcar **"Public bucket"** ← ⚠️ IMPORTANTE
5. **Create**

Luego:

1. Click en el bucket `company-assets`
2. **Create folder**
3. Nombre: `logos`
4. **Create**

---

## 📋 CHECKLIST RÁPIDO

- [ ] Ejecuté la consulta SQL de company_settings
- [ ] Hay al menos 1 fila en company_settings
- [ ] El bucket company-assets existe y es PÚBLICO
- [ ] Hay una carpeta logos/ dentro del bucket
- [ ] Mi usuario tiene role = 'admin'
- [ ] Probé subir un logo con la consola abierta (F12)
- [ ] Leí los logs en la consola
- [ ] Identifiqué en qué caso estoy (CASO 1, 2, 3 o 4)

---

## 🆘 SI NADA FUNCIONA

**Lee:** `GUIA_DIAGNOSTICO_LOGO.md` (guía completa paso a paso)

**Ejecuta:** `database/DIAGNOSTICO_LOGO.sql` (todas las consultas)

**Comparte:**
1. Screenshot de la consola (F12)
2. Resultado de `SELECT * FROM company_settings;`
3. Screenshot de Storage mostrando el bucket

---

## ✨ ARCHIVOS DE AYUDA

- **`GUIA_DIAGNOSTICO_LOGO.md`** → Guía completa paso a paso
- **`database/DIAGNOSTICO_LOGO.sql`** → Script SQL de diagnóstico
- **`CAMBIOS_LOGO_DETALLADOS.md`** → Changelog técnico completo

---

**🎬 EMPIEZA POR EL PASO 1** ☝️
