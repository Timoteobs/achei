import { Avatar, Box, Flex, IconButton, Menu, Text } from "@chakra-ui/react";
import { LogOut, MoreHorizontal, Settings2, UserRound } from "lucide-react";
import { SidebarTooltip } from "./sidebar-tooltip";
import type { SidebarUserAction, SidebarUserData } from "./types";

export function SidebarUser({
  user,
  collapsed,
  onAction,
}: Readonly<{
  user: SidebarUserData;
  collapsed: boolean;
  onAction?: (action: SidebarUserAction) => void;
}>) {
  const avatar = (
    <Avatar.Root size="sm" bg="brand.subtle" color="brand.fg">
      <Avatar.Fallback name={user.name} fontSize="xs" fontWeight="semibold" />
      {user.avatarUrl && <Avatar.Image src={user.avatarUrl} />}
    </Avatar.Root>
  );
  return (
    <Flex
      as="footer"
      borderTopWidth="1px"
      borderColor="border.default"
      p={collapsed ? "3" : "4"}
      minH="85px"
      flexShrink={0}
      align="center"
      gap="2.5"
      justify={collapsed ? "center" : undefined}
    >
      {!collapsed && (
        <>
          {avatar}
          <Box flex="1" minW="0">
            <Text
              fontSize="12px"
              fontWeight="semibold"
              truncate
              title={user.name}
            >
              {user.name}
            </Text>
            <Text
              fontSize="11px"
              color="fg.muted"
              mt="0.5"
              truncate
              title={user.email}
            >
              {user.email}
            </Text>
          </Box>
        </>
      )}
      <Menu.Root
        positioning={{
          placement: "top-end",
          strategy: "fixed",
          hideWhenDetached: true,
        }}
      >
        <SidebarTooltip enabled={collapsed} label={user.name}>
          <Menu.Trigger asChild>
            <IconButton
              aria-label={`Menu de ${user.name}`}
              variant="ghost"
              size={collapsed ? "md" : "xs"}
              borderRadius={collapsed ? "full" : "sm"}
              color="fg.muted"
              _hover={{ bg: "bg.subtle" }}
            >
              {collapsed ? avatar : <MoreHorizontal size={19} />}
            </IconButton>
          </Menu.Trigger>
        </SidebarTooltip>
        <Menu.Positioner>
          <Menu.Content
            minW="200px"
            bg="bg.surface"
            borderWidth="1px"
            borderColor="border.default"
            borderRadius="sm"
            p="1"
            boxShadow="md"
          >
            <Menu.Item
              value="profile"
              disabled={!onAction}
              onClick={() => onAction?.("profile")}
              gap="2"
              fontSize="sm"
            >
              <UserRound size={16} />
              Meu perfil
            </Menu.Item>
            <Menu.Item
              value="settings"
              disabled={!onAction}
              onClick={() => onAction?.("settings")}
              gap="2"
              fontSize="sm"
            >
              <Settings2 size={16} />
              Configurações
            </Menu.Item>
            <Menu.Separator borderColor="border.default" />
            <Menu.Item
              value="sign-out"
              disabled={!onAction}
              onClick={() => onAction?.("sign-out")}
              gap="2"
              fontSize="sm"
            >
              <LogOut size={16} />
              Sair
            </Menu.Item>
            {!onAction && (
              <Text px="2" py="1.5" fontSize="xs" color="fg.muted">
                Disponível em breve
              </Text>
            )}
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </Flex>
  );
}
