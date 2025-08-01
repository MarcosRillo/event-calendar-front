# Checklist de Migración y Mejora UX/UI - Super Admin Dashboard

## Prioridad 1: Estructura, Layout y Navegación
- [x] Migrar y mejorar `DashboardLayout` usando componentes MUI recomendados (`AppBar`, `Drawer`, `Toolbar`, etc.)
- [x] Rediseñar y mejorar `SidebarNav` con MUI (`Drawer`, `List`, `ListItem`, animaciones, accesibilidad)
- [x] Agregar logo de ejemplo (MUI) y branding temporal
- [x] Incluir theme switcher (claro/oscuro) en el header
- [x] Agregar acciones rápidas en el header (perfil, logout, notificaciones)
- [x] Mejorar accesibilidad (roles, aria-labels, foco visual)
- [x] Implementar animaciones sutiles (Drawer, Skeleton)

## Prioridad 2: Consistencia Visual y Componentes
- [ ] Auditar y migrar todos los componentes custom a MUI puro o mejorado (Botones, Cards, Modals, etc.)
- [ ] Unificar estilos, tipografía y espaciados en todo el dashboard
- [ ] Mejorar visual de badges, secciones y navegación en el sidebar

## Prioridad 3: Feedback Visual y UX
- [ ] Implementar feedback visual consistente usando `Snackbar`, `Skeleton`, `Alert` de MUI
- [ ] Usar `Dialog` de MUI para confirmaciones y formularios modales
- [ ] Mejorar loading, error y success en todas las páginas

## Prioridad 4: Migración Progresiva de Páginas
- [ ] Auditar cada página bajo `/super-admin` para asegurar uso del layout global
- [ ] Reemplazar layouts/componentes propios por los de MUI
- [ ] Mantener navegación y branding consistente en todas las vistas

## Prioridad 5: Accesibilidad y Detalles Finales
- [ ] Implementar roles, aria-labels y foco visual en todos los componentes interactivos
- [ ] Agregar animaciones/transiciones sutiles en navegación y carga
- [ ] Revisar y testear la experiencia en dispositivos móviles

---

**Notas:**
- Marcar cada ítem completado a medida que se avanza.
- Priorizar la experiencia del usuario, accesibilidad y consistencia visual.
- Documentar cualquier decisión relevante o cambio importante.
