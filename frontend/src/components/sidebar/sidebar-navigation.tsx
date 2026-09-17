import { Box, Button, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { navigationItems, navigationPaths } from "./data";
import { SidebarTooltip } from "./sidebar-tooltip";
import type { SidebarSection } from "./types";

export function SidebarNavItem({
  label,
  icon: Icon,
  selected,
  collapsed,
  to,
  onClick,
}: Readonly<{
  label: string;
  icon: LucideIcon;
  selected: boolean;
  collapsed: boolean;
  to: (typeof navigationPaths)[SidebarSection];
  onClick: () => void;
}>) {
  return (
    <SidebarTooltip label={label} enabled={collapsed}>
      <Button
        asChild
        variant="plain"
        w="full"
        h={{ base: "44px", md: "40px" }}
        px="3"
        gap="3"
        justifyContent={collapsed ? "center" : "flex-start"}
        borderRadius="sm"
        bg={selected ? "brand.subtle" : "transparent"}
        color={selected ? "brand.fg" : "fg.muted"}
        fontSize="sm"
        fontWeight={selected ? "semibold" : "medium"}
        _hover={{
          bg: selected ? "brand.subtle" : "bg.subtle",
          color: selected ? "brand.fg" : "fg.default",
        }}
        _active={{ bg: "brand.subtle" }}
      >
        <Link
          to={to}
          aria-label={label}
          aria-current={selected ? "page" : undefined}
          activeOptions={{ exact: to === "/" }}
          onClick={onClick}
        >
          <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
          {!collapsed && <Text as="span">{label}</Text>}
        </Link>
      </Button>
    </SidebarTooltip>
  );
}

export function SidebarNavigation({
  collapsed,
  activeSection,
  onNavigate,
}: {
  collapsed: boolean;
  activeSection: SidebarSection;
  onNavigate: (section: SidebarSection) => void;
}) {
  return (
    <Box
      as="nav"
      aria-label="Navegação principal"
      px="3"
      pb="5"
      display="flex"
      flexDirection="column"
      gap="1"
      flexShrink={0}
    >
      {navigationItems.map((item) => (
        <SidebarNavItem
          key={item.id}
          {...item}
          to={navigationPaths[item.id]}
          collapsed={collapsed}
          selected={activeSection === item.id}
          onClick={() => onNavigate(item.id)}
        />
      ))}
    </Box>
  );
}
