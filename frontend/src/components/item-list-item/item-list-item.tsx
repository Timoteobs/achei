import { Avatar, Box, Grid, Text } from "@chakra-ui/react";
import { Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ItemListItemProps {
  name: string;
  location: readonly string[];
  locationSeparator?: string;
  image?: string;
  icon?: LucideIcon;
  time?: string;
}

export function ItemListItem({
  name,
  location,
  locationSeparator = " › ",
  image,
  icon: Icon = Package,
  time,
}: Readonly<ItemListItemProps>) {
  return (
    <Grid
      templateColumns={{
        base: "auto minmax(0, 1fr)",
        md: "auto minmax(0, 1fr) auto",
      }}
      columnGap="4"
      rowGap="1"
      alignItems="start"
      minW="0"
    >
      <Avatar.Root
        boxSize="11"
        gridColumn="1"
        gridRow={{ base: "1 / 3", md: "1" }}
        borderRadius="md"
        overflow="hidden"
        bg="bg.subtle"
        color="fg.muted"
        borderWidth="1px"
        borderColor="border.default"
        aria-hidden="true"
      >
        <Avatar.Fallback>
          <Icon size={24} strokeWidth={1.6} />
        </Avatar.Fallback>
        {image && <Avatar.Image src={image} alt="" objectFit="cover" />}
      </Avatar.Root>
      <Box gridColumn="2" gridRow="1" minW="0" overflowWrap="anywhere">
        <Text color="fg.default" fontSize="sm" fontWeight="semibold">
          {name}
        </Text>
        <Text color="fg.muted" fontSize="sm" mt="1">
          {location.join(locationSeparator)}
        </Text>
      </Box>
      {time && (
        <Text
          gridColumn={{ base: "2", md: "3" }}
          gridRow={{ base: "2", md: "1" }}
          alignSelf={{ base: "start", md: "center" }}
          color="fg.muted"
          fontSize="sm"
          textAlign={{ base: "start", md: "end" }}
        >
          {time}
        </Text>
      )}
    </Grid>
  );
}
