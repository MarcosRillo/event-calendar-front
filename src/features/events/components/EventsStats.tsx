import { Box } from '@mui/material';
import StatsCard from '@/components/ui/StatsCard';
import { EVENTS_CONFIG } from '../config/events.config';

interface EventsStatsProps {
  stats: {
    totalEvents: number;
    activeEvents: number;
    totalOrganizations: number;
    upcomingEvents: number;
  };
}

/**
 * Events statistics display component
 */
export const EventsStats: React.FC<EventsStatsProps> = ({ stats }) => {
  const config = EVENTS_CONFIG.stats;

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
        title={config.totalEvents.title}
        value={stats.totalEvents}
        icon={<config.totalEvents.icon />}
        color={config.totalEvents.color}
      />
      <StatsCard
        title={config.activeEvents.title}
        value={stats.activeEvents}
        icon={<config.activeEvents.icon />}
        color={config.activeEvents.color}
      />
      <StatsCard
        title={config.totalOrganizations.title}
        value={stats.totalOrganizations}
        icon={<config.totalOrganizations.icon />}
        color={config.totalOrganizations.color}
      />
      <StatsCard
        title={config.upcomingEvents.title}
        value={stats.upcomingEvents}
        icon={<config.upcomingEvents.icon />}
        color={config.upcomingEvents.color}
      />
    </Box>
  );
};
