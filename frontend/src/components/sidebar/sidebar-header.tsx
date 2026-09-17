import { Flex, IconButton } from "@chakra-ui/react";
import { BrandLogo, BrandMark as AcheiMark } from "../brand-logo/brand-logo";
import { PanelLeftClose, X } from "lucide-react";
import { SidebarTooltip } from "./sidebar-tooltip";

export function SidebarCollapseButton({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const label = collapsed ? "Expandir menu lateral" : "Recolher menu lateral";
  return (
    <SidebarTooltip label={label}>
      <IconButton
        aria-label={label}
        aria-expanded={!collapsed}
        onClick={onToggle}
        variant="ghost"
        size="sm"
        borderRadius="sm"
        color="fg.muted"
        _hover={{ bg: "bg.subtle", color: "fg.default" }}
      >
        {collapsed ? <AcheiMark /> : <PanelLeftClose size={18} />}
      </IconButton>
    </SidebarTooltip>
  );
}

export function SidebarHeader({
  collapsed,
  onToggle,
  onClose,
}: {
  collapsed: boolean;
  onToggle: () => void;
  onClose?: () => void;
}) {
  return (
    <Flex
      h="88px"
      minH="88px"
      px={collapsed ? "0" : "5"}
      align="center"
      justify={collapsed ? "center" : "space-between"}
    >
      {collapsed ? (
        <SidebarCollapseButton collapsed onToggle={onToggle} />
      ) : (
        <>
          <BrandLogo />
          {onClose ? (
            <IconButton
              aria-label="Fechar menu"
              variant="ghost"
              size="sm"
              color="fg.muted"
              onClick={onClose}
            >
              <X size={19} />
            </IconButton>
          ) : (
            <SidebarCollapseButton collapsed={false} onToggle={onToggle} />
          )}
        </>
      )}
    </Flex>
  );
}
