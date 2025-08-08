// Tipos para navegación flexible estilo MUI Toolpad Core

import { ReactNode } from "react";

export type SidebarNavItem =
  | SidebarNavHeader
  | SidebarNavDivider
  | SidebarNavLink
  | SidebarNavGroup;

export interface SidebarNavHeader {
  kind: "header";
  title: string;
}

export interface SidebarNavDivider {
  kind: "divider";
}

export interface SidebarNavLink {
  kind?: "link";
  segment: string;
  title: string;
  icon?: ReactNode;
  badge?: ReactNode;
  action?: ReactNode;
  pattern?: string;
  href?: string;
  disabled?: boolean;
  selected?: boolean;
}

export interface SidebarNavGroup {
  kind?: "group";
  title: string;
  icon?: ReactNode;
  children: SidebarNavItem[];
  badge?: ReactNode;
  expanded?: boolean;
}

export type SidebarNavConfig = SidebarNavItem[];
