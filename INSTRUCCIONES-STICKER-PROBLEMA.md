# 📋 Instrucciones para agregar PROBLEMA al Sticker

## ✅ Ya completado automáticamente:
1. ✅ Badge de SEDE en ServiceQueue.tsx (muestra la sede en las tarjetas de órdenes)
2. ✅ Vista previa del sticker en React/JSX actualizada

## ⚠️ Cambios manuales necesarios en ComandaPreview.tsx:

El archivo tiene 3 ubicaciones donde se define el sticker:
1. **Vista previa JSX** (línea ~590) - ✅ YA ACTUALIZADO
2. **Template impresión directa** (línea ~40-120) - ❌ NECESITA EDICIÓN MANUAL
3. **Template PDF** (línea ~295-395) - ❌ NECESITA EDICIÓN MANUAL

---

## 🛠️ PASO 1: Template de Impresión Directa (línea ~110)

### Buscar este código:
```html
<div class="info">
  <div class="info-line"><strong>ORDEN:</strong> ${order.order_number}</div>
  <div class="info-line"><strong>CLIENTE:</strong> ${customer.full_name.slice(0, 25)}</div>
  <div class="info-line"><strong>TEL:</strong> ${(customer.phone || 'N/A').slice(0, 15)}</div>
  <div class="info-line"><strong>DISPOSITIVO:</strong> ${(order.device_type + ' ' + order.device_brand).slice(0, 22)}</div>
  <div class="info-line"><strong>SERIE:</strong> ${(order.serial_number || 'N/A').slice(0, 20)}</div>
</div>
```

### Reemplazar por:
```html
<div class="info">
  <div class="info-line"><strong>ORDEN:</strong> ${order.order_number}</div>
  <div class="info-line"><strong>CLIENTE:</strong> ${customer.full_name.slice(0, 20)}</div>
  <div class="info-line"><strong>TEL:</strong> ${(customer.phone || 'N/A').slice(0, 15)}</div>
  <div class="info-line"><strong>SERIE:</strong> ${(order.serial_number || 'N/A').slice(0, 18)}</div>
  <div class="problem-section">
    <div><strong>PROBLEMA:</strong></div>
    <div class="problem-text">${order.problem_description.slice(0, 120)}${order.problem_description.length > 120 ? '...' : ''}</div>
  </div>
</div>
```

### Y en el CSS del mismo template (línea ~70), cambiar:
```css
.logo {
  width: 100%;
  max-width: 4cm;  /* CAMBIAR a 3cm */
  height: auto;
  margin: 0 auto 2mm auto;  /* CAMBIAR a 1.5mm */
  display: block;
}
.info {
  flex-grow: 1;
  font-size: 9px;
  line-height: 1.2;  /* CAMBIAR a 1.3 */
  color: #000;
}
.info-line {
  margin-bottom: 1mm;  /* CAMBIAR a 0.8mm */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

### Y agregar DESPUÉS de `.info-line strong {...}`:
```css
.problem-section {
  margin-top: 1.5mm;
  padding-top: 1.5mm;
  border-top: 1px solid #999;
  font-size: 8px;
  line-height: 1.2;
}
.problem-text {
  margin-top: 0.5mm;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  max-height: 12mm;
}
```

---

## 🛠️ PASO 2: Template PDF (línea ~390)

### Hacer LOS MISMOS cambios que en el PASO 1
(El template PDF es casi idéntico al de impresión directa)

---

## 📝 Resumen de cambios:
- ❌ Quitar línea `<div class="info-line"><strong>DISPOSITIVO:</strong>...`
- ✅ Agregar sección `.problem-section` con el problema
- ✅ Logo reducido de 4cm a 3cm
- ✅ Espacio entre logo y contenido reducido de 2mm a 1.5mm
- ✅ Line height aumentado a 1.3 para mejor legibilidad
- ✅ Problema con hasta 120 caracteres (antes 80)
- ✅ Problema puede ocupar hasta 4 líneas (12mm)

---

## 🎯 Resultado final del sticker:
```
┌─────────────────────────────┐
│      [LOGO GAMEBOX]         │  <- Más pequeño (3cm)
├─────────────────────────────┤
│ ORDEN: OS-20251009-123456   │
│ CLIENTE: Juan Perez         │
│ TEL: 555-1234               │
│ SERIE: ABC123XYZ            │
│ ─────────────────────────   │  <- Línea separadora
│ PROBLEMA:                    │
│ No enciende, botones        │
│ pegados, necesita limpieza  │
│ profunda...                 │
└─────────────────────────────┘
```

Formato: 7cm × 5cm
