# Cambios Realizados - Teléfono Personalizado por Usuario

## Resumen de Cambios

Se ha modificado el sistema para que cada usuario pueda tener su propio número de teléfono de sede que aparecerá en las comandas y stickers que generen.

### ✅ Cambios Implementados

1. **Campo de Teléfono por Usuario**
   - Cada usuario ahora tiene un campo `branch_phone` en su perfil
   - Se puede editar desde "Gestión de Usuarios" en el panel de administración
   - El teléfono aparece junto a la sede del usuario en las comandas

2. **Eliminado del Panel de Control**
   - Se eliminaron los campos de Sede y Teléfono del panel de configuración general
   - Ahora esta información es específica de cada usuario

3. **Comandas Personalizadas**
   - Las comandas ahora muestran la sede y teléfono del usuario que recibió la orden
   - Si el usuario no tiene teléfono configurado, usa "3116638302" por defecto
   - Si el usuario no tiene sede configurada, usa "Parque Caldas" por defecto

### 📁 Archivos Modificados

1. **src/types/index.ts** 
   - Agregado campo `branch_phone` a la interfaz `User`
   - Eliminados campos `branch_name` y `branch_phone` de `CompanySettings`

2. **src/hooks/useUsers.ts**
   - Agregada función `updateUserBranchPhone()` para actualizar el teléfono del usuario

3. **src/components/UserManagement.tsx**
   - Agregada columna "Teléfono" en la tabla de usuarios
   - Botón de edición para modificar el teléfono de cada usuario
   - Estado y handlers para gestionar la edición del teléfono

4. **src/components/Settings.tsx**
   - Eliminados los campos de Nombre de Sede y Teléfono de Sede
   - Restaurado a solo tener el nombre de la empresa

5. **src/components/ComandaPreview.tsx**
   - Actualizado para usar `user.branch_phone` en lugar de valores de configuración
   - Usa el teléfono del usuario que recibió la orden

6. **src/components/MultipleOrdersComandaPreview.tsx**
   - Actualizado para usar `user.branch_phone` del usuario que recibió las órdenes

7. **database/add_branch_fields.sql**
   - Script SQL actualizado para agregar columna `branch_phone` a tabla `profiles`

## 🔧 Instrucciones de Instalación

### Paso 1: Ejecutar Script SQL en Supabase

1. Ve a tu proyecto en Supabase
2. Abre el **SQL Editor**
3. Copia y pega el contenido del archivo `database/add_branch_fields.sql`
4. Ejecuta el script haciendo clic en "Run"

Esto agregará la columna `branch_phone` a la tabla `profiles` con el valor por defecto "3116638302".

### Paso 2: Configurar Teléfonos de Usuarios

1. Inicia sesión en tu aplicación como administrador
2. Ve a **Gestión de Usuarios** (en el menú de administración)
3. Para cada usuario, verás una columna "Teléfono"
4. Haz clic en el botón ✏️ en la columna de Teléfono
5. Escribe el número de teléfono (ej: "3116638302")
6. Haz clic en el botón ✅ (guardar)

### Paso 3: Configurar Sedes de Usuarios (si no están configuradas)

1. En la misma pantalla de **Gestión de Usuarios**
2. Haz clic en el botón ✏️ en la columna "Sede"
3. Escribe el nombre de la sede (ej: "Parque Caldas", "Sanandresito", etc.)
4. Haz clic en el botón ✅ (guardar)

### Paso 4: Verificar

1. Inicia sesión con un usuario que tenga sede y teléfono configurados
2. Crea una nueva orden de servicio
3. Imprime la comanda
4. Verifica que aparezca:
   ```
   SEDE: [Sede del Usuario] - Tel: [Teléfono del Usuario]
   ```

## 💡 Ventajas de este Cambio

### Antes:
- ❌ Un solo teléfono para todos los usuarios
- ❌ No se podía diferenciar entre sedes
- ❌ Configuración global poco flexible

### Ahora:
- ✅ Cada usuario tiene su propio teléfono
- ✅ Perfecto para múltiples sedes con diferentes números
- ✅ Cada usuario en una sede diferente puede tener su teléfono específico
- ✅ Las comandas muestran el teléfono correcto según quién recibió la orden
- ✅ Configuración flexible por usuario

## 🎯 Casos de Uso

**Ejemplo 1: Múltiples Sedes**
- Usuario A (Sede Parque Caldas): Tel. 3116638302
- Usuario B (Sede Sanandresito): Tel. 3147748865
- Usuario C (Sede Norte): Tel. 3201234567

**Ejemplo 2: Mismo Sede, Diferentes Teléfonos**
- Usuario A (Recepcionista - Parque Caldas): Tel. 3116638302
- Usuario B (Técnico - Parque Caldas): Tel. 3116638303 (línea directa)

## 📋 Notas Importantes

- Los valores por defecto son:
  - Sede: "Parque Caldas"
  - Teléfono: "3116638302"
- Cada usuario puede tener valores diferentes
- Las comandas siempre mostrarán la información del usuario que **recibió la orden**
- Si un usuario no tiene configurado sede o teléfono, se usan los valores por defecto
- La configuración es por usuario, no global

## 🔄 Migración

Si ya tienes usuarios existentes:
1. Ejecuta el script SQL (todos tendrán el teléfono por defecto)
2. Ve a Gestión de Usuarios
3. Actualiza el teléfono de cada usuario según corresponda

## ❓ Preguntas Frecuentes

**P: ¿Qué pasa si no configuro el teléfono de un usuario?**
R: Se usará el valor por defecto "3116638302"

**P: ¿Puedo tener el mismo teléfono para varios usuarios?**
R: Sí, puedes asignar el mismo teléfono a múltiples usuarios si es necesario

**P: ¿Dónde aparece este teléfono?**
R: En todas las comandas y stickers que se imprimen, en la línea de SEDE

**P: ¿Puedo cambiar el teléfono en cualquier momento?**
R: Sí, desde Gestión de Usuarios puedes editarlo cuando quieras
