# 📍 DÓNDE SE VEN LOS CAMBIOS DE INFORMACIÓN DE LA EMPRESA

## ✅ CAMPOS QUE SÍ SE MUESTRAN ACTUALMENTE

### 1. **LOGO** 🖼️
El logo se muestra en **4 lugares principales**:

#### a) **Pantalla de Login**
- **Archivo:** `src/components/Login.tsx`
- **Ubicación:** Centro superior de la pantalla de inicio de sesión
- **Tamaño:** 200px × 80px
- **Se actualiza:** Automáticamente al cambiar el logo en Configuración

#### b) **Header/Navegación** (todas las páginas)
- **Archivo:** `src/components/Layout.tsx`
- **Ubicación:** Esquina superior izquierda (navbar)
- **Tamaño:** 140px × 40px
- **Se actualiza:** Automáticamente al cambiar el logo en Configuración
- **Clickeable:** Sí, lleva al Dashboard

#### c) **Comandas de Servicio** (impresión)
- **Archivo:** `src/components/ComandaPreview.tsx`
- **Ubicación:** 
  - **Comanda completa (tirilla 80mm):** Header centrado, 50mm × 20mm
  - **Vista previa:** 180px × 72px
- **Se actualiza:** Automáticamente al cambiar el logo
- **Uso:** Cuando imprimes o descargas una comanda

#### d) **Stickers de Consola** (impresión)
- **Archivo:** `src/components/ComandaPreview.tsx`
- **Ubicación:** 
  - **Sticker impreso (7cm × 5cm):** Superior centrado, 25mm × 12mm
  - **Vista previa:** 100px × 48px
- **Se actualiza:** Automáticamente al cambiar el logo
- **Uso:** Para pegar en las consolas/controles que reciben

#### e) **Impresión de Múltiples Órdenes**
- **Archivo:** `src/components/MultipleOrdersComandaPreview.tsx`
- **Ubicación:** Header de cada comanda
- **Se actualiza:** Automáticamente al cambiar el logo

---

### 2. **NOMBRE DE LA EMPRESA** 🏢
El nombre de la empresa se usa en:

#### a) **Pantalla de Login**
- **Ubicación:** Alt text del logo
- **Campo usado:** `company_name`
- **Por defecto:** "GameBox Service"

#### b) **Header/Navegación**
- **Ubicación:** Alt text del logo
- **Campo usado:** `company_name`

#### c) **Comandas y Stickers**
- **Ubicación:** Alt text del logo en impresiones
- **Campo usado:** `company_name`

---

## ⚠️ CAMPOS QUE NO SE MUESTRAN (están guardados pero no visibles)

Los siguientes campos **se guardan en la base de datos** cuando los editas en Configuración, pero **NO se muestran** en ninguna parte del sistema actualmente:

### ❌ No se usan actualmente:

| Campo | Guardado | Visible | Sugerencia de uso |
|-------|----------|---------|-------------------|
| **Teléfono** | ✅ Sí | ❌ No | Footer de comandas |
| **Email** | ✅ Sí | ❌ No | Footer de comandas |
| **Dirección** | ✅ Sí | ❌ No | Footer de comandas |
| **Ciudad** | ✅ Sí | ❌ No | Footer de comandas |
| **País** | ✅ Sí | ❌ No | Footer de comandas |
| **Sitio Web** | ✅ Sí | ❌ No | Footer de comandas |
| **Descripción** | ✅ Sí | ❌ No | About/Acerca de |
| **Facebook** | ✅ Sí | ❌ No | Footer de comandas |
| **Instagram** | ✅ Sí | ❌ No | Footer de comandas |
| **WhatsApp** | ✅ Sí | ❌ No | Footer de comandas |
| **NIT/RUC** | ✅ Sí | ❌ No | Footer de comandas |
| **Horario** | ✅ Sí | ❌ No | Footer de comandas |

---

## 💡 SUGERENCIAS PARA USAR LA INFORMACIÓN GUARDADA

### Opción 1: Agregar Footer a las Comandas

