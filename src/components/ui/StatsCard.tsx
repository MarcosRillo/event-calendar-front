'use client';

import { Card, CardContent, Typography, Box, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  sx?: SxProps<Theme>;
}

export default function StatsCard({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  trend,
  sx 
}: StatsCardProps) {
  const getColorValue = (colorName: string) => {
    return `${colorName}.main`;
  };

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'visible',
        ...sx,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ mb: 1, fontWeight: 600 }}>
              {value}
            </Typography>
            
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: trend.isPositive ? 'success.main' : 'error.main',
                    fontWeight: 500,
                  }}
                >
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  vs mes anterior
                </Typography>
              </Box>
            )}
          </Box>

          {icon && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 56,
                borderRadius: 2,
                bgcolor: `${getColorValue(color)}15`,
                color: getColorValue(color),
                '& > *': {
                  fontSize: 28,
                },
              }}
            >
              {icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
