import { Portal, Tooltip } from "@chakra-ui/react";
import type { ReactElement } from "react";

export function SidebarTooltip({
  label,
  enabled = true,
  children,
}: Readonly<{
  label: string;
  enabled?: boolean;
  children: ReactElement;
}>) {
  if (!enabled) return children;
  return (
    <Tooltip.Root
      openDelay={300}
      closeDelay={0}
      positioning={{ placement: "right" }}
    >
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Portal>
        <Tooltip.Positioner>
          <Tooltip.Content
            bg="fg.default"
            color="bg.surface"
            px="3"
            py="2"
            borderRadius="sm"
            fontSize="xs"
          >
            {label}
          </Tooltip.Content>
        </Tooltip.Positioner>
      </Portal>
    </Tooltip.Root>
  );
}
