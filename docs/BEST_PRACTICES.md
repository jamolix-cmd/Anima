# 📘 Guía de Buenas Prácticas - GameBox Service

## 🎯 Objetivo

Este documento establece las mejores prácticas de desarrollo para mantener la calidad, consistencia y mantenibilidad del código en el proyecto GameBox Service.

---

## 📂 Organización de Archivos

### Estructura de Carpetas

```
src/
├── assets/           # Recursos estáticos (NO modificar en runtime)
├── components/       # Componentes React
│   └── ui/          # Componentes UI reutilizables
├── config/          # Configuraciones de la aplicación
├── constants/       # Constantes y valores estáticos
├── contexts/        # React Contexts
├── hooks/           # Custom Hooks
├── lib/             # Configuraciones de librerías externas
├── types/           # TypeScript types
└── utils/           # Funciones utilitarias
```

### ✅ Dónde Colocar Nuevo Código

| Tipo de Código | Ubicación | Ejemplo |
|----------------|-----------|---------|
| Componente UI genérico | `components/ui/` | Button, Modal, Card |
| Componente de página | `components/` | Dashboard, Login |
| Hook personalizado | `hooks/` | useOrders, useAuth |
| Función utilitaria | `utils/` | formatDate, validateEmail |
| Constante | `constants/` | API_URLS, STATUS_CODES |
| Tipo TypeScript | `types/` | User, Order, Customer |

---

## 💻 Convenciones de Código

### Nombres de Archivos

```typescript
// ✅ CORRECTO
ComponentName.tsx       // PascalCase para componentes
useCustomHook.ts        // camelCase con prefijo 'use' para hooks
helperFunction.ts       // camelCase para utilidades
CONSTANTS.ts            // SCREAMING_SNAKE_CASE para constantes

// ❌ INCORRECTO
component-name.tsx
Component_Name.tsx
usecustomhook.ts
```

### Nombres de Variables y Funciones

```typescript
// ✅ CORRECTO - Nombres descriptivos
const customerList = getCustomers()
const isOrderCompleted = checkOrderStatus(order)
const handleSubmitForm = () => { /* ... */ }

// ❌ INCORRECTO - Nombres genéricos o confusos
const data = getCustomers()
const flag = checkOrderStatus(order)
const doStuff = () => { /* ... */ }
```

### Nombres de Constantes

```typescript
// ✅ CORRECTO
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const API_TIMEOUT = 30000 // 30 seconds
export const DEFAULT_PAGE_SIZE = 10

// ❌ INCORRECTO - Números mágicos en el código
if (fileSize > 5242880) { /* ... */ }
setTimeout(callback, 30000)
```

---

## 🎨 Estructura de Componentes

### Template Recomendado

```typescript
// 1️⃣ Imports externos (React, librerías)
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'

// 2️⃣ Imports internos (hooks, utils, constants)
import { useServiceOrders } from '@/hooks'
import { formatDateForPrint } from '@/utils'
import { ORDER_STATUS } from '@/constants'

// 3️⃣ Imports de tipos
import type { ServiceOrder } from '@/types'

// 4️⃣ Tipos/Interfaces del componente
interface Props {
  orderId: string
  onComplete: (order: ServiceOrder) => void
}

// 5️⃣ Componente
export const OrderDetail: React.FC<Props> = ({ orderId, onComplete }) => {
  // 5.1 Hooks (useState, useEffect, custom hooks)
  const [loading, setLoading] = useState(false)
  const { orders, updateOrder } = useServiceOrders()
  
  useEffect(() => {
    // Efectos secundarios
  }, [orderId])
  
  // 5.2 Funciones handlers
  const handleComplete = async () => {
    // Lógica
  }
  
  // 5.3 Funciones helpers
  const isCompleted = () => {
    return order?.status === ORDER_STATUS.COMPLETED
  }
  
  // 5.4 Renderizado condicional
  if (loading) return <div>Cargando...</div>
  
  // 5.5 JSX principal
  return (
    <div>
      {/* Contenido */}
    </div>
  )
}
```

---

## 🔧 Uso de Utilidades

### ✅ USAR Utilidades Centralizadas

```typescript
// ✅ CORRECTO
import { formatDateForPrint, getStatusDisplayName } from '@/utils'

const date = formatDateForPrint(order.created_at)
const status = getStatusDisplayName(order.status)
```

```typescript
// ❌ INCORRECTO - Duplicar lógica
const date = new Date(order.created_at).toLocaleString('es-ES', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
})
```

### ✅ USAR Hooks Personalizados

```typescript
// ✅ CORRECTO
import { useImageToBase64 } from '@/hooks'
import logo from '@/assets/logo.png'

const { base64: logoBase64, loading, error } = useImageToBase64(logo)
```

```typescript
// ❌ INCORRECTO - Reimplementar lógica
const [logoBase64, setLogoBase64] = useState('')
useEffect(() => {
  fetch(logo).then(res => res.blob()).then(/* ... */)
}, [])
```

---

## 📋 Uso de Constantes

### ✅ SIEMPRE Usar Constantes

```typescript
// ✅ CORRECTO
import { ORDER_STATUS, PRINT_SETTINGS } from '@/constants'

if (order.status === ORDER_STATUS.COMPLETED) {
  printOrder(order, PRINT_SETTINGS.STICKER)
}
```

```typescript
// ❌ INCORRECTO - Strings y números mágicos
if (order.status === 'completed') {
  printOrder(order, { width: '7cm', height: '5cm' })
}
```

---

## 🎯 Principios SOLID

### Single Responsibility Principle (SRP)

