import { Box, IconButton } from "@chakra-ui/react";
import { MoreVertical } from "lucide-react";
import { NotificationItem } from "../../../../components/notification-item/notification-item";
import { notificationsMock } from "./notifications-mock";

export function NotificationList() {
  return (
    <Box
      as="ul"
      aria-label="Notificações"
      listStyleType="none"
      mt="6"
      mb="0"
      p="0"
      minW="0"
      bg="bg.surface"
      borderWidth="1px"
      borderColor="border.default"
      borderRadius="sm"
      overflow="hidden"
    >
      {notificationsMock.map(({ id, ...notification }) => (
        <Box
          as="li"
          key={id}
          minW="0"
          borderBottomWidth="1px"
          borderColor="border.default"
          _last={{ borderBottomWidth: "0" }}
        >
          <NotificationItem
            {...notification}
            actions={
              <IconButton
                type="button"
                aria-label={`Mais opções: ${notification.title}`}
                variant="ghost"
                boxSize="10"
                minW="10"
                color="fg.muted"
                borderRadius="sm"
                _hover={{ bg: "bg.subtle" }}
              >
                <MoreVertical size={20} strokeWidth={1.8} aria-hidden="true" />
              </IconButton>
            }
          />
        </Box>
      ))}
    </Box>
  );
}
