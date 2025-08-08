import React, { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Collapse from "@mui/material/Collapse";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { usePathname, useRouter } from "next/navigation";
import { match } from 'path-to-regexp';
import { SidebarNavConfig, SidebarNavItem, SidebarNavHeader, SidebarNavDivider, SidebarNavLink, SidebarNavGroup } from "./SidebarNav.types";

interface SidebarNavFlexProps {
  navigation: SidebarNavConfig;
  logo?: React.ReactNode;
  appTitle?: string;
  homeUrl?: string;
  header?: React.ReactNode;
  toolbarActions?: React.ReactNode;
  onMobileClose?: () => void;
  footer?: React.ReactNode;
}

const DRAWER_WIDTH = 240;
const MINI_DRAWER_WIDTH = 64;

export default function SidebarNavFlex({ 
  navigation, 
  logo, 
  appTitle, 
  homeUrl, 
  header, 
  toolbarActions, 
  onMobileClose, 
  footer 
}: SidebarNavFlexProps) {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Persist open state in localStorage
  useEffect(() => {
    const stored = localStorage.getItem('sidebarOpen');
    if (stored !== null) setOpen(stored === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('sidebarOpen', open.toString());
  }, [open]);

  const handleToggle = () => setOpen((prev) => !prev);

  const handleNavigation = (href?: string) => {
    if (href) {
      router.push(href);
      if (onMobileClose) onMobileClose();
    }
  };

  const isActive = (pattern?: string, href?: string) => {
    if (pattern) {
      try {
        const matcher = match(pattern, { decode: decodeURIComponent });
        return matcher(pathname) !== false;
      } catch {
        return pathname === pattern || pathname.startsWith(pattern);
      }
    }
    if (href) {
      return pathname === href || pathname.startsWith(href);
    }
    return false;
  };

  const renderNavItem = (item: SidebarNavItem, depth = 0): React.ReactNode => {
    // Header
    if ((item as SidebarNavHeader).kind === "header") {
      const header = item as SidebarNavHeader;
      return open ? (
        <Typography
          key={header.title + depth}
          variant="overline"
          sx={{
            px: 2,
            py: 1,
            color: theme.palette.text.secondary,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontSize: "0.8rem",
            opacity: 0.85,
            fontFamily: theme.typography.fontFamily,
          }}
        >
          {header.title}
        </Typography>
      ) : null;
    }

    // Divider
    if ((item as SidebarNavDivider).kind === "divider") {
      return <Divider key={"divider-" + depth} sx={{ my: 1 }} />;
    }

    // Group
    if ((item as SidebarNavGroup).children) {
      const group = item as SidebarNavGroup;
      const hasNavChildren = Array.isArray(group.children) && group.children.some(child => typeof child === 'object' && 'kind' in child);
      
      return (
        <Box key={group.title + depth} sx={{ mb: 1 }}>
          <ListItem disablePadding sx={{ px: 0.5 }}>
            <Tooltip title={!open ? group.title : ""} placement="right">
              <ListItemButton
                aria-label={group.title}
                role="menuitem"
                tabIndex={0}
                sx={{
                  borderRadius: 2,
                  mx: 0.5,
                  mb: 0.5,
                  justifyContent: open ? 'initial' : 'center',
                  minHeight: 44,
                  bgcolor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  boxShadow: 0,
                  transition: theme.transitions.create(['background', 'color'], {
                    duration: theme.transitions.duration.shortest,
                    easing: theme.transitions.easing.easeInOut,
                  }),
                  fontWeight: 600,
                  fontSize: '0.98rem',
                  border: '1px solid',
                  borderColor: theme.palette.divider,
                  "&:hover": {
                    bgcolor: theme.palette.action.hover,
                    color: theme.palette.primary.main,
                    borderColor: theme.palette.primary.main
                  }
                }}
              >
                {group.icon && (
                  <ListItemIcon sx={{ 
                    minWidth: 0, 
                    mr: open ? 2 : 'auto', 
                    justifyContent: 'center', 
                    color: theme.palette.primary.main, 
                    fontSize: '1.5rem' 
                  }}>
                    {group.icon}
                  </ListItemIcon>
                )}
                {open && (
                  <ListItemText 
                    primary={group.title} 
                    primaryTypographyProps={{ 
                      fontWeight: 600, 
                      fontSize: '1rem', 
                      color: theme.palette.primary.main, 
                      fontFamily: theme.typography.fontFamily 
                    }} 
                  />
                )}
                {open && group.badge && (
                  <Chip label={group.badge} size="small" color="secondary" />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
          
          {/* Renderizar children arbitrarios para submenús */}
          {open && hasNavChildren && (
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List sx={{ py: 0, pl: 2 + depth * 2 }}>
                {Array.isArray(group.children) && group.children.map((child: SidebarNavItem) => 
                  renderNavItem(child, depth + 1)
                )}
              </List>
            </Collapse>
          )}
          
          {/* Si hay children ReactNode, renderizarlos directamente */}
          {open && group.children && !Array.isArray(group.children) && (
            <Box sx={{ pl: 2 + depth * 2 }}>{group.children}</Box>
          )}
        </Box>
      );
    }

    // Link
    if ((item as SidebarNavLink).href || (item as SidebarNavLink).title) {
      const link = item as SidebarNavLink;
      const active = isActive(link.pattern, link.href);
      
      return (
        <ListItem key={link.title + depth} disablePadding sx={{ px: 0.5 }}>
          <Tooltip title={!open ? link.title : ""} placement="right">
            <ListItemButton
              onClick={() => !link.disabled && handleNavigation(link.href)}
              selected={active}
              disabled={link.disabled}
              sx={{
                borderRadius: 2,
                mx: 0.5,
                mb: 0.5,
                minHeight: 44,
                transition: theme.transitions.create(['background', 'color'], {
                  duration: theme.transitions.duration.shortest,
                  easing: theme.transitions.easing.easeInOut,
                }),
                boxShadow: active ? 2 : 0,
                bgcolor: active ? theme.palette.action.selected : theme.palette.background.paper,
                color: active ? theme.palette.primary.contrastText : theme.palette.text.primary,
                justifyContent: open ? 'initial' : 'center',
                border: '1px solid',
                borderColor: active ? theme.palette.primary.main : theme.palette.divider,
                fontWeight: active ? 600 : 400,
                fontSize: '0.98rem',
                fontFamily: theme.typography.fontFamily,
                "&.Mui-selected": {
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  boxShadow: theme.shadows[3],
                  borderColor: theme.palette.primary.dark,
                  "&:hover": { 
                    bgcolor: theme.palette.primary.dark 
                  }
                },
                "&:hover": {
                  bgcolor: theme.palette.action.hover,
                  color: theme.palette.primary.main,
                  borderColor: theme.palette.primary.main
                }
              }}
            >
              {link.icon && (
                <ListItemIcon sx={{ 
                  color: active ? theme.palette.primary.main : theme.palette.text.secondary, 
                  minWidth: open ? 40 : 0, 
                  justifyContent: 'center', 
                  fontSize: '1.5rem' 
                }}>
                  {link.icon}
                </ListItemIcon>
              )}
              {open && (
                <ListItemText
                  primary={link.title}
                  primaryTypographyProps={{ 
                    fontSize: '1rem', 
                    fontWeight: active ? 600 : 400, 
                    color: active ? theme.palette.primary.main : theme.palette.text.primary, 
                    fontFamily: theme.typography.fontFamily 
                  }}
                />
              )}
              {open && link.badge && (
                <Chip label={link.badge} size="small" color="secondary" />
              )}
              {open && link.action}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      );
    }

    // Fallback
    return null;
  };

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? DRAWER_WIDTH : MINI_DRAWER_WIDTH,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        transition: theme.transitions.create('width', {
          easing: 'cubic-bezier(0.4,0,0.2,1)',
          duration: 250,
        }),
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_WIDTH : MINI_DRAWER_WIDTH,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: 'cubic-bezier(0.4,0,0.2,1)',
            duration: 250,
          }),
        },
      }}
      PaperProps={{ 
        role: 'navigation', 
        'aria-label': 'Menú lateral', 
        tabIndex: 0 
      }}
    >
      {/* Toggle Button + Toolbar Actions */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: open ? 'space-between' : 'center', 
        p: 1 
      }}>
        {toolbarActions && open && (
          <Box sx={{ mr: 1 }}>{toolbarActions}</Box>
        )}
        <Tooltip title={open ? 'Colapsar menú' : 'Expandir menú'}>
          <IconButton 
            onClick={handleToggle} 
            aria-label={open ? 'Colapsar menú' : 'Expandir menú'} 
            size="small"
          >
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Logo/Branding + appTitle + homeUrl + header slot */}
      <Box sx={{ 
        p: open ? 3 : 1, 
        textAlign: 'center', 
        minHeight: 80, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: open ? 'flex-start' : 'center' 
      }}>
        {homeUrl ? (
          <a 
            href={homeUrl} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              textDecoration: 'none', 
              color: 'inherit' 
            }}
          >
            {logo}
            {open && appTitle && (
              <span style={{ 
                marginLeft: 8, 
                fontWeight: 600, 
                fontSize: '1.1rem' 
              }}>
                {appTitle}
              </span>
            )}
          </a>
        ) : (
          <>
            {logo}
            {open && appTitle && (
              <span style={{ 
                marginLeft: 8, 
                fontWeight: 600, 
                fontSize: '1.1rem' 
              }}>
                {appTitle}
              </span>
            )}
          </>
        )}
        {header && (
          <Box sx={{ ml: open ? 2 : 0, mt: open ? 0 : 1 }}>
            {header}
          </Box>
        )}
      </Box>

      <Divider sx={{ borderColor: 'grey.200', mb: 1 }} />

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 2 }}>
        <List sx={{ py: 0 }}>
          {navigation.map((item) => renderNavItem(item, 0))}
        </List>
      </Box>

      {/* Footer slot */}
      {footer && (
        <Box sx={{ 
          p: 2, 
          borderTop: '1px solid', 
          borderColor: 'grey.200' 
        }}>
          {footer}
        </Box>
      )}
    </Drawer>
  );
}