```typescript
// ✅ CORRECTO - Cada función hace UNA cosa
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const sendEmail = async (to: string, subject: string, body: string) => {
  // Lógica de envío
}

// ❌ INCORRECTO - Función hace muchas cosas
const processEmail = (email: string, subject: string, body: string) => {
  // Valida
  if (!validateEmail(email)) return false
  // Envía
  sendEmailAPI(email, subject, body)
  // Registra
  logEmailSent(email)
  // etc...
}
```

---

## 🧪 Testing (Futuro)

### Estructura de Tests

```typescript
// ComponentName.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ComponentName } from './ComponentName'

describe('ComponentName', () => {
  it('should render correctly', () => {
    // Arrange
    // Act
    // Assert
  })
  
  it('should handle user interaction', () => {
    // Test
  })
})
```

---

## 📝 Comentarios y Documentación

### Cuándo Comentar

```typescript
// ✅ CORRECTO - Comentar el "por qué", no el "qué"
// Usamos setTimeout para evitar race condition con la API
setTimeout(() => {
  fetchData()
}, 100)

// ❌ INCORRECTO - Comentar lo obvio
// Incrementa el contador en 1
counter++
```

### JSDoc para Funciones Públicas

```typescript
/**
 * Converts an image URL to base64 string
 * @param imageUrl - URL or path to the image
 * @returns Promise<string> - Base64 encoded image string
 * @throws {Error} If image cannot be loaded
 */
export const convertImageToBase64 = async (imageUrl: string): Promise<string> => {
  // Implementation
}
```

---

## ⚠️ Manejo de Errores

### ✅ SIEMPRE Manejar Errores

```typescript
// ✅ CORRECTO
const loadData = async () => {
  try {
    setLoading(true)
    const data = await fetchData()
    setData(data)
  } catch (error) {
    console.error('Error loading data:', error)
    setError('No se pudieron cargar los datos')
  } finally {
    setLoading(false)
  }
}
```

```typescript
// ❌ INCORRECTO
const loadData = async () => {
  const data = await fetchData() // ¿Qué pasa si falla?
  setData(data)
}
```

---

## 🔒 TypeScript

### ✅ Tipado Fuerte

```typescript
// ✅ CORRECTO - Tipos específicos
interface Order {
  id: string
  status: 'pending' | 'in_progress' | 'completed'
  amount: number
}

const processOrder = (order: Order): void => {
  // Implementation
}
```

```typescript
// ❌ INCORRECTO - Tipos any
const processOrder = (order: any): any => {
  // Implementation
}
```

---

## 🎨 Imports Organizados

### Orden de Imports

```typescript
// 1. React y librerías externas
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

// 2. Componentes
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

// 3. Hooks personalizados
import { useAuth, useOrders } from '@/hooks'

// 4. Utilidades y constantes
import { formatDate, validateEmail } from '@/utils'
import { API_ENDPOINTS, ERROR_MESSAGES } from '@/constants'

// 5. Tipos
import type { User, Order } from '@/types'

// 6. Assets
import logo from '@/assets/logo.png'
import './styles.css'
```

---

## 🚀 Performance

### Memoización

```typescript
// ✅ Usar useMemo para cálculos costosos
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(data)
}, [data])

// ✅ Usar useCallback para funciones que se pasan como props
const handleClick = useCallback(() => {
  doSomething(id)
}, [id])
```

### Lazy Loading

```typescript
// ✅ Lazy load componentes grandes
const HeavyComponent = lazy(() => import('./HeavyComponent'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  )
}
```

---

## 📱 Responsividad

### Mobile First

```css
/* ✅ CORRECTO - Mobile first */
.button {
  padding: 8px 16px;
}

@media (min-width: 768px) {
  .button {
    padding: 12px 24px;
  }
}
```

---

## 🔐 Seguridad

### ✅ NUNCA Commits con Secrets

```typescript
// ❌ INCORRECTO
const API_KEY = 'sk_live_123456789'

// ✅ CORRECTO
const API_KEY = import.meta.env.VITE_API_KEY
```

### Sanitización de Inputs

```typescript
// ✅ Validar y sanitizar inputs del usuario
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/<script>/gi, '')
}
```

---

## 📊 Git Commits

### Formato de Commits

```bash
# ✅ CORRECTO
git commit -m "feat: add customer search functionality"
git commit -m "fix: resolve order number generation bug"
git commit -m "refactor: extract image conversion to utility"
git commit -m "docs: update API documentation"

# Tipos de commits:
# feat: Nueva funcionalidad
# fix: Corrección de bugs
# refactor: Refactorización de código
# docs: Documentación
# style: Formato, estilo (no afecta el código)
# test: Agregar o modificar tests
# chore: Tareas de mantenimiento
```

---

## ✅ Checklist Pre-Commit

Antes de hacer commit, verifica:

- [ ] ✅ El código compila sin errores
- [ ] ✅ No hay warnings de TypeScript
- [ ] ✅ Imports están organizados
- [ ] ✅ No hay console.logs innecesarios
- [ ] ✅ Código formateado correctamente
- [ ] ✅ Nombres de variables son descriptivos
- [ ] ✅ Se usan constantes en lugar de números mágicos
- [ ] ✅ Errores están manejados apropiadamente
- [ ] ✅ Documentación actualizada si es necesario

---

## 📚 Recursos Recomendados

- [Clean Code - Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [React Best Practices](https://react.dev/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

---

**Última Actualización**: Octubre 2025  
**Versión**: 1.0  
**Mantenido por**: Equipo GameBox Service

---

*Estas guías están vivas y deben actualizarse según evolucionen las necesidades del proyecto*
