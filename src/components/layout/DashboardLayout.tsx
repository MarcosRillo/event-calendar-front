'use client';

import { useState, ReactNode } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Settings,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import SidebarNav from './SidebarNav';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DRAWER_WIDTH = 280;

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const theme = useTheme();
  const { user, logout } = useAuth();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mode, setMode] = useState<'light' | 'dark'>(typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const handleThemeToggle = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', mode === 'light' ? 'dark' : 'light');
    }
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Logo de ejemplo (MUI)
  const Logo = () => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Avatar src="https://mui.com/static/logo.png" alt="MUI Logo" sx={{ width: 32, height: 32, bgcolor: 'primary.main' }} />
      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>MUI Panel</Typography>
    </Box>
  );

  // SidebarNav con branding
  const drawer = (
    <SidebarNav onMobileClose={() => setMobileOpen(false)} logo={<Logo />} />
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar mejorado */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          zIndex: theme.zIndex.drawer + 1,
          boxShadow: 2,
        }}
        color="default"
        role="banner"
        aria-label="Panel de administración"
      >
        <Toolbar sx={{ minHeight: 64, display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Mobile menu button */}
            <IconButton
              color="primary"
              aria-label="Abrir menú lateral"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            {/* Logo y branding */}
            <Logo />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Theme Switcher funcional */}
            <IconButton aria-label={mode === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'} color="primary" sx={{ mr: 1 }} onClick={handleThemeToggle}>
              {mode === 'light' ? <Settings /> : <Settings sx={{ color: 'secondary.main' }} />}
            </IconButton>
            {/* Acciones rápidas (placeholder) */}
            <IconButton aria-label="Notificaciones" color="primary">
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                <AccountCircle />
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* User Menu: se migrará en el siguiente paso con acciones rápidas y accesibilidad mejorada */}

      {/* Sidebar mejorado con animaciones y accesibilidad */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
        aria-label="Menú lateral"
        role="navigation"
      >
        {/* Mobile drawer con animación */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              transition: 'width 0.3s',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer con animación */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH,
              transition: 'width 0.3s',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
        role="main"
      >
        {/* Toolbar spacer */}
        <Toolbar />
        {/* Page content */}
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
