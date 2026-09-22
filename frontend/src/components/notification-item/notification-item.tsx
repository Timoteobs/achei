import { Box, Flex, Grid, Text, VisuallyHidden } from "@chakra-ui/react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { colorVariantStyles } from "../color-variants";
import type { ColorVariant } from "../color-variants";

export interface NotificationItemProps {
  icon: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
  date: string;
  unread?: boolean;
  iconVariant?: ColorVariant;
  actions?: ReactNode;
}

export function NotificationItem({
  icon: Icon,
  title,
  description,
  date,
  unread = false,
  iconVariant = "teal",
  actions,
}: Readonly<NotificationItemProps>) {
  return (
    <Box
      w="full"
      minW="0"
      containerType="inline-size"
      bg={unread ? "brand.subtle/40" : "bg.surface"}
    >
      <Grid
        templateColumns="8px 40px minmax(0, 1fr) auto"
        templateAreas={
          '"status icon content actions" "status icon date actions"'
        }
        columnGap="2"
        rowGap="2"
        alignItems="start"
        ps="2"
        pe="3"
        py="4"
        css={{
          "@container (min-width: 48rem)": {
            gridTemplateColumns: "8px 48px minmax(0, 1fr) auto auto",
            gridTemplateAreas: '"status icon content date actions"',
            columnGap: "4",
            alignItems: "center",
            pe: "4",
          },
        }}
      >
        <Box
          gridArea="status"
          boxSize="2"
          mt="4"
          borderRadius="full"
          bg={unread ? "brand.solid" : "transparent"}
          aria-hidden="true"
          css={{ "@container (min-width: 48rem)": { mt: "0" } }}
        />
        <Flex
          gridArea="icon"
          boxSize="10"
          align="center"
          justify="center"
          borderRadius="full"
          {...colorVariantStyles[iconVariant]}
          aria-hidden="true"
          css={{ "@container (min-width: 48rem)": { boxSize: "12" } }}
        >
          <Icon size={24} strokeWidth={1.8} />
        </Flex>
        <Box gridArea="content" minW="0" overflowWrap="anywhere">
          <Text
            color="fg.default"
            fontSize="sm"
            fontWeight="semibold"
            lineHeight="tall"
          >
            <VisuallyHidden>{unread ? "Não lida: " : "Lida: "}</VisuallyHidden>
            {title}
          </Text>
          {description && (
            <Text color="fg.muted" fontSize="sm" lineHeight="tall" mt="1">
              {description}
            </Text>
          )}
        </Box>
        <Text
          gridArea="date"
          minW="0"
          color="fg.muted"
          fontSize="sm"
          overflowWrap="anywhere"
          css={{
            "@container (min-width: 48rem)": {
              alignSelf: "start",
              textAlign: "end",
              whiteSpace: "nowrap",
            },
          }}
        >
          {date}
        </Text>
        {actions && <Box gridArea="actions">{actions}</Box>}
      </Grid>
    </Box>
  );
}
