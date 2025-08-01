'use client';

import { usePathname, useRouter } from 'next/navigation';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Dashboard,
  People,
  Business,
  Event,
  Assignment,
  BarChart,
  Settings,
} from '@mui/icons-material';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType;
  badge?: string;
  disabled?: boolean;
}

interface NavigationSection {
  title: string;
  items: NavigationItem[];
}

interface SidebarNavProps {
  onMobileClose?: () => void;
  logo?: React.ReactNode;
}

export default function SidebarNav({ onMobileClose, logo }: SidebarNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navigationSections: NavigationSection[] = [
    {
      title: 'Principal',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          path: '/super-admin',
          icon: Dashboard,
        },
      ],
    },
    {
      title: 'Gestión',
      items: [
        {
          id: 'users',
          label: 'Usuarios',
          path: '/super-admin/users',
          icon: People,
        },
        {
          id: 'organizations',
          label: 'Organizaciones',
          path: '/super-admin/organizations',
          icon: Business,
        },
        {
          id: 'events',
          label: 'Eventos',
          path: '/super-admin/events',
          icon: Event,
        },
      ],
    },
    {
      title: 'Solicitudes',
      items: [
        {
          id: 'organization-requests',
          label: 'Solicitudes de Organizaciones',
          path: '/super-admin/organization-requests',
          icon: Assignment,
        },
      ],
    },
    {
      title: 'Herramientas',
      items: [
        {
          id: 'forms-demo',
          label: 'Demo Formularios',
          path: '/super-admin/forms-demo',
          icon: Settings,
        },
        {
          id: 'analytics',
          label: 'Analíticas',
          path: '/super-admin/analytics',
          icon: BarChart,
          disabled: true,
        },
        {
          id: 'settings',
          label: 'Configuración',
          path: '/super-admin/settings',
          icon: Settings,
          disabled: true,
        },
      ],
    },
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const isActive = (path: string) => {
    if (path === '/super-admin') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} role="navigation" aria-label="Menú lateral">
      {/* Logo/Branding */}
      <Box sx={{ p: 3, textAlign: 'center', minHeight: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {logo ? logo : (
          <>
            <Avatar src="https://mui.com/static/logo.png" alt="MUI Logo" sx={{ width: 32, height: 32, bgcolor: 'primary.main', mx: 'auto', mb: 1 }} />
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>
              MUI Panel
            </Typography>
            <Typography variant="body2" sx={{ color: 'grey.400', mt: 0.5 }}>
              Branding temporal
            </Typography>
          </>
        )}
      </Box>

      <Divider sx={{ borderColor: 'grey.200', mb: 1 }} />

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 2 }}>
        {navigationSections.map((section) => (
          <Box key={section.title} sx={{ mb: 3 }}>
            {/* Section Title */}
            <Typography
              variant="overline"
              sx={{
                px: 3,
                py: 1,
                color: 'grey.600',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {section.title}
            </Typography>

            {/* Section Items */}
            <List sx={{ py: 0 }}>
              {section.items.map((item) => {
                const IconComponent = item.icon;
                const active = isActive(item.path);

                return (
                  <ListItem key={item.id} disablePadding sx={{ px: 1 }}>
                    <ListItemButton
                      onClick={() => !item.disabled && handleNavigation(item.path)}
                      selected={active}
                      disabled={item.disabled}
                      sx={{
                        borderRadius: 2,
                        mx: 1,
                        mb: 0.5,
                        transition: 'background 0.2s',
                        '&.Mui-selected': {
                          bgcolor: 'primary.light',
                          color: 'primary.contrastText',
                          '&:hover': {
                            bgcolor: 'primary.main',
                          },
                        },
                        '&:hover': {
                          bgcolor: 'grey.100',
                        },
                      }}
                      aria-label={item.label}
                      role="menuitem"
                      tabIndex={0}
                    >
                      <ListItemIcon
                        sx={{
                          color: active ? 'primary.main' : 'grey.500',
                          minWidth: 40,
                          transition: 'color 0.2s',
                        }}
                      >
                        <IconComponent />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: '0.95rem',
                          fontWeight: active ? 700 : 400,
                          color: active ? 'primary.main' : 'grey.800',
                        }}
                      />
                      {/* Badge */}
                      {item.badge && (
                        <Chip
                          label={item.badge}
                          size="small"
                          color="secondary"
                          sx={{
                            height: 20,
                            fontSize: '0.75rem',
                            fontWeight: 500,
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'grey.200' }}>
        <Typography variant="caption" sx={{ color: 'grey.500', textAlign: 'center', display: 'block' }}>
          © 2025 Ente de Turismo de Tucumán
        </Typography>
      </Box>
    </Box>
  );
}
