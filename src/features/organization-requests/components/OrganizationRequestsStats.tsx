import { Box } from '@mui/material';
import StatsCard from '@/components/ui/StatsCard';
import { ORGANIZATION_REQUESTS_CONFIG } from '../config/organization-requests.config';

interface OrganizationRequestsStatsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    corrections: number;
  };
}

/**
 * Organization Requests statistics display component
 */
export const OrganizationRequestsStats: React.FC<OrganizationRequestsStatsProps> = ({ stats }) => {
  const config = ORGANIZATION_REQUESTS_CONFIG.stats;

  return (
    <Box 
      sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          md: 'repeat(5, 1fr)' 
        }, 
        gap: 3, 
        mb: 4 
      }}
    >
      <StatsCard
        title={config.total.title}
        value={stats.total}
        icon={<config.total.icon />}
        color={config.total.color}
      />
      <StatsCard
        title={config.pending.title}
        value={stats.pending}
        icon={<config.pending.icon />}
        color={config.pending.color}
      />
      <StatsCard
        title={config.approved.title}
        value={stats.approved}
        icon={<config.approved.icon />}
        color={config.approved.color}
      />
      <StatsCard
        title={config.rejected.title}
        value={stats.rejected}
        icon={<config.rejected.icon />}
        color={config.rejected.color}
      />
      <StatsCard
        title={config.corrections.title}
        value={stats.corrections}
        icon={<config.corrections.icon />}
        color={config.corrections.color}
      />
    </Box>
  );
};
