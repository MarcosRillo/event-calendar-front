'use client';

import { useEffect, useState } from 'react';
import { Button, Snackbar, Alert } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Componente para manejar la instalación de PWA
 */
export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verificar si ya está instalada
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Escuchar el evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    // Escuchar cuando la app se instala
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Mostrar el prompt de instalación
    deferredPrompt.prompt();

    // Esperar la respuesta del usuario
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowInstallPrompt(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Recordar que el usuario no quiere instalar por ahora
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // No mostrar si ya está instalada o fue rechazada recientemente
  if (isInstalled || !showInstallPrompt) {
    return null;
  }

  // Verificar si fue rechazada en las últimas 24 horas
  const lastDismissed = localStorage.getItem('pwa-install-dismissed');
  if (lastDismissed) {
    const timeSinceDismissed = Date.now() - parseInt(lastDismissed);
    const oneDayInMs = 24 * 60 * 60 * 1000;
    
    if (timeSinceDismissed < oneDayInMs) {
      return null;
    }
  }

  return (
    <Snackbar
      open={showInstallPrompt}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ 
        bottom: { xs: 90, sm: 24 },
        '& .MuiSnackbarContent-root': {
          padding: 0,
        }
      }}
    >
      <Alert
        severity="info"
        sx={{ width: '100%' }}
        action={
          <>
            <Button
              color="inherit"
              size="small"
              onClick={handleInstallClick}
              startIcon={<DownloadIcon />}
              sx={{ mr: 1 }}
            >
              Instalar
            </Button>
            <Button
              color="inherit"
              size="small"
              onClick={handleDismiss}
            >
              Después
            </Button>
          </>
        }
      >
        ¡Instala la app para una mejor experiencia!
      </Alert>
    </Snackbar>
  );
}

/**
 * Hook para detectar si la app está instalada como PWA
 */
export function useIsInstalled() {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const checkInstallation = () => {
      // Verificar display-mode standalone
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      
      // Verificar si está en iOS y fue añadida al home screen
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isIOSStandalone = isIOS && (window.navigator as typeof window.navigator & { standalone?: boolean }).standalone === true;
      
      setIsInstalled(isStandalone || isIOSStandalone);
    };

    checkInstallation();

    // Escuchar cambios en el display-mode
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkInstallation);

    return () => {
      mediaQuery.removeEventListener('change', checkInstallation);
    };
  }, []);

  return isInstalled;
}
