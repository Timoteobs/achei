import { Tabs } from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useRoomsQuery } from "../../../hooks/rooms/use-rooms-query";
import { BoxesTab } from "./boxes/boxes-tab";
import { ItemsTab } from "./items/items-tab";
import { OverviewTab } from "./overview/overview-tab";
import { RoomsTab } from "./rooms/rooms-tab";

const tabs = [
  { value: "overview", label: "Visão geral" },
  { value: "rooms", label: "Ambientes" },
  { value: "boxes", label: "Caixas" },
  { value: "items", label: "Itens" },
];

export function SpaceTabs({ spaceName }: Readonly<{ spaceName: string }>) {
  const { spaceId } = useParams({ from: "/_app/espacos/$spaceId/" });
  const roomsQuery = useRoomsQuery(spaceId);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const boxesTriggerRef = useRef<HTMLButtonElement>(null);
  const shouldFocusBoxes = useRef(false);
  const selectedRoom = roomsQuery.data?.find((room) => room.id === selectedRoomId);
  const visibleTabs = tabs.filter((tab) => tab.value !== "boxes" || selectedRoom);

  const openRoom = (roomId: number) => {
    shouldFocusBoxes.current = true;
    setSelectedRoomId(roomId);
    setActiveTab("boxes");
  };

  useEffect(() => {
    if (activeTab === "boxes" && selectedRoom && shouldFocusBoxes.current) {
      boxesTriggerRef.current?.focus();
      shouldFocusBoxes.current = false;
    }
  }, [activeTab, selectedRoom]);

  const itemLocation = selectedRoom
    ? { space: spaceName, room: selectedRoom.name, roomId: selectedRoom.id }
    : undefined;

  return (
    <Tabs.Root
      value={activeTab === "boxes" && !selectedRoom ? "rooms" : activeTab}
      onValueChange={({ value }) => setActiveTab(value)}
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
        {visibleTabs.map(({ value, label }) => (
          <Tabs.Trigger
            key={value}
            ref={value === "boxes" ? boxesTriggerRef : undefined}
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
      <Tabs.Content value="overview" pt="6">
        <OverviewTab onRoomClick={openRoom} />
      </Tabs.Content>
      <Tabs.Content value="rooms" pt="6">
        <RoomsTab onRoomClick={openRoom} />
      </Tabs.Content>
      {selectedRoom && (
        <Tabs.Content value="boxes" pt="6">
          <BoxesTab key={selectedRoom.id} room={selectedRoom} />
        </Tabs.Content>
      )}
      <Tabs.Content value="items" pt="6">
        <ItemsTab key={selectedRoom?.id ?? "all"} location={itemLocation} />
      </Tabs.Content>
    </Tabs.Root>
  );
}
