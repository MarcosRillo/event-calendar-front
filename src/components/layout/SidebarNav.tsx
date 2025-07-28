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
}

export default function SidebarNav({ onMobileClose }: SidebarNavProps) {
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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo/Brand */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
          Event Calendar
        </Typography>
        <Typography variant="body2" sx={{ color: 'grey.400', mt: 0.5 }}>
          Ente de Turismo
        </Typography>
      </Box>

      <Divider sx={{ borderColor: 'grey.700' }} />

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
                color: 'grey.400',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
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
                        borderRadius: 0,
                        mx: 1,
                        mb: 0.5,
                        '&.Mui-selected': {
                          bgcolor: 'rgba(59, 130, 246, 0.2)',
                          '&:hover': {
                            bgcolor: 'rgba(59, 130, 246, 0.3)',
                          },
                        },
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.05)',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: active ? '#60A5FA' : 'grey.400',
                          minWidth: 40,
                        }}
                      >
                        <IconComponent />
                      </ListItemIcon>
                      
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: active ? 600 : 400,
                          color: active ? 'white' : 'grey.300',
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
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'grey.700' }}>
        <Typography variant="caption" sx={{ color: 'grey.500', textAlign: 'center', display: 'block' }}>
          © 2025 Ente de Turismo de Tucumán
        </Typography>
      </Box>
    </Box>
  );
}
