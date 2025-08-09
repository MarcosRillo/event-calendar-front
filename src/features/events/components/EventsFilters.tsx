import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { FilterList as FilterListIcon } from '@mui/icons-material';
import { EventFilters } from '@/hooks/useEventManagement';
import { Organization } from '@/types';
import { EVENTS_CONFIG } from '../config/events.config';

interface EventsFiltersProps {
  filters: EventFilters;
  onFilterChange: (filters: EventFilters) => void;
  organizations: Organization[];
  eventStatuses: Array<{ id: number; name: string; }>;
}

/**
 * Events filters component
 */
export const EventsFilters: React.FC<EventsFiltersProps> = ({
  filters,
  onFilterChange,
  organizations,
  eventStatuses,
}) => {
  const config = EVENTS_CONFIG.filters;

  const handleFilterChange = (newFilters: Partial<EventFilters>) => {
    onFilterChange({ ...filters, ...newFilters });
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <FilterListIcon color="action" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Filtros
          </Typography>
        </Box>
        
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
              lg: 'repeat(5, 1fr)',
            },
            gap: 2,
          }}
        >
          {/* Search */}
          <TextField
            fullWidth
            label="Buscar eventos"
            variant="outlined"
            size="small"
            value={filters.search || ''}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
            placeholder="Título, descripción..."
          />

          {/* Start Date */}
          <TextField
            fullWidth
            label="Fecha Inicio"
            type="date"
            variant="outlined"
            size="small"
            value={filters.start_date || ''}
            onChange={(e) => handleFilterChange({ start_date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />

          {/* End Date */}
          <TextField
            fullWidth
            label="Fecha Fin"
            type="date"
            variant="outlined"
            size="small"
            value={filters.end_date || ''}
            onChange={(e) => handleFilterChange({ end_date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />

          {/* Organization */}
          <FormControl fullWidth size="small">
            <InputLabel>{config.organization.label}</InputLabel>
            <Select
              value={filters.organization_id || ''}
              label={config.organization.label}
              onChange={(e: SelectChangeEvent<string | number>) =>
                handleFilterChange({
                  organization_id: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
            >
              <MenuItem value="">
                <em>{config.organization.placeholder}</em>
              </MenuItem>
              {organizations.map((org) => (
                <MenuItem key={org.id} value={org.id}>
                  {org.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Status */}
          <FormControl fullWidth size="small">
            <InputLabel>{config.status.label}</InputLabel>
            <Select
              value={filters.status || ''}
              label={config.status.label}
              onChange={(e: SelectChangeEvent<string | number>) =>
                handleFilterChange({
                  status: e.target.value as string || undefined,
                })
              }
            >
              <MenuItem value="">
                <em>{config.status.placeholder}</em>
              </MenuItem>
              {eventStatuses.map((status) => (
                <MenuItem key={status.id} value={status.name}>
                  {status.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </CardContent>
    </Card>
  );
};
