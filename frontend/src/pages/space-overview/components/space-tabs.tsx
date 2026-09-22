import { Tabs } from "@chakra-ui/react";
import { BoxesTab } from "./boxes/boxes-tab";
import { ItemsTab } from "./items/items-tab";
import { OverviewTab } from "./overview/overview-tab";
import { RoomsTab } from "./rooms/rooms-tab";

const tabs = [
  { value: "overview", label: "Visão geral", Content: OverviewTab },
  { value: "rooms", label: "Ambientes", Content: RoomsTab },
  { value: "boxes", label: "Caixas", Content: BoxesTab },
  { value: "items", label: "Itens", Content: ItemsTab },
];

export function SpaceTabs() {
  return (
    <Tabs.Root
      defaultValue="overview"
      variant="line"
      colorPalette="brand"
      mt="6"
      minW="0"
    >
      <Tabs.List
        aria-label="Navegação do espaço"
        w="full"
        gap={{ base: "0", md: "2", lg: "4" }}
        overflowX="auto"
        scrollbarWidth="none"
        borderColor="border.default"
      >
        {tabs.map(({ value, label }) => (
          <Tabs.Trigger
            key={value}
            value={value}
            h="12"
            px="4"
            flexShrink="0"
            whiteSpace="nowrap"
            fontSize="sm"
            fontWeight="medium"
            color="fg.muted"
            bg="transparent"
            _hover={{ color: "fg.default", _selected: { color: "brand.fg" } }}
            _selected={{
              color: "brand.fg",
              fontWeight: "semibold",
              _horizontal: {
                "--indicator-offset-y": "0px",
                _before: { bg: "brand.solid", borderRadius: "full" },
              },
            }}
            _focusVisible={{
              outlineColor: "brand.focusRing",
              outlineOffset: "-2px",
            }}
          >
            {label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabs.map(({ value, Content }) => (
        <Tabs.Content key={value} value={value} pt="6">
          <Content />
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
