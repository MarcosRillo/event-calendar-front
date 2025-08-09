import React from 'react';
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Chip, 
  Box, 
  Button,
  Stack,
  IconButton,
} from '@mui/material';
import { 
  Favorite, 
  FavoriteBorder, 
  Share, 
  LocationOn,
  AccessTime,
} from '@mui/icons-material';
import { TucumanColors } from '@/theme';

interface TourismCardProps {
  title: string;
  description: string;
  image: string;
  category: string;
  location?: string;
  duration?: string;
  isFavorite?: boolean;
  onFavoriteClick?: () => void;
  onShareClick?: () => void;
  onViewMore?: () => void;
  tags?: string[];
  elevation?: number;
}

/**
 * Tourism Card Component - Inspirado en las tarjetas del sitio de Tucumán Turismo
 * Diseño moderno con hover effects y diseño responsivo
 */
export const TourismCard: React.FC<TourismCardProps> = ({
  title,
  description,
  image,
  category,
  location,
  duration,
  isFavorite = false,
  onFavoriteClick,
  onShareClick,
  onViewMore,
  tags = [],
  elevation = 2,
}) => {
  return (
    <Card 
      elevation={elevation}
      sx={{ 
        maxWidth: 400, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0px 8px 24px rgba(0,0,0,0.15)',
          '& .card-media': {
            transform: 'scale(1.05)',
          },
        },
      }}
    >
      {/* Imagen principal */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          className="card-media"
          component="img"
          height="240"
          image={image}
          alt={title}
          sx={{ 
            transition: 'transform 0.3s ease-in-out',
            objectFit: 'cover',
          }}
        />
        
        {/* Overlay con categoría */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 2,
          }}
        >
          <Chip
            label={category}
            size="small"
            sx={{
              backgroundColor: TucumanColors.primary.main,
              color: 'white',
              fontWeight: 500,
              boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
            }}
          />
        </Box>

        {/* Botones de acción */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2,
            display: 'flex',
            gap: 0.5,
          }}
        >
          <IconButton
            size="small"
            onClick={onFavoriteClick}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              color: isFavorite ? TucumanColors.error.main : TucumanColors.neutral.darkGray,
              '&:hover': {
                backgroundColor: 'white',
              },
            }}
          >
            {isFavorite ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
          </IconButton>
          
          <IconButton
            size="small"
            onClick={onShareClick}
            sx={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              color: TucumanColors.neutral.darkGray,
              '&:hover': {
                backgroundColor: 'white',
              },
            }}
          >
            <Share fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Contenido */}
      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Typography 
          variant="h6" 
          component="h3"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: TucumanColors.neutral.charcoal,
            lineHeight: 1.3,
            mb: 1,
          }}
        >
          {title}
        </Typography>

        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            mb: 2,
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
            overflow: 'hidden',
            lineHeight: 1.5,
          }}
        >
          {description}
        </Typography>

        {/* Información adicional */}
        {(location || duration) && (
          <Stack direction="row" spacing={2} sx={{ mb: 2, alignItems: 'center' }}>
            {location && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationOn 
                  fontSize="small" 
                  sx={{ color: TucumanColors.secondary.main }}
                />
                <Typography variant="caption" color="text.secondary">
                  {location}
                </Typography>
              </Box>
            )}
            
            {duration && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTime 
                  fontSize="small" 
                  sx={{ color: TucumanColors.secondary.main }}
                />
                <Typography variant="caption" color="text.secondary">
                  {duration}
                </Typography>
              </Box>
            )}
          </Stack>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <Stack direction="row" spacing={0.5} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
            {tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.75rem',
                  height: 24,
                  borderColor: TucumanColors.secondary.light,
                  color: TucumanColors.secondary.main,
                  '&:hover': {
                    backgroundColor: TucumanColors.secondary.light,
                    color: 'white',
                    borderColor: TucumanColors.secondary.main,
                  },
                }}
              />
            ))}
          </Stack>
        )}
      </CardContent>

      {/* Botón de acción */}
      <Box sx={{ p: 2.5, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={onViewMore}
          sx={{
            backgroundColor: TucumanColors.primary.main,
            fontWeight: 500,
            textTransform: 'none',
            borderRadius: 2,
            py: 1.2,
            '&:hover': {
              backgroundColor: TucumanColors.primary.dark,
              transform: 'translateY(-1px)',
              boxShadow: '0px 4px 12px rgba(21, 101, 192, 0.3)',
            },
          }}
        >
          Conocé más aquí
        </Button>
      </Box>
    </Card>
  );
};
