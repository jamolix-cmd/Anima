# 📁 Estructura del Proyecto - GameBox Service

## 🏗️ Arquitectura

Este proyecto sigue una arquitectura modular y escalable basada en React + TypeScript con Supabase como backend.

## 📂 Estructura de Carpetas

```
src/
├── assets/              # Recursos estáticos (imágenes, logos)
├── components/          # Componentes de React
│   ├── ui/             # Componentes UI reutilizables
│   └── ...             # Componentes de funcionalidad
├── config/             # Configuraciones de la aplicación
├── constants/          # Constantes y valores estáticos
├── contexts/           # React Contexts (Auth, Router, etc.)
├── hooks/              # Custom Hooks reutilizables
├── lib/                # Bibliotecas y configuraciones externas
├── types/              # TypeScript type definitions
└── utils/              # Funciones utilitarias

database/
├── migrations/         # Scripts SQL de migración
└── utils/              # Utilidades SQL
```

## 🔧 Utilidades Centralizadas

### **utils/**
Funciones utilitarias reutilizables organizadas por dominio:

- `imageConverter.ts` - Conversión de imágenes a base64
- `printHelpers.ts` - Funciones auxiliares para impresión
- `orderNumber.ts` - Generación de números de orden
- `index.ts` - Barrel export para imports limpios

### **hooks/**
Custom hooks para lógica reutilizable:

- `useImageToBase64` - Conversión de imágenes con estado
- `useAutoRefresh` - Auto-actualización de datos
- `useServiceOrders` - Gestión de órdenes de servicio
- `useCustomers` - Gestión de clientes
- `useUsers` - Gestión de usuarios
- `useRealtimeSubscription` - Suscripciones en tiempo real

### **constants/**
Valores constantes centralizados:

- Estados de órdenes
- Roles de usuario
- Configuraciones de impresión
- Mensajes de error y éxito
- Claves de localStorage

## 🎯 Buenas Prácticas Implementadas

### 1. **DRY (Don't Repeat Yourself)**
- Utilidades centralizadas en `utils/`
- Hooks personalizados reutilizables
- Componentes UI modulares

### 2. **Separación de Responsabilidades**
- Lógica de negocio separada de la presentación
- Hooks para manejo de estado y efectos
- Componentes enfocados en una sola responsabilidad

### 3. **Type Safety**
- TypeScript en todo el proyecto
- Tipos definidos en `types/`
- Constantes tipadas con `as const`

### 4. **Código Limpio**
- Nombres descriptivos y significativos
- Funciones pequeñas y enfocadas
- Comentarios JSDoc donde es necesario
- Imports organizados

### 5. **Organización de Archivos**
- Estructura lógica y predecible
- Barrel exports (`index.ts`) para imports limpios
- Separación clara entre producción y desarrollo

## 📝 Convenciones de Código

### **Nombres de Archivos**
- Componentes: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utilidades: `camelCase.ts`
- Constantes: `SCREAMING_SNAKE_CASE` o `camelCase.ts`

### **Imports**
Orden recomendado:
```typescript
// 1. React y librerías externas
import React from 'react'
import { useAuth } from '@/contexts/AuthContext'

// 2. Componentes
import { Button } from '@/components/ui/Button'

// 3. Hooks personalizados
import { useServiceOrders } from '@/hooks'

// 4. Utilidades y constantes
import { formatDateForPrint, ORDER_STATUS } from '@/utils'
import { STORAGE_KEYS } from '@/constants'

// 5. Tipos
import type { ServiceOrder } from '@/types'

// 6. Assets
import logo from '@/assets/logo.png'
```

### **Componentes**
```typescript
// Estructura recomendada de componente

// 1. Imports
import React from 'react'

// 2. Types/Interfaces
interface Props {
  // ...
}

// 3. Componente
export const Component: React.FC<Props> = (props) => {
  // 3.1. Hooks
  // 3.2. State
  // 3.3. Effects
  // 3.4. Funciones handlers
  // 3.5. Render helpers
  // 3.6. Return JSX
}
```

## 🚀 Scripts Disponibles

```bash
npm run dev          # Inicia servidor de desarrollo
npm run build        # Compila para producción
npm run preview      # Preview de build de producción
npm run lint         # Ejecuta linter
```

## 📚 Recursos Adicionales

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev/)

## 🔐 Variables de Entorno

Archivo `.env` requerido:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🧪 Testing (Futuro)

Estructura propuesta para tests:
```
src/
├── __tests__/
│   ├── components/
│   ├── hooks/
│   └── utils/
```

## 📊 Base de Datos

Los scripts SQL están organizados en:
- `database/migrations/` - Scripts de migración e inicialización
- `database/utils/` - Scripts de utilidad y mantenimiento

---

**Última actualización:** Octubre 2025
**Versión:** 1.0.0
**Mantenido por:** Equipo GameBox Service
