'use client';

import { Box } from '@mui/material';
import { 
  PersonAdd as PersonAddIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import StatsCard from '@/components/ui/StatsCard';
import { StatConfig } from '../config/users.config';

interface UsersStatsProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    rolesCount: number;
    organizationsCount: number;
  };
}

/**
 * Componente para mostrar estadísticas de usuarios
 */
export function UsersStats({ stats }: UsersStatsProps) {
  const statsConfig: StatConfig[] = [
    {
      title: "Total Usuarios",
      value: stats.totalUsers,
      color: "primary",
    },
    {
      title: "Usuarios Activos",
      value: stats.activeUsers,
      color: "success",
    },
    {
      title: "Roles Disponibles",
      value: stats.rolesCount,
      color: "info",
    },
    {
      title: "Organizaciones",
      value: stats.organizationsCount,
      color: "warning",
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          md: 'repeat(4, 1fr)' 
        }, 
        gap: 3, 
        mb: 4 
      }}
    >
      <StatsCard
        title={statsConfig[0].title}
        value={statsConfig[0].value}
        icon={<PersonAddIcon />}
        color={statsConfig[0].color}
      />
      <StatsCard
        title={statsConfig[1].title}
        value={statsConfig[1].value}
        icon={<PersonAddIcon />}
        color={statsConfig[1].color}
      />
      <StatsCard
        title={statsConfig[2].title}
        value={statsConfig[2].value}
        icon={<BusinessIcon />}
        color={statsConfig[2].color}
      />
      <StatsCard
        title={statsConfig[3].title}
        value={statsConfig[3].value}
        icon={<BusinessIcon />}
        color={statsConfig[3].color}
      />
    </Box>
  );
}
