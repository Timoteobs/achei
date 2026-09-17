import { Avatar, Box, Flex, Text } from "@chakra-ui/react";

export interface ActivityItemProps {
  userName: string;
  avatarFallback?: string;
  avatarUrl?: string;
  description: string;
  time: string;
}

export function ActivityItem({
  userName,
  avatarFallback,
  avatarUrl,
  description,
  time,
}: Readonly<ActivityItemProps>) {
  return (
    <Flex align="start" gap="3" minW="0">
      <Avatar.Root
        boxSize="10"
        flexShrink="0"
        borderRadius="full"
        bg="brand.subtle"
        color="brand.fg"
        aria-hidden="true"
      >
        <Avatar.Fallback name={userName} fontSize="sm" fontWeight="semibold">
          {avatarFallback}
        </Avatar.Fallback>
        {avatarUrl && <Avatar.Image src={avatarUrl} alt={userName} />}
      </Avatar.Root>
      <Box minW="0" flex="1" overflowWrap="anywhere">
        <Text color="fg.default" fontSize="sm" lineHeight="tall">
          <Box as="span" fontWeight="semibold">
            {userName}
          </Box>{" "}
          {description}
        </Text>
        <Text color="fg.muted" fontSize="xs" fontWeight="regular" mt="1">
          {time}
        </Text>
      </Box>
    </Flex>
  );
}
