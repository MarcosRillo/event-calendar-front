# Forms Demo Feature

## Descripción
Funcionalidad de demostración de componentes de formulario que permite probar los diferentes tipos de inputs, selects, date pickers y switches disponibles en el sistema.

## Estructura

```
src/features/forms-demo/
├── components/
│   ├── FormsDemoPage.tsx      # Componente principal de la página
│   └── FormsDemoForm.tsx      # Formulario de demostración
├── hooks/
│   └── useFormsDemo.ts        # Lógica de manejo del formulario
├── config/
│   └── forms-demo.config.ts   # Configuración y datos iniciales
└── index.ts                   # Exportaciones del feature
```

## Componentes

### FormsDemoPage
Página principal que contiene el layout y estructura general de la funcionalidad.

### FormsDemoForm
Formulario de demostración que incluye:
- Inputs de texto (nombre, email, password)
- Input de teléfono
- Selects (rol, organización)
- Date picker (fecha de nacimiento)
- Switches (usuario activo, notificaciones)

## Hook personalizado

### useFormsDemo
Hook que maneja:
- Estado del formulario
- Validación de campos
- Handlers para diferentes tipos de input
- Lógica de envío
- Notificaciones

## Configuración
Todas las configuraciones, opciones y constantes están centralizadas en `forms-demo.config.ts`:
- Datos iniciales del formulario
- Opciones para selects
- Configuración de campos
- Textos de la interfaz

## Uso
```tsx
import { FormsDemoPage } from '@/features/forms-demo';

// En una página de Next.js
export default function Page() {
  return <FormsDemoPage />;
}
```

## Refactorización
Esta funcionalidad fue refactorizada de un archivo monolítico de 246 líneas a una arquitectura modular con separación de responsabilidades y mejor mantenibilidad.
