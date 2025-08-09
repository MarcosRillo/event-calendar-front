'use client';

import { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { 
  Wifi as WifiIcon,
  CloudOff as CloudOffIcon 
} from '@mui/icons-material';

/**
 * Componente para mostrar el estado de conectividad
 */
export function ConnectivityStatus() {
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);
  const [showOnlineAlert, setShowOnlineAlert] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setShowOfflineAlert(false);
      setShowOnlineAlert(true);
      
      // Ocultar alerta de conexión restaurada después de 3 segundos
      setTimeout(() => setShowOnlineAlert(false), 3000);
    };

    const handleOffline = () => {
      setShowOfflineAlert(true);
      setShowOnlineAlert(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <>
      {/* Alerta offline persistente */}
      <Snackbar
        open={showOfflineAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ top: { xs: 16, sm: 24 } }}
      >
        <Alert
          severity="warning"
          icon={<CloudOffIcon />}
          sx={{ 
            width: '100%',
            backgroundColor: '#f57c00',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white'
            }
          }}
        >
          Sin conexión a internet. Trabajando en modo offline.
        </Alert>
      </Snackbar>

      {/* Alerta de conexión restaurada */}
      <Snackbar
        open={showOnlineAlert}
        autoHideDuration={3000}
        onClose={() => setShowOnlineAlert(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ top: { xs: 16, sm: 24 } }}
      >
        <Alert
          severity="success"
          icon={<WifiIcon />}
          onClose={() => setShowOnlineAlert(false)}
        >
          Conexión restaurada
        </Alert>
      </Snackbar>
    </>
  );
}

/**
 * Hook para obtener el estado de conectividad
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Estado inicial
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Si estaba offline, marcar que se restauró la conexión
      if (wasOffline) {
        setWasOffline(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  return { isOnline, wasOffline };
}
