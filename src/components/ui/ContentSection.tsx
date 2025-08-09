import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Button,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { 
  ArrowForward, 
} from '@mui/icons-material';
import { TucumanColors } from '@/theme';

interface ContentSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundColor?: string;
  textColor?: string;
  children?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'contained' | 'outlined' | 'text';
  };
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  spacing?: number;
  textAlign?: 'left' | 'center' | 'right';
  showDivider?: boolean;
  paddingY?: number;
}

/**
 * Content Section Component - Inspirado en las secciones de contenido de Tucumán Turismo
 * Componente versátil para diferentes tipos de secciones
 */
export const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  subtitle,
  description,
  backgroundColor = 'transparent',
  textColor = TucumanColors.neutral.charcoal,
  children,
  action,
  maxWidth = 'lg',
  spacing = 4,
  textAlign = 'center',
  showDivider = false,
  paddingY = 8,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      component="section"
      sx={{
        backgroundColor: backgroundColor,
        py: paddingY,
        position: 'relative',
      }}
    >
      {/* Patrón de fondo sutil */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(21, 101, 192, 0.02) 0%, transparent 20%),
            radial-gradient(circle at 90% 80%, rgba(46, 125, 50, 0.02) 0%, transparent 20%)
          `,
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth={maxWidth} sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ mb: spacing, textAlign: textAlign }}>
          {/* Divider decorativo superior */}
          {showDivider && (
            <Box sx={{ mb: 3, display: 'flex', justifyContent: textAlign }}>
              <Divider 
                sx={{ 
                  width: 60, 
                  height: 3, 
                  backgroundColor: TucumanColors.accent.golden,
                  borderRadius: 2,
                }}
              />
            </Box>
          )}

          {/* Subtítulo */}
          {subtitle && (
            <Typography
              variant="overline"
              component="p"
              sx={{
                color: TucumanColors.secondary.main,
                fontWeight: 600,
                letterSpacing: '1.5px',
                mb: 1,
              }}
            >
              {subtitle}
            </Typography>
          )}

          {/* Título principal */}
          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            component="h2"
            gutterBottom
            sx={{
              color: textColor,
              fontWeight: 700,
              mb: 2,
              maxWidth: 800,
              mx: textAlign === 'center' ? 'auto' : 'unset',
            }}
          >
            {title}
          </Typography>

          {/* Descripción */}
          {description && (
            <Typography
              variant="body1"
              component="p"
              sx={{
                color: textColor === TucumanColors.neutral.charcoal 
                  ? TucumanColors.neutral.darkGray 
                  : 'rgba(255,255,255,0.8)',
                maxWidth: 600,
                mx: textAlign === 'center' ? 'auto' : 'unset',
                lineHeight: 1.6,
                fontSize: '1.1rem',
              }}
            >
              {description}
            </Typography>
          )}
        </Box>

        {/* Contenido principal */}
        {children && (
          <Box sx={{ mb: action ? spacing : 0 }}>
            {children}
          </Box>
        )}

        {/* Botón de acción */}
        {action && (
          <Box sx={{ textAlign: textAlign, mt: 4 }}>
            <Button
              variant={action.variant || 'contained'}
              size="large"
              endIcon={<ArrowForward />}
              onClick={action.onClick}
              sx={{
                backgroundColor: action.variant === 'contained' 
                  ? TucumanColors.primary.main 
                  : 'transparent',
                color: action.variant === 'outlined' 
                  ? TucumanColors.primary.main 
                  : 'white',
                fontWeight: 600,
                py: 1.5,
                px: 4,
                fontSize: '1rem',
                textTransform: 'none',
                borderRadius: 3,
                border: action.variant === 'outlined' 
                  ? `2px solid ${TucumanColors.primary.main}` 
                  : 'none',
                '&:hover': {
                  backgroundColor: action.variant === 'contained'
                    ? TucumanColors.primary.dark
                    : action.variant === 'outlined'
                    ? TucumanColors.primary.main
                    : 'rgba(21, 101, 192, 0.1)',
                  color: action.variant === 'outlined' ? 'white' : undefined,
                  transform: 'translateY(-2px)',
                  boxShadow: '0px 4px 12px rgba(21, 101, 192, 0.3)',
                },
              }}
            >
              {action.label}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

/**
 * Feature Grid Component - Para mostrar características o servicios
 */
interface FeatureGridProps {
  features: {
    title: string;
    description: string;
    icon?: React.ReactNode;
    image?: string;
  }[];
  columns?: number;
}

export const FeatureGrid: React.FC<FeatureGridProps> = ({
  features,
  columns = 3,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const getColumns = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return columns;
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)', 
          md: `repeat(${getColumns()}, 1fr)`,
        },
        gap: 4,
      }}
    >
      {features.map((feature, index) => (
        <Box
          key={index}
          sx={{
            textAlign: 'center',
            p: 3,
            height: '100%',
            borderRadius: 3,
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              backgroundColor: TucumanColors.neutral.lightGray,
              transform: 'translateY(-4px)',
            },
          }}
        >
          {/* Icono o imagen */}
          {feature.icon && (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: TucumanColors.primary.light,
                color: 'white',
                mb: 2,
              }}
            >
              {feature.icon}
            </Box>
          )}

          {feature.image && (
            <Box
              component="img"
              src={feature.image}
              alt={feature.title}
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                objectFit: 'cover',
                mb: 2,
              }}
            />
          )}

          {/* Título */}
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: TucumanColors.neutral.charcoal,
              mb: 1,
            }}
          >
            {feature.title}
          </Typography>

          {/* Descripción */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            {feature.description}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
