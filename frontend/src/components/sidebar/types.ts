import type { LucideIcon } from "lucide-react";

export type SidebarSection =
  "home" | "search" | "spaces" | "notifications" | "favorites" | "activity" | "trash";

export interface SidebarLocation {
  id: string;
  name: string;
  icon?: LucideIcon;
  children?: SidebarLocation[];
}

export interface SidebarSpace {
  id: string;
  name: string;
  icon?: LucideIcon;
  locations: SidebarLocation[];
}

export interface SidebarSelection {
  spaceId: string;
  locationId?: string;
}

export interface SidebarUserData {
  name: string;
  email: string;
  avatarUrl?: string;
}

export type SidebarUserAction = "profile" | "settings" | "sign-out";

export interface SidebarProps {
  spaces: SidebarSpace[];
  user: SidebarUserData;
  activeSection: SidebarSection;
  selection?: SidebarSelection;
  onNavigate?: (section: SidebarSection) => void;
  onSelectLocation: (selection: SidebarSelection) => void;
  onCreateSpace: (name: string) => void;
  onUserAction?: (action: SidebarUserAction) => void;
}
