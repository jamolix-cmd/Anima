# 🧪 PRUEBAS DE SEGURIDAD - TEST SUITE

**Proyecto:** GameBox Service  
**Fecha:** 01/10/2025  
**Estado:** Listo para ejecutar  

---

## 🎯 INSTRUCCIONES PARA EJECUTAR PRUEBAS

### Prerrequisitos:
1. Aplicación corriendo en http://localhost:5173/
2. Acceso a Supabase Dashboard
3. Cuenta de prueba de cada rol (admin, receptionist, technician)

---

## ✅ PRUEBAS MANUALES A EJECUTAR

### 🔴 PRUEBA 1: Row Level Security (CRÍTICO)

**Objetivo:** Verificar que RLS está habilitado en Supabase

**Pasos:**
1. Abrir Supabase Dashboard
2. Ir a `Authentication` → `Policies`
3. Verificar cada tabla:
   - ✅ `profiles` - RLS enabled
   - ✅ `customers` - RLS enabled
   - ✅ `service_orders` - RLS enabled

**SQL para verificar:**
```sql
-- Ejecutar en Supabase SQL Editor
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'customers', 'service_orders');
```

**Resultado esperado:** Todas las tablas deben tener `rowsecurity = true`

**Si falla:** Ejecutar:
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;
```

---

### 🟡 PRUEBA 2: Sanitización de Inputs

**Objetivo:** Verificar que inputs maliciosos son bloqueados

**Caso 2.1: XSS Básico**
1. Ir a "Nueva Orden de Servicio"
2. En campo "Nombre Completo" ingresar: `<script>alert('XSS')</script>`
3. Guardar cliente
4. Verificar en dashboard que NO aparece el script

**Resultado esperado:** ✅ Text aparece sin tags HTML

---

**Caso 2.2: HTML Injection**
1. En campo "Observaciones" ingresar: `<img src=x onerror=alert('XSS')>`
2. Guardar orden
3. Ver orden en lista

**Resultado esperado:** ✅ Tag img es removido

---

**Caso 2.3: Data URI (CORREGIDO)**
1. Si hay algún campo URL (futuras features)
2. Ingresar: `data:text/html,<script>alert('XSS')</script>`

**Resultado esperado:** ✅ URL rechazada (vacía)

**Cómo probar:**
```typescript
// Abrir consola del navegador y ejecutar:
import { sanitizeInput } from './utils/sanitization'
console.log(sanitizeInput.url('data:text/html,<script>alert("XSS")</script>'))
// Debe retornar: ''
```

---

### 🟡 PRUEBA 3: Validación de Datos

**Objetivo:** Verificar validaciones funcionan correctamente

**Caso 3.1: Email inválido**
1. Crear nuevo cliente
2. Email: `invalidemail`
3. Intentar guardar

**Resultado esperado:** ❌ "Email inválido"

---

**Caso 3.2: Cédula muy corta**
1. Cédula: `123`
2. Intentar buscar

**Resultado esperado:** ❌ "Cédula inválida (7-15 dígitos)"

---

**Caso 3.3: Cédula con letras**
1. Cédula: `12345abc`
2. Intentar buscar

**Resultado esperado:** ❌ "Cédula inválida (7-15 dígitos)"

---

### 🟢 PRUEBA 4: Manejo de Errores

**Objetivo:** Verificar que errores no exponen información sensible

**Caso 4.1: Error de red**
1. Desconectar internet
2. Intentar crear orden
3. Ver mensaje de error

**Resultado esperado en producción:** 
❌ "Error de conexión. Verifica tu internet e intenta nuevamente."

**NO debe mostrar:**
- Stack traces
- URLs de API
- Tokens
- Detalles internos

---

**Caso 4.2: Error de validación de backend**
1. Intentar crear orden sin campos requeridos

**Resultado esperado:** 
❌ "Por favor, completa todos los campos obligatorios."

---

### 🔴 PRUEBA 5: Protección de Rutas

**Objetivo:** Verificar que roles no pueden acceder a rutas prohibidas

**Caso 5.1: Técnico intenta crear orden**
1. Login como técnico
2. Intentar navegar a `/create-order`

**Resultado esperado:** 
✅ Redirigido a dashboard
✅ Mensaje: "Acceso No Permitido - Los técnicos no pueden crear órdenes"

---

**Caso 5.2: Recepcionista intenta ver gestión de usuarios**
1. Login como recepcionista
2. Intentar acceder a gestión de usuarios

**Resultado esperado:** 
❌ "Acceso Denegado" o no ver la opción

---

### 🟡 PRUEBA 6: Exposición de Datos

**Objetivo:** Verificar que no se exponen datos sensibles en consola

**Caso 6.1: Logs en producción**
1. Abrir herramientas de desarrollador (F12)
2. Ir a pestaña "Console"
3. Navegar por la aplicación

**Resultado esperado en producción:**
✅ NO debe haber `console.log` con datos de clientes
✅ NO debe haber passwords o tokens
✅ Errores deben ser genéricos

**Cómo verificar entorno:**
```javascript
// En consola del navegador:
console.log('DEV mode:', import.meta.env.DEV)
// En producción debe ser: false
```

---

**Caso 6.2: LocalStorage**
1. F12 → Application → Local Storage
2. Ver contenido

**Resultado esperado:**
✅ NO debe haber:
- Passwords
- Datos completos de clientes
- Información sensible sin encriptar

---

### 🟢 PRUEBA 7: SQL Injection (Protegido por Supabase)

**Objetivo:** Verificar que Supabase protege contra SQL injection

**Caso 7.1: SQL en búsqueda de cédula**
1. Buscar cliente con cédula: `'; DROP TABLE customers; --`

