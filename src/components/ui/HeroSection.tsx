import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Stack,
  Chip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { 
  PlayArrow, 
  Explore, 
  TrendingUp,
} from '@mui/icons-material';
import { TucumanColors } from '@/theme';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  badges?: string[];
  overlay?: boolean;
  height?: number | string;
  textAlign?: 'left' | 'center' | 'right';
}

/**
 * Hero Section Component - Inspirado en el hero de Tucumán Turismo
 * Diseño moderno con overlay y call-to-actions prominentes
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  backgroundImage,
  backgroundColor = TucumanColors.primary.main,
  primaryAction,
  secondaryAction,
  badges = [],
  overlay = true,
  height = 500,
  textAlign = 'center',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        position: 'relative',
        height: height,
        minHeight: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundColor: backgroundColor,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
      }}
    >
      {/* Overlay */}
      {overlay && backgroundImage && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            backgroundImage: 'linear-gradient(45deg, rgba(21, 101, 192, 0.6), rgba(46, 125, 50, 0.4))',
            zIndex: 1,
          }}
        />
      )}

      {/* Patrón decorativo */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)
          `,
          zIndex: 1,
        }}
      />

      {/* Contenido principal */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative', 
          zIndex: 2,
          textAlign: textAlign,
        }}
      >
        <Box sx={{ maxWidth: 800, mx: textAlign === 'center' ? 'auto' : 'unset' }}>
          {/* Badges */}
          {badges.length > 0 && (
            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ 
                mb: 3, 
                justifyContent: textAlign === 'center' ? 'center' : 'flex-start',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              {badges.map((badge, index) => (
                <Chip
                  key={index}
                  label={badge}
                  size="small"
                  icon={<TrendingUp fontSize="small" />}
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 500,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                  }}
                />
              ))}
            </Stack>
          )}

          {/* Subtítulo */}
          {subtitle && (
            <Typography
              variant="h6"
              component="p"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                mb: 2,
                fontWeight: 500,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              {subtitle}
            </Typography>
          )}

          {/* Título principal */}
          <Typography
            variant={isMobile ? 'h3' : 'h1'}
            component="h1"
            gutterBottom
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 3,
              textShadow: '0px 2px 4px rgba(0,0,0,0.3)',
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>

          {/* Descripción */}
          {description && (
            <Typography
              variant={isMobile ? 'body1' : 'h6'}
              component="p"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                mb: 4,
                maxWidth: 600,
                mx: textAlign === 'center' ? 'auto' : 'unset',
                lineHeight: 1.6,
                textShadow: '0px 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              {description}
            </Typography>
          )}

          {/* Botones de acción */}
          {(primaryAction || secondaryAction) && (
            <Stack
              direction={isMobile ? 'column' : 'row'}
              spacing={2}
              sx={{
                mt: 4,
                justifyContent: textAlign === 'center' ? 'center' : 'flex-start',
              }}
            >
              {primaryAction && (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={primaryAction.icon || <Explore />}
                  onClick={primaryAction.onClick}
                  sx={{
                    backgroundColor: TucumanColors.accent.golden,
                    color: TucumanColors.neutral.charcoal,
                    fontWeight: 600,
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    borderRadius: 3,
                    boxShadow: '0px 4px 12px rgba(255, 179, 0, 0.4)',
                    '&:hover': {
                      backgroundColor: '#FFA000',
                      transform: 'translateY(-2px)',
                      boxShadow: '0px 6px 16px rgba(255, 179, 0, 0.6)',
                    },
                  }}
                >
                  {primaryAction.label}
                </Button>
              )}

              {secondaryAction && (
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={secondaryAction.icon || <PlayArrow />}
                  onClick={secondaryAction.onClick}
                  sx={{
                    color: 'white',
                    borderColor: 'rgba(255,255,255,0.7)',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    fontWeight: 500,
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    borderRadius: 3,
                    borderWidth: '2px',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderWidth: '2px',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  {secondaryAction.label}
                </Button>
              )}
            </Stack>
          )}
        </Box>
      </Container>

      {/* Decoraciones adicionales */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 100,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.1))',
          zIndex: 1,
        }}
      />
    </Box>
  );
};
