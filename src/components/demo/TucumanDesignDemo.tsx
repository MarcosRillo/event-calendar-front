import React from 'react';
import { Box } from '@mui/material';
import { 
  Museum, 
  LocationCity, 
  Event, 
  Groups,
  Analytics,
  Settings,
} from '@mui/icons-material';
import { 
  HeroSection, 
  ContentSection, 
  FeatureGrid,
  TourismCard,
} from '@/components/ui';
import { TucumanColors } from '@/theme';

/**
 * Demo Page - Showcase del diseño inspirado en Tucumán Turismo
 */
export const TucumanDesignDemo: React.FC = () => {
  // Data de ejemplo para las tarjetas
  const tourismPlaces = [
    {
      title: "Casa Histórica de la Independencia",
      description: "Museo más importante del país. Aquí se juró la independencia Argentina. Un lugar emblemático de nuestra historia nacional.",
      image: "https://www.tucumanturismo.gob.ar/public/img/1920x650-MIA-Desktop_arh059hi_28-06-2024_o0799csx_17-06-2025.jpg",
      category: "Historia",
      location: "San Miguel de Tucumán",
      duration: "2 horas",
      tags: ["Cultura", "Museo", "Historia"],
    },
    {
      title: "Museo de la Industria Azucarera", 
      description: "Conocida como la Casa del Obispo Colombres, este museo expone la historia azucarera de Tucumán.",
      image: "https://www.tucumanturismo.gob.ar/public/img/sanmigueltuc_0a1rp74m_14-06-2024_agomx8s6_19-06-2025.jpg",
      category: "Museo",
      location: "San Miguel de Tucumán",
      duration: "1.5 horas", 
      tags: ["Historia", "Azúcar", "Cultura"],
    },
    {
      title: "Casa de Gobierno",
      description: "Palacio de Gobierno de Tucumán. Ofrece visitas guiadas gratuitas durante los días de semana.",
      image: "https://www.tucumanturismo.gob.ar/public/img/1920x650-Mnicolasavellaneda-Mobile_13gpv9bx_28-06-2024_jxpxzb9f_19-06-2025.jpg",
      category: "Ciudad Histórica",
      location: "Centro",
      duration: "1 hora",
      tags: ["Historia", "Cultura", "Arquitectura"],
    },
  ];

  // Features para la grid
  const systemFeatures = [
    {
      title: "Gestión de Usuarios",
      description: "Sistema completo para administrar usuarios, roles y permisos con interfaz intuitiva.",
      icon: <Groups fontSize="large" />,
    },
    {
      title: "Organizaciones",
      description: "Gestión centralizada de organizaciones con herramientas de colaboración avanzadas.",
      icon: <LocationCity fontSize="large" />,
    },
    {
      title: "Eventos",
      description: "Planificación y gestión de eventos con calendario integrado y notificaciones automáticas.",
      icon: <Event fontSize="large" />,
    },
    {
      title: "Análisis y Reportes",
      description: "Dashboard con métricas en tiempo real y reportes detallados para toma de decisiones.",
      icon: <Analytics fontSize="large" />,
    },
    {
      title: "Configuración Avanzada",
      description: "Panel de administración con configuraciones personalizables y opciones avanzadas.",
      icon: <Settings fontSize="large" />,
    },
    {
      title: "Experiencia Cultural",
      description: "Herramientas diseñadas para promover y gestionar experiencias culturales únicas.",
      icon: <Museum fontSize="large" />,
    },
  ];

  return (
    <Box>
      {/* Hero Section - Banner principal */}
      <HeroSection
        subtitle="Sistema de Gestión"
        title="Event Calendar - Inspirado en Tucumán"
        description="Plataforma moderna de gestión de eventos y organizaciones con el alma cultural de Tucumán. Diseño elegante inspirado en el patrimonio histórico y la naturaleza tucumana."
        backgroundImage="https://www.tucumanturismo.gob.ar/public/img/1920x650-MIA-Desktop_arh059hi_28-06-2024_o0799csx_17-06-2025.jpg"
        primaryAction={{
          label: "Explorar Sistema",
          onClick: () => console.log("Explorar clicked"),
        }}
        secondaryAction={{
          label: "Ver Demo",
          onClick: () => console.log("Demo clicked"),
        }}
        badges={["Diseño Moderno", "UX Optimizada", "Responsive"]}
        height={600}
      />

      {/* Sección de características del sistema */}
      <ContentSection
        subtitle="Características Principales"
        title="Sistema Completo de Gestión"
        description="Nuestro sistema combina potencia tecnológica con un diseño inspirado en la rica cultura tucumana, ofreciendo una experiencia única y profesional."
        backgroundColor={TucumanColors.neutral.lightGray}
        showDivider
        paddingY={10}
      >
        <FeatureGrid features={systemFeatures} columns={3} />
      </ContentSection>

      {/* Sección de lugares destacados */}
      <ContentSection
        subtitle="Inspiración Cultural"
        title="Lugares Emblemáticos de Tucumán" 
        description="El diseño de nuestro sistema se inspira en los lugares más emblemáticos de Tucumán, combinando historia, cultura y modernidad."
        textAlign="center"
        paddingY={10}
        action={{
          label: "Ver Más Lugares",
          onClick: () => console.log("Ver más clicked"),
          variant: "outlined",
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 4,
            mt: 4,
          }}
        >
          {tourismPlaces.map((place, index) => (
            <TourismCard
              key={index}
              title={place.title}
              description={place.description}
              image={place.image}
              category={place.category}
              location={place.location}
              duration={place.duration}
              tags={place.tags}
              onViewMore={() => console.log(`Ver más: ${place.title}`)}
              onFavoriteClick={() => console.log(`Favorito: ${place.title}`)}
              onShareClick={() => console.log(`Compartir: ${place.title}`)}
            />
          ))}
        </Box>
      </ContentSection>

      {/* Sección de call-to-action */}
      <ContentSection
        title="¿Listo para comenzar?"
        description="Experimenta la fusión perfecta entre tecnología moderna y el encanto cultural de Tucumán en nuestro sistema de gestión."
        backgroundColor={TucumanColors.primary.main}
        textColor="white"
        paddingY={8}
        action={{
          label: "Comenzar Ahora",
          onClick: () => console.log("Comenzar clicked"),
          variant: "contained",
        }}
      />
    </Box>
  );
};
