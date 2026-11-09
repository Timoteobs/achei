import { DoorOpen } from "lucide-react";
import type { RoomCardProps } from "../../../../components/room-card/room-card";
import type { RoomResponse } from "../../../../services/rooms";
import { roomColorOptions, roomIconOptions } from "./new-room/new-room-options";

export function getRoomCardProps(room: RoomResponse): RoomCardProps {
  return {
    name: room.name,
    boxesCount: room.boxesCount,
    icon: roomIconOptions.find(({ value }) => value === room.icon)?.icon ?? DoorOpen,
    variant: roomColorOptions.find(({ value }) => value === room.color)?.value ?? "teal",
  };
}
