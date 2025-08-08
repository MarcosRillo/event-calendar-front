'use client';

import { IconButton, Tooltip } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useUIStore } from '@/store/uiStore';

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useUIStore();

  return (
    <Tooltip title={darkMode ? 'Modo claro' : 'Modo oscuro'}>
      <IconButton
        onClick={toggleDarkMode}
        color="inherit"
        aria-label="toggle theme"
        sx={{
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        }}
      >
        {darkMode ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
}