Actualmente las comandas solo dicen "CONSERVE ESTE COMPROBANTE" en el footer. Podrías agregar:

```
CONSERVE ESTE COMPROBANTE

GameBox Service - Manizales, Colombia
📞 +57 XXX XXX XXXX
📧 contacto@gameboxservice.com
🌐 www.gameboxservice.com
💬 WhatsApp: +57 XXX XXX XXXX

Lun-Vie: 9AM-6PM, Sáb: 9AM-1PM

Síguenos: @gameboxservice
```

**Beneficio:** Clientes tienen toda tu información de contacto en la comanda.

---

### Opción 2: Página "Acerca de" o "Información"

Crear una nueva página en el sistema que muestre:
- Descripción de la empresa
- Información de contacto completa
- Horarios de atención
- Redes sociales

**Beneficio:** Los usuarios pueden ver la información de la empresa sin salir del sistema.

---

### Opción 3: Personalizar Email de Notificaciones

Si en el futuro implementas notificaciones por email, usar:
- Logo de la empresa
- Información de contacto
- Firma personalizada

---

## 🔄 CÓMO PROBAR LOS CAMBIOS

### Para el LOGO:

1. **Ve a Configuración** (icono de engranaje)
2. **Sube un nuevo logo** en "Logo de la Empresa"
3. **Espera 1 segundo** (se recarga automáticamente)
4. **Verifica en:**
   - ✅ El header (arriba a la izquierda)
   - ✅ Cierra sesión y mira el login
   - ✅ Ve a Órdenes → Vista Previa de una orden → Verás el nuevo logo

### Para INFORMACIÓN DE CONTACTO:

1. **Ve a Configuración**
2. **Llena los campos** (teléfono, email, dirección, etc.)
3. **Click en "Guardar Cambios"**
4. **Los datos se guardan en la base de datos** ✅
5. **PERO:** No se mostrarán en ninguna parte aún ⚠️

**Estos datos están listos para usarse cuando los conectes a las vistas.**

---

## 📊 ARCHIVOS CLAVE

| Función | Archivo | Qué hace |
|---------|---------|----------|
| **Configuración (Admin)** | `src/components/Settings.tsx` | Panel donde editas logo e info |
| **Login** | `src/components/Login.tsx` | Muestra logo y nombre |
| **Header** | `src/components/Layout.tsx` | Muestra logo en navegación |
| **Comandas** | `src/components/ComandaPreview.tsx` | Impresiones con logo |
| **Múltiples Órdenes** | `src/components/MultipleOrdersComandaPreview.tsx` | Batch de comandas |
| **Hook de Settings** | `src/hooks/useCompanySettings.ts` | Carga datos de BD |
| **Tipos** | `src/types/index.ts` | Define estructura CompanySettings |

---

## 🎯 RESUMEN RÁPIDO

### ✅ Lo que SÍ funciona ahora:
- **Logo:** Se ve en Login, Header, Comandas, Stickers
- **Nombre:** Alt text en todas las imágenes

### 💾 Lo que se guarda pero no se muestra:
- Teléfono, Email, Dirección, Ciudad, País
- Website, Facebook, Instagram, WhatsApp
- NIT/RUC, Horario de atención, Descripción

### 🔧 Para mostrar esa información:
Necesitas **editar los archivos** donde quieres que aparezca (principalmente `ComandaPreview.tsx` para agregar footer con datos de contacto).

---

## 🚀 ¿QUIERES AGREGAR LOS DATOS AL FOOTER DE LAS COMANDAS?

Si quieres que el **teléfono, email, dirección, etc.** aparezcan en las comandas impresas, puedo hacer esa modificación ahora mismo. Solo dime:

1. **¿Qué datos quieres mostrar?** (teléfono, email, WhatsApp, redes sociales, etc.)
2. **¿Dónde?** (footer de comandas, footer de stickers, o ambos)
3. **¿Formato deseado?** (una línea, varias líneas, con iconos, etc.)

---

**Última actualización:** 16 de Febrero de 2026
