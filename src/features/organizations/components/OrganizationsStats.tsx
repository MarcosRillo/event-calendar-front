import { Box } from '@mui/material';
import StatsCard from '@/components/ui/StatsCard';
import { ORGANIZATIONS_CONFIG } from '../config/organizations.config';

interface OrganizationsStatsProps {
  stats: {
    totalOrganizations: number;
    activeOrganizations: number;
    totalUsers: number;
    totalEvents: number;
  };
}

/**
 * Organizations statistics display component
 */
export const OrganizationsStats: React.FC<OrganizationsStatsProps> = ({ stats }) => {
  const config = ORGANIZATIONS_CONFIG.stats;

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
        title={config.totalOrganizations.title}
        value={stats.totalOrganizations}
        icon={<config.totalOrganizations.icon />}
        color={config.totalOrganizations.color}
      />
      <StatsCard
        title={config.activeOrganizations.title}
        value={stats.activeOrganizations}
        icon={<config.activeOrganizations.icon />}
        color={config.activeOrganizations.color}
      />
      <StatsCard
        title={config.totalUsers.title}
        value={stats.totalUsers}
        icon={<config.totalUsers.icon />}
        color={config.totalUsers.color}
      />
      <StatsCard
        title={config.totalEvents.title}
        value={stats.totalEvents}
        icon={<config.totalEvents.icon />}
        color={config.totalEvents.color}
      />
    </Box>
  );
};
