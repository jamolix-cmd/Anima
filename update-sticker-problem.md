# Actualización de Stickers - Agregar Descripción del Problema

## ✅ Completado:
1. Vista previa del sticker en React (JSX) - Ya actualizado con el problema

## 🔧 Pendiente - Actualizar templates HTML de impresión:

### Template 1: Impresión Directa del Sticker (líneas ~40-120)
Buscar en ComandaPreview.tsx la línea con este código dentro del `if (viewType === 'sticker')`:

```html
<div class="info">
  <div class="info-line"><strong>ORDEN:</strong> ${order.order_number}</div>
  <div class="info-line"><strong>CLIENTE:</strong> ${customer.full_name.slice(0, 25)}</div>
  <div class="info-line"><strong>TEL:</strong> ${(customer.phone || 'N/A').slice(0, 15)}</div>
  <div class="info-line"><strong>DISPOSITIVO:</strong> ${(order.device_type + ' ' + order.device_brand).slice(0, 22)}</div>
  <div class="info-line"><strong>SERIE:</strong> ${(order.serial_number || 'N/A').slice(0, 20)}</div>
</div>
```

**Reemplazar por:**
```html
<div class="info">
  <div class="info-line"><strong>ORDEN:</strong> ${order.order_number}</div>
  <div class="info-line"><strong>CLIENTE:</strong> ${customer.full_name.slice(0, 20)}</div>
  <div class="info-line"><strong>TEL:</strong> ${(customer.phone || 'N/A').slice(0, 15)}</div>
  <div class="info-line"><strong>DISPOSITIVO:</strong> ${(order.device_type + ' ' + order.device_brand).slice(0, 20)}</div>
  <div class="info-line"><strong>SERIE:</strong> ${(order.serial_number || 'N/A').slice(0, 18)}</div>
  <div class="problem-section">
    <div><strong>PROBLEMA:</strong></div>
    <div class="problem-text">${order.problem_description.slice(0, 80)}${order.problem_description.length > 80 ? '...' : ''}</div>
  </div>
</div>
```

Y agregar estos estilos CSS en el `<style>` del mismo template (después de `.info-line strong {...}`):

```css
.problem-section {
  margin-top: 1mm;
  padding-top: 1mm;
  border-top: 1px solid #ccc;
  font-size: 7.5px;
  line-height: 1.1;
}
.problem-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  max-height: 8mm;
}
```

También reducir tamaño de fuente de `.info` de `9px` a `8.5px` y `.info-line` margin de `1mm` a `0.8mm`.

---

### Template 2: PDF del Sticker (líneas ~290-400)
Hacer los mismos cambios en el segundo template que también tiene `if (viewType === 'sticker')` con instrucciones de PDF.

El template es casi idéntico, solo que tiene una sección adicional con `.instructions` para mostrar cómo guardar el PDF.

---

## Resumen de cambios:
1. ✅ Vista previa JSX actualizada
2. ⏳ Template HTML de impresión directa - Necesita actualización manual
3. ⏳ Template HTML de PDF - Necesita actualización manual

## Instrucciones para el usuario:
Por favor continúa con la siguiente solicitud para que termine de aplicar estos cambios en los templates HTML de impresión.
