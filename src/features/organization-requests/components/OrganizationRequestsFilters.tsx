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
import { ORGANIZATION_REQUESTS_CONFIG, STATUS_OPTIONS } from '../config/organization-requests.config';

interface OrganizationRequestsFiltersProps {
  filters: {
    search: string;
    status: string;
  };
  onFilterChange: (filters: { search: string; status: string; }) => void;
}

/**
 * Organization Requests filters component
 */
export const OrganizationRequestsFilters: React.FC<OrganizationRequestsFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const config = ORGANIZATION_REQUESTS_CONFIG.filters;

  const handleFilterChange = (newFilters: Partial<{ search: string; status: string; }>) => {
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
            },
            gap: 2,
          }}
        >
          {/* Search */}
          <TextField
            fullWidth
            label={config.search.label}
            variant="outlined"
            size="small"
            value={filters.search}
            onChange={(e) => handleFilterChange({ search: e.target.value })}
            placeholder={config.search.placeholder}
          />

          {/* Status */}
          <FormControl fullWidth size="small">
            <InputLabel>{config.status.label}</InputLabel>
            <Select
              value={filters.status}
              label={config.status.label}
              onChange={(e: SelectChangeEvent<string>) =>
                handleFilterChange({ status: e.target.value })
              }
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </CardContent>
    </Card>
  );
};
