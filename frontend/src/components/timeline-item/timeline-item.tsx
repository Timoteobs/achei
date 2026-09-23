import { Box, Grid, Text, Timeline } from "@chakra-ui/react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { colorVariantStyles } from "../color-variants";
import type { ColorVariant } from "../color-variants";

export interface TimelineItemProps {
  icon: LucideIcon;
  iconVariant?: ColorVariant;
  title: ReactNode;
  date: string;
  children: ReactNode;
}

export function TimelineItem({
  icon: Icon,
  iconVariant = "teal",
  title,
  date,
  children,
}: Readonly<TimelineItemProps>) {
  return (
    <Timeline.Item
      w="full"
      minW="0"
      gap={{ base: "3", md: "4" }}
      _last={{ "& > [data-timeline-content]": { borderBottomWidth: "0" } }}
    >
      <Timeline.Connector aria-hidden="true">
        <Timeline.Separator
          borderColor="border.default"
          insetInlineStart="5"
          insetBlockStart="8"
          insetBlockEnd="-8"
        />
        <Timeline.Indicator
          boxSize="10"
          mt="3"
          outline="none"
          {...colorVariantStyles[iconVariant]}
        >
          <Icon size={20} strokeWidth={1.8} />
        </Timeline.Indicator>
      </Timeline.Connector>

      <Timeline.Content
        data-timeline-content=""
        minW="0"
        containerType="inline-size"
        gap="1"
        py="3"
        borderBottomWidth="1px"
        borderColor="border.default"
      >
        <Grid
          templateColumns="minmax(0, 1fr)"
          columnGap="4"
          rowGap="1"
          alignItems="start"
          css={{
            "@container (min-width: 40rem)": {
              gridTemplateColumns: "minmax(0, 1fr) auto",
            },
          }}
        >
          <Text
            color="fg.default"
            fontSize="sm"
            fontWeight="medium"
            overflowWrap="anywhere"
          >
            {title}
          </Text>
          <Text
            color="fg.muted"
            fontSize="sm"
            overflowWrap="anywhere"
            css={{
              "@container (min-width: 40rem)": {
                textAlign: "end",
                whiteSpace: "nowrap",
              },
            }}
          >
            {date}
          </Text>
        </Grid>
        <Box minW="0">{children}</Box>
      </Timeline.Content>
    </Timeline.Item>
  );
}
