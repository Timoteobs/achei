import {
  Box,
  Drawer,
  Flex,
  IconButton,
  Portal,
  Text,
  useBreakpointValue,
  VisuallyHidden,
} from "@chakra-ui/react";
import { Menu as MenuIcon } from "lucide-react";
import { useState } from "react";
import { BrandMark as AcheiMark } from "../brand-logo/brand-logo";
import { SidebarHeader } from "./sidebar-header";
import { SidebarNavigation } from "./sidebar-navigation";
import { SidebarUser } from "./sidebar-user";
import type { SidebarProps } from "./types";

export function Sidebar(props: Readonly<SidebarProps>) {
  const desktopExpanded =
    useBreakpointValue({ base: false, lg: true }) ?? false;
  const mobile = useBreakpointValue({ base: true, md: false }) ?? true;
  const [collapsedOverride, setCollapsedOverride] = useState<
    boolean | undefined
  >();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const collapsed = collapsedOverride ?? !desktopExpanded;

  // A viewport change must release the drawer's focus trap and scroll lock.
  if (!mobile && drawerOpen) setDrawerOpen(false);

  const content = (compact: boolean, isDrawer = false) => (
    <Flex
      direction="column"
      h="full"
      minH="0"
      bg="bg.surface"
      color="fg.default"
    >
      <SidebarHeader
        collapsed={compact}
        onToggle={() => setCollapsedOverride(!collapsed)}
        onClose={isDrawer ? () => setDrawerOpen(false) : undefined}
      />
      <Flex direction="column" flex="1" minH="0" overflowY="auto">
        <SidebarNavigation
          collapsed={compact}
          activeSection={props.activeSection}
          onNavigate={(section) => {
            props.onNavigate?.(section);
            setDrawerOpen(false);
          }}
        />
      </Flex>
      <SidebarUser
        user={props.user}
        collapsed={compact}
        onAction={props.onUserAction}
      />
    </Flex>
  );
  return (
    <>
      <Box
        as="aside"
        aria-label="Menu lateral"
        display={{ base: "none", md: "block" }}
        w={collapsed ? "72px" : "260px"}
        flexShrink={0}
        h="100dvh"
        position="sticky"
        top="0"
        borderRightWidth="1px"
        borderColor="border.default"
      >
        {content(collapsed)}
      </Box>
      <Drawer.Root
        open={drawerOpen}
        onOpenChange={({ open }) => setDrawerOpen(open)}
        placement="start"
        lazyMount
        unmountOnExit
      >
        <Flex
          as="header"
          display={{ base: "flex", md: "none" }}
          h="64px"
          px="4"
          align="center"
          gap="3"
          bg="bg.surface"
          borderBottomWidth="1px"
          borderColor="border.default"
          position="sticky"
          top="0"
          zIndex="sticky"
        >
          <Drawer.Trigger asChild>
            <IconButton
              variant="ghost"
              aria-label="Abrir menu"
              color="fg.muted"
            >
              <MenuIcon size={22} />
            </IconButton>
          </Drawer.Trigger>
          <AcheiMark />
          <Text
            color="brand.fg"
            fontWeight="bold"
            fontSize="xl"
            letterSpacing="-0.7px"
          >
            Achei!
          </Text>
        </Flex>
        <Portal>
          <Drawer.Backdrop _motionReduce={{ animation: "none" }} />
          <Drawer.Positioner>
            <Drawer.Content
              w="min(300px, calc(100vw - 40px))"
              maxW="none"
              h="100dvh"
              bg="bg.surface"
              boxShadow="none"
              _motionReduce={{ animation: "none" }}
            >
              <VisuallyHidden>
                <Drawer.Title>Menu do Achei!</Drawer.Title>
              </VisuallyHidden>
              {content(false, true)}
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  );
}