**Resultado esperado:**
✅ Cliente no encontrado (busca literal)
✅ NO ejecuta el SQL
✅ Tabla customers intacta

---

### 🟡 PRUEBA 8: Autenticación

**Objetivo:** Verificar flujo de autenticación

**Caso 8.1: Token expirado**
1. Login normal
2. Esperar 1 hora (o manipular token en LocalStorage)
3. Intentar realizar acción

**Resultado esperado:**
❌ "Sesión expirada. Por favor inicia sesión nuevamente."
✅ Redirigido a login

---

**Caso 8.2: Sin autenticación**
1. Borrar LocalStorage
2. Intentar acceder a `/dashboard`

**Resultado esperado:**
✅ Redirigido a login (`/`)

---

## 📊 MATRIZ DE RESULTADOS

Llenar esta tabla al ejecutar las pruebas:

| # | Prueba | Resultado | Notas |
|---|--------|-----------|-------|
| 1 | RLS Habilitado | ⬜ PASS / ⬜ FAIL | |
| 2.1 | XSS Básico Bloqueado | ⬜ PASS / ⬜ FAIL | |
| 2.2 | HTML Injection Bloqueado | ⬜ PASS / ⬜ FAIL | |
| 2.3 | Data URI Bloqueado | ⬜ PASS / ⬜ FAIL | |
| 3.1 | Email Validation | ⬜ PASS / ⬜ FAIL | |
| 3.2 | Cédula Validation | ⬜ PASS / ⬜ FAIL | |
| 4.1 | Error de Red | ⬜ PASS / ⬜ FAIL | |
| 4.2 | Error de Validación | ⬜ PASS / ⬜ FAIL | |
| 5.1 | Técnico en CreateOrder | ⬜ PASS / ⬜ FAIL | |
| 5.2 | Recepcionista en Users | ⬜ PASS / ⬜ FAIL | |
| 6.1 | No Logs en Producción | ⬜ PASS / ⬜ FAIL | |
| 6.2 | No Datos en LocalStorage | ⬜ PASS / ⬜ FAIL | |
| 7.1 | SQL Injection Bloqueado | ⬜ PASS / ⬜ FAIL | |
| 8.1 | Token Expirado | ⬜ PASS / ⬜ FAIL | |
| 8.2 | Sin Autenticación | ⬜ PASS / ⬜ FAIL | |

---

## 🚀 PRUEBAS AUTOMATIZADAS (FUTURO)

### Para implementar con Vitest/Jest:

```typescript
// tests/security/sanitization.test.ts
import { describe, it, expect } from 'vitest'
import { sanitizeInput } from '@/utils/sanitization'

describe('Sanitization - XSS Prevention', () => {
  it('should remove script tags', () => {
    const input = '<script>alert("XSS")</script>'
    expect(sanitizeInput.text(input)).toBe('')
  })
  
  it('should remove HTML tags', () => {
    const input = '<img src=x onerror=alert("XSS")>'
    expect(sanitizeInput.text(input)).toBe('')
  })
  
  it('should block data URIs', () => {
    const input = 'data:text/html,<script>alert("XSS")</script>'
    expect(sanitizeInput.url(input)).toBe('')
  })
  
  it('should block javascript URIs', () => {
    const input = 'javascript:alert("XSS")'
    expect(sanitizeInput.url(input)).toBe('')
  })
  
  it('should allow valid HTTPS URLs', () => {
    const input = 'https://example.com'
    expect(sanitizeInput.url(input)).toBe('https://example.com/')
  })
})

describe('Validation', () => {
  it('should reject invalid emails', () => {
    const result = validators.email('invalidemail')
    expect(result).toBe('Email inválido')
  })
  
  it('should accept valid emails', () => {
    const result = validators.email('test@example.com')
    expect(result).toBeNull()
  })
  
  it('should reject short cedulas', () => {
    const result = validators.cedula('123')
    expect(result).toBe('Cédula inválida (7-15 dígitos)')
  })
  
  it('should accept valid cedulas', () => {
    const result = validators.cedula('12345678')
    expect(result).toBeNull()
  })
})
```

---

## 📝 REPORTE DE RESULTADOS

Al completar las pruebas, crear issue en GitHub con:

```markdown
# Reporte de Pruebas de Seguridad

**Fecha:** [FECHA]
**Ejecutado por:** [NOMBRE]

## Resumen
- Pruebas ejecutadas: X/15
- PASS: X
- FAIL: X

## Detalles

### Vulnerabilidades Encontradas
1. [Descripción]
   - Severidad: Alta/Media/Baja
   - Prueba: #X
   - Acción requerida: [Descripción]

### Fortalezas
- [Lista de aspectos seguros verificados]

## Próximos Pasos
- [ ] Corregir vulnerabilidades críticas
- [ ] Implementar tests automatizados
- [ ] Re-ejecutar pruebas
```

---

## 🎯 CRITERIOS DE APROBACIÓN

Para que la aplicación pase la auditoría de seguridad:

✅ **OBLIGATORIO:**
- RLS habilitado en todas las tablas
- XSS bloqueado (script tags, HTML injection)
- Protección de rutas funcionando
- Errores no exponen información sensible

🟡 **RECOMENDADO:**
- Data URI bloqueado
- Logs limpios en producción
- Validaciones robustas

🟢 **OPCIONAL:**
- Tests automatizados
- Monitoreo de errores (Sentry)
- Rate limiting

---

**Última actualización:** 01/10/2025  
**Próxima auditoría:** Después de Fase 2

