import { Tabs } from "@chakra-ui/react";
import { useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useRoomsQuery } from "../../../hooks/rooms/use-rooms-query";
import { useBoxesQuery } from "../../../hooks/boxes/use-boxes-query";
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
  const boxesQuery = useBoxesQuery(spaceId);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [selectedBoxId, setSelectedBoxId] = useState<number | null>(null);
  const itemsTriggerRef = useRef<HTMLButtonElement>(null);
  const shouldFocusItems = useRef(false);
  const boxesTriggerRef = useRef<HTMLButtonElement>(null);
  const shouldFocusBoxes = useRef(false);
  const selectedRoom = roomsQuery.data?.find((room) => room.id === selectedRoomId);
  const selectedBox = selectedRoom
    ? boxesQuery.data?.find((box) => box.id === selectedBoxId && box.roomId === selectedRoom.id)
    : undefined;
  const visibleTabs = tabs.filter((tab) =>
    (tab.value !== "boxes" || selectedRoom) && (tab.value !== "items" || selectedBox),
  );
  const visibleTab = activeTab === "items" && !selectedBox
    ? selectedRoom ? "boxes" : "rooms"
    : activeTab === "boxes" && !selectedRoom ? "rooms" : activeTab;

  const openRoom = (roomId: number) => {
    shouldFocusBoxes.current = true;
    setSelectedRoomId(roomId);
    setSelectedBoxId(null);
    setActiveTab("boxes");
  };

  const openBox = (boxId: number) => {
    shouldFocusItems.current = true;
    setSelectedBoxId(boxId);
    setActiveTab("items");
  };

  useEffect(() => {
    if (activeTab === "items" && selectedBox && shouldFocusItems.current) {
      itemsTriggerRef.current?.focus();
      shouldFocusItems.current = false;
    }
  }, [activeTab, selectedBox]);

  useEffect(() => {
    if (activeTab === "boxes" && selectedRoom && shouldFocusBoxes.current) {
      boxesTriggerRef.current?.focus();
      shouldFocusBoxes.current = false;
    }
  }, [activeTab, selectedRoom]);

  return (
    <Tabs.Root
      value={visibleTab}
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
            ref={value === "boxes" ? boxesTriggerRef : value === "items" ? itemsTriggerRef : undefined}
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
          <BoxesTab key={selectedRoom.id} room={selectedRoom} onBoxClick={openBox} />
        </Tabs.Content>
      )}
      {selectedBox && (
        <Tabs.Content value="items" pt="6">
          <ItemsTab key={selectedBox.id} box={selectedBox} spaceName={spaceName} />
        </Tabs.Content>
      )}
    </Tabs.Root>
  );
}
